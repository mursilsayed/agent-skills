# Skills vs Prompts

## What is a Skill?

An agentic skill is a pre-packaged, reusable workflow that extends what an LLM agent can do. Think of it as an "onboarding guide" that transforms a general-purpose AI into a specialist for a specific task domain.

Imagine training a new employee: a **prompt** is verbal instructions they might forget, while a **skill** is a documented procedure they can follow every time.

## When to Use Each

| Use a Prompt when... | Use a Skill when... |
|----------------------|---------------------|
| One-off simple task | Repeatable multi-step workflow |
| Quick exploration | Consistent output format needed |
| No decision logic | Complex branching logic required |
| Personal use only | Team needs to share the workflow |

## Key Characteristics of Skills

1. **Reusable** — Configure once, available across all future sessions without re-explanation
2. **Version-controlled** — Skills are markdown files that live in git, can be shared, and updated centrally
3. **Multi-step workflows** — Define sequences with branching logic: "First do X, then if Y happens do Z"
4. **Sub-agent support** — Can spin up isolated sub-agents for heavy operations, keeping the main context clean (see [understanding-sub-agents.md](understanding-sub-agents.md))
5. **Consistent output** — Guarantees the same structure every time (e.g., specific JSON schema)

## Trade-offs

Skills trade **context window space** for **consistency**. Every loaded skill consumes tokens that could otherwise hold code, conversation history, or reasoning about the current task.

The implication: effective skills must be concise. Bloated skills crowd out the actual work. The sweet spot is encoding _just enough_ workflow structure to ensure reliable execution without wasting context on obvious steps.

**Sub-agents as a mitigation**: Using a sub-agent partially overcomes the context window trade-off. Sub-agents run in isolated context, so the skill instructions only consume the sub-agent's context window — not the main agent's. The main conversation stays clean because only summarized results return from the sub-agent. This allows using detailed, comprehensive skills without bloating the primary conversation. The trade-off is latency: sub-agent invocation adds overhead compared to inline skill execution.

## When to Graduate a Prompt to a Skill

Consider creating a skill when you notice:

- **You're re-explaining the same workflow** across multiple sessions
- **You need consistent output format** — the same structure every time
- **The workflow has decision points** — branching logic that's easy to forget
- **Multiple people need the same workflow** — a skill ensures everyone follows the same process
- **The task involves multiple tools** — coordinating several MCP tools or APIs in sequence
