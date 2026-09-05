# Folgezettel — Outline Positioning Rules

Outlines implement the **Folgezettel** principle: zettels are arranged as a parent-child hierarchy, not a flat list. Position in the outline is meaningful.

```markdown
* [Root concept A](#root/noteId)          ← starting thought
  * [Continues A](#root/noteId)           ← child: continues the thought
  * [Branches from A](#root/noteId)       ← child: adds a new angle
    * [Specific case of branch](#root/noteId)  ← grandchild: deeper detail
* [Unrelated concept B](#root/noteId)     ← sibling: new independent thought
```

## Rules for positioning a new zettel in an outline

1. **Read the outline** with `get_note` before inserting
2. **Find the closest related zettel** already in the outline
3. **Place as a child** (indented one level) of that related zettel if it continues or branches from it
4. **Place as a sibling** (same level) only if it starts an entirely new independent thought
5. **Never append to the end** without considering position — a zettel appended out of sequence breaks the thought chain

## Folgezettel connection types

| Relationship | Position | Example |
|---|---|---|
| Continues a thought | Child of parent | "Why X matters" under "What is X" |
| Adds an angle | Child of parent | "Counter-argument to X" under "X" |
| Blind end / exclusion | Child, marked as such | "What X is NOT" under "X" |
| New independent thread | Top-level sibling | Unrelated concept |
