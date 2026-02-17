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
"Install the trilium-zettelkasten skill"
```

## Available Skills

| Skill | Description | Status | Dependencies |
|-------|-------------|--------|-------------|
| [trilium-zettelkasten](skills/trilium-zettelkasten/) | Create atomic Zettelkasten notes in Trilium | stable | trilium-bolt (MCP), node>=18 |
| [generate-bounded-context-map](skills/generate-bounded-context-map/) | Generate ER diagrams for bounded contexts | stable | python3>=3.9 |
| [skill-installer](skills/skill-installer/) | Meta skill: install, update, manage other skills | stable | — |

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
"Install the trilium-zettelkasten skill"
```

**Update** to the latest version:
```
"Update trilium-zettelkasten"
```

**Uninstall** a skill and its dedicated dependencies:
```
"Uninstall trilium-zettelkasten"
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new skills, the metadata schema, and validation tooling.
