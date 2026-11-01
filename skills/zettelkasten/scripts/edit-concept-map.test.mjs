// Run: node --test skills/zettelkasten/scripts/edit-concept-map.test.mjs
// Needs the trilium-concept-maps repository, which also supplies the example map.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { applyEdits, checkNothingMoved, listMap, loadTools } from "./edit-concept-map.mjs";

const repo = process.env.TRILIUM_CONCEPT_MAPS_DIR || path.join(os.homedir(), "Projects", "trilium-concept-maps");
const frozen = fs.readFileSync(path.join(repo, "examples", "concept-map-example-frozen.dot"), "utf8");
const unfrozen = fs.readFileSync(path.join(repo, "examples", "concept-map-example.dot"), "utf8");
const starter = fs.readFileSync(new URL("../templates/concept-map.dot", import.meta.url), "utf8")
    .replaceAll("{{NAME}}", "Starter").replaceAll("{{LABEL}}", "Starter").replaceAll("{{WIDTH}}", "1.200").replaceAll("{{DATE}}", "2026-11-02");
const tools = await loadTools(repo);
const { cm, gv } = tools;

// Every concept and arrow already on the map stays exactly where it was.
function assertKept(before, after, except = []) {
    const a = cm.readMap(gv, before), b = cm.readMap(gv, after);
    for (const n of a.nodes.filter((x) => !except.includes(x.id))) {
        const m = b.nodes.find((x) => x.id === n.id);
        assert.ok(m, `${n.id} is still there`);
        assert.ok(Math.abs(n.x - m.x) < 0.2 && Math.abs(n.y - m.y) < 0.2, `${n.id} did not move`);
    }
}
const overlaps = (a, b) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;

test("list shows concepts, relations and groups", () => {
    const r = listMap(tools, frozen);
    assert.ok(r.concepts.some((c) => c.id === "retrieval" && c.kind === "activity"));
    assert.ok(r.relations.some((e) => e.key === "retrieval->encoding"));
    assert.ok(r.groups.some((g) => g.id === "cluster_practice"));
});

test("refuses a story and an unfrozen map", async () => {
    assert.equal((await applyEdits(tools, "story: Car rental\n", [])).status, "refused");
    const r = await applyEdits(tools, unfrozen, [{ op: "remove", id: "maps" }]);
    assert.equal(r.status, "refused");
    assert.match(r.problems[0], /Freeze layout/);
});

test("no edits means nothing to write", async () => {
    assert.equal((await applyEdits(tools, frozen, [])).status, "no-changes");
});

test("rename changes one line and warns when the label outgrows its box", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "rename", id: "spacing", label: "Spacing out your practice over several weeks" }]);
    assert.equal(r.status, "changed");
    assert.match(r.changeList, /Relabelled/);
    assert.equal(r.linesAdded.length, 1);
    assert.equal(r.linesRemoved.length, 1);
    assert.match(r.warnings.join(), /may not fit/);
    assertKept(frozen, r.dot);
});

test("style sets the legend attributes and rejects anything else", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "style", id: "transfer", kind: "process", main: true }]);
    assert.match(r.dot, /transfer \[label=Transfer kind=process main=true/);
    assertKept(frozen, r.dot);
    const bad = await applyEdits(tools, frozen, [{ op: "style", id: "transfer", kind: "purple" }]);
    assert.equal(bad.status, "refused");
});

test("link writes an id: link, and removes it", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "link", id: "transfer", url: "id:Ab12Cd34Ef56" }]);
    assert.match(r.dot, /transfer \[label=Transfer[^\]]*URL="id:Ab12Cd34Ef56"/);
    const removed = await applyEdits(tools, frozen, [{ op: "link", id: "maps", url: null }]);
    assert.doesNotMatch(removed.dot, /en\.wikipedia/);
});

test("a new concept goes in free space, and nothing else moves", async () => {
    const r = await applyEdits(tools, frozen, [
        { op: "add", ref: "fluency", label: "Fluency", kind: "outcome", near: "memory" },
        { op: "relate", from: "memory", to: "fluency", label: "shows as" },
    ]);
    assert.equal(r.status, "changed");
    assert.deepEqual(r.linesRemoved, []);
    assert.equal(r.linesAdded.length, 2, r.linesAdded.join("\n"));
    assertKept(frozen, r.dot);
    const m = cm.readMap(gv, r.dot);
    const added = m.nodes.find((n) => n.id === "fluency");
    assert.equal(added.kind, "outcome");
    for (const n of m.nodes.filter((x) => x !== added)) assert.ok(!overlaps(added, n), `clear of ${n.id}`);
    for (const c of m.clusters) assert.ok(!c.nodes.includes("fluency"), "not captured by a group");
    assert.ok(m.edges.find((e) => e.key === "memory->fluency").pos, "the new arrow has a stored route");
});

test("several new concepts don't land on each other", async () => {
    const r = await applyEdits(tools, starter, [
        { op: "add", ref: "a", label: "First", near: "topic" },
        { op: "add", ref: "b", label: "Second", near: "topic" },
        { op: "add", ref: "c", label: "Third", near: "a" },
        { op: "relate", from: "a", to: "c", rel: "is_a" },
    ]);
    assert.equal(r.status, "changed");
    const m = cm.readMap(gv, r.dot);
    assert.equal(m.nodes.length, 4);
    m.nodes.forEach((x, i) => m.nodes.slice(i + 1).forEach((y) => assert.ok(!overlaps(x, y), `${x.id} and ${y.id}`)));
    assert.equal(m.edges[0].rel, "is_a");
    assertKept(starter, r.dot);
});

