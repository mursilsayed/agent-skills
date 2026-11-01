#!/usr/bin/env node
/*
 * Applies chat edits to a frozen concept map's DOT text. Used by Workflow 10 in SKILL.md.
 *
 *   node edit-concept-map.mjs list  <map.dot>
 *   node edit-concept-map.mjs apply <map.dot> <ops.json> <output folder>
 *
 * It never writes to Trilium. `apply` writes proposed.dot and preview.svg, and prints JSON with
 * the change list, problems and the SHA-256 of proposed.dot. Exit code 0 means there is something
 * to review (check `status`); 1 means it refused, with the reason in `problems`.
 *
 * Edits go through the converter in the trilium-concept-maps repository (dotToCanvas, then
 * canvasToDot), the same code the Edit layout button uses, so concepts and arrows keep their
 * stored positions and routes. Find that repository with TRILIUM_CONCEPT_MAPS_DIR, or the default
 * ~/Projects/trilium-concept-maps. It needs `npm install`.
 *
 * ops.json is a list of edits, applied in order:
 *   { "op": "rename", "id": "<concept>", "label": "..." }
 *   { "op": "style",  "id": "<concept>", "kind": "activity|process|outcome|plain", "main": true }
 *   { "op": "link",   "id": "<concept>", "url": "id:<noteId>" }            url null removes the link
 *   { "op": "add",    "ref": "<name>", "label": "...", "kind": "...", "main": true, "url": "...",
 *                     "near": "<concept or ref>" }                          placed in free space
 *   { "op": "remove", "id": "<concept>" }                                   also removes its arrows
 *   { "op": "relate", "from": "<concept or ref>", "to": "<concept or ref>",
 *                     "label": "...", "rel": "is_a", "main": true, "kind": "..." }
 *   { "op": "update_relation", "key": "<tail->head>", "label": "...", "rel": "is_a" or null,
 *                     "main": true, "kind": "..." }                         label "" removes it
 *   { "op": "unrelate", "key": "<tail->head>" }
 */
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CREATED_BY = "the zettelkasten skill";
const PX_PER_INCH = 96; // Excalidraw px per inch of DOT size: 72 pt × 4/3
const CLEARANCE_PX = 48; // leaves an arrow long enough to carry its label
const TOLERANCE_PT = 0.2; // stored coordinates have one decimal

export async function loadTools(repo = process.env.TRILIUM_CONCEPT_MAPS_DIR || path.join(os.homedir(), "Projects", "trilium-concept-maps")) {
    const require = createRequire(path.join(repo, "package.json"));
    let cm, Graphviz;
    try {
        cm = require("./src/concept-map.js");
        ({ Graphviz } = await import(pathToFileURL(require.resolve("@hpcc-js/wasm-graphviz")).href));
    } catch (e) {
        throw new Error(`Can't load the concept map tools from ${repo}. Set TRILIUM_CONCEPT_MAPS_DIR, and run npm install there. (${e.message})`);
    }
    return { cm, gv: await Graphviz.load() };
}

// A story, or a map with no stored positions, can't be edited without something moving.
function refusal(cm, dot) {
    if (/^\s*story:/.test(dot)) return "This is a domain story, not a concept map. Edit its text directly.";
    if (!cm.isFrozen(dot)) return "This map isn't frozen, so its positions aren't stored. Press 📌 Freeze layout under the map first.";
    return null;
}

export function listMap({ cm, gv }, dot) {
    const reason = refusal(cm, dot);
    if (reason) return { status: "refused", problems: [reason] };
    const m = cm.readMap(gv, dot);
    return {
        status: "ok",
        concepts: m.nodes.map((n) => ({ id: n.id, label: n.label, kind: n.kind, main: n.main, url: n.attrs.URL || null })),
        relations: m.edges.map((e) => ({ key: e.key, label: e.label, rel: e.rel, main: e.main })),
        groups: m.clusters.map((c) => ({ id: c.id, label: c.label, concepts: c.nodes })),
    };
}

const boxWidthPx = (label) => Math.max(1.2, (label.length * 7 + 36) / 72) * PX_PER_INCH;
const BOX_HEIGHT_PX = 0.5 * PX_PER_INCH;
const toLink = (url) => (url && url.startsWith("id:") ? `#root/${url.slice(3).trim()}` : url || null);

function pathPoints(arrow) {
    return (arrow.points || []).map(([x, y]) => [arrow.x + x, arrow.y + y]);
}

function hitsSegment(rect, [ax, ay], [bx, by]) {
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 8));
    for (let i = 0; i <= steps; i++) {
        const x = ax + ((bx - ax) * i) / steps, y = ay + ((by - ay) * i) / steps;
        if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) return true;
    }
    return false;
}

