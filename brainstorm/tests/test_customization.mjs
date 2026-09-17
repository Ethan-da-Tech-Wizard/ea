import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { customizationFlows } from '../customization-flows.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const board = JSON.parse(read('assistant-expanded.archi.json'));
const code = read('PSEUDOCODE.md');
const flow = id => customizationFlows.find(f => f.id === id);
const node = (f, id) => f.nodes.find(n => n[0] === id);

function reachable(f, from, to, removed) {
  const nodes = new Map(f.nodes.map(n => [n[0], n]));
  const pending = [from], seen = new Set();
  while (pending.length) {
    const current = pending.pop();
    if (current === removed || seen.has(current)) continue;
    if (current === to) return true;
    seen.add(current);
    pending.push(...nodes.get(current)[4].map(edge => edge[1]));
  }
  return false;
}

test('customization is explicit, dependency-aware and cannot bypass core controls or consent', () => {
  const f = flow('moduleProfiles');
  assert.match(board.decisions.customization, /confirmed direction/);
  for (const guard of ['snapshot', 'parse', 'graph', 'valid', 'effective', 'preview', 'confirm', 'restrict', 'commit']) {
    assert.equal(reachable(f, 'request', 'activate', guard), false, guard);
  }
  assert.equal(reachable(f, 'rollback', 'activate'), false);
  assert.match(node(f, 'valid')[3], /Stop, Hide All/);
  assert.match(node(f, 'parse')[3], /No eval, shell hooks, remote references/);
  assert.match(node(f, 'activate')[3], /Disabled providers have no subscriptions/);
  assert.match(node(f, 'rollback')[2], /without_restoring_revoked_grants/);
  assert.match(code, /minimum_of_approved_hard_caps_profile_and_remaining_task_caps/);
  assert.match(read('END-STATE.md'), /35 feature families/);
  for (const id of ['F-33', 'F-34', 'F-35']) assert.ok(read('END-STATE.md').includes(`| ${id} |`));
});

test('annotations share scope and lifetime without reviving stale marks or generation loops', () => {
  const f = flow('annotations');
  for (const guard of ['scope', 'grant', 'anchor', 'types', 'budget', 'preview', 'fresh']) {
    assert.equal(reachable(f, 'request', 'show', guard), false, guard);
  }
  assert.equal(reachable(f, 'edit', 'show', 'fresh'), false);
  assert.equal(reachable(f, 'edit', 'budget'), false);
  assert.equal(reachable(f, 'hide', 'show'), false);
  assert.equal(node(f, 'target')[5], 'pointing');
  assert.match(node(f, 'target')[3], /not its drawing\/event loop/);
  assert.match(node(f, 'show')[2], /noninteractive/);
  assert.match(node(f, 'event')[3], /Hide All/);
  assert.match(node(f, 'budget')[3], /50 objects, 10000 stroke points and 16 KiB/);
  assert.match(code, /lifetime = min\(60_seconds/);
  assert.match(code, /reject_late_worker_or_undo_output/);
});

test('artifact repairs and transfers require their original ledger and explicit current approval', () => {
  const f = flow('artifacts');
  for (const guard of ['budget', 'sources', 'admit', 'debit']) {
    assert.equal(reachable(f, 'request', 'draft', guard), false, guard);
  }
  assert.equal(reachable(f, 'repair', 'draft'), true);
  assert.equal(reachable(f, 'repair', 'draft', 'admit'), false);
  assert.equal(reachable(f, 'repair', 'draft', 'debit'), false);
  assert.equal(reachable(f, 'repair', 'budget'), false);
  for (const destination of ['copy', 'file']) {
    for (const guard of ['validate', 'valid', 'preview', 'choice', 'transfer', 'fresh']) {
      assert.equal(reachable(f, 'request', destination, guard), false, `${destination}.${guard}`);
    }
  }
  assert.match(node(f, 'budget')[3], /3 total model passes, 60 active seconds, 256 KiB/);
  assert.match(node(f, 'validate')[3], /no compiler, interpreter, generated tests or shell/i);
  assert.match(node(f, 'valid')[3], /no Markdown fence or stray prose/);
  assert.match(node(f, 'file')[3], /no false cross-file atomicity/);
  assert.match(node(f, 'copy')[3], /still-owned clipboard selection/);
  assert.match(code, /validation_receipt_does_not_match_exact_payload_bytes/);
  assert.equal(reachable(f, 'finish', 'draft'), false);
});

test('guided learning preserves confirmed external training and independent evaluation', () => {
  const f = flow('learningWorkbench');
  assert.match(board.decisions.easyTraining, /confirmed/);
  assert.match(board.decisions.easyTraining, /separately launched self-hosted tool/);
  assert.match(node(f, 'boundary')[2], /^RETURN EXTERNAL_TRAINER_REQUIRED_NO_LAUNCH$/);
  assert.deepEqual(node(f, 'boundary')[4], []);
  for (const guard of ['sources', 'consent', 'build', 'review', 'validate', 'split', 'preview', 'approve']) {
    assert.equal(reachable(f, 'goal', 'export', guard), false, guard);
  }
  assert.match(node(f, 'split')[3], /insufficient independent data/);
  assert.match(node(f, 'handoff')[3], /user separately runs the trainer/);
  assert.match(node(f, 'adapter')[3], /independent held-out/);
  assert.equal(node(f, 'adapter')[5], 'adapterLifecycle');
  assert.equal(reachable(f, 'finish', 'build'), false);
  assert.doesNotMatch(JSON.stringify(f), /DECISION_PENDING|awaiting clarification/);
  assert.match(read('SETTINGS.md'), /S-68/);
});

test('peaceful support preserves evidence, accepts dismissal and connects every new detail flow', () => {
  const f = flow('peacefulSupport');
  assert.match(board.decisions.productValues, /confirmed: peace, love, respect/);
  assert.match(node(f, 'preferences')[3], /direct|concise/);
  assert.equal(reachable(f, 'input', 'present', 'request'), false);
  assert.equal(reachable(f, 'input', 'present', 'integrity'), false);
  assert.equal(reachable(f, 'fallback', 'format'), false);
  assert.equal(reachable(f, 'quiet', 'present'), false);
  assert.match(node(f, 'integrity')[3], /not soften a real warning/);
  assert.match(node(f, 'feedback')[3], /Feedback is optional/);
  assert.match(node(f, 'quiet')[3], /conserve energy/);
  assert.match(read('CAPABILITIES.md'), /Everyday Recipe Candidates/);
  for (const detail of customizationFlows) {
    assert.ok(board.views.some(v => v.id === detail.id), detail.id);
    assert.ok(flows.some(parent => parent.id !== detail.id && parent.nodes.some(n => n[5] === detail.id)), `Unlinked ${detail.id}`);
  }
});
