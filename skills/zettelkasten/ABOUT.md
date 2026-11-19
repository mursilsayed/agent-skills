# About the Zettelkasten Skill

Full dependency and context detail for this skill. SKILL.md links here so the workflows stay short during execution — read this when installing, updating, or debugging the skill, not on every invocation.

## Dependencies & Pre-requisites

### Knowledge sources

| Tier | Location | Contents |
|------|----------|----------|
| Skill-local | `./knowledge/`, `./templates/` | Naming/linking conventions, outline ordering rules, markdown formatting rules, the zettel template — stable, portable, versioned with the skill |
| Personal | Trilium | The zettels and outlines themselves — the actual knowledge base this skill reads and writes |
| Source of truth for rules | Trilium `[cheatsheet]Zettelkasten` (noteId `64lPoaqApFuL`) | The user's rules, each linked to the zettel that explains why. `./knowledge/` is an operational copy written as instructions. When a rule changes: the user adds a dated entry to `[journal]My zettelkasten practice`, edits the cheat sheet line, and the matching knowledge file is updated to match |

### Tools & MCP Servers

Requires the Trilium MCP server (`trilium-bolt`) — search, read, create, update, and revision tools for notes. The exact tool set is whatever that server currently exposes; the workflows in SKILL.md name the specific calls they use, so this file doesn't duplicate that list.

Installation (package, command, env vars, scope) is defined in `skill-metadata.yaml` and handled by the `skill-installer` skill.

### Runtime assumptions

- **Supported agent runtimes:** any MCP-capable agent (Claude Code, GitHub Copilot CLI, other agent runtimes) can run these workflows.
- **Requires:** a Trilium instance with ETAPI enabled, and the current month's `zettels` folder tagged `#inbox` for new notes.
- **Concept maps and diagrams (Workflow 9)** are created and edited by the `trilium-diagrams` skill, which needs the `Graphviz renderer` notes in Trilium and a local clone of [`trilium-graphviz-diagrams`](https://github.com/mursilsayed/trilium-graphviz-diagrams). This skill keeps only the title, parent and outline-link rules.
- **Not yet covered:** a flashcard workflow. Rules are in Trilium `[cheatsheet]Flashcards` (noteId `ADgOngsTojLa`); a workflow waits on the two week card pilot. Until then, when a card is made or retired for a zettel, add or remove its `#flashcard` label.
