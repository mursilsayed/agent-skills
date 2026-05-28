# Strategy Document Skill

A skill for creating, reviewing, and calibrating strategy documents using Roger Martin's framework: a coherent, integrated set of choices that positions you on a playing field where you can win.

**Applies to:** Operations — any ongoing domain with a persistent theory of winning (career, business, health, life area). Not for projects, which inherit strategy from their parent operation.

## Source of Truth

This skill is derived from a Trilium note. If the source changes, the skill should be regenerated to match.

- **Trilium note title:** `Strategy-20260326170000`
- **Trilium noteId:** `KtftZB2AUpn1`
- **Fetch via:** `mcp__trilium__get_note` with the noteId above

**To regenerate:** ask "regenerate the strategy-document skill from the source of truth". The assistant should fetch the current note content and update this file, preserving the existing structure (Core Concepts → Operations → Template → Pitfalls → Invocation Examples) and porting over only what has changed in the source.

## Core Concepts (Always Apply)

**Strategy** is not a list of initiatives or a single choice. It is the argument — the coherent logic explaining why a specific set of choices fits together and produces durable advantage.

**The five questions:**
1. What is our winning aspiration?
2. Where are we choosing to play?
3. How are we choosing to win?
4. What capabilities must be in place?
5. What management systems are needed?

**The asymmetry:** Questions 1–3 are true strategic choices with real trade-offs. Questions 4–5 are derived requirements — conditions that must be true for the strategic choices to be executable.

**Integration test:** Remove one choice. Do the others weaken? If yes, the strategy is integrated. If no, you have a list of decisions, not a strategy.

---

## Operations

### CREATE — Draft a new strategy

Use when the user wants to create a strategy document for a new or undefined domain.

**Step 1 — Establish context**

Ask the user:
- What is the domain or operation? (career, business area, health, etc.)
- Have they already made a directional commitment, or are they still exploring?

If they are still exploring (no committed direction), advise:
> "Strategy is most useful after you have committed to a direction. It guides how you win within that direction — not which direction to pick. If you are still choosing between paths, consider first deciding which playing field you want to commit to, then use this skill to build the strategy for it."

If they have a committed direction, proceed.

**Step 2 — Draft winning aspiration**

Ask: "What does winning look like in this domain? Give me one sentence."

Push for specificity. Vague aspirations ("be successful", "grow the business") are not useful. A good aspiration names the outcome that would constitute genuine success from the perspective of the people you are serving.

Example prompts if the user is stuck:
- "If you look back in 5 years and say 'we won' — what happened?"
- "Who are you serving, and what does it look like when you've truly served them well?"

**Step 3 — Draft where to play**

Ask: "What specific arena are you committing to? Think about: which customers, which segments, which channels, which geographies."

Remind: This is a real trade-off. Saying yes to one playing field means saying no to others. The commitment is the point.

**Step 4 — Draft how to win**

Ask: "What is the specific advantage you are betting on? Why would customers choose you over alternatives?"

A how-to-win choice must:
- Name a real advantage (not just "better quality" — better in what specific way?)
- Pair with the where-to-play (the same advantage may not work in a different arena)

**Step 5 — Test integration**

Before proceeding, test the two strategic choices for coherence:

Ask: "Does the where-to-play make the how-to-win stronger? And vice versa? Explain the connection."

If the user cannot articulate why these two choices reinforce each other, flag it:
> "These two choices may not be integrated yet. Strategy requires that each choice makes the others stronger. What is the specific reason your how-to-win works especially well in your where-to-play? If you cannot articulate it, the choices may need to be revised."

**Step 6 — Draft the integrating argument**

Ask the user to state in 2–4 sentences: why do these choices together lead to winning? This is the strategy itself — the argument, not just the decisions.

Format: "Because [where-to-play context], our [how-to-win] creates [specific advantage mechanism], which leads to [winning outcome]."

**Step 7 — Surface assumptions**

Ask: "What must be true for this strategy to work? Think about: customers, the competitive landscape, your own capabilities, the market."

For each assumption, assign a confidence level:
- **High** — you have evidence or strong experience. Monitor periodically.
- **Medium** — plausible but untested. Watch actively in early reviews.
- **Low** — a real guess. Test this first — it is your biggest risk.

Push for at least 3 assumptions. Low-confidence assumptions are first test targets.

**Step 8 — Derive capabilities and management systems**

Ask: "Given your strategic choices, what must you be exceptionally good at? What capabilities are non-negotiable?"

Then: "What systems, processes, or structures must be in place to develop and sustain those capabilities?"

Remind: These are derived — they flow from the strategic choices. If a capability does not directly support the how-to-win, question whether it belongs.

**Step 9 — Produce the document**

