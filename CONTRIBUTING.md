# Contributing

## Skill Directory Structure

Each skill lives in its own directory under `skills/`:

```
skills/<skill-name>/
├── SKILL.md                  # Required: workflow instructions
├── skill-metadata.yaml       # Required: metadata and dependencies
├── scripts/                  # Optional: supporting scripts
└── references/               # Optional: reference materials
```

## SKILL.md Guidelines

- **Pure workflow** — No dependency declarations, no install instructions, no frontmatter with metadata
- **Agent-agnostic** — Write so any AI agent can follow the instructions, not just Claude Code
- **Self-contained** — The workflow should be understandable without reading skill-metadata.yaml
- **Concise** — Skills consume context window tokens; encode just enough structure for reliable execution

## skill-metadata.yaml Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique skill identifier, kebab-case, must match directory name |
| `version` | string | Semantic version (X.Y.Z) |
| `description` | string | One-line description |
| `status` | enum | `stable`, `experimental`, or `deprecated` |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `tags` | list | Discovery tags (e.g., `[knowledge-management, trilium]`) |
| `mcp-servers` | list | MCP server dependencies |
| `system-deps` | list | System dependencies (checked, not auto-installed) |
| `npm-packages` | list | npm packages to install |
| `pip-packages` | list | pip packages to install |
| `includes` | list | Additional files/dirs to copy with the skill |
| `sub-agent` | object | Sub-agent configuration for context isolation |
| `verify` | list | Verification checks run after install/update |

### MCP Server Entry

```yaml
mcp-servers:
  - name: trilium
    package: trilium-bolt        # npm package
    type: stdio
    command: npx
    args: ["-y", "trilium-bolt"]
    env:
      - name: TRILIUM_TOKEN
        description: "Trilium ETAPI token"
        required: true
        secret: true
    scope: global                # global | project
```

### System Dependency Entry

```yaml
system-deps:
  - name: node
    min-version: "18"
    check-command: "node --version"
```

### Sub-Agent Configuration

```yaml
sub-agent:
  description: >
    What this sub-agent does and why it's useful.
  tools:
    - mcp__tool__name
  model: sonnet                  # suggested model tier
```

### Verify Section

Three types of verification checks:

```yaml
verify:
  # Run a shell command, check exit code
  - description: "Python available"
    command: "python3 --version"
    expect: exit-code-0

  # Invoke an MCP tool, check it doesn't error
  - description: "API reachable"
    tool: mcp__service__search
    args: { query: "test" }
    expect: no-error

  # Verify a file exists
  - description: "Skill file installed"
    check: file-exists
    path: "~/.claude/skills/my-skill/SKILL.md"
```

Full schema definition: [`scripts/skill-metadata.schema.yaml`](scripts/skill-metadata.schema.yaml)

## Validation

The validation script checks:

1. `skill-metadata.yaml` exists and has all required fields
2. `SKILL.md` exists and has no dependency frontmatter
3. All paths in `includes` actually exist
4. `name` field matches the directory name
5. `status` is a valid enum value
6. `version` follows semver format

Run manually:

```bash
# Validate all skills
./scripts/validate-skill.sh

# Validate a specific skill
./scripts/validate-skill.sh skills/my-skill
```

## Pre-Commit Hooks

The repository uses a Python pre-commit hook (`.githooks/pre-commit`) that:

1. Runs `scripts/validate-skill.sh` on changed skill directories
2. Regenerates `skill-index.yaml` if any `skill-metadata.yaml` changed

**Requires:** Python 3.9+

To set up after cloning:

```bash
git config core.hooksPath .githooks
```

## Adding a New Skill

1. Create the skill directory:
   ```bash
   mkdir -p skills/my-new-skill
   ```

2. Write `SKILL.md` — pure workflow instructions

3. Create `skill-metadata.yaml` with at least the required fields:
   ```yaml
   name: my-new-skill
   version: 1.0.0
   description: What this skill does
   status: experimental
   tags: [relevant, tags]
   ```

4. Add any supporting files (scripts/, references/) and list them in `includes`

5. Validate:
   ```bash
   ./scripts/validate-skill.sh skills/my-new-skill
   ```

6. Regenerate the index:
   ```bash
   ./scripts/generate-index.sh
   ```

7. Commit — the pre-commit hook will re-validate and update the index

## Testing Your Skill

Before committing, verify:

- [ ] `./scripts/validate-skill.sh skills/<name>` passes
- [ ] SKILL.md contains only workflow instructions (no dependency metadata)
- [ ] skill-metadata.yaml has all required fields
- [ ] All `includes` paths exist
- [ ] The skill works when loaded into your AI agent
- [ ] Verify checks (if defined) pass after installation
