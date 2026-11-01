# Outline Ordering Rules

## Placing notes in outlines

- **Sections, in order:** `## Concept maps` (the topic's `[map]` notes, plain list), `## Cheat sheet` (the topic's `[cheatsheet]`, plus any tool or process cheat sheets split from it), `## Concepts` (concept zettels, nested only by type, no label), `## Lines of thought` (claim zettels, ordered by argument, below), `## Open questions` (question titles, plain list), `## Sources` (source notes, journals and other unstructured notes, plain list). A zettel's kind picks its section: a `<Term>: <definition>` title goes in Concepts (under its parent), a title ending in `?` in Open questions, any other claim in Lines of thought. A question doesn't claim anything, so no connective joins it to a line; it moves into Concepts or Lines of thought once it's renamed to its answer. A `#draft` zettel stays in its line, since it still claims something and only its title is unsettled. Recipes are never listed in an outline; they're reached through the cheat sheet.
- **Link a new zettel from the closest existing outline,** even if the fit is broad. Add it to a second outline only if you can name the note it sits under there.
- **Outlines grow from clusters.** Suggest a new `[outline]<handle>` only once three or more zettels cover one concept. A sub concept starts as a sub list in its parent outline, and gets its own outline at three zettels or when a second parent needs it. On promotion, its zettels move and the parent keeps one link in the same place.
- **One handle test:** if naming an outline needs "and", it's two outlines.
- An outline holds no ideas of its own, only links and text about how they relate.

## Ordering zettels

Outlines replace Luhmann's **Folgezettel**. A zettel can sit in several outlines, so it has no single fixed position. What carries over is the idea: inside an outline's Lines of thought section, claim zettels are ordered **by argument, not topic**, so reading top to bottom gives a line of thought. The why is in Trilium zettel `3dDzrfPrp4is`.

The diagram below uses plain `[Title](#root/noteId)` markdown links for readability, but when actually editing an outline note, use the same reference-link syntax as zettel forward links (see `zettel-format.md`): `<a class="reference-link" href="#root/noteId">Title</a>`. That way an outline entry's label doesn't go stale if the zettel it points to is later renamed.

```markdown
* [Claim A](#root/noteId)                         ← a bullet starts a line of thought
      but → [Objection to A](#root/noteId)        ← branch: a detour about A, indented directly under it, no bullet
  therefore → [Claim B](#root/noteId)             ← continuation: new line inside A's bullet, back at the line's level, no bullet

* [Claim D](#root/noteId)                         ← new line: only "also" connects it, its own bullet, no connective
```

Only a new line of thought gets a bullet. A branch sits directly under the note it's about, so when a line has both, the branch comes first and the continuation returns to the line's level after it. In Trilium's HTML the line is one `<li>`: each note is a `<p>` inside it, a continuation a plain `<p>` and a branch a `<p>` starting with six `&nbsp;` (twelve for a branch of a branch), each followed by its connective. Every bullet except the last ends with `<p>&nbsp;</p>`, the blank line before the next line of thought. Don't use `style="margin-left"`: Trilium's editor ignores paragraph indents inside list items.

## Relationship types

| Relationship | Meaning | Position | Luhmann |
|---|---|---|---|
| Continuation | Next step of the same line (therefore, so, then) | A new line inside the note's bullet, no bullet of its own, with the connective | 1 → 2 |
| Branch | Detour about one specific note (but, for example, because, in practice) | Indented directly under that note, no bullet, with the connective | 1 → 1a |
| New line | Only "also" connects it to anything | Its own bullet at the same level, after a blank line, no connective | new number |

Concept zettels don't use these relationships: they sit in the Concepts section, nested only by **type**. A sub concept nests under its parent (the concept named after the colon in its title) as a nested bullet with no label, since nesting can mean only "is a type of". Placement is read from the title, so it never needs judgment. Concepts that share a parent stay together as one block, each with its own bullet, even when the parent isn't in the outline (Outline and Zettel are both "a note that…"). A blank line (`<p>&nbsp;</p>` at the end of a block's last `<li>`, inside a `<p>`-wrapped item) starts a new group. Every other relation between concepts (part of, causes, opposite of) is a claim: write it in the concept's body as a link with its connective, or as a claim zettel in Lines of thought. *Therefore* never follows a definition. A claim that argues about one concept starts its own line in Lines of thought and links to the concept in its body. The why is in Trilium zettel `WN47iQcK5Ysv`.

```markdown
* [Zettel: a note that …](#root/noteId)
    * [Claim zettel: a zettel that …](#root/noteId)
* [Outline: a note that …](#root/noteId)

* [Zettelkasten: a box of …](#root/noteId)
```

## Rules for positioning a new zettel in an outline

1. **Read the outline** with `get_note` before inserting.
2. **Connective test:** find a word that joins the new zettel to an existing one. If only "also" fits, it starts a new line.
3. **Pick one anchor:** the single note it argues from most directly. Other related notes get ordinary links in the zettel body, not a second position.
4. **Hide test:** imagine the line without the new zettel. If the next note would no longer make sense, place it as a **continuation**. If the line still reads fine, place it as a **branch** under the anchor.
5. **Insert in place.** If it fits between two notes, put it there. Never append to the end without considering position.
6. **Write the connective** before the link, so the relationship is visible without opening the notes.
7. **Keep it light.** Order a line only when three or more notes build on each other. Notes that don't connect yet stay a plain list.
8. **Propose, don't decide.** Show the user the chosen position and connective, and ask before writing it.
9. **Only settled titles get notes nested under them** (see the title tests).

A branch that grows to five or six notes has become its own line: suggest promoting it to a new line or its own outline, leaving a link where it was.
