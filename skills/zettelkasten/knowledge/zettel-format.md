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

## Forward links — use reference links, not plain hyperlinks

Write every `## Links` entry as a Trilium **reference link**, not a plain markdown hyperlink. A plain link (`[Note Title](#root/noteId)`) freezes the target's title as static text at write time — rename the target later and every note linking to it now shows a stale label. A reference link instead always displays the target's *current* title and icon, because Trilium resolves it live at render time rather than storing the label.

Embed it as raw HTML, inline within the markdown content (markdown passes inline HTML through unchanged, so this is safe to mix with the rest of a markdown-formatted note):

```html
<a class="reference-link" href="#root/abc123xyz">Note Title</a>
```

The inner text is a placeholder only — Trilium's editor ignores it and renders the live title instead — but still fill it with the note's title at time of writing, both for readability of the raw source and because `trilium-bolt`'s `#root/noteId` detection (above) still needs to see the href to create the `internalLink` relation.

```markdown
✓  * **related** <a class="reference-link" href="#root/abc123xyz">Note Title</a>
✗  * **related** [Note Title](#root/abc123xyz)   — title text goes stale if the target is renamed
```

Plain markdown links are still fine for linking *out* to external sources (the `source:` line) — this rule is only for links between zettels.
