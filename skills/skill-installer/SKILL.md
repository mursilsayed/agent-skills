# Skill Installer

Meta skill for managing skills from the repository. Reads `skill-index.yaml` and individual `skill-metadata.yaml` files to install, update, list, and uninstall skills with their dependencies.

**Repository:** `https://github.com/mursilsayed/agent-skills`
**Raw base URL:** `https://raw.githubusercontent.com/mursilsayed/agent-skills/main/`

## Operations

### 0. Bootstrap

First-time setup. Copies this skill into the agent's skills directory so it persists across sessions and can manage other skills going forward.

**Trigger:** The user asks you to bootstrap, or this file is not already in the agent's skills directory.

**Steps:**

1. **Detect agent** — Run the [Config Path Detection Protocol](#config-path-detection-protocol) to identify the agent platform and confirm all relevant paths (MCP config, skills directory, sub-agent mechanism). Store the confirmed paths for use in subsequent steps.
2. **Copy self** — Copy this `SKILL.md` and `skill-metadata.yaml` into the agent's skills directory (e.g., `<skills-directory>/skill-installer/`)
   - If running from a downloaded file, fetch `skill-metadata.yaml` from the repository raw URL
   - If the destination already exists, compare versions and ask whether to overwrite
3. **Fetch index** — Download `skill-index.yaml` from the repository raw URL and store it alongside the installer in the skills directory
4. **Confirm** — Report that the skill-installer is now installed and ready. Show usage examples for listing and installing skills

### 1. List

Display available skills from the repository.

**Steps:**
1. Read `skill-index.yaml` from the local skills directory (placed there during bootstrap), or fetch it from the repository raw URL if not found
2. For each skill, display:
   - Name, description, version, status
   - Tags and dependency summary
   - Whether it is currently installed (check if SKILL.md exists in the target skill directory)
3. Format as a table for quick scanning

**Example output:**
```
| Skill                        | Version | Status | Installed | Dependencies        |
|------------------------------|---------|--------|-----------|---------------------|
| trilium-zettelkasten         | 1.0.0   | stable | Yes       | trilium-bolt (MCP)  |
| generate-bounded-context-map | 1.0.0   | stable | No        | python3>=3.9        |
```

### 2. Install

Set up a skill and all its dependencies.

**Steps:**

1. **Locate** — Find the skill in `skill-index.yaml`, then fetch its `skill-metadata.yaml` and `SKILL.md` from the repository raw URL using the skill's `path` field
2. **Check system deps** — For each entry in `system-deps`, run the `check-command`. Report any missing or outdated dependencies. Do not auto-install system deps — instruct the user how to install them.
3. **Detect config paths** — Run the [Config Path Detection Protocol](#config-path-detection-protocol) to confirm where MCP servers and sub-agent definitions will be written. If paths were already confirmed during bootstrap, skip re-detection but show a brief summary.
4. **Show plan** — Display what will be installed:
   - MCP servers to configure, with the **exact target file path** confirmed in the previous step
   - Packages to install (npm/pip)
   - Files to copy, with destination paths
   - Sub-agent to create (if defined), with the mechanism and location
   - Ask for confirmation before proceeding. In `--auto` mode, skip confirmation.
5. **Install MCP servers** — For each entry in `mcp-servers`:
   - Map the skill's `scope` field to a Claude Code scope flag: `global` → `--scope user`, `project` → `--scope project`, unset → `--scope user`
   - Check if already configured: run `claude mcp get <name>` and inspect output
   - If already configured, ask whether to overwrite (re-run `claude mcp add`) or skip
   - Prompt for required secret environment variables (e.g., API tokens)
   - Show the exact command that will be run before executing it
   - Run: `claude mcp add --scope <scope> -e KEY=value -- <name> <command> [args...]`
   - Confirm with `claude mcp get <name>` after adding
6. **Install packages** — Run `npm install -g <package>` for npm-packages, `pip install <package>` for pip-packages
7. **Set up sub-agent** — If `sub-agent` section exists:
   - Display a recommendation prompt before doing anything:
     ```
     This skill defines a sub-agent that can run it in an isolated context,
     keeping its tools and permissions separate from the main conversation.

     Recommended: Create a sub-agent for this skill?
     Sub-agent name: <skill-name>
     Description:    <sub-agent.description>
     Tools:          <sub-agent.tools>

     [Y]es (recommended) / [N]o — skip sub-agent creation
     ```
   - If the user declines (`N`): skip sub-agent creation entirely, continue with the rest of install
   - If the user approves (`Y`): look up the **Create-Agent Method** for the detected platform in the [Configuration Paths](#configuration-paths) table, then follow the [Sub-Agent Setup](#sub-agent-setup) instructions to execute that method using the agents directory confirmed in the detection protocol; create the directory if it doesn't exist; report the path or command used
   - In `--auto` mode: default to yes (create the sub-agent) and display the target path without prompting
8. **Copy skill files** — Copy `SKILL.md` and all files listed in `includes` to the agent's skills directory
9. **Verify** — Run each check in the `verify` section:
   - `command`: Execute the shell command, check exit code
   - `tool`: Invoke the MCP tool with given args, check for errors
   - `file-exists`: Verify the file exists at the specified path
   - Report pass/fail for each check

### 3. Update

Upgrade an installed skill to the latest version from the repository.

**Steps:**

1. **Compare versions** — Read installed skill version vs. repository version
2. **Show diff summary** — Report what changed:
   - New or removed dependencies
   - Workflow changes (SKILL.md modified)
   - New or removed includes
3. **Detect config paths** — Re-run the [Config Path Detection Protocol](#config-path-detection-protocol) or use previously confirmed paths
4. **Update dependencies** — Install new MCP servers/packages, warn about removed ones
5. **Replace skill files** — Overwrite SKILL.md and includes with latest from repo
6. **Verify** — Run verification checks

### 4. Uninstall

Remove a skill and optionally its dependencies.

**Steps:**

1. **Identify installed artifacts** — Skill files, MCP server configs, and sub-agent definition file (path and extension determined by the platform's **Create-Agent Method** in the [Configuration Paths](#configuration-paths) table). Only include the sub-agent file if it was created during a previous install — if the user skipped sub-agent creation at install time, there is nothing to remove.
2. **Detect config paths** — Confirm the paths where configs were written (use previously confirmed paths or re-detect)
3. **Check shared deps** — For each MCP server the skill uses, check if other installed skills also use it. If shared, warn and skip removal.
4. **Show removal plan** — List exactly what will be removed and from which files, ask for confirmation
5. **Remove skill files** — Delete SKILL.md and includes from the agent's skill directory
6. **Remove dedicated deps** — Remove MCP server configs, packages not shared with other skills, and the sub-agent definition file (only if it was created during install)
7. **Verify** — Confirm clean removal (files no longer exist, MCP server entry removed from config)

## Config Path Detection Protocol

Run this protocol whenever you need to determine where to write MCP server configs, sub-agent definitions, or skill files. The goal is to **never assume a path** — always probe, present, and confirm.

### Step 1 — Identify the agent

Determine which agent is running this skill. Checks in order:
- If the current session context makes the agent obvious (e.g., you know you are Claude Code), state it
- Otherwise ask: *"Which agent are you installing this skill for? (e.g., Claude Code, Cursor, Windsurf, other)"*

### Step 2 — Probe for candidate config files

For the identified agent, check which candidate config files actually exist on the filesystem. Use the [Configuration Paths](#configuration-paths) table for the list of candidates.

For **Claude Code** specifically, probe all three levels:
- User (global): `~/.claude.json` → `mcpServers` key (top-level)
- Local (machine-specific, per-project): `~/.claude.json` → `projects["<cwd>"].mcpServers`
- Project (shared via VCS): `.mcp.json` in the project root

> **Note:** `~/.claude/settings.json` is Claude Code's internal application settings file. It is **not** read for MCP server configuration — do not write MCP entries there.

### Step 2b — Probe for candidate agents directories

After confirming the MCP config path, also probe for the agents directory where sub-agent definition files will be written. Use the [Configuration Paths](#configuration-paths) table for the list of candidates per agent.

- **Claude Code**: check both `~/.claude/agents/` (user-level) and `.claude/agents/` (project-level). Prefer project-level if the skill scope is `project`; otherwise prefer user-level.
- **Cursor**: check `~/.cursor/agents/`
- **Windsurf**: no known standard location — ask the user: *"Where should I create sub-agent definition files for Windsurf? Please provide the absolute path to your agents directory."*
- **Unknown**: ask the user: *"Where should I create sub-agent definition files? Please provide the absolute path to your agents directory."*

Store the confirmed agents directory alongside the MCP config and skills directory paths for use in later steps.

### Step 3 — Select based on skill scope

Use the `scope` field from the MCP server entry in `skill-metadata.yaml`:
- `scope: global` → use the **user-level** config file (e.g., `~/.claude/settings.json`)
- `scope: project` → use the **project-level** config file (e.g., `.claude/settings.json`)
- If `scope` is not set → default to `global`

### Step 4 — Present and confirm

Before writing anything, show the user:

```
I'll write the MCP server configuration to:
  File:  /Users/<you>/.claude.json
  Key:   mcpServers.<server-name>

I'll write the sub-agent definition to:
  File:  ~/.claude/agents/<skill-name>.md

Is this correct? (yes / provide a different path)
```

If the user provides a different path, use that instead. If the file or directory does not yet exist, confirm before creating it.

### Step 5 — Handle unknown agents

If the agent is not in the [Configuration Paths](#configuration-paths) table:
1. Ask: *"I don't have a preset for your agent. Where should I write the MCP server configuration? Please provide the absolute path to your MCP config file."*
2. Ask: *"Where is your skills/prompts directory? (The folder where I should copy SKILL.md)"*
3. Confirm both paths before proceeding
4. Note the new agent and paths in the output so the user can contribute them to the repository

## Sub-Agent Setup

How sub-agent definitions are created depends on the agent platform. Look up the **Create-Agent Method** for the detected platform in the [Configuration Paths](#configuration-paths) table and follow it. All platform-specific knowledge (CLI command, file format, path) lives in that table — this section stays generic.

### Steps

1. Look up the **Create-Agent Method** for the detected platform in the [Configuration Paths](#configuration-paths) table
2. Execute that method, substituting values from `skill-metadata.yaml`:
   - `<skill-name>` — the skill's `name` field
   - `<description>` — `sub-agent.description`
   - `<tools>` — `sub-agent.tools`
   - `<model>` — `sub-agent.model` (omit if not set)
3. Report the file path or command that was used

### Agent File Format (for file-write methods)

When the Create-Agent Method is `write-file`, write the following to `<agents-dir>/<skill-name>.<ext>`:

```markdown
---
name: <skill-name>
description: <built description — see below>
tools: <sub-agent.tools from skill-metadata.yaml, comma-separated>
model: <sub-agent.model if present, else omit this field>
---

Read and follow the instructions in `<skills-dir>/<skill-name>/SKILL.md` to handle this request.
```

#### Building the description

The description is what Claude uses to decide when to proactively invoke the agent. A plain sentence is not enough — it must include trigger examples. Build it as follows:

1. Start with the `sub-agent.description` text from `skill-metadata.yaml`
2. If `sub-agent.examples` entries exist, append each one as an `<example>` block:

```
<example>
Context: <example.context if present>
user: "<example.user>"
assistant: "<example.assistant>"
<commentary>
<example.commentary if present>
</commentary>
</example>
```

3. Escape the full description as a JSON string (wrap in `"..."`, use `\n` for newlines) so the YAML frontmatter stays valid

#### Body

Always include a body that tells the agent where its instructions live:

```
Read and follow the instructions in `<skills-dir>/<skill-name>/SKILL.md` to handle this request.
```

Where `<skills-dir>` is the confirmed skills directory for the detected platform (e.g. `~/.claude/skills`).

## Modes

All operations support two modes:

- **Guided (default)** — Shows plan and asks for confirmation at each step, including explicit confirmation of config file paths before any write
- **Automatic (`--auto`)** — Runs without confirmation prompts, but still **displays** the target paths before writing

## Usage Examples

```
# First-time setup (run once after downloading SKILL.md)
"Follow the instructions in SKILL.md to bootstrap yourself"

# List all available skills
"List available skills"

# Install a skill
"Install the trilium-zettelkasten skill"

# Install without confirmation prompts
"Install trilium-zettelkasten --auto"

# Update a skill
"Update generate-bounded-context-map"

# Uninstall a skill
"Uninstall trilium-zettelkasten"
```

## Configuration Paths

Reference table of known config locations per agent. The [Config Path Detection Protocol](#config-path-detection-protocol) uses this table as a starting point — always probe and confirm before writing.

| Agent | MCP Config scope | Config location | Skills Directory | Agents Directory | Create-Agent Method |
|-------|-----------------|-----------------|-----------------|-----------------|---------------------|
| Claude Code | `user` | `~/.claude.json` → `mcpServers` | `~/.claude/skills/<name>/` | `~/.claude/agents/` | `write-file` → `<agents-dir>/<name>.md` (no CLI available) |
| Claude Code | `local` (default) | `~/.claude.json` → `projects["<cwd>"].mcpServers` | `~/.claude/skills/<name>/` | `.claude/agents/` | `write-file` → `<agents-dir>/<name>.md` (no CLI available) |
| Claude Code | `project` | `.mcp.json` in project root | `~/.claude/skills/<name>/` | `.claude/agents/` | `write-file` → `<agents-dir>/<name>.md` (no CLI available) |
| Cursor | user | `~/.cursor/mcp.json` | `~/.cursor/rules/<name>/` | `~/.cursor/agents/` | `write-file` → `<agents-dir>/<name>.mdc` (no CLI available) |
| Cursor | project | `.cursor/mcp.json` | `~/.cursor/rules/<name>/` | `~/.cursor/agents/` | `write-file` → `<agents-dir>/<name>.mdc` (no CLI available) |
| Windsurf | user | `~/.codeium/windsurf/mcp_config.json` | `~/.codeium/windsurf/skills/<name>/` | Ask user | Ask user |
| (Unknown) | — | Ask user | Ask user | Ask user | Ask user |

**Claude Code config file notes (verified via `claude mcp add`):**
- `~/.claude.json` → `mcpServers` — **User scope** (`--scope user`). Available in all projects on this machine. Use this for skills with `scope: global`.
- `~/.claude.json` → `projects["<path>"].mcpServers` — **Local scope** (`--scope local`, the default). Machine-specific, tied to a specific project working directory.
- `.mcp.json` in project root — **Project scope** (`--scope project`). Committed to version control; shared with the team.
- `~/.claude/settings.json` — **Not for MCP config.** This is Claude Code's internal application settings file and is ignored by `claude mcp list`. Writing MCP entries here will silently have no effect.
- `~/.claude.json` top-level keys other than `mcpServers` — Internal state (session counters, feature flags, A/B test cache). Do not modify manually.

For unlisted agents, the installer will ask where to write configuration and display the paths it uses so they can be contributed back to the repository.

## Error Handling

- **Missing system dep**: Report which dependency is missing and how to install it. Do not proceed with installation.
- **MCP server already configured**: Ask whether to overwrite, skip, or abort.
- **Config file path unconfirmed**: Never write to a config file whose path has not been confirmed in the current session. If the detection step was skipped, re-run it.
- **Verification failure**: Report which check failed. The skill may still be partially installed — suggest running uninstall and retrying.
- **Network error during package install**: Report the error and suggest checking connectivity.
- **Unknown agent**: Do not guess paths. Ask the user and confirm before writing.
