# Title Tests

A zettel title is a draft until it passes all six tests. Only settled titles get flashcards or notes nested under them in an outline.

| # | Test | Question to ask | Common failure |
|---|------|-----------------|----------------|
| 1 | **Disagree** | Could someone reasonably disagree? For a concept zettel: is it `<Term>: <definition>`, the term, a colon, then the definition? | Topic titles: `Procrastination` |
| 2 | **Content** | Remove the subject. Does the rest still tell me something? | Empty endings: "is important", "matters", "has benefits" |
| 3 | **One claim** | Is there only one thing to agree with? A `so` or `because` clause giving the reason is fine | Two claims joined by "and" |
| 4 | **Standalone** | Seen as a link inside another note, does it make sense without opening it? Does it fit into "A, and B, so C"? | "This", "it", or missing context |
| 5 | **Body match** | Does the body argue the whole title, and nothing beyond it? | The body drifts and the title stays behind |
| 6 | **Plain words** | Is it in the user's own words, phrased positively, without other defined terms? | Jargon stacking, "Don't…" titles |

A title doesn't have to carry its own why. A rule title ("X should be Y") passes, but a reason title is preferred, because the rules live in the cheat sheet and a reason title can be cited inside an argument.

## Process guardrails

1. **A draft title is a hypothesis.** Settle it only after the body is written, because test 5 can't run before then.
2. **Search before creating or renaming.** If a similar title exists, run the disagreement test: could someone agree with one and disagree with the other? If not, it's the same claim, so propose a merge. If so, propose sharpening both titles. Two titles answering the same question signal a merge. Check concept zettels too: a new note that answers "what is X?" overlaps an existing concept zettel for X.
3. **The user writes, Claude checks.** Run the six tests and report failures. Suggest a title, but never set one without approval.
4. **Only settled titles get cards and notes nested under them.** A draft shows: a title that still fails a test gets `#draft=<failing tests>` (e.g. `#draft=4,5`) plus `#iconClass=bx bx-pencil`, so a pencil appears in the tree and every reference link. Remove both once all six pass. Question titles keep the question mark instead, and legacy notes get labels only when touched.
5. **Drift check:** when updating a zettel, re-run test 5.
