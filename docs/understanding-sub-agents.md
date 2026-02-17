# Understanding Sub-Agents

## The Context Window Problem

When an AI agent works on a complex task, it accumulates messages, tool results, and conversation history. Eventually this hits the model's context limit or degrades performance — responses slow down, earlier context gets forgotten, and quality drops.

## What Are Sub-Agents?

Sub-agents are specialized, isolated agents that an orchestrator agent delegates tasks to. They solve the problem of growing context windows by running with fresh, isolated context and returning only summarized results.

```
──────────────────────────────────────────────────────┐
              ORCHESTRATOR AGENT                      │
         (Keeps minimal context)                      │
                                                      │
   "Break this complex task into subtasks"            │
                    │                                 │
         ┌─────────┴─────────┐                        │
         ▼                   ▼                        │
   ┌───────────┐       ┌───────────┐                  │
   │ Sub-Agent │       │ Sub-Agent │   ← Fresh        │
   │     A     │       │     B     │     context      │
   │           │       │           │     each          │
   │ (10 tool  │       │ (15 tool  │                  │
   │  calls)   │       │  calls)   │                  │
   └─────┬─────┘       └─────┬─────┘                  │
         │                   │                        │
         ▼                   ▼                        │
   "Summary A"         "Summary B"   ← Only results   │
                                       returned       │
──────────────────────────────────────────────────────┘
```

## Key Benefits

| Benefit | How It Helps |
|---------|-------------|
| Context Isolation | Each sub-agent starts fresh — no inherited history |
| Parallel Execution | Multiple sub-agents can run concurrently |
| Result Summarization | Only concise results flow back to orchestrator |
| Specialization | Each sub-agent can have focused tools and prompts |
| Bounded Complexity | Max iterations limits prevent runaway context growth |

## How It Solves Context Window Growth

**Without sub-agents:**
- Single agent accumulates all tool calls and results
- Context grows: 5K → 20K → 50K → 100K+ tokens
- Performance degrades, eventually hits limits

**With sub-agents:**
- Orchestrator context stays small (~5K tokens)
- Each sub-agent uses isolated context (~2-3K each)
- Only summaries return to orchestrator
- Total effective context remains bounded

## When to Use Sub-Agents

| Approach | Context Growth | Best For |
|----------|---------------|----------|
| Single agent | Unbounded | Simple, short tasks |
| With sub-agents | Isolated per task | Complex multi-step tasks |

**Use sub-agents when:**
- Complex tasks need multiple independent operations
- Tasks can run in parallel
- Different tool sets are needed for different parts
- Heavy operations (many tool calls) would bloat main context

**Don't use sub-agents when:**
- The task is simple and short
- The skill needs conversation context from the main agent
- Latency is critical (sub-agent invocation adds overhead)

## Sub-Agents in This Repository

Sub-agents in this repo are **optional**. The `sub-agent` section in `skill-metadata.yaml` is a recommendation, not a requirement.

Each skill works without sub-agents — you can always run a skill inline in the main conversation. The sub-agent definition describes an ideal isolated agent configuration for when you want context isolation.

**Example from `trilium-zettelkasten`:**
```yaml
sub-agent:
  description: >
    Handles Trilium zettelkasten operations: searching, creating,
    updating, and linking notes.
  tools:
    - mcp__trilium__search_notes
    - mcp__trilium__create_note
    - mcp__trilium__update_note
  model: sonnet
```

This tells the skill-installer: "If you want to run this skill via a sub-agent, here's the recommended configuration." Users choose whether to invoke the skill directly or via a sub-agent based on their needs.
