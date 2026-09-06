# Dimension reference syntax

Any dimension file in context-hub can be referenced in conversation as:

```
<slug>/<filename>
```

(no file extension) — e.g. `komatsu/professional-context` for `context/komatsu/professional-context.md`.

This is a plain mechanical expansion to `<contextHubPath>/context/<slug>/<filename>.md` — never a new abbreviation or naming scheme, and never something a user has to register or maintain. It exists purely as convenient skill input.

`AGENTS.md` itself never stores this shorthand — it always stores the fully expanded absolute path (see [`../templates/agents-md-section.md`](../templates/agents-md-section.md)).
