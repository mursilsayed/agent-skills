# Edit forms for `$TOOLS edit`

`edits.json` is a JSON list of edits, applied in order. Shapes are named by the `id` that `$TOOLS list` shows; new shapes by the `ref` you give them. Arrows are named by `key` (`tail->head`, with `#2` for a second arrow between the same shapes).

| Edit | Form |
|---|---|
| Rename a shape | `{ "op": "rename", "id": "<shape>", "label": "..." }` (`\n` breaks a line) |
| Restyle a shape | `{ "op": "style", "id": "<shape>", ...look }` |
| Link a shape to a note | `{ "op": "link", "id": "<shape>", "url": "id:<noteId>" }` (`null` removes it) |
| Add a shape | `{ "op": "add", "ref": "<name>", "label": "...", "near": "<shape or ref>", "shape": "box\|rounded\|ellipse\|diamond\|text", "url": "...", ...look }` |
| Remove a shape | `{ "op": "remove", "id": "<shape>" }` (also removes its arrows) |
| Add an arrow | `{ "op": "relate", "from": "<shape or ref>", "to": "<shape or ref>", "label": "...", ...look }` |
| Change an arrow | `{ "op": "update_relation", "key": "<tail->head>", "label": "...", ...look }` (`""` removes the label) |
| Remove an arrow | `{ "op": "unrelate", "key": "<tail->head>" }` |

**Look fields** (all optional; anything not given keeps its value, and new things take the diagram's usual look):

| Field | Shapes | Arrows | Value |
|---|---|---|---|
| `color` | ✓ | ✓ | line colour, `#rrggbb` |
| `textColor` | ✓ | ✓ | label colour |
| `fill` | ✓ | | fill colour, or `"none"` |
| `penwidth` | ✓ | ✓ | line width in points; `3` is bold |
| `line` | ✓ | ✓ | `"solid"`, `"dashed"` or `"dotted"` |
| `fontsize` | ✓ | ✓ | text size in points |
| `rounded` | ✓ | | `true` or `false`, for boxes |
| `arrowheads` | | ✓ | `"forward"`, `"back"`, `"both"` or `"none"` |

New shapes are placed in the nearest free space around `near`, outside every group. Moving, resizing and regrouping are not edits: they are done with **✏️ Edit layout**.