// Nearest free spot around the anchor, clear of every shape, group, label and arrow.
function findFreeSpot(elements, anchor, w, h) {
    const live = elements.filter((e) => !e.isDeleted);
    const boxes = live.filter((e) => e.type !== "arrow");
    const arrows = live.filter((e) => e.type === "arrow").map(pathPoints);
    const isFree = (cx, cy) => {
        const r = { x: cx - w / 2 - CLEARANCE_PX, y: cy - h / 2 - CLEARANCE_PX, w: w + 2 * CLEARANCE_PX, h: h + 2 * CLEARANCE_PX };
        const clearOfBoxes = boxes.every((b) => r.x + r.w < b.x || r.x > b.x + b.width || r.y + r.h < b.y || r.y > b.y + b.height);
        if (!clearOfBoxes) return false;
        return arrows.every((pts) => pts.every((p, i) => i === 0 || !hitsSegment(r, pts[i - 1], p)));
    };
    for (let radius = 40; radius < 6000; radius += 30) {
        for (let i = 0; i < 16; i++) {
            const angle = (i * Math.PI) / 8;
            const cx = Math.round(anchor[0] + radius * Math.cos(angle)), cy = Math.round(anchor[1] + radius * Math.sin(angle));
            if (isFree(cx, cy)) return [cx, cy];
        }
    }
    return null;
}

function applyOps(cm, scene, ops, problems) {
    const els = scene.elements;
    const refs = {};
    const custom = (e, k) => (e.customData ? e.customData[k] : undefined);
    const conceptEl = (id) => (refs[id] ? refs[id] : els.find((e) => !e.isDeleted && custom(e, "dotId") === id && custom(e, "role") !== "label"));
    const labelOf = (shape) => els.find((e) => !e.isDeleted && e.type === "text" && e.containerId === shape.id) || (shape.type === "text" ? shape : null);
    const arrowEl = (key) => els.find((e) => !e.isDeleted && e.type === "arrow" && custom(e, "dotEdge") === key);
    const center = (e) => [e.x + e.width / 2, e.y + e.height / 2];
    const addText = (id, text, containerId) => els.push({ id, type: "text", x: 0, y: 0, width: 1, height: 1, text, originalText: text, containerId, isDeleted: false });
    const colorFor = (kind, what) => {
        if (kind === "plain" || kind === null) return cm.LEGEND.plain.color;
        if (cm.LEGEND.kinds[kind]) return cm.LEGEND.kinds[kind].color;
        problems.push(`${what}: "${kind}" is not in the legend (activity, process, outcome, plain)`);
        return null;
    };
    const strokePx = (main) => (main ? cm.LEGEND.main.strokePx : cm.LEGEND.normal.strokePx);
    const setStyle = (el, op, what) => {
        if (op.kind !== undefined) {
            const color = colorFor(op.kind, what);
            if (color) el.strokeColor = color;
        }
        if (op.main !== undefined) el.strokeWidth = strokePx(op.main);
    };
    const setArrowLabel = (arrow, label) => {
        const current = els.find((e) => !e.isDeleted && e.type === "text" && e.containerId === arrow.id);
        if (current && label) { current.text = label; current.originalText = label; }
        else if (current) current.isDeleted = true;
        else if (label) addText(`${arrow.id}-label`, label, arrow.id);
    };
    const need = (el, kind, name, opName) => {
        if (!el) problems.push(`${opName}: there is no ${kind} "${name}"`);
        return el;
    };

    ops.forEach((op, i) => {
        const opName = op.op || `edit ${i + 1}`;
        switch (op.op) {
            case "rename": {
                const s = need(conceptEl(op.id), "concept", op.id, opName);
                const label = s && labelOf(s);
                if (label) { label.text = op.label; label.originalText = op.label; }
                break;
            }
            case "style": {
                const s = need(conceptEl(op.id), "concept", op.id, opName);
                if (s) setStyle(s, op, `Concept ${op.id}`);
                break;
            }
            case "link": {
                const s = need(conceptEl(op.id), "concept", op.id, opName);
                if (s) s.link = toLink(op.url);
                break;
            }
            case "add": {
                if (!op.ref || !op.label) { problems.push(`${opName}: needs both ref and label`); break; }
                const near = op.near ? need(conceptEl(op.near), "concept", op.near, opName) : null;
                if (op.near && !near) break;
                const all = els.filter((e) => !e.isDeleted && e.type !== "arrow" && e.type !== "text");
                const anchor = near ? center(near) : all.length
                    ? [all.reduce((t, e) => t + center(e)[0], 0) / all.length, all.reduce((t, e) => t + center(e)[1], 0) / all.length] : [0, 0];
                const w = boxWidthPx(op.label);
                const spot = findFreeSpot(els, anchor, w, BOX_HEIGHT_PX);
                if (!spot) { problems.push(`${opName}: no free space found for "${op.label}"`); break; }
                const shape = {
                    id: `new-${op.ref}`, type: "rectangle", x: spot[0] - w / 2, y: spot[1] - BOX_HEIGHT_PX / 2, width: w, height: BOX_HEIGHT_PX,
                    strokeColor: cm.LEGEND.plain.color, strokeWidth: strokePx(false), strokeStyle: "solid", roundness: { type: 3 },
                    isDeleted: false, boundElements: [], link: toLink(op.url),
                };
                setStyle(shape, op, `Concept "${op.label}"`);
                els.push(shape);
                addText(`new-${op.ref}-label`, op.label, shape.id);
                refs[op.ref] = shape;
                break;
            }
            case "remove": {
                const s = need(conceptEl(op.id), "concept", op.id, opName);
                if (!s) break;
                s.isDeleted = true;
                const label = labelOf(s);
                if (label) label.isDeleted = true;
                for (const a of els.filter((e) => !e.isDeleted && e.type === "arrow" && (e.startBinding?.elementId === s.id || e.endBinding?.elementId === s.id))) {
                    a.isDeleted = true;
                    setArrowLabel(a, "");
                }
                break;
            }
            case "relate": {
                const from = need(conceptEl(op.from), "concept", op.from, opName);
                const to = need(conceptEl(op.to), "concept", op.to, opName);
                if (!from || !to) break;
                const arrow = {
                    id: `new-arrow-${i}`, type: "arrow", x: 0, y: 0, width: 1, height: 1, points: [[0, 0]],
                    strokeColor: cm.LEGEND.plain.color, strokeWidth: strokePx(false), strokeStyle: op.rel === "is_a" ? "dashed" : "solid",
                    startBinding: { elementId: from.id }, endBinding: { elementId: to.id }, endArrowhead: "arrow", isDeleted: false,
                };
                setStyle(arrow, op, `Relation ${op.from} → ${op.to}`);
                els.push(arrow);
                if (op.label) addText(`${arrow.id}-label`, op.label, arrow.id);
                break;
            }
            case "update_relation": {
                const a = need(arrowEl(op.key), "relation", op.key, opName);
                if (!a) break;
                setStyle(a, op, `Relation ${op.key}`);
                if (op.rel !== undefined) a.strokeStyle = op.rel === "is_a" ? "dashed" : "solid";
                if (op.label !== undefined) setArrowLabel(a, op.label);
                break;
            }
            case "unrelate": {
                const a = need(arrowEl(op.key), "relation", op.key, opName);
                if (a) { a.isDeleted = true; setArrowLabel(a, ""); }
                break;
            }
            default:
                problems.push(`Unknown edit "${op.op}"`);
        }
    });
}

