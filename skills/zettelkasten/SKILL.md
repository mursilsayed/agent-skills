---
name: zettelkasten
description: Create, update and search notes in Trilium, the tool that holds the Zettelkasten. Use whenever the user mentions Zettelkasten or Trilium, and before reading or editing any Trilium note, including project notes and templates that are not zettels.
---

# Zettelkasten

## 1. Purpose & Scope

Create and maintain atomic notes following Zettelkasten principles — knowledge compression into atomic, well-connected notes written in your own words (Feynman technique: explain as if to someone unfamiliar), linked via Folgezettel and stored in Trilium.

## 2. Dependencies

Requires the Trilium MCP server. See [`./ABOUT.md`](./ABOUT.md) for knowledge sources, tools, and supported runtimes.

Zettelkasten is the method. Trilium is the tool it lives in. When the user mentions either, use Trilium.

## Rule for every Trilium edit

Before changing the content of **any** Trilium note, call `create_revision(noteId)`. This applies to zettels, outlines, project notes, templates and every other note. The Trilium MCP server does not save a revision on `update_note` or `patch_note`, so without this step the previous version is lost.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Create zettel | new concept/idea to capture | [Workflow 1: Create zettel](#workflow-1-create-zettel) |
| 2 | Update zettel | concept already exists as a zettel | [Workflow 2: Update zettel](#workflow-2-update-zettel) |
| 3 | Search zettel | "find notes about X", exploring a cluster | [Workflow 3: Search zettel](#workflow-3-search-zettel) |
| 4 | Archive skill file to Trilium | saving a skill/code file verbatim | [Workflow 4: Archive skill file to Trilium](#workflow-4-archive-skill-file-to-trilium) |
| 5 | Edit other Trilium note | changing a note that is not a zettel (project notes, templates, instructions) | [Workflow 5: Edit other Trilium note](#workflow-5-edit-other-trilium-note) |

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
   - Search existing zettels (`search_notes`) — if the same concept already exists, use **Workflow 2: Update zettel** instead
   - If new: find the inbox parent with `search_notes("#inbox")`, then create the zettel there
   - Format the body per [`./templates/zettel.md`](./templates/zettel.md) and [`./knowledge/zettel-format.md`](./knowledge/zettel-format.md)
   - Name it per [`./knowledge/note-types.md`](./knowledge/note-types.md) (`<complete phrase>-YYYYMMDDHHmmss`)
   - Add source attribution
   - Add forward links to related zettels only (never to outlines)
   - **Link from an outline** — find the relevant outline, read it with `get_note`, and position the new zettel per [`./knowledge/folgezettel-rules.md`](./knowledge/folgezettel-rules.md) (child of the closest related zettel, not appended to the end)

### Workflow 2: Update zettel

Use when an existing zettel already covers the concept.

1. `create_revision(noteId)` — always snapshot before editing
2. Fetch the note with `get_note`
3. **Synthesize, don't append** — integrate the new information into the existing text
4. Add the new source to existing sources (don't replace)
5. Update links as needed
6. Keep the title unchanged (its timestamp is the creation date, not the edit date)

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

---

**Best practices:** one concept per zettel, complete-phrase titles, link liberally to existing knowledge, synthesize rather than append on updates, always revision before editing, use outlines to navigate and review.
