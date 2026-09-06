---
name: context-hub
description: Install or uninstall context-hub contexts/dimensions in a project's AGENTS.md, author new contexts/dimensions into the context-hub repo, and list what's wired into the current project
---

# context-hub

## 1. Purpose & Scope

Companion tool for the `context-hub` repository (a git repo holding reusable agent context: `context/<slug>/_index.md` + typed detail files, consumed by projects via an uncommitted `AGENTS.md`). This skill does not define or duplicate context-hub's conventions — it always reads and follows `<contextHubPath>/README.md` as the source of truth.

Four workflows: **Install context** (wire a context/dimension into the current project), **Uninstall context** (unwire a context/dimension from the current project), **Author context** (add or update content inside context-hub itself), **List context** (show what's wired into the current project). No hub-wide "list every available context" feature exists here by design — browse `context/` directly for that.

## 2. Dependencies

Requires the context-hub git repository, located via a small local config file rather than an MCP server or package. See [`./ABOUT.md`](./ABOUT.md) for dependency detail and runtime assumptions, [`./knowledge/reference-syntax.md`](./knowledge/reference-syntax.md) for the dimension-reference shorthand, and [`./templates/agents-md-section.md`](./templates/agents-md-section.md) for the exact `AGENTS.md` section this skill reads and writes.

## Workflows Menu

| # | Workflow | Trigger phrases / when to use it | Section |
|---|----------|-----------------------------------|---------|
| 1 | Install context | wire a context/dimension into the current project | [Workflow 1: Install context](#workflow-1-install-context) |
| 2 | Uninstall context | unwire a context/dimension from the current project | [Workflow 2: Uninstall context](#workflow-2-uninstall-context) |
| 3 | Author context | add or update content inside context-hub itself | [Workflow 3: Author context](#workflow-3-author-context) |
| 4 | List context | show what's wired into the current project | [Workflow 4: List context](#workflow-4-list-context) |

Every workflow above first runs [Locate context-hub](#locate-context-hub-run-before-any-workflow-below).
If the request doesn't clearly match exactly one workflow, ask the user which one they want rather than guessing.
If the user asks what this skill can do, or asks to list workflows, show this table instead of running any workflow.

## 3. Supported workflows

### Locate context-hub (run before any workflow below)

Configuration lives at a single, fixed, platform-independent path — `~/.config/context-hub/config.json` — deliberately outside any agent-specific skills directory, so it's found the same way regardless of which agent runtime is running this skill.

1. Look for `~/.config/context-hub/config.json`, containing `{"contextHubPath": "/absolute/path"}`.
2. If it's missing, doesn't parse, or `contextHubPath` doesn't point to a directory containing both a `context/` folder and a `README.md`: ask the user for the absolute path to their context-hub clone, validate it the same way, then create `~/.config/context-hub/` if needed and write `config.json` with the confirmed path.
3. If it still doesn't validate after asking: **stop and fail clearly** — show the expected structure (`<path>/context/`, `<path>/README.md`) and do not proceed into any workflow below.
4. Otherwise, read `<contextHubPath>/README.md` now (or re-read if it's been a while) — its conventions govern everything below. Keep the resolved `contextHubPath` for the rest of this session.

### Workflow 1: Install context

Wires an existing context-hub context or specific dimension into the **current** project's `AGENTS.md`.

1. Confirm the current project root (cwd, or ask if ambiguous). Check whether it already has an `AGENTS.md`.
2. List candidate context slugs by reading `<contextHubPath>/context/*/_index.md` directory names, and ask the user which context(s) and/or specific dimension(s) they want installed — don't assume. Accept dimension references per [`./knowledge/reference-syntax.md`](./knowledge/reference-syntax.md).
3. For each confirmed context, ensure its `_index.md` absolute path is listed under the project's `## Agent Context (context-hub)` section (create the section per [`./templates/agents-md-section.md`](./templates/agents-md-section.md) if absent; append to it, never duplicate it, if present).
4. For any dimension the user explicitly wants read eagerly (not just reachable via its index's own on-demand guidance), add its absolute path to the template's "Eager dimensions" sub-list. Leave dimensions not explicitly marked eager alone — they stay lazy by default, exactly as context-hub already documents.
5. Always write **absolute paths**.
6. If `AGENTS.md` didn't exist before this run, include the template's two `<!-- -->` comment lines verbatim, and — if the project has a git repo — check `.gitignore` covers `AGENTS.md`, offering to add it if missing.
7. To remove wiring later, use **Workflow 2: Uninstall context** rather than hand-editing.
8. Show the exact diff to `AGENTS.md` before writing it, and confirm.

### Workflow 2: Uninstall context

Unwires a context or specific eager dimension from the **current** project's `AGENTS.md`. This never touches the context-hub repository itself — to delete a context or dimension from the hub, see **Workflow 3: Author context** instead.

1. Locate the current project's `AGENTS.md` (cwd, or ask). If it doesn't exist, or has no `## Agent Context (context-hub)` section, report there's nothing to remove and stop.
2. Parse the section per the parsing rule in [`./templates/agents-md-section.md`](./templates/agents-md-section.md) and show the user what's currently wired (context slugs, and eager dimensions per slug).
3. Ask what to remove: a whole context (drop its index line and any of its eager-dimension lines, unwiring it entirely) or a single eager dimension (drop just that line, leaving the context wired but that dimension lazy again). Accept dimension references per [`./knowledge/reference-syntax.md`](./knowledge/reference-syntax.md).
4. If the removal leaves the `## Agent Context (context-hub)` section with no index lines at all, remove the whole section — including its two leading `<!-- -->` comment lines — rather than leaving an empty header behind.
5. Show the exact diff to `AGENTS.md` before writing it, and confirm.

### Workflow 3: Author context

Adds or updates content **inside the context-hub repository itself**. Three sub-flows:

**New context**
1. Ask for the new context's slug (kebab-case, stable — warn that renaming it later means updating every consuming project's `AGENTS.md`, unlike adding a dimension).
2. `mkdir <contextHubPath>/context/<slug>`.
3. Draft `_index.md` with the user: a brief description, plus a list of planned detail files each with guidance on when an agent should load it. Use the `**Type:** index (eager — ...)` marker, matching the convention actually in use across the hub's existing indexes.
4. For each detail file, ask whether it's `**Type:** content` (draft/paste real content directly into the file) or `**Type:** pointer (...)` (capture where the real content lives — e.g. a Trilium note ID and which skill/tool resolves it — never write resolved content into a pointer file).
5. Show all new files to the user before writing. Only `git add` + `git commit` on explicit confirmation. Never `git push` unless the user separately asks for that.

**New or updated dimension in an existing context**
1. Ask which existing context slug this belongs to.
2. New dimension: create the file with its `**Type:**` marker (content or pointer, per the user), then update that context's `_index.md` to list it with load-when guidance. Tell the user explicitly that no project's `AGENTS.md` needs to change — it only ever references the index, never individual dimension files, unless that dimension was separately marked eager via Install context.
3. Updated dimension: edit the file's content in place. Preserve its existing `**Type:**` marker unless the user is deliberately changing the type. Update the index's load-when guidance only if when-to-load actually changed.
4. Same preview-then-commit pattern as above.

**Removing a context or dimension**
Mirrors context-hub's README: `git rm -r context/<slug>` for a whole context (after confirming no project's `AGENTS.md` still references it), or delete a single dimension file and remove its line from that context's `_index.md`. Preview and confirm before committing, same as above.

### Workflow 4: List context

Read-only report of what's wired into the **current** project.

1. Locate the current project's `AGENTS.md` (cwd, or ask). If it doesn't exist, report that nothing is wired and stop.
2. Parse its `## Agent Context (context-hub)` section per the parsing rule in [`./templates/agents-md-section.md`](./templates/agents-md-section.md).
3. Present as a table: `Context slug | Dimension (or "— index only") | Eager/Lazy`.
4. Never write to `AGENTS.md` during this workflow.
