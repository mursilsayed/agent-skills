---
name: trilium-diagrams
description: Create, edit and review diagrams in Trilium that are stored as frozen Graphviz DOT and drawn by the Graphviz renderer — architecture diagrams, pictures of an idea, flows, and concept maps. Use whenever the user wants a diagram, a concept map or a visual of something in Trilium, or mentions a [diagram] or [map] note, a DOT note, Edit layout or a #needsReview session.
---

# Trilium diagrams

## 1. Purpose & Scope

Turns a description, a document or a chat request into a diagram in Trilium, and keeps it up to date. Every diagram is a Render note drawn by the `Graphviz renderer`, with a child DOT note that stores the look as drawn (colours, line widths, dashes, shapes) and **every position frozen**. The user memorises where things sit, so **nothing already on a diagram ever moves** without their approval.

There is one diagram type. A **profile** adds conventions on top; today there is one, `concept-map` ([`./knowledge/concept-map-profile.md`](./knowledge/concept-map-profile.md)). Any other diagram uses no profile.

## 2. Dependencies

Requires the Trilium MCP server and Node 18+ with `npx`. Everything goes through the `trilium-graphviz-diagrams` npm package, which runs the same converter as the buttons in Trilium. See [`./ABOUT.md`](./ABOUT.md).

The tools never write to Trilium; the agent writes, after approval. Write their files to a temporary folder (call it `$TMP` below).

## Pick the tools version first (once per session)

The tools must be the release whose converter is installed in Trilium, or the agent and the **Edit layout** button would write different DOT. Use `@latest` only for the lookup.

1. `search_notes('note.title = "conceptMap"')`, then `get_note` on the match whose parent is titled `render.js`, with `includeContent: false`. Keep its `contentSha256`
2. `npx -y trilium-graphviz-diagrams@latest which <contentSha256>` gives `version`
3. From here on, `$TOOLS` means `npx -y trilium-graphviz-diagrams@<version>`. If `which` refuses, stop and show its message: the user's Trilium has a converter that no release has, and needs to install a released one from the `trilium-graphviz-diagrams` README

## Rules for every diagram

- **Approval first.** Show the change list, warnings and the preview path, and write nothing until the user approves.
- **Never write DOT positions by hand** (`pos`, `lp`, `bb`, `width`, `height`) and never patch a DOT note's text. Every change goes through `$TOOLS`.
- **Reading a DOT note: stop at `// ---- Positions:`.** Everything above that line is the diagram: groups, shapes, arrows, labels, links and looks. `node [...]` and `edge [...]` hold the plain look, and each shape or arrow lists only how it differs (a shape without `color` has the plain colour). Below the line are only frame and shape positions, which carry no meaning. A DOT note without that line is in the older form, with positions and arrow routes on the same lines; it is rewritten in the new form at its next save.
- **Revision first.** `create_revision` on a note before changing its content, then write with `expectedUtcDateModified`. If the write is rejected, the user changed it meanwhile: start again from reading it.
- **Verify by hash.** After writing, `get_note` with `includeContent: false` and check `contentSha256` equals the `sha256` the tools printed. The MCP server can't run the renderer, so ask the user to open the diagram to confirm it draws.
- **Titles:** take one timestamp (`YYYYMMDDHHmmss`, Sydney time) for both notes.
  - Concept map: `[map]<name>-<timestamp>` with label `#conceptMap`; DOT note `[map]<name> DOT-<timestamp>`.
  - Any other diagram: `[diagram]<name>-<timestamp>`, no label; DOT note `[diagram]<name> DOT-<timestamp>`.
  - The DOT note always has `#archived`, so search reaches it only through the diagram's `~dotSource` relation.
