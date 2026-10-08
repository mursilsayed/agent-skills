# Personal Skills Repository

A portable, agent-agnostic collection of reusable AI skills with automated dependency management. Skills are plain markdown workflows that any AI agent can consume, with optional tooling for installation and setup.

## What is a Skill?

A skill is a pre-packaged, reusable workflow that transforms a general-purpose AI into a specialist for a specific task. Unlike one-off prompts, skills persist across sessions, define multi-step workflows with branching logic, and produce consistent output.

For a deeper comparison, see [docs/skills-vs-prompts.md](docs/skills-vs-prompts.md).

## Quick Start

No need to clone the repository. Download the skill-installer and let your AI agent handle the rest:

```bash
# Download the skill-installer
curl -fsSL https://raw.githubusercontent.com/mursilsayed/agent-skills/main/skills/skill-installer/SKILL.md -o SKILL.md
```

Then ask your AI agent:

```
"Follow the instructions in SKILL.md to bootstrap yourself"
```

The skill-installer will copy itself into your agent's skills directory and from there you can install any skill from the repository:

```
"List available skills"
"Install the zettelkasten skill"
```

## Available Skills

| Skill | Description | Status | Dependencies |
|-------|-------------|--------|-------------|
| [confluence-doc-sync](skills/confluence-doc-sync/) | Draft and iterate on Confluence pages in a local Markdown file, publishing to Confluence only on an explicit publish step | experimental | mcp-remote (Atlassian MCP), node>=18 |
| [context-hub](skills/context-hub/) | Install, uninstall, author, and list context-hub contexts/dimensions in a project's AGENTS.md | experimental | context-hub-repo |
| [generate-bounded-context-map](skills/generate-bounded-context-map/) | Generate ER diagrams for bounded contexts | stable | python3>=3.9 |
| [generate-cv](skills/generate-cv/) | Generate a tailored CV PDF from a Trilium master portfolio, matched to a job description | experimental | trilium-bolt (MCP), node>=18 |
| [grilling](skills/grilling/) | Grill the user about a plan, decision, or idea until a shared understanding is reached | experimental | — |
| [project-foundations](skills/project-foundations/) | Create an Impact Brief, Project Charter, and Deliverable-Oriented WBS using Impact First Thinking | stable | — |
| [project-naming](skills/project-naming/) | Generate, evaluate, and standardise memorable project names and aliases | experimental | — |
| [skill-installer](skills/skill-installer/) | Meta skill: install, update, manage other skills | stable | — |
| [strategy-document](skills/strategy-document/) | Create, review, and audit strategy documents (Roger Martin framework) | stable | trilium-bolt (MCP, for regenerating the skill from source), node>=18 |
| [zettelkasten](skills/zettelkasten/) | Create, update and search notes in Trilium, the tool that holds the Zettelkasten | stable | trilium-bolt (MCP), node>=18 |

## How It Works

Each skill has two files with a clear separation of concerns:

```
skills/<name>/
├── SKILL.md              ← Pure workflow instructions (portable, agent-agnostic)
└── skill-metadata.yaml   ← Metadata: dependencies, MCP servers, sub-agent config, tags
```

- **SKILL.md** focuses solely on the workflow. Anyone can grab this file and use it with any AI agent.
- **skill-metadata.yaml** contains everything needed for automated setup: MCP server definitions, system dependencies, package requirements, sub-agent configuration, and verification checks.

## Sub-Agents

Skills can optionally define sub-agents for context isolation — running skill operations in a separate agent context so the main conversation stays lean. This is a recommendation, not a requirement.

For details on why and when to use sub-agents, see [docs/understanding-sub-agents.md](docs/understanding-sub-agents.md).

## Using the Skill Installer

The skill-installer is itself a skill that lives at `skills/skill-installer/SKILL.md`. Load it in your AI agent to manage the repository.

**List** available skills:
```
"List available skills"
```

**Install** a skill with all dependencies:
```
"Install the zettelkasten skill"
```

**Update** to the latest version:
```
"Update zettelkasten"
```

**Uninstall** a skill and its dedicated dependencies:
```
"Uninstall zettelkasten"
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new skills, the metadata schema, and validation tooling.
