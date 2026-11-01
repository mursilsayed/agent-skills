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
- **Concept maps (Workflow 9) also require:** the `Graphviz renderer` notes in Trilium, set up once from the [`trilium-concept-maps`](https://github.com/mursilsayed/trilium-concept-maps) README. `./templates/concept-map.dot` is a copy of `starterDot` in that repository's `src/new-concept-map.js`, so update it if the starter map changes. The launch bar button creates its notes under the open note with plain titles; this workflow uses the `[map]` title form and defaults to the `#inbox` folder.
- **Concept map editing (Workflow 10) also requires:** Node 18 or later and a local clone of `trilium-concept-maps` with `npm install` run. `./scripts/edit-concept-map.mjs` loads `src/concept-map.js` and Graphviz from it, found through `TRILIUM_CONCEPT_MAPS_DIR` or the default `~/Projects/trilium-concept-maps`. Keep that clone at the version of `conceptMap` installed in Trilium, so the skill and the Edit layout button write the same DOT. Run the tests with `node --test scripts/edit-concept-map.test.mjs`.
- **Not yet covered:** a flashcard workflow. Rules are in Trilium `[cheatsheet]Flashcards` (noteId `ADgOngsTojLa`); a workflow waits on the two week card pilot. Until then, when a card is made or retired for a zettel, add or remove its `#flashcard` label.
