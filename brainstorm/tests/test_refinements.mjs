import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { strengtheningFlows } from '../strengthening-flows.mjs';
import { compareFlowSemantics, validateRefinementLinks } from '../analysis-links.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const documents = Object.fromEntries(['END-STATE.md', 'ACCEPTANCE.md', 'SCENARIOS.md', 'SETTINGS.md', 'RESEARCH.md', 'PSEUDOCODE.md'].map(name => [name, read(name)]));
const index = JSON.parse(read('REFINEMENTS.json'));
const board = JSON.parse(read('assistant-expanded.archi.json'));

test('research refinements resolve across all specification artifacts', () => {
  assert.equal(index.refinements.length, 8);
  assert.deepEqual(validateRefinementLinks(index, documents, flows, board), []);
  assert.match(board.decisions.researchRefinements, /no EA runtime verification/);
});

test('dangling references and missing pseudocode or nodes fail traceability', () => {
  for (const field of ['features', 'requirements', 'scenarios', 'settings', 'evidence', 'nodes']) {
    const changed = structuredClone(index);
    changed.refinements[0][field] = ['MISSING-99'];
    assert.ok(validateRefinementLinks(changed, documents, flows, board).some(e => e.includes('MISSING-99')), field);
  }
  for (const field of ['pseudocodeHeading', 'flow']) {
    const changed = structuredClone(index);
    changed.refinements[0][field] = 'missing';
    assert.ok(validateRefinementLinks(changed, documents, flows, board).length, field);
  }
  const changedDocs = {...documents, 'ACCEPTANCE.md': documents['ACCEPTANCE.md'].replace(/^\| EA-OUT-01 \|.*$/m, '')};
  assert.ok(validateRefinementLinks(index, changedDocs, flows, board).some(e => e.includes('EA-OUT-01')));
});

test('duplicate indexes and invented verification cannot silently pass', () => {
  const duplicate = structuredClone(index);
  duplicate.refinements.push(duplicate.refinements[0]);
  assert.ok(validateRefinementLinks(duplicate, documents, flows, board).some(e => e.includes('Duplicate refinement')));
  const falsePass = structuredClone(index);
  falsePass.refinements[0].runtimeStatus = 'verified';
  assert.ok(validateRefinementLinks(falsePass, documents, flows, board).some(e => e.includes('runtime status')));
  const missing = structuredClone(index);
  missing.refinements.pop();
  assert.ok(validateRefinementLinks(missing, documents, flows, board).some(e => e.includes('Unindexed')));
});

test('saved board semantics match the source while layout remains user-owned', () => {
  assert.deepEqual(compareFlowSemantics(flows, board), []);
  const moved = structuredClone(board);
  moved.views[0].shapes[0].px += 23;
  assert.deepEqual(compareFlowSemantics(flows, moved), []);
  for (const field of ['text', 'pseudocode', 'description', 'linkView']) {
    const changed = structuredClone(board);
    changed.views[0].shapes[0][field] = 'changed';
    assert.ok(compareFlowSemantics(flows, changed).some(e => e.includes(field)), field);
  }
  const changed = structuredClone(board);
  changed.views[0].arrows.pop();
  assert.ok(compareFlowSemantics(flows, changed).some(e => e.includes('transition')));
});

test('critical refinement transitions cannot bypass their required guards', () => {
  const reachable = (flowID, target, excluded) => {
    const flow = strengtheningFlows.find(f => f.id === flowID);
    const nodes = new Map(flow.nodes.map(n => [n[0], n]));
    const pending = [flow.nodes[0][0]], seen = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (id === excluded || seen.has(id)) continue;
      if (id === target) return true;
      seen.add(id);
      pending.push(...nodes.get(id)[4].map(e => e[1]));
    }
    return false;
  };
  for (const [flow, target, guards] of [
    ['outputContract', 'publish', ['schema', 'shape', 'current', 'support', 'render']],
    ['chartPatch', 'commit', ['targets', 'valid', 'pins', 'preview', 'fresh']],
    ['branchCheck', 'solve', ['grammar', 'supported', 'assumptions', 'lease']],
    ['resourceGuard', 'launch', ['supported', 'fits', 'lease', 'limits']],
    ['forgetProof', 'receipt', ['tombstone', 'compat', 'verify', 'complete']],
    ['artifactTrust', 'commit', ['stage', 'hash', 'compat', 'passed', 'activate']]
  ]) {
    assert.equal(reachable(flow, target), true, flow);
    for (const guard of guards) assert.equal(reachable(flow, target, guard), false, `${flow}.${guard}`);
  }
});

test('new refinement flows are finite specifications, not recursive job triggers', () => {
  for (const flow of strengtheningFlows) {
    const nodes = new Map(flow.nodes.map(n => [n[0], n]));
    const visiting = new Set(), done = new Set();
    function visit(id) {
      assert.ok(!visiting.has(id), `${flow.id}: unbounded cycle`);
      if (done.has(id)) return;
      visiting.add(id);
      for (const [, target] of nodes.get(id)[4]) visit(target);
      visiting.delete(id);
      done.add(id);
    }
    visit(flow.nodes[0][0]);
    assert.equal(done.size, nodes.size);
  }
  assert.match(documents['PSEUDOCODE.md'], /same shrinking deadline/);
  assert.match(documents['PSEUDOCODE.md'], /never silently rebases\/retries\/generates/);
  assert.match(documents['END-STATE.md'], /unmeasured proposals/);
  assert.match(documents['SETTINGS.md'], /No unlimited setting/);
});
