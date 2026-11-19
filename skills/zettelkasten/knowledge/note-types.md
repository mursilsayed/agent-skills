# Note Types & Linking Rules

Operational copy of the rules in `[cheatsheet]Zettelkasten` (Trilium noteId `64lPoaqApFuL`), which is the source of truth. Don't read the cheat sheet on every run; this file is enough to act.

**Note** means anything in the vault. **Zettel** means only the thinking type. Every other type is a note, not a zettel, so zettel rules never apply to it.

| Type | Job | Title | Label |
|------|-----|-------|-------|
| **Zettel** (claim or concept) | Thinking | A claim, a concept as `<Term>: <definition>`, or a question as a temporary title. **No prefix** | None |
| **Outline** | Finding | `[outline]<handle>` | `#outline=<name>` |
| **Saved search** | Finding | `[search]<name>` | None |
| **Cheat sheet** | Doing | `[cheatsheet]<topic>`, or `<tool or process>` when split out | None |
| **Recipe** | Doing | `[recipe]<task, including the tool's name>` | None |
| **Source note** | Input | `[book]`, `[vlog]`, `[blog]`, `[podcast]`, `[project]`, `[research]` prefix | None |
| **Journal** | Reflection | `[journal]<subject>` | None |
| **Concept map** | Studying | `[map]<name>`, with a child DOT note `[map]<name> DOT` | `#conceptMap` on the map, `#archived` on the DOT note |
| **Diagram** | Explaining | `[diagram]<name>`, with a child DOT note `[diagram]<name> DOT` | None on the diagram, `#archived` on the DOT note |
| **Archived skill** | Reference | `<skill-name>` | `#skill` |

- Every title ends in `-YYYYMMDDHHmmss`, the creation time in Sydney time. Never change it on rename, except to fix a malformed one to the note's real creation time (Trilium's `dateCreated` is UTC; convert it).
- **No bracket prefix means zettel.**
- **The name uses the words the user would search with,** and is distinctive enough not to clash with other notes: `[cheatsheet]Kubernetes`, not `[cheatsheet]Tools`. Search titles before proposing a name.
- A prefix says what kind of note it is, never what it's about. Tags are for indices only (`#outline`, `#personal`, `#project`, `#skill`, `#conceptMap`, `#remnote`, `#draft`), never for topics. `#draft=<failing tests>` always comes with `#iconClass=bx bx-pencil`; see `title-tests.md`. `#remnote=<card Rem ID>` is a pointer set once when a zettel's RemNote card is created; it never changes on retire or reactivate, because RemNote keeps the card's state in its child item (rules in `[cheatsheet]Flashcards`, noteId `ADgOngsTojLa`). When updating a zettel that has `#remnote`, check whether its card needs the same change.
- **Journal notes are append only.** Never edit past entries. New learning goes in a new dated entry at the top, pointing back to the old one.

## Zettel title forms

| Kind | Title | Body supports it with |
|------|-------|-----------------------|
| **Claim zettel** | `<subject> <verb> <what I think>`. Prefer a reason title over a rule title | Reasons, evidence and the warrant linking them |
| **Concept zettel** | The term, a colon, then the definition: `<Term>: a <parent> that <difference>`, in plain words. The colon marks a concept (a claim title never has one), the parent is where it nests in the Concepts hierarchy, and the definition stays short (about ten words) so the term stands out. Older concept titles in `<Term> is/means …` form get reworded when touched, never in a sweep. Never a bare noun (why: Trilium zettel `jZXWUMsFd2A8`) | Examples, boundaries (what it isn't) and contrast with nearby concepts |
| **Question** | Ends in `?`. Temporary: rename to the answer once the body gives one | Candidate answers and evidence |

A concept gets its own zettel only once other zettels need to link to its definition. New terms start in a source note.

Extract from a source note only the ideas that connect to a note the user already has: they can name the zettel or outline it connects to, and say how (supports, contradicts, continues). This happens while processing the source, or later on demand when an idea becomes a step in the user's own argument. Citing a source note as evidence doesn't need a zettel. Never propose extracting every idea from a source note. The why is in Trilium zettel `s1Lyp3oKOpNP`.

Run the title tests in [`title-tests.md`](./title-tests.md) on every new or renamed zettel. Suggest a title if it fails, but never set one without the user's approval.

## Linking Rules

| From | Can link to |
|------|-------------|
| **Zettel** | Other zettels. May cite a source note, but must make sense without it. Never outlines |
| **Outline** | Zettels, the topic's cheat sheet, concept maps, source notes and other outlines. Never recipes |
| **Cheat sheet** | Recipes (on the task's line), the zettel holding a rule's why, official docs |
| **Recipe** | Zettels for any insight beyond the tool |

- **Every zettel is linked from at least one outline.** Add it to another outline only if you can name the note it sits under there, and say why.
- **Every recipe is linked from at least one cheat sheet.**
- **Every concept map is linked from at least one outline,** in its `## Concept maps` section.
- **One cheat sheet per topic by default, never one per term.** A tool or process within the topic gets its own cheat sheet only once it has about three lines of the user's own answers or serves more than one topic; the topic's cheat sheet links to it (e.g. `[cheatsheet]Flashcards` from `[cheatsheet]Zettelkasten`). A cheat sheet can start as a placeholder: one sentence in the user's words on what the topic is, and a link to the official docs or repo. Terms inside a topic (e.g. kubectx, minikube) are lines in its cheat sheet, not notes. Don't create a zettel or a reference note that restates the docs; the why is in Trilium zettel `qvfNGl6OdJN5`.
- Don't add back links: Trilium shows backlinks automatically.

## Notes migrated or not

Only outlines with a `Convention applied` line follow these rules fully. Elsewhere, a noun titled note without a prefix may be legacy: ask before applying zettel rules such as suggesting a claim title, and never migrate a note the user didn't ask about.