const routePoints = (pos) => String(pos || "").split(";")[0].trim().split(/\s+/).map((t) => t.split(",").filter((p) => !/^[se]$/.test(p)).map(Number));
const sameRoute = (a, b) => {
    const pa = routePoints(a), pb = routePoints(b);
    return pa.length === pb.length && pa.every((p, i) => p.every((v, k) => Math.abs(v - pb[i][k]) <= TOLERANCE_PT));
};

// The promise of a frozen map: nothing already on it moves, whatever the edit was.
export function checkNothingMoved(cm, gv, oldDot, newDot, changes) {
    const failures = [];
    const before = cm.readMap(gv, oldDot), after = cm.readMap(gv, newDot);
    const close = (a, b) => Math.abs(a - b) <= TOLERANCE_PT;
    if (changes.moved.length) failures.push(`Moved: ${changes.moved.map((m) => m.label).join(", ")}`);
    for (const n of after.nodes) {
        const o = before.nodes.find((x) => x.id === n.id);
        if (o && !(close(o.x, n.x) && close(o.y, n.y) && close(o.w, n.w) && close(o.h, n.h))) failures.push(`Concept ${n.id} moved or changed size`);
    }
    const addedPairs = changes.added.filter((a) => a.type === "relation").length;
    const rerouted = after.edges.filter((e) => !before.edges.some((o) => o.tail === e.tail && o.head === e.head && sameRoute(o.pos, e.pos)));
    if (rerouted.length > addedPairs) failures.push(`Arrows rerouted: ${rerouted.map((e) => e.key).join(", ")}`);
    for (const c of after.clusters) {
        const o = before.clusters.find((x) => x.id === c.id);
        if (o && o.bb && c.bb && !o.bb.every((v, i) => close(v, c.bb[i]))) failures.push(`Group ${c.id} moved or changed size`);
    }
    return failures;
}

