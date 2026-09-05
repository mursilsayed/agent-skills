# Impact → Outcome → Deliverable → Activity

The hierarchy that underlies all three workflows in this skill. Work backwards from impact.

| Level | Definition | Key question |
|-------|------------|---------------|
| **Impact** | The real-world change that matters — for a user, business, or system. Lagging, often outside your direct control. | What changes in the world? |
| **Outcome** | A measurable state change you control, expected to cause the impact. Binary — either true or false when done. | What must be true when we're done? |
| **Deliverable** (work package) | A concrete artifact or system that enables the outcome. Something you can hand over and verify exists. | What do we produce? |
| **Activity** | The effort done to produce a deliverable. Not a thing — it's work. | What do we do? |

## Why the boundaries matter

- Activities without a deliverable are waste.
- You can complete the **deliverable** without achieving the **outcome** (the artifact exists but the condition isn't met).
- You can achieve the **outcome** without realising the **impact** (the condition is met but the world didn't change as expected).
- The outcome → impact link is always a causal hypothesis that may be wrong. Making it explicit and testable before work begins increases the probability of impact by enabling early course-correction — that's the point of Impact First Thinking, not a guarantee of impact.

## Deliverable vs Outcome (the most common confusion)

- **Deliverable** = a *thing* (document, feature, service, report).
- **Outcome** = a *condition* that is true or false.

You can ship the deliverable and fail the outcome.

## Worked example

*Context: Users are churning because the app is slow.*

- **Impact:** Monthly churn drops from 15% to 8%
- **Outcome:** Dashboard load time is under 1 second
- **Deliverable:** Optimised database query layer with indexed joins
- **Activity:** Profile slow queries → rewrite top 10 → add indexes → benchmark

## Defining outcomes well

An outcome should be SMART (Specific, Measurable, Actionable, Realistic, Time-bound) and have a clear verification plan — see `outcome-verification.md`. Frame outcomes as conditions, not solutions or activities:

- Bad (solution): "Build an RPA monitoring dashboard."
- Good (outcome): "Business-impacting RPA failures are detected and surfaced proactively."
