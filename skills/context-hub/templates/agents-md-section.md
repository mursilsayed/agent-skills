# `AGENTS.md` section template

Used by **Install context** (written) and **List context** (parsed). The "Eager dimensions" block is optional — omit it entirely when nothing has been marked eager; an `AGENTS.md` without it simply has zero eager dimensions, which is today's default lazy-everything behavior. Always use absolute paths.

```
<!-- Local-only file: do not commit. Add "AGENTS.md" to .gitignore once this project has a git repo. -->
<!-- References an absolute path specific to this machine (~/Projects/context-hub) — will not work for other machines or cloud coding agents. -->

## Agent Context (context-hub)

At the start of this session, read these index files for background context:

- /absolute/path/to/context-hub/context/<slug>/_index.md

Also read these specific dimension files eagerly at session start, in addition
to their context's index above:

- /absolute/path/to/context-hub/context/<slug>/<dimension>.md

Each index file is short and lists its own detail files along with guidance on
**when** to load them. Only read a detail file when the current task actually
matches that guidance — except the eager dimensions explicitly listed above,
which are always read at session start — do not load all other detail files
upfront.
```

## Parsing rule (for List context)

- Each line in the first list (index files) names a wired context — derive the slug from its `context/<slug>/_index.md` path segment. Default status: lazy.
- Each line in the "Eager dimensions" list names one specific dimension file read eagerly — derive slug + dimension from `context/<slug>/<dimension>.md`. If an eager-dimension line's slug has no matching index-file line, flag it as a broken/partial wiring.
