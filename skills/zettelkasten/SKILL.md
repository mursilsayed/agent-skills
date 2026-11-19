---
name: zettelkasten
description: Create, update and search notes in Trilium, the tool that holds the Zettelkasten. Use whenever the user mentions Zettelkasten or Trilium, and before reading or editing any Trilium note, including project notes and templates that are not zettels.
---

# Zettelkasten

## 1. Purpose & Scope

Create and maintain atomic notes following Zettelkasten principles — knowledge compression into atomic, well-connected notes written in your own words (Feynman technique: explain as if to someone unfamiliar), ordered by lines of thought in outlines and stored in Trilium.

## 2. Dependencies

Requires the Trilium MCP server. See [`./ABOUT.md`](./ABOUT.md) for knowledge sources, tools, and supported runtimes.

Zettelkasten is the method. Trilium is the tool it lives in. When the user mentions either, use Trilium.

The user's rules live in `[cheatsheet]Zettelkasten` (Trilium noteId `64lPoaqApFuL`), the source of truth. The files in `./knowledge/` are an operational copy, so don't read the cheat sheet on every run. If the user changes a rule, update the matching knowledge file too.

## Rule for every Trilium edit

Before changing the content of **any** Trilium note, call `create_revision(noteId)`. This applies to zettels, outlines, project notes, templates and every other note. The Trilium MCP server does not save a revision on `update_note` or `patch_note`, so without this step the previous version is lost.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Create zettel | new concept/idea to capture | [Workflow 1: Create zettel](#workflow-1-create-zettel) |
| 2 | Update zettel | concept already exists as a zettel | [Workflow 2: Update zettel](#workflow-2-update-zettel) |
| 3 | Search zettel | "find notes about X", exploring a cluster | [Workflow 3: Search zettel](#workflow-3-search-zettel) |
| 4 | Archive skill file to Trilium | saving a skill/code file verbatim | [Workflow 4: Archive skill file to Trilium](#workflow-4-archive-skill-file-to-trilium) |
| 5 | Edit other Trilium note | changing a note that is not a zettel (project notes, templates, instructions). For any diagram, concept map or DOT note, use the `trilium-diagrams` skill | [Workflow 5: Edit other Trilium note](#workflow-5-edit-other-trilium-note) |
| 6 | Add a cheat sheet line | a command, shortcut or rule to remember for a tool or method, or a placeholder for a new tool with its docs link | [Workflow 6: Add a cheat sheet line](#workflow-6-add-a-cheat-sheet-line) |
| 7 | Promote a line to a recipe | a cheat sheet line now needs several steps or explanation | [Workflow 7: Promote a line to a recipe](#workflow-7-promote-a-line-to-a-recipe) |
| 8 | Sort an old tool note | touching a legacy note about a tool or tool feature | [Workflow 8: Sort an old tool note](#workflow-8-sort-an-old-tool-note) |
| 9 | Concept maps and diagrams | "new concept map", "draw a diagram of …", editing or reviewing a map | [Workflow 9: Concept maps and diagrams](#workflow-9-concept-maps-and-diagrams) |

If the request doesn't clearly match exactly one workflow, ask the user which one they want rather than guessing.
If the user asks what this skill can do, or asks to list workflows, show this table instead of running any workflow.

## 3. Supported workflows

### Workflow 1: Create zettel

1. **Extract concepts** from what the user shared — identify distinct atomic ideas
2. **List for approval:**
   ```
   Key concepts identified:
   1. [Concept A]
   2. [Concept B]
   Which should I capture?
   ```
3. **For each approved concept:**
   - Search existing zettels (`search_notes`), including concept zettels for the same term. If the same claim already exists (disagreement test in [`./knowledge/title-tests.md`](./knowledge/title-tests.md)), use **Workflow 2: Update zettel** instead
   - If new: find the current month's `zettels` folder (Timeline › year › month › zettels) with `search_notes("#inbox")`. If several match, pick the current month and tell the user where the note went
   - Format the body per [`./templates/zettel.md`](./templates/zettel.md) and [`./knowledge/zettel-format.md`](./knowledge/zettel-format.md): one main claim, and the body supports it
   - Title it per [`./knowledge/note-types.md`](./knowledge/note-types.md): a claim, a concept as `<Term>: a <parent> that <difference>`, or a question, plus `-YYYYMMDDHHmmss`. Run the six title tests and report failures. Never set a title without approval. If the approved title still fails a test, add `#draft=<failing tests>` and `#iconClass=bx bx-pencil` (not for question titles)
   - Add source attribution
   - Add forward links to related zettels only (never to outlines)
   - **Link from at least one outline:** read the closest outline with `get_note`, propose the position and connective per [`./knowledge/outline-order-rules.md`](./knowledge/outline-order-rules.md) (continuation or branch of the note it argues from, not appended to the end), and write it after approval

### Workflow 2: Update zettel

Use when an existing zettel already covers the concept.

1. `create_revision(noteId)` — always snapshot before editing
2. Fetch the note with `get_note`
3. **Synthesize, don't append** — integrate the new information into the existing text
4. Add the new source to existing sources (don't replace)
5. Update links as needed
6. Keep the title unchanged (its timestamp is the creation date, not the edit date). If the body now argues something different, re-run title test 5 and suggest a new title for approval. After any title change, re-run the tests: all pass → remove `#draft` and `#iconClass`; some fail → update the `#draft` value

### Workflow 3: Search zettel

1. Use `search_notes` with a text query or attribute filter (e.g. `#inbox`, `#outline=<name>`)
2. To explore a cluster, `get_note_tree` on an outline note
3. Use `get_note` to read a specific note's full content before deciding to update or link to it

### Workflow 4: Archive skill file to Trilium

When saving a skill/code file to Trilium, different rules apply than for a normal zettel:

| Normal Zettel Rules | Skill Archive Rules |
|---------------------|---------------------|
| Simplify & compress | **Preserve verbatim** — exact content, no simplification |
| Own words only | **Keep original text** — do not rephrase |
| One atomic concept | **Full file content** — include all sections |
| Zettel naming | **Use skill name** — e.g., `<skill-name>-YYYYMMDDHHmmss` |

**Create:** title `<skill-name>-YYYYMMDDHHmmss`, label `#skill`, `type: "code"`, `mime: "text/markdown"`, content = exact file content.
**Update:** `create_revision` first, then update content, keep title unchanged.
**Retrieval:** search `#skill` to list all archived skills, or search by title for a specific one.

### Workflow 5: Edit other Trilium note

For notes that are not zettels. Zettel format, naming and linking rules do not apply.

1. `create_revision(noteId)`. Only the noteId is sent. Trilium copies the content on its side, so this costs almost no tokens
2. Read only what the edit needs. Skip the read if the exact text is already known from this session. Otherwise page to the section with `contentStart` and `contentMaxChars`, and use `includeContent: false` when only metadata is needed
3. Prefer `patch_note` for a local change, and `update_note` only to rewrite the whole note
4. Keep the title unchanged unless the user asks to rename it
5. For a `[journal]` note, only add a new dated entry at the top. Never edit past entries

### Workflow 6: Add a cheat sheet line

1. Find the topic's `[cheatsheet]<topic>` (or a split out `[cheatsheet]<tool or process>`) with a title search. Split a tool or process into its own cheat sheet only once it has about three lines of the user's answers or serves more than one topic. If none exists, create it in the current month's `zettels` folder as a placeholder (one sentence in the user's words on what the topic is, then a link to the official docs or repo) and link it from the tool's outline `## Cheat sheet` section, or the closest outline if the tool has none. One cheat sheet per topic, never per term: a term inside a topic is a line in that topic's cheat sheet
2. `create_revision`, then add one line under the right section: the task in the user's search words, then the command, shortcut or rule
3. For a method cheat sheet, link the line to the zettel that holds the why. The reasoning itself never goes in the cheat sheet
4. If searching the web or asking Claude would give the same answer, suggest a link to the official docs instead of a line

### Workflow 7: Promote a line to a recipe

Use when a cheat sheet line needs several steps, or a gotcha or explanation that won't fit on one line.

1. Create `[recipe]<task, including the tool's name>-YYYYMMDDHHmmss` in the current month's `zettels` folder: command first, then variants and gotchas, then a `Verified: <date>, <tool version>` line
2. `create_revision` on the cheat sheet, and replace the line's content with a link to the recipe, on the same line
3. Never link the recipe from an outline. If it surfaces an insight beyond the tool, suggest a claim zettel

### Workflow 8: Sort an old tool note

Only when the user touches the note, never as a cleanup sweep. Ask which applies, then act after approval:

1. **Writing it taught the user something** → keep it as a zettel, and suggest a claim title from its body
2. **Only opened to look things up** → move the useful lines into the tool's cheat sheet, link the official docs, then add `#archived`
3. **Neither** → add `#archived`

Archive rather than delete, so a wrong call is easy to undo.

### Workflow 9: Concept maps and diagrams

Creating, editing and reviewing concept maps and other diagrams is done by the **`trilium-diagrams` skill**: load it and follow its workflows, with `--profile concept-map` for a concept map. This skill adds only the note rules:

1. **Title and label** per [`./knowledge/note-types.md`](./knowledge/note-types.md): `[map]` and `#conceptMap` for a concept map, `[diagram]` with no label for any other diagram
2. **Default parent:** the current month's `zettels` folder (`search_notes("#inbox")`)
3. **Link a concept map from an outline:** read the closest outline, propose adding the map as a reference link in its `## Concept maps` section (a plain list, always the outline's first section, created if missing), and write it after approval. Link the map note, not the DOT note. Call `create_revision` on the outline first
4. **Link concepts to zettels** where one exists (`URL="id:<noteId>"` on the concept), after searching for it

---

**Best practices:** one claim per zettel, claim titles or `Term: definition` concept titles that pass the six tests, a body that supports its title, link liberally to existing knowledge, synthesize rather than append on updates, always revision before editing, every zettel in at least one outline.