test("the first arrow on a starter map keeps the map's arrow font", async () => {
    const r = await applyEdits(tools, starter, [
        { op: "add", ref: "a", label: "First", near: "topic" },
        { op: "relate", from: "topic", to: "a", label: "leads to" },
    ]);
    assert.equal(r.status, "changed");
    const edge = cm.readMap(gv, r.dot).edges[0];
    assert.equal(edge.attrs.fontname, "Helvetica");
    assert.equal(edge.attrs.fontsize, "10");
    assert.ok(edge.pos && edge.lp, "route and label position are stored");
    assertKept(starter, r.dot);
    const again = await applyEdits(tools, r.dot, [
        { op: "add", ref: "b", label: "Second", near: "first" },
        { op: "relate", from: "first", to: "b", label: "then" },
    ]);
    assert.equal(again.status, "changed");
    for (const e of cm.readMap(gv, again.dot).edges) assert.equal(e.attrs.fontname, "Helvetica", e.key);
    assertKept(r.dot, again.dot);
});

test("removing the last arrow keeps the arrow font for later", async () => {
    const one = await applyEdits(tools, starter, [{ op: "add", ref: "a", label: "First", near: "topic" }]);
    assert.match(one.dot, /^\s*edge \[/m, "a map with no arrows keeps its edge line");
    const added = await applyEdits(tools, one.dot, [
        { op: "add", ref: "b", label: "Second", near: "first" },
        { op: "relate", from: "topic", to: "first", label: "x" },
        { op: "relate", from: "first", to: "b", label: "y" },
    ]);
    const gone = await applyEdits(tools, added.dot, [{ op: "unrelate", key: "topic->first" }, { op: "unrelate", key: "first->second" }]);
    assert.equal(gone.status, "changed");
    assert.match(gone.dot, /^\s*edge \[.*fontname=Helvetica/m);
});

test("removing a concept removes its arrows and leaves the rest", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "remove", id: "maps" }]);
    assert.equal(r.status, "changed");
    assert.doesNotMatch(r.dot, /\bmaps\b/);
    assert.match(r.changeList, /Removed/);
    assertKept(frozen, r.dot, ["maps"]);
    assert.deepEqual(r.linesAdded, []);
});

test("relations can be relabelled, restyled and removed without rerouting", async () => {
    const r = await applyEdits(tools, frozen, [
        { op: "update_relation", key: "memory->transfer", label: "makes possible", main: true },
        { op: "unrelate", key: "spacing->retrieval" },
    ]);
    assert.equal(r.status, "changed");
    assert.match(r.dot, /memory -> transfer \[label="makes possible" main=true/);
    assert.doesNotMatch(r.dot, /spacing -> retrieval/);
    const before = cm.readMap(gv, frozen).edges.find((e) => e.key === "memory->transfer");
    const after = cm.readMap(gv, r.dot).edges.find((e) => e.key === "memory->transfer");
    assert.equal(after.pos.split(" ").length, before.pos.split(" ").length);
});

test("an is_a relation can't keep a label: reported, not guessed", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "update_relation", key: "memory->transfer", rel: "is_a" }]);
    assert.equal(r.status, "refused");
    assert.match(r.problems.join(), /has a label/);
});

test("unknown ids and edits are refused before anything is written", async () => {
    for (const ops of [[{ op: "remove", id: "nope" }], [{ op: "relate", from: "maps", to: "nope" }], [{ op: "fly" }], [{ op: "add", label: "No ref" }]]) {
        const r = await applyEdits(tools, frozen, ops);
        assert.equal(r.status, "refused", JSON.stringify(ops));
        assert.equal(r.dot, undefined);
    }
});

test("the safety check catches a moved concept and a rerouted arrow", () => {
    const none = { moved: [], added: [] };
    assert.deepEqual(checkNothingMoved(cm, gv, frozen, frozen, none), []);
    const pos = frozen.match(/maps\s+\[[^\]]*?pos="(-?[\d.]+),(-?[\d.]+)!"/);
    assert.ok(pos, "the example stores a position for maps");
    const movedDot = frozen.replace(`pos="${pos[1]},${pos[2]}!"`, `pos="${+pos[1] + 50},${pos[2]}!"`);
    assert.match(checkNothingMoved(cm, gv, frozen, movedDot, none).join(), /Concept maps moved/);
    const route = frozen.match(/retrieval\s+->\s+encoding\s+\[[^\]]*?pos="([^"]+)"/)[1];
    const nudged = route.replace(/(\d+\.?\d*),(-?\d+\.?\d*)$/, (_, x, y) => `${+x + 30},${y}`);
    const reroutedDot = frozen.replace(route, nudged);
    assert.match(checkNothingMoved(cm, gv, frozen, reroutedDot, none).join(), /Arrows rerouted/);
});

test("a duplicate label is reported", async () => {
    const r = await applyEdits(tools, frozen, [{ op: "add", ref: "x", label: "Spacing" }]);
    assert.equal(r.status, "refused");
    assert.match(r.problems.join(), /both labelled/);
});

test("a saved edit can be edited again without drifting", async () => {
    const first = await applyEdits(tools, frozen, [{ op: "add", ref: "x", label: "Fluency", near: "memory" }]);
    const second = await applyEdits(tools, first.dot, [{ op: "style", id: "fluency", main: true }]);
    assert.equal(second.status, "changed");
    assert.equal(second.linesAdded.length, 1);
    assertKept(first.dot, second.dot);
});
