---
name: actionable-feedback
description: Quickly turn a described scenario into actionable feedback using the SBI framework (Situation, Behaviour, Impact, Next Step), asking only for what is missing and flagging significant gaps or psychological biases. Use when the user wants to give, write, draft, prepare, or sanity-check feedback for a colleague, direct report, manager, or peer, or says things like "help me give feedback", "how do I tell them", or "review my feedback".
---

# Actionable Feedback

Help the user turn a scenario into feedback the recipient can act on, fast. Feedback loses value with every day it waits, so the default is to produce a usable draft in the first reply. Challenge the feedback only when a significant gap would make it unfair or useless.

**SBI + Next Step = Actionable Feedback**

| Element | Question it answers | Passes when | Fails when |
| --- | --- | --- | --- |
| **Situation** | When and where did it happen? | One specific occasion: "During yesterday's sprint review" | "You always", "You never", "lately", "in general" |
| **Behaviour** | What specifically happened? | A camera could have recorded it: "You interrupted three people while they were explaining their ideas" | A judgment, trait, or guess at motive: "You were disrespectful", "You don't care about deadlines" |
| **Impact** | Why does it matter? | A concrete consequence for a person, the team, a customer, or the business: "Some people stopped contributing" | No consequence beyond "I didn't like it" |
| **Next Step** | What should happen next time? | A behaviour the recipient controls and could start doing tomorrow | "Be more professional", "Do better", "Take more ownership" |

The same four elements apply to positive feedback. There the Next Step is reinforcement: what to keep doing, and where else to apply it.

## Rules

- **Speed first.** Draft in the first reply whenever you can. Never hold a usable draft back to ask a question that would only polish it.
- **Never invent facts.** Every detail in the feedback must come from the user. Where a small detail is missing, leave a marked placeholder like `[which meeting?]` for the user to fill in.
- **One round of questions at most**, and no more than three questions in it. If the answers still leave a gap, draft with what you have and note the gap.
- **A bias flag is a signal, not a verdict.** You only know what the user told you. Name the signal in one line, quote the words that triggered it, and let the user decide.
- **The user decides.** If they want the draft as it is, give it to them.

## Workflow

### Step 1: Triage the scenario

Sort what the user gave you against the four elements and choose a path. Do not show this analysis unless it helps.

| Path | When | What to do |
| --- | --- | --- |
| **Draft now** | Every element is present, or the gaps are minor: a missing date, a loose Next Step you can sharpen from what the user said, wording that needs tightening | Go straight to Step 3 |
| **Quick probe** | An element is missing and cannot be covered by a placeholder, most often the observable Behaviour or the Impact | Step 2, then Step 3 |
| **Challenge** | There is a significant gap (see below) | Step 2, raising the gap as one of the questions, then Step 3 |

Most scenarios should take the first path. When in doubt, draft.

**Significant gaps.** Challenge only when one of these is true, because each one changes what the feedback should say or whether it should be given at all:

- **No observable behaviour.** The whole account is judgment or trait ("careless", "has an attitude") and the user has not described anything they saw or heard.
- **Second hand only.** The user did not witness it and is relying on what others said.
- **Expectation never set.** The recipient was never told, and could not reasonably have known, what was expected.
- **A bias that carries the message.** One of the signals in the table below is central to the feedback, not just a turn of phrase.
- **Emotional heat.** The language is charged enough that the user may regret the message.

| Bias | Signal in the user's account | Question to ask |
| --- | --- | --- |
| **Fundamental attribution error** | Behaviour explained by character ("lazy", "doesn't care") with no mention of circumstances | "What about their situation could explain this?" |
| **Mind reading** | Stated intent the user cannot have observed ("they did it to undermine me") | "What did you observe that tells you that?" |
| **Overgeneralisation** | "Always", "never", "every time", built on one or two occasions | "Which occasions, specifically?" |
| **Recency bias** | One recent event standing in for a whole period, especially in review feedback | "Does this reflect the whole period or just the last few weeks?" |
| **Horn or halo effect** | One trait or event colouring everything about the person | "What have they done well in the same period?" |
| **Confirmation bias** | A fixed prior view ("typical of them") with only supporting evidence | "What have you seen that does not fit this view?" |
| **Outcome bias** | A decision judged by its bad result, not by what was known at the time | "Given what they knew then, was it a reasonable call?" |
| **Personal preference as standard** | "Not how I would have done it", with no concrete impact | "Did their way cause a problem, or was it just different?" |
| **Conflict avoidance** | The message hedged until the point disappears ("just a tiny thing") | "If they only heard this version, would they know anything needs to change?" |

A bias signal that is only wording, such as a stray "always" in an otherwise specific account, is not a significant gap. Fix the wording in the draft and mention the change in one line.

### Step 2: Ask (only if needed)

Ask in one numbered round, three questions at most, most important first. Keep each question to one line.

Useful probes:

- **Situation:** "Which specific occasion are you thinking of?"
- **Behaviour:** "What did they actually say or do? What would I have seen if I had been there?"
- **Impact:** "What happened as a result, and who was affected?"
- **Next Step:** "What would you like them to do instead next time?"

For a significant gap, say what you noticed in one sentence and ask the matching question. Do not stack challenges. If several gaps apply, raise the one that matters most.

Where it helps the user move faster, include a provisional draft with placeholders alongside the questions, so they can see how close they already are.

If the answer shows the feedback should not be given yet, say so plainly and suggest the quicker alternative. Typical cases: ask the recipient a question first, or set the expectation now instead of treating it as a failure.

### Step 3: Draft the feedback

Write the feedback in the user's voice, in first person, using only facts the user gave you.

> In [Situation], when you [Behaviour], the impact was [Impact].
>
> Going forward, I'd like you to [Desired Behaviour].

Then add an **intent question**, so the conversation runs both ways:

> "Can you help me understand what you were aiming to achieve?" or "What was your thinking at the time?"

Drafting rules:

- Plain language, short sentences, one behaviour per piece of feedback. If the user described several incidents, draft the one that matters most and offer to do the others.
- No trait labels, no "always" or "never", no guesses about motive. Rewrite these into the observable version using the user's own facts.
- Spoken feedback should sound like speech. Written feedback stays short.
- For positive feedback, replace the Next Step with reinforcement and skip the intent question unless it helps.

Present the result like this, keeping the notes section short and leaving it out when there is nothing to say:

```
## Feedback for <recipient>

**Situation:** ...
**Behaviour:** ...
**Impact:** ...
**Next Step:** ...
**Intent question:** ...

### Ready to say or send
<the feedback as one natural passage>

### Notes
- <placeholders to fill in, wording you changed and why, or a bias signal worth keeping in mind>
```

Before you hand it over, check it yourself against the last test: **would the recipient know exactly what to do differently after this conversation?** If not, sharpen the Next Step, or tell the user that is the one thing still missing.
