# `AGENTS.md` section template

Used by **Install context** (written) and **List context** (parsed).

The canonical template lives in context-hub's own `README.md`, under "Wiring
up a new project" (step 3). Read that section at runtime for the exact
literal text to write — do not hardcode a copy here, so the two can't drift
out of sync.

The "Eager dimensions" step is optional — omit it entirely when nothing has
been marked eager; an `AGENTS.md` without it simply has zero eager
dimensions, which is today's default lazy-everything behavior. Always use
absolute paths.

## Parsing rule (for List context)

- Each line in the eager-dimensions list (step 1) names one specific
  dimension file read eagerly — derive slug + dimension from
  `context/<slug>/<dimension>.md`. If an eager-dimension line's slug has no
  matching index-file line, flag it as a broken/partial wiring.
- Each line in the index-files list (step 2) names a wired context — derive
  the slug from its `context/<slug>/_index.md` path segment. Default status:
  lazy.