- **The tools are in Trilium already.** Never create or change the `Graphviz renderer`, `render.js` or `conceptMap` notes here; that is the `trilium-graphviz-diagrams` README's job.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Create diagram | "draw / make a diagram, concept map, architecture diagram, picture of …", from a description or a document | [Workflow 1](#workflow-1-create-diagram) |
| 2 | Edit diagram by chat | add, rename, restyle, link or remove shapes and arrows on an existing diagram | [Workflow 2](#workflow-2-edit-diagram-by-chat) |
| 3 | Review a layout session | a `#needsReview` session, or "check my layout edit" | [Workflow 3](#workflow-3-review-a-layout-session) |
| 4 | Check a concept map | "does this map follow the conventions?" | [Workflow 4](#workflow-4-check-a-concept-map) |

If the request doesn't clearly match exactly one workflow, ask which one. If asked what this skill can do, show this table.
To convert an existing canvas, send the user to **Convert to diagram** on the launch bar: it keeps the original canvas and opens a session in Trilium, which the MCP server can't do.

## 3. Workflows

### Workflow 1: Create diagram

1. **Find the renderer:** `search_notes('note.title = "Graphviz renderer"')`. No match: stop and point the user to the one-time setup in the `trilium-graphviz-diagrams` README. Several: ask which
2. **Agree the content.** Concept map or other diagram (decides the profile and title)? Name? List the shapes, arrows and groups you plan, in words, and get a yes before drawing. For a concept map, also agree which concepts and relations are the most important, and what each colour means
3. **Pick the parent:** the note the user names, otherwise the current month's `zettels` folder (`search_notes("#inbox")`). Search titles for a similar diagram and say if one exists
4. **Write a draft DOT** to `$TMP/draft.dot`, without positions, following [`./knowledge/drafting-dot.md`](./knowledge/drafting-dot.md) (and the profile for a concept map)
5. **Lay it out and freeze it:** `$TOOLS create $TMP/draft.dot $TMP/out [--profile concept-map]`. If it refuses, fix the draft. Fix the draft for each overlap warning (try another layout, `rankdir`, `sep`) and run it again
6. **Get approval:** show the `summary`, any `warnings`, and the path of `preview` (`preview.svg`). Say plainly that **this layout becomes the positions they memorise**; small tidying is easiest afterwards with **✏️ Edit layout**. Redraft until approved
7. **Create the diagram:** `create_note` under the parent with `type: "render"`, `content: ""`, the relation `renderNote` → the renderer's noteId, and for a concept map the label `conceptMap`
8. **Create the DOT note:** `create_note` under the diagram with `type: "code"`, `mime: "text/plain"`, the label `archived`, and the content of `$TMP/out/proposed.dot` (prefer `contentFilePath` when the server has `TRILIUM_CONTENT_DIR`)
9. **Connect them:** `update_note` on the diagram with the relation `dotSource` → the DOT note's noteId
10. **Verify:** check the relations and labels with `get_note` (`includeContent: false`), and the DOT note's `contentSha256` against `sha256`
11. **Link it:** for a concept map, the zettelkasten skill's linking rule applies (an outline's `## Concept maps` section). For another diagram, offer to link it from the note it illustrates. Revision first, write after approval

If a step fails, report the noteIds created so far and stop. Don't retry or delete without asking: a diagram with no `dotSource` only shows *No DOT source*.

### Workflow 2: Edit diagram by chat

1. **Find the diagram:** the note the user names, or search titles (`[map]`, `[diagram]`) or `#conceptMap`. Confirm it is a `render` note; its `dotSource` relation gives the DOT note
2. **Check for an open layout session:** `search_notes("#diagramSession")` and `search_notes("#conceptMapSession")`; `get_note` each result (`includeContent: false`). If one has `editsMap` → this diagram, stop and ask the user to finish or cancel it first
3. **Read the DOT:** `get_note` on the DOT note; save `content` unchanged to `$TMP/diagram.dot` and keep `utcDateModified`
4. **See what's there:** `$TOOLS list $TMP/diagram.dot` gives shape ids, labels, looks, relation keys and groups. If it refuses, say why and stop (an unfrozen diagram needs **📌 Freeze layout** under it first)
5. **Write the edits** as a JSON list in `$TMP/edits.json`; the forms are in [`./knowledge/edits.md`](./knowledge/edits.md). Give each new shape a `near` (the shape it belongs beside) and a `ref` for later `from`/`to`. New shapes and arrows take the diagram's usual look unless you set one. Prefer `id:<noteId>` links. For a concept map, follow the profile
6. **Dry run:** `$TOOLS edit $TMP/diagram.dot $TMP/edits.json $TMP/out [--profile concept-map]`. `refused`: show the `problems`, fix the edits or stop. `no-changes`: say so and stop
7. **Get approval:** show `changeList`, `warnings` and the `preview` path. New shapes are placed in free space automatically: point them out, and say they can be moved with **✏️ Edit layout**
8. **Save:** `create_revision` on the DOT note, then `update_note` with the content of `$TMP/out/proposed.dot` and `expectedUtcDateModified` from step 3
9. **Verify:** `contentSha256` equals `sha256`; ask the user to reopen the diagram

To move, resize or regroup existing shapes, send the user to **✏️ Edit layout**: the tools refuse anything that would move them.

### Workflow 3: Review a layout session

A session the user couldn't save, or asked for help with, is a canvas labelled `#needsReview`.

1. **Find it:** `search_notes("#needsReview")` (sessions aren't archived). Its `~editsMap` gives the diagram, whose `~dotSource` gives the DOT note
2. **Read both:** save the DOT note's content to `$TMP/diagram.dot` and the canvas content to `$TMP/canvas.json`
3. **Run:** `$TOOLS review $TMP/diagram.dot $TMP/canvas.json $TMP/out [--profile concept-map]`
4. **Explain** each problem in plain words (where on the canvas, what to do), then the change list and warnings. Decide from these, not from comparing text: the tools rewrite the header line, so its DOT differs even with no edits
5. **Agree the fix.** Usually the user fixes the canvas and presses **Finish** again in Trilium. Write `proposed.dot` yourself only if they ask, with no problems left: revision first, `expectedUtcDateModified`, verify by hash, and tell them to **Cancel** the session afterwards so the canvas is deleted. If there are no changes, write nothing

### Workflow 4: Check a concept map

1. Read the DOT as in Workflow 2, steps 1 and 3
2. `$TOOLS check $TMP/diagram.dot --profile concept-map`
3. Show the warnings. They never block anything. If the user wants fixes, continue with Workflow 2

---

**Best practices:** agree the content before drawing, one idea per diagram, labels short enough to fit their box, a legend whenever colour or line style means something, and never surprise the user by moving what they have memorised.