Output the strategy document using the [Strategy Document Template](#strategy-document-template) below.

---

### REVIEW — Calibrate an existing strategy

Use when the user wants to review or update an existing strategy document.

**Step 1 — Identify the trigger**

Ask: "What prompted this review?" Common triggers:
- Scheduled cadence (monthly in first 3 months, quarterly in months 4–12, bi-annually after 12 months)
- A key assumption has broken or changed
- A project's impact assessment surfaced something unexpected
- External change (market, technology, personal circumstances)
- Consistently unable to execute a strategic choice

**Step 2 — Review each assumption**

For each listed assumption:
1. Is it still true? What evidence supports or challenges it?
2. Has your confidence level changed?
3. If a low-confidence assumption has broken — this likely requires an overhaul, not a tweak.

**Step 3 — Check the strategic choices**

- Is the where-to-play still the right field? Have conditions changed?
- Is the how-to-win still the right advantage? Is it still differentiated?
- Is the integrating argument still coherent?

**Step 4 — Check derived requirements**

- Are the capabilities still the right ones, given the strategic choices?
- Have the management systems kept up?

**Step 5 — Determine: tweak or overhaul**

**Tweak:** One assumption has shifted, one element adjusts. The core position holds.

**Overhaul:** Where-to-play or how-to-win is no longer valid. Rebuild from the choices.

> Do not overhaul when a tweak is sufficient. Do not tweak when an overhaul is needed.

**Step 6 — Produce the updated document**

Update the strategy document using the [Strategy Document Template](#strategy-document-template). Add an entry to the review history.

---

### AUDIT — Check coherence of an existing strategy

Use when the user wants a critical review of whether their strategy is actually a strategy.

Run through these checks and report any failures:

1. **Winning aspiration test** — Is there a clear, specific one-sentence aspiration? Not a goal ("grow revenue") but a winning outcome ("be the go-to platform for independent consultants in the UK").

2. **Trade-off test** — Does the where-to-play exclude something? A choice that includes everything is not a choice.

3. **Advantage test** — Does the how-to-win name a specific, defensible mechanism? Not "better service" but "faster onboarding through our API-first architecture."

4. **Pairing test** — Is the how-to-win specifically suited to the where-to-play? The same advantage should not work equally well everywhere.

5. **Integration test** — Can the user articulate why removing one choice would weaken the others? If the choices are independent, it is a list of decisions, not a strategy.

6. **Argument test** — Is there a written integrating argument? Not bullet points — a coherent sentence or paragraph that states why these choices together lead to winning.

7. **Assumptions test** — Are there named, explicit assumptions with confidence levels? At least 3. No implicit assumptions hiding as facts.

8. **Derived requirements test** — Do the capabilities directly support the how-to-win? If a capability does not connect to the strategic choices, question its inclusion.

Report findings in a table:

| Check | Result | Notes |
|---|---|---|
| Winning aspiration | Pass / Fail | [details] |
| Trade-off | Pass / Fail | [details] |
| ... | | |

For each failure, suggest a specific corrective question or prompt to address it.

---

## Strategy Document Template

```markdown
# Strategy: [Domain Name]
*Last updated: [date]*

## Winning Aspiration
[One sentence. What does winning look like? Be specific about outcome and who benefits.]

## Strategic Choices

### Where to Play
[The arena you are committing to. Name what you are excluding as well as what you are including.]

### How to Win
[The specific advantage you are betting on. Why would customers/people choose you over alternatives?]

## The Integrating Argument
[2–4 sentences. Why do these choices fit together? What is the mechanism that makes this position durable?]

## Derived Requirements

### Capabilities
[What must you be exceptionally good at for this strategy to be executable?]

### Management Systems
[What processes, structures, or systems must support those capabilities?]

## Assumptions

| Assumption | Confidence | What to Watch |
|---|---|---|
| [assumption 1] | High / Medium / Low | [signal that would confirm or break this] |
| [assumption 2] | High / Medium / Low | [signal] |
| [assumption 3] | High / Medium / Low | [signal] |

## Review History

| Date | Trigger | What Changed | Notes |
|---|---|---|---|
| [date] | [trigger] | [what changed] | [why] |
```

---

## Common Pitfalls — Always Watch For

- **Listing initiatives instead of making choices.** "We will improve X, launch Y, hire Z" is a plan. Push back: what is the single position these initiatives are meant to support?
- **A goal masquerading as a winning aspiration.** "Grow 30%" is a goal. A winning aspiration names the outcome from the customer/user perspective.
- **A single choice presented as strategy.** Where-to-play alone is not strategy. How-to-win alone is not strategy. Both must be present and integrated.
- **Implicit assumptions.** If the user says "obviously our product is better" — that is an assumption. Name it. Rate its confidence. Put it on the watch list.
- **Derived requirements presented as strategic choices.** "We must build great engineering" is a derived requirement, not a strategic choice, unless the user is in the business of engineering talent itself.

---

## Invocation Examples

- "Help me create a strategy for my consulting practice"
- "Let's review my career strategy — it's been 3 months since I wrote it"
- "Audit this strategy document and tell me if it holds up"
- "I need to update my strategy — a key assumption just broke"