// canvasToDot takes a new arrow's font from an existing arrow, and writes `edge [...]` only when
// two arrows share it. So a map with no arrows, like a new starter map, would lose its arrow font.
function keepEdgeDefaults(cm, gv, oldDot, newDot) {
    const edgeLine = oldDot.match(/^[ \t]*edge\s*\[[^\]]*\][ \t]*$/m);
    if (!edgeLine || /^[ \t]*edge\s*\[/m.test(newDot)) return newDot;
    const noArrowsLeft = !cm.readMap(gv, newDot).edges.length;
    if (!noArrowsLeft && cm.readMap(gv, oldDot).edges.length) return newDot; // the arrows carry the font themselves

    const lines = newDot.split("\n");
    let at = lines.findIndex((l) => /^\s*node\s*\[/.test(l));
    if (at < 0) at = lines.findIndex((l) => /^\s*layout=/.test(l));
    lines.splice(at + 1, 0, edgeLine[0]);
    const withDefaults = lines.join("\n");
    if (noArrowsLeft) return withDefaults;

    // Every arrow here is new, so route them again with the right font: labels are sized by it.
    const unrouted = withDefaults.split("\n")
        .map((l) => (l.includes("->") ? l.replace(/\s*\blp="[^"]*"/, "").replace(/\s*\bpos="[^"]*"/, "") : l)).join("\n")
        .replace(/frozen=true/, "frozen=true splines=true");
    const title = (newDot.match(/^\/\/ Concept map: (.+)$/m) || [])[1];
    return cm.writeFrozen(cm.readMap(gv, unrouted), { title, createdBy: CREATED_BY });
}

const bodyLines = (dot) => dot.split("\n").filter((l) => l.trim() && !l.startsWith("//"));

export async function applyEdits({ cm, gv }, dot, ops) {
    const reason = refusal(cm, dot);
    if (reason) return { status: "refused", problems: [reason] };

    const { scene, warnings } = await cm.dotToCanvas(gv, dot);
    // A `note:` title link can't be resolved here. That's harmless: it stays in the DOT as it is.
    const notes = warnings.filter((w) => !/could not be resolved/.test(w));
    const problems = [];
    applyOps(cm, scene, ops, problems);
    if (problems.length) return { status: "refused", problems };

    const result = await cm.canvasToDot(gv, dot, scene, { createdBy: CREATED_BY });
    if (result.problems.length) return { status: "refused", problems: result.problems, changeList: cm.formatChanges(result) };

    const changed = Object.values(result.changes).some((v) => Array.isArray(v) && v.length);
    if (!changed) return { status: "no-changes", problems: [], changeList: "No changes." };

    result.dot = keepEdgeDefaults(cm, gv, dot, result.dot);
    const failures = checkNothingMoved(cm, gv, dot, result.dot, result.changes);
    if (failures.length) return { status: "refused", problems: failures.map((f) => `Safety check: ${f}`), changeList: cm.formatChanges(result) };

    // A box's size is stored, so a renamed concept can outgrow it. Only a person should resize it.
    const after = cm.readMap(gv, result.dot);
    for (const r of result.changes.relabelled) {
        const n = after.nodes.find((x) => x.id === r.id);
        if (n && !/\n/.test(r.to) && r.to.length * 7 + 18 > n.w) notes.push(`"${r.to}" may not fit its box. Resize it with ✏️ Edit layout if it overflows.`);
    }

    const oldLines = bodyLines(dot), newLines = bodyLines(result.dot);
    return {
        status: "changed",
        problems: [],
        warnings: notes,
        changeList: cm.formatChanges(result),
        linesRemoved: oldLines.filter((l) => !newLines.includes(l)),
        linesAdded: newLines.filter((l) => !oldLines.includes(l)),
        dot: result.dot,
        svg: gv.layout(result.dot, "svg", "neato", { nop: 2 }),
    };
}

async function main([command, dotPath, opsPath, outDir]) {
    const usage = "Usage: edit-concept-map.mjs list <map.dot> | apply <map.dot> <ops.json> <output folder>";
    if (!dotPath || (command !== "list" && !(command === "apply" && opsPath && outDir))) throw new Error(usage);
    const tools = await loadTools();
    const dot = fs.readFileSync(dotPath, "utf8");
    if (command === "list") return listMap(tools, dot);

    const { dot: proposed, svg, ...report } = await applyEdits(tools, dot, JSON.parse(fs.readFileSync(opsPath, "utf8")));
    if (proposed) {
        fs.mkdirSync(outDir, { recursive: true });
        report.proposed = path.join(outDir, "proposed.dot");
        report.preview = path.join(outDir, "preview.svg");
        fs.writeFileSync(report.proposed, proposed);
        fs.writeFileSync(report.preview, svg);
        report.sha256 = crypto.createHash("sha256").update(proposed).digest("hex");
    }
    return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
    main(process.argv.slice(2)).then((report) => {
        console.log(JSON.stringify(report, null, 2));
        process.exit(report.status === "refused" ? 1 : 0);
    }).catch((e) => {
        console.log(JSON.stringify({ status: "refused", problems: [e.message] }, null, 2));
        process.exit(1);
    });
}
