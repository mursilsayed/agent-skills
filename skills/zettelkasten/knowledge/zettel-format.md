# Zettel Formatting Rules

Trilium-bolt fully supports markdown. Every zettel **must** use formatting to aid readability — never write a zettel as plain unformatted prose. Plain prose is invisible in Trilium; structure makes notes scannable and usable on revisit.

| Element | Usage |
|---------|-------|
| `## Heading` | Separate distinct sections within the note |
| `**bold**` | Key terms, concept names, important distinctions |
| `*italic*` | Emphasis, foreign words, quoted terms |
| `> blockquote` | Core conclusions or memorable one-liners |
| `- list` | Enumerations of 3+ items (schools, steps, examples) |
| `\| table \|` | Comparisons, pros/cons, structured contrasts |

## Backlinks — internalLink Relations

Always use `#root/noteId` format for internal links (not `#noteId`). When `trilium-bolt` converts markdown to HTML, it detects this format and **automatically creates `internalLink` relation attributes** — no manual step needed. Backlinks in the target note then appear automatically.

```markdown
[Note Title](#root/abc123xyz)   ✓ — auto-creates internalLink relation
[Note Title](#abc123xyz)        ✗ — does NOT auto-create internalLink relation
```
