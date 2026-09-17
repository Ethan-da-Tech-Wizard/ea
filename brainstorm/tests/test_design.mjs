import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { capabilityFlows } from '../capability-flows.mjs';
import { endStateFlows } from '../end-state-flows.mjs';
import { strengtheningFlows } from '../strengthening-flows.mjs';
import { conversationFlows } from '../conversation-flows.mjs';
import { customizationFlows } from '../customization-flows.mjs';
import { optimizationFlows } from '../optimization-flows.mjs';
import { personalityFlows } from '../personality-flows.mjs';
import { intersects, labelBounds } from '../label-layout.mjs';
import { compareReferenceSemantics } from '../analysis-links.mjs';

const board = JSON.parse(fs.readFileSync(new URL('../assistant-expanded.archi.json', import.meta.url)));
const reference = fs.readFileSync(new URL('../FLOW-REFERENCE.md', import.meta.url), 'utf8');

test('ZI decisions remain explicit and separate from future execution', () => {
  assert.equal(board.decisions.phase, 'analysis-only');
  assert.match(board.decisions.commandExecution, /ZI has no execution backend/);
  assert.match(board.decisions.futureAutonomy, /ZII/);
  assert.match(board.decisions.collectionOff, /temporary-only/);
  assert.equal(board.backgroundColor, '#caffee');
});

test('each analysis node has metadata, valid transitions, and a reachable path', () => {
  const views = new Set(board.views.map(view => view.id));
  assert.equal(views.size, board.views.length);
  assert.equal(views.size, flows.length);
  assert.ok(views.has(board.activeView));
  const keys = new Set();
  for (const view of board.views) {
    const ids = new Set(view.shapes.map(shape => shape.shapeId));
    assert.equal(ids.size, view.shapes.length, view.id);
    const edges = new Map(view.shapes.map(shape => [shape.shapeId, []]));
    for (const shape of view.shapes) {
      assert.ok(shape.text && shape.description && shape.pseudocode, shape.nodeKey);
      assert.ok(!keys.has(shape.nodeKey), shape.nodeKey);
      keys.add(shape.nodeKey);
      assert.ok(reference.includes(`### ${shape.nodeKey}: ${shape.text}`), shape.nodeKey);
      assert.ok(!shape.linkView || views.has(shape.linkView), shape.nodeKey);
      assert.ok([shape.px, shape.py, shape.pw, shape.ph].every(Number.isFinite));
      assert.ok(shape.pw > 0 && shape.ph > 0);
    }
    for (const edge of view.arrows) {
      assert.ok(ids.has(edge.fromId) && ids.has(edge.toId), view.id);
      edges.get(edge.fromId).push(edge);
      assert.ok((edge.points || []).every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
    }
    for (const outgoing of edges.values()) {
      if (outgoing.length > 1) {
        assert.ok(outgoing.every(edge => edge.label.trim()), view.id);
        assert.equal(new Set(outgoing.map(edge => edge.label)).size, outgoing.length, view.id);
      }
    }
    const pending = [view.shapes[0].shapeId];
    const reached = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (reached.has(id)) continue;
      reached.add(id);
      pending.push(...edges.get(id).map(edge => edge.toId));
    }
    assert.equal(reached.size, ids.size, view.id);
  }
  assert.equal(keys.size, flows.reduce((total, flow) => total + flow.nodes.length, 0));
});

