# About the Project Foundations Skill

Full dependency and context detail for this skill. SKILL.md links here so the workflows stay short during execution — read this when installing, updating, or debugging the skill, not on every invocation.

## Dependencies & Pre-requisites

### Knowledge sources

| Tier | Location | Contents |
|------|----------|----------|
| Skill-local | `./knowledge/`, `./templates/` | The Impact First Process, the Impact/Outcome/Deliverable/Activity model, framing and outcome-verification rules, deliverable-oriented WBS principles, and the three document templates — stable, portable, versioned with the skill |
| Personal | Trilium | Source notes this skill was derived from: `Impact first thinking-2026010817112929`, `Simple Project Charter Template-20260326160000`, `Deliverable Oriented Work Breakdown Structure-2026082911365243`, and their linked notes (Impact First Process, Impact Brief, Problem Framing, Accomplishment Framing, Outcome, Deliverable, Impact vs Outcome vs Deliverable vs Activity, Design principles for decomposing work into WBS, How to verify an outcome) |

If those Trilium notes change, this skill's `knowledge/` and `templates/` files should be regenerated to match — ask "regenerate the project-foundations skill from its source notes."

### Tools & MCP Servers

None required. This skill runs entirely on conversation with the user plus its own local knowledge and templates — no MCP servers, external APIs, or system dependencies.

### Runtime assumptions

- **Supported agent runtimes:** any agent runtime can run these workflows — no special capabilities required.
- **Requires:** nothing beyond the user's willingness to work through the questions each workflow asks (5 Whys, 5 So Whats, outcome verification, etc.).
