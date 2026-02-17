# Trilium Zettelkasten Skill

Create and maintain atomic notes in Trilium following Zettelkasten principles.

## Objective

Knowledge compression — distilling information into atomic, well-connected notes that represent your own understanding rather than copied content. Use the Feynman technique: write as if explaining to someone unfamiliar.

## Prerequisites

- Trilium Notes with API access (ETAPI enabled)
- Trilium MCP server connected
- Parent note with `#inbox` tag for new zettels

## Available Tools

| Tool | Purpose |
|------|--------|
| `mcp__trilium__search_notes` | Find existing notes by text or attributes |
| `mcp__trilium__get_note` | Get note content and metadata |
| `mcp__trilium__create_note` | Create new zettels |
| `mcp__trilium__update_note` | Update existing notes |
| `mcp__trilium__create_revision` | Create a snapshot before editing |
| `mcp__trilium__get_note_tree` | Get children/hierarchy of a note |

## Note Types

| Type | Purpose | Naming Convention |
|------|---------|-------------------|
| **Zettel** | Atomic note explaining one concept | `<complete phrase>-YYYYMMDDHHmmss` |
| **Outline Zettel** | Entry point clustering related zettels | `[outline]<name>-YYYYMMDDHHmmss` + label `#outline=<name>` |

### Linking Rules

| From | Can Link To |
|------|-------------|
| **Zettel** | Other zettels only (NOT outlines) |
| **Outline** | Zettels AND other outlines |

Each zettel should be forward-linked from exactly one outline.

## Zettel Format

Use this HTML structure for zettel content:

```html
<p>[Concept explained in your own words]</p>

<h3>Links</h3>
<ul>
  <li><strong>relationship</strong> <a href="#noteId">Related Zettel</a></li>
</ul>
<p>source: <a href="url">Source Title</a></p>
```

**Rules:** Own words only • One concept • Forward links only • Include source

## Agent Workflow

### When user shares information:

1. **Extract concepts** — identify distinct atomic ideas
2. **List for approval:**
   ```
   Key concepts identified:
   1. [Concept A]
   2. [Concept B]
   Which should I capture?
   ```
3. **For each approved concept:**
   - Search existing zettels
   - **Update** if same concept exists → synthesize, don't duplicate
   - **Create** if new concept → find parent using `search_notes` for `#inbox` tag
   - Add/update links to related zettels
   - Add/update source attribution

### Update vs Create Decision

| Existing zettel covers same concept? | Action |
|-------------------------------------|--------|
| Yes | **Update** — synthesize new info, append new source |
| No | **Create** — new zettel under `#inbox` parent |

### Updating Zettels

Always create a revision before updating:

```
1. mcp__trilium__create_revision(noteId)
2. mcp__trilium__update_note(noteId, ...)
```

- Fetch with `get_note`, synthesize (don't append), update links
- Add new source to existing sources (don't replace)
- Keep title unchanged (timestamp = creation date)

### Finding the Inbox

New zettels should be created under a note with the `#inbox` tag:

```
mcp__trilium__search_notes("#inbox")
```

## Special Cases

### Archiving Skill Files to Trilium

When saving skill/code files to Trilium:

| Normal Zettel Rules | Skill Archive Rules |
|---------------------|---------------------|
| Simplify & compress | **Preserve verbatim** — exact content, no simplification |
| Own words only | **Keep original text** — do not rephrase |
| One atomic concept | **Full file content** — include all sections |
| Zettel naming | **Use skill name** — e.g., `<skill-name>-YYYYMMDDHHmmss` |

**Workflow:**
1. Create note with title: `<skill-name>-YYYYMMDDHHmmss`
2. Add label: `#skill`
3. Use `type: "code"` with `mime: "text/markdown"`
4. Set `contentFormat: "html"` to skip markdown-to-HTML conversion
5. Copy the **exact content** of the skill file — no modifications

**Updating Skills:**
- Create a revision first using `create_revision`
- Update the content with the new skill file content
- Keep title unchanged (timestamp = original creation date)

**Retrieval:**
- Search for skills using: `#skill` to list all skills
- Search by title for a specific skill

## Best Practices

- **Atomic notes** - One concept per zettel, explained completely
- **Clear titles** - Use complete phrases, not abbreviations
- **Rich linking** - Connect to existing knowledge liberally
- **Synthesize, don't append** - When updating, integrate new info
- **Revisions before edits** - Always create a revision before updating
- **Regular review** - Outlines help navigate and review knowledge