test('reference preserves the board view order and every detailed node contract', () => {
  assert.deepEqual(compareReferenceSemantics(reference, board), []);
  const headings = [...reference.matchAll(/^## (?!Reading The State Machines)(.+)$/gm)].map(m => m[1]);
  assert.deepEqual(headings, board.views.map(v => v.title));
  for (const view of board.views) {
    const viewStart = reference.indexOf(`## ${view.title}\n`);
    const firstNode = reference.indexOf('\n### ', viewStart);
    assert.ok(reference.slice(viewStart, firstNode).includes(view.notes), `${view.id} notes`);
    for (const node of view.shapes) {
      const heading = `### ${node.nodeKey}: ${node.text}\n`;
      const start = reference.indexOf(heading);
      const next = reference.indexOf('\n### ', start + heading.length);
      const section = reference.slice(start, next < 0 ? undefined : next);
      assert.ok(section.includes(node.description), `${node.nodeKey} explanation`);
      assert.ok(section.includes(node.pseudocode), `${node.nodeKey} pseudocode`);
      for (const edge of view.arrows.filter(a => a.fromId === node.shapeId)) {
        const target = view.shapes.find(s => s.shapeId === edge.toId);
        assert.ok(section.includes(`${edge.label ? 'ON ' + edge.label : 'THEN'} -> ${target.nodeKey}`), node.nodeKey);
      }
    }
  }
});

test('intent separates supplied math from authorized source-based math', () => {
  const overview = board.views.find(v => v.id === 'overview');
  assert.ok(overview.arrows.some(a => a.fromId === 1 && a.toId === 14 && a.label === 'question'));
  assert.equal(overview.shapes.find(s => s.nodeKey === 'MAP-14').linkView, 'capabilities');
  assert.equal(overview.shapes.find(s => s.nodeKey === 'MAP-16').linkView, 'capabilities');
  const intent = board.views.find(v => v.id === 'capabilities');
  assert.match(intent.shapes.find(s => s.nodeKey === 'CAP-05').pseudocode, /input_is_self_contained/);
  assert.equal(intent.shapes.find(s => s.nodeKey === 'CAP-08').linkView, 'request');
  const life = board.views.find(v => v.id === 'presence');
  assert.equal(life.shapes.find(s => s.nodeKey === 'LIFE-12').linkView, 'overview');
});

test('new capability views leave room for branch labels', () => {
  for (const flow of [...capabilityFlows, ...endStateFlows, ...strengtheningFlows, ...conversationFlows, ...customizationFlows, ...optimizationFlows, ...personalityFlows]) {
    const view = board.views.find(v => v.id === flow.id);
    const occupied = view.shapes.map(s => ({ x: s.px, y: s.py, w: s.pw, h: s.ph }));
    for (const edge of view.arrows.filter(a => a.label)) {
      assert.ok(Number.isFinite(edge.labelX) && Number.isFinite(edge.labelY), view.id);
      const bounds = labelBounds(edge);
      assert.ok(!occupied.some(r => intersects(r, bounds)), `${view.id}: ${edge.label}`);
      occupied.push(bounds);
    }
  }
});

test('pointing, math limits, and extension boundaries have explicit failure paths', () => {
  for (const id of ['calculator', 'plotting', 'pointing', 'extensions', 'acceptance']) {
    assert.ok(board.views.some(v => v.id === id), id);
  }
  const pointing = board.views.find(v => v.id === 'pointing');
  assert.match(pointing.shapes.find(s => s.nodeKey === 'POINT-14').pseudocode, /revisions_match/);
  assert.match(pointing.shapes.find(s => s.nodeKey === 'POINT-17').pseudocode, /hide/);
  const extensions = board.views.find(v => v.id === 'extensions');
  assert.match(extensions.shapes.find(s => s.nodeKey === 'EXT-04').pseudocode, /subset_of_ZI_registry/);
  const math = board.views.find(v => v.id === 'calculator');
  assert.match(math.shapes.find(s => s.nodeKey === 'CAL-05').description, /No eval/);
  const plots = board.views.find(v => v.id === 'plotting');
  const stale = plots.shapes.find(s => s.nodeKey === 'PLOT-18');
  assert.equal(stale.pseudocode, 'RETURN STALE_REVISION');
  assert.ok(!plots.arrows.some(a => a.fromId === stale.shapeId));
});

test('background observation is separately authorized before retention is considered', () => {
  assert.match(board.decisions.backgroundObservation, /explicit opt-in/);
  const policy = board.views.find(v => v.id === 'policy');
  const byKey = key => policy.shapes.find(s => s.nodeKey === key);
  assert.match(byKey('AUTH-18').pseudocode, /live_background_lease_covers/);
  assert.ok(policy.arrows.some(a => a.fromId === 5 && a.toId === 18 && a.label === 'yes'));
  assert.ok(policy.arrows.some(a => a.fromId === 18 && a.toId === 7 && a.label === 'yes'));
  assert.match(byKey('AUTH-08').pseudocode, /background_lease.live/);
  assert.match(byKey('AUTH-06').pseudocode, /background_denial/);
  const controls = board.views.find(v => v.id === 'controls');
  assert.equal(controls.shapes.find(s => s.nodeKey === 'CTRL-20').linkView, 'background');
  const bg = board.views.find(v => v.id === 'background');
  assert.match(bg.shapes.find(s => s.nodeKey === 'BG-02').pseudocode, /background.enabled/);
  assert.match(bg.shapes.find(s => s.nodeKey === 'BG-08').pseudocode, /collect AND retention_rule/);
  assert.match(bg.shapes.find(s => s.nodeKey === 'BG-10').pseudocode, /revisions_match/);
  assert.match(bg.shapes.find(s => s.nodeKey === 'BG-15').description, /unsolicited/);
  assert.match(bg.shapes.find(s => s.nodeKey === 'BG-16').description, /not saved knowledge/);
  assert.ok(bg.arrows.some(a => a.fromId === 12 && a.toId === 14 && a.label === 'no'));
});
