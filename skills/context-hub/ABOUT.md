# About the context-hub Skill

Full dependency detail for this skill. SKILL.md links here so the workflows stay short during execution — read this when installing, updating, or debugging the skill, not on every invocation.

## Dependencies & Pre-requisites

### The context-hub repository (external, required)

This skill has no built-in knowledge of context-hub's conventions and never re-encodes them. It reads and defers to `<contextHubPath>/README.md` as the single source of truth for the `context/<slug>/_index.md` structure, the `**Type:** content` / `**Type:** pointer` markers, and the `AGENTS.md` wiring format. If this skill's behavior and that README ever disagree, the README wins and this skill should be updated to match.

Location is configured, not guessed — see SKILL.md's "Locate context-hub" step for the config file (`~/.config/context-hub/config.json`: `{"contextHubPath": "/absolute/path"}`) and the interactive first-run prompt that creates it. This path is deliberately fixed and platform-independent — outside any agent-specific skills directory (`~/.claude/skills/...`, `~/.cursor/...`, etc.) — so the same configuration is found no matter which agent runtime installed or is running this skill; the location does not need to be re-detected or re-entered per platform. `skill-metadata.yaml`'s `system-deps` entry does a lightweight presence check at install time only (for `skill-installer`'s reporting); the authoritative check — the configured path exists and actually looks like a context-hub clone (`context/` and `README.md` both present) — runs every time this skill is invoked, since only a live workflow step can interactively recover from a missing/stale path.

### Pointer-type dimension resolution

Some dimension files in context-hub are `**Type:** pointer` — they name a fetch mechanism (e.g. a Trilium note ID, resolved via the `zettelkasten` skill's `get_note` tool) rather than holding content directly. This skill does not resolve pointers itself when installing or authoring context; resolution happens only at consumption time, by whichever tool the pointer names, per context-hub's own rule that pointer content is never cached locally.

### Runtime assumptions

- **Supported agent runtimes:** any agent capable of reading/writing local files and following a Markdown-instruction skill (Claude Code, GitHub Copilot CLI, others) — no MCP server or language runtime beyond a POSIX shell (for the `system-deps` check) is required.
- **Single machine only** — same constraint context-hub's own README documents: `AGENTS.md` is uncommitted and references context-hub by absolute path, so none of this works across machines or in a cloud checkout. This skill does not attempt to solve that; it inherits the constraint as-is.
