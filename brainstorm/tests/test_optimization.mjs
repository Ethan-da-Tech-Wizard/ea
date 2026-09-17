import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { optimizationFlows } from '../optimization-flows.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const board = JSON.parse(read('assistant-expanded.archi.json'));
const f = optimizationFlows.find(flow => flow.id === 'workingSet');
const node = id => f.nodes.find(n => n[0] === id);

function reachable(from, to, removed) {
  const pending = [from], seen = new Set();
  while (pending.length) {
    const current = pending.pop();
    if (current === removed || seen.has(current)) continue;
    if (current === to) return true;
    seen.add(current);
    pending.push(...node(current)[4].map(edge => edge[1]));
  }
  return false;
}

test('optimization refines existing scope without claiming runtime evidence', () => {
  assert.equal(board.decisions.phase, 'analysis-only');
  assert.match(board.decisions.optimization, /not runtime benchmark results/);
  assert.ok(board.views.some(view => view.id === f.id));
  assert.equal(flows.find(flow => flow.id === 'resources').nodes.find(n => n[0] === 'estimate')[5], f.id);
  assert.match(read('END-STATE.md'), /35-family inventory/);
  assert.match(read('RESEARCH.md'), /P-17 is planned and unrun/);
  for (const id of ['EA-OPT-01', 'EA-OPT-02', 'EA-OPT-03', 'EA-OPT-04']) {
    assert.ok(read('ACCEPTANCE.md').includes(`| ${id} |`), id);
  }
  assert.match(read('SCENARIOS.md'), /EA-OPT-01\.\.04/);
});

test('all heavy work needs live authority, shared debit, a fitting profile and admission', () => {
  for (const guard of ['contract', 'plan', 'next', 'live', 'debit', 'profile', 'fits', 'pack', 'admit']) {
    assert.equal(reachable('task', 'run', guard), false, guard);
  }
  assert.equal(node('admit')[5], 'resourceGuard');
  assert.match(node('plan')[3], /no model-generated recursive plan/);
  assert.match(node('profile')[3], /smaller prefill batches/);
  assert.match(node('pack')[3], /full-frame decoder/);
  assert.match(node('fits')[3], /no automatic swap tuning/);
});

test('cache reuse cannot bypass validation or reserve new work indefinitely', () => {
  for (const guard of ['live', 'debit', 'cache']) {
    assert.equal(reachable('task', 'reuse', guard), false, guard);
  }
  assert.equal(reachable('reuse', 'merge', 'validate'), false);
  assert.equal(reachable('reuse', 'merge', 'valid'), false);
  assert.equal(reachable('advance', 'run', 'debit'), false);
  assert.equal(reachable('advance', 'plan'), false);
  assert.match(node('cache')[3], /provider\/model\/schema revision/);
  assert.match(node('reuse')[3], /cannot replace an exact clause/);
  assert.match(node('advance')[3], /no-progress stop/);
  assert.match(read('PSEUDOCODE.md'), /parent\.consume_stage_visit\(\)/);
  assert.match(read('PSEUDOCODE.md'), /advance_once_without_repeated_cursor/);
});

test('release precedes another stage and fresh authority precedes every return', () => {
  assert.equal(reachable('run', 'advance', 'release'), false);
  assert.equal(reachable('run', 'validate', 'release'), false);
  for (const from of ['task', 'limited', 'reuse']) {
    assert.equal(reachable(from, 'return', 'fresh'), false, from);
  }
  assert.equal(reachable('cancel', 'return'), false);
  assert.equal(reachable('limited', 'run'), false);
  assert.equal(reachable('return', 'run'), false);
  assert.match(node('release')[3], /errors, pressure and cancellation/);
  assert.match(node('release')[3], /charged or evicted/);
  assert.match(node('return')[3], /No automatic next job/);
});

test('allocation arithmetic and performance evaluation remain explicit proposals', () => {
  const research = read('RESEARCH.md');
  const rows = [...research.matchAll(/^\| (Resident core|Shared working set|One heavy stage|Unallocated margin) \| (\d+) \|/gm)];
  assert.equal(rows.length, 4);
  assert.equal(rows.reduce((total, row) => total + Number(row[2]), 0), 1024);
  assert.match(research, /targets, not measured component sizes or approved defaults/);
  assert.match(research, /change one factor per comparison/);
  assert.match(research, /untouched, source-separated/);
  assert.match(read('PSEUDOCODE.md'), /additional \+ margin <= measured\.system_available - system_reserve/);
  assert.match(read('PSEUDOCODE.md'), /sublimit of the shared 16 MiB/);
  assert.match(read('SETTINGS.md'), /zero|0 seconds/);
});
