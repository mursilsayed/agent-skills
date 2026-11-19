# About the Trilium Diagrams Skill

Dependency and context detail. SKILL.md links here; read it when installing, updating or debugging the skill, not on every run.

## Dependencies & Pre-requisites

### Knowledge sources

| Tier | Location | Contents |
|------|----------|----------|
| Skill-local | `./knowledge/` | How to draft DOT (`drafting-dot.md`), the edit forms (`edits.md`) and the concept-map profile (`concept-map-profile.md`) |
| Tools | npm package [`trilium-graphviz-diagrams`](https://www.npmjs.com/package/trilium-graphviz-diagrams), from the [repository](https://github.com/mursilsayed/trilium-graphviz-diagrams) of the same name | The converter (`src/concept-map.js`, the same code as the `conceptMap` note in Trilium) and the command line (`bin/cli.mjs`). The repository's `docs/REQUIREMENTS.md` section 13 is the plan; R13.5 covers this skill |
| Personal | Trilium | The diagrams themselves |

### Tools & MCP Servers

- The Trilium MCP server (`trilium-bolt` 1.7.0 or later): search, read, create, update and revision tools, `contentSha256` and `expectedUtcDateModified`.
- Node 18 or later with `npx`. The skill runs `npx -y trilium-graphviz-diagrams@<version>`; npx downloads each version once (about 2 MB with the Graphviz library) and caches it. No clone of the repository is needed.

### Versions

The tools must match the converter installed in Trilium, so the skill and the **Edit layout** button write the same DOT. The package's `releases.json` records the SHA-256 of each release's converter; the skill reads the `conceptMap` note's `contentSha256` and asks `which` for the matching version. Nothing here pins a version, so the skill needs no update when the tools are released: it follows whatever is installed in Trilium.

Releasing a new version is done in the repository (see its `CLAUDE.md`): change, test, `npm run release:record`, `npm publish`, then install the new converter in Trilium.

### Runtime assumptions

- **Supported agent runtimes:** any MCP-capable agent that can run `npx`.
- **Requires in Trilium:** the `Graphviz renderer` notes, set up once from the `trilium-graphviz-diagrams` README, and the current month's `zettels` folder tagged `#inbox` as the default parent.
- **Network** the first time each tools version is used.
- **The MCP server can't** run the renderer, run scripts, create launchers, or change a note's type. Drawing is confirmed by the user opening the diagram; converting a canvas is done with the launch bar's **Convert to diagram**.
- **Relation to the zettelkasten skill:** that skill owns note types, titles and outline links, and sends concept-map creation and editing here. Concept maps keep `[map]` and `#conceptMap`; other diagrams are `[diagram]` with no label (R13.5.6).

## Not yet covered

- Moving, resizing or regrouping existing shapes by chat (by design: that is **Edit layout**).
- Adding a shape inside an existing group: new shapes are placed in free space outside groups.
- More profiles (for example an architecture profile): add them to `PROFILES` in the package's `bin/cli.mjs`, release, and add a knowledge file here.
