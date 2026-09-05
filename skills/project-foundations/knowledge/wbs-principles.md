# Deliverable-Oriented WBS: principles

Most work breakdown structures default to functional/activity decomposition (Design, Backend, Frontend, QA) — this hides progress behind effort instead of outcomes. A deliverable-oriented WBS decomposes work into concrete outputs instead.

> Don't describe the work people will do. Describe what will exist, change, or be possible when the work is done.

## Functional vs deliverable-oriented

Functional (avoid as the primary structure): Design / Backend development / Frontend development / QA / Deployment — tells you who is busy, not what exists.

Deliverable-oriented (preferred):
- Password reset flow works end-to-end for customers
- Finance can export invoice list as CSV
- Support can view failed webhook deliveries
- Release checklist covers card and PayPal checkout flows

Each node is an outcome that can be demoed, tested, or shown, and can be broken down further into smaller deliverables, still phrased as outcomes.

## Core principles

1. **Decompose by outcome, not by function.** Split an outcome into smaller deliverables, not into "backend part" / "frontend part."
2. **Every deliverable should be demonstrable.** If you can't show, test, or review it, it's probably still an activity.
3. **One accountable owner per deliverable.** If two teams are jointly accountable, that's a sign the deliverable needs to be split along the accountability boundary, not shared. Single accountability doesn't mean single contributor — one owner decides when it's done.
4. **Keep "who benefits" visible in titles.** `[Who] can [do/see/receive what]`.
5. **Internal or exploratory work still needs a concrete output** (e.g. a recommendation document, a root-cause note, a shared module adopted).
6. **Depth is a tool, not a goal.** Break down only as far as needed for planning/tracking; avoid manufacturing artificial sub-levels.
7. **Epics are containers, not deliverables.** An Epic groups related deliverables under a shared theme, named after the deliverable domain (e.g. "Self-service password reset"), not a team or phase (not "Backend work" or "Q3 delivery"). Epics don't need an outcome sentence, a done-when checklist, or a single accountable owner — that rigor lives at the Task level.

## Classical WBS discipline (applies underneath the above)

- **100% rule:** the WBS captures 100% of the work defined by project scope at every level — the sum of child-level work must equal 100% of the parent, no more, no less. Applies down to the activity level within each work package too.
- **Mutually exclusive elements:** no overlap in scope between WBS elements — ambiguity causes duplicated work, cost-accounting confusion, or disputed ownership.
- **Never confuse deliverables with actions or outcomes.** Outcomes (binary conditions) sit above the WBS in the Project Charter; deliverables (things produced) are the WBS elements; activities (the work) sit below the WBS.
- **Use nouns, not verbs** for work package / deliverable names (e.g. "ADC IT Ops training", not "Provide training to ADC IT Ops team").
- **Single organisational unit or person accountable** for each deliverable.
- **Include internal deliverables too** (requirements docs, design docs, test reports, deployment plans), not just customer-facing ones.
- **Changes to the WBS require change control** — a WBS change is a scope change.
- **What a WBS is NOT:** a schedule or project plan, an exhaustive to-do list, or a copy of the org chart. It specifies *what* will be produced, not *how* or *when*.

## Task sizing

A Task is right-sized when it can be completed, reviewed, and marked done within a short, focused stretch (typically a few days). Split a Task when:

1. The "done when" checklist needs more than ~4 items (usually bundling more than one outcome).
2. The outcome has more than one beneficiary or use case.
3. More than one team/person would need to be jointly accountable.
4. Part of the outcome could ship and be independently useful on its own.
5. The Task mixes unrelated types of change (e.g. a data migration and a new UI screen).
6. You can't estimate it with reasonable confidence — often a sign it's hiding two or more outcomes.

Keep it as one Task when it has a single clear beneficiary, a single accountable owner, a 2–4 item checklist all describing the same outcome, and splitting further would only produce non-independently-demonstrable fragments.

**Rule of thumb:** if you can't write a single title in `[Who] can [outcome]` format without "and" joining two unrelated outcomes, split it.

## Quality check per Task

Before adding a Task, ask: Can I point to what changes or exists when it's done? Would another person understand "done" from the label alone? Does this read as an outcome, not an activity? Could I demo, test, or show this? Can I name the one accountable team/person? If mostly yes, it's well-formed. Epics are exempt — they only need a theme name.
