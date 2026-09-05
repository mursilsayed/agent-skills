# About the Zettelkasten Skill

Full dependency and context detail for this skill. SKILL.md links here so the workflows stay short during execution — read this when installing, updating, or debugging the skill, not on every invocation.

## Dependencies & Pre-requisites

### Knowledge sources

| Tier | Location | Contents |
|------|----------|----------|
| Skill-local | `./knowledge/`, `./templates/` | Naming/linking conventions, Folgezettel positioning rules, markdown formatting rules, the zettel template — stable, portable, versioned with the skill |
| Personal | Trilium | The zettels and outlines themselves — the actual knowledge base this skill reads and writes |

### Tools & MCP Servers

Requires the Trilium MCP server (`trilium-bolt`) — search, read, create, update, and revision tools for notes. The exact tool set is whatever that server currently exposes; the workflows in SKILL.md name the specific calls they use, so this file doesn't duplicate that list.

Installation (package, command, env vars, scope) is defined in `skill-metadata.yaml` and handled by the `skill-installer` skill.

### Runtime assumptions

- **Supported agent runtimes:** any MCP-capable agent (Claude Code, GitHub Copilot CLI, other agent runtimes) can run these workflows.
- **Requires:** a Trilium instance with ETAPI enabled, and a parent note tagged `#inbox` for new zettels.
