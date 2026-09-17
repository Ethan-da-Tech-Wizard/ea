import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { conversationFlows } from '../conversation-flows.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const board = JSON.parse(read('assistant-expanded.archi.json'));
const code = read('PSEUDOCODE.md');
const settings = read('SETTINGS.md');
const source = id => conversationFlows.find(flow => flow.id === id);
const node = (flow, id) => flow.nodes.find(n => n[0] === id);

function reachable(flow, from, to, removed) {
  const nodes = new Map(flow.nodes.map(n => [n[0], n]));
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

test('confirmed local-only research connects existing families to all new flows', () => {
  assert.match(board.decisions.computerResearch, /confirmed direction/);
  assert.match(board.decisions.computerResearch, /not implemented/);
  assert.match(board.decisions.currentInformation, /confirmed: approved local files and visible apps\/pages only/);
  assert.match(board.decisions.currentInformation, /no runtime web lookup/);
  assert.equal(node(source('computerSearch'), 'file')[5], 'files');
  assert.equal(node(source('computerSearch'), 'extract')[5], 'extraction');
  assert.equal(node(source('extraction'), 'clarify')[5], 'conversation');
  for (const id of ['computerSearch', 'extraction', 'conversation']) {
    assert.ok(board.views.some(view => view.id === id));
    assert.ok(flows.some(flow => flow.nodes.some(n => n[5] === id)), `Unlinked detail: ${id}`);
  }
  for (const doc of ['ZI-SCOPE.md', 'END-STATE.md', 'CAPABILITIES.md', 'ANALYSIS.md', 'SETTINGS.md']) {
    assert.match(read(doc), /local files and visible apps\/pages/i, doc);
  }
  const network = settings.split('\n').find(line => line.startsWith('| S-49 |'));
  assert.match(network, /confirmed/i);
  assert.match(network, /disabled/i);
  assert.match(read('RESEARCH.md'), /P-13/);
});

test('search loops cannot bypass discovery, entry debits or bounded identity bookkeeping', () => {
  const flow = source('computerSearch');
  for (const guard of ['grant', 'ledger', 'admit', 'next', 'allowed', 'identity', 'seen', 'mark']) {
    assert.equal(reachable(flow, 'goal', 'file', guard), false, guard);
  }
  for (const repeat of ['more', 'skip']) {
    assert.equal(reachable(flow, repeat, 'file'), true);
    assert.equal(reachable(flow, repeat, 'file', 'admit'), false);
    assert.equal(reachable(flow, repeat, 'file', 'next'), false);
    assert.equal(reachable(flow, repeat, 'ledger'), false);
  }
  assert.deepEqual(node(flow, 'mark')[4], [['recorded', 'file'], ['full', 'limited']]);
  assert.equal(reachable(flow, 'coverage', 'extract', 'format'), false);
  assert.match(node(flow, 'format')[2], /shared_ledger_remaining/);
  assert.match(node(flow, 'ledger')[3], /60 active seconds, 10000 visited entries and 64 MiB/);
  assert.match(node(flow, 'scan')[3], /Thorough mode/);
  assert.match(node(flow, 'finish')[3], /Never automatically renew/);
  assert.match(code, /catch DecodeOrFileRevisionFailure/);
  assert.match(code, /One unreadable file does not end a still-admitted pass/);
  assert.match(code, /if extraction_still_admitted_under_same_ledger/);
  const fileRead = flows.find(f => f.id === 'files').nodes.find(n => n[0] === 'read');
  assert.match(fileRead[2], /caller.remaining_bytes/);
  assert.match(fileRead[2], /caller.offset/);
  assert.match(fileRead[3], /Chunks never renew/);
  assert.match(read('SCENARIOS.md'), /SC-30:/);
});

test('extraction requires exact selectors, source support, qualifiers and fresh authority', () => {
  const flow = source('extraction');
  for (const guard of ['selector', 'unique', 'read', 'match', 'structure', 'support', 'cite', 'fresh']) {
    assert.equal(reachable(flow, 'input', 'present', guard), false, guard);
  }
  assert.match(node(flow, 'selector')[3], /document ID, a section or a count/);
  assert.match(node(flow, 'match')[3], /432 is not rule 4320/);
  assert.match(node(flow, 'read')[3], /footnotes and table units/);
  assert.match(node(flow, 'support')[3], /existing math engine with cited inputs/);
  assert.match(node(flow, 'present')[3], /inherit source retention/);
  assert.equal(reachable(flow, 'partial', 'read'), false);
  assert.equal(reachable(flow, 'clarify', 'read'), false);
  assert.match(read('ACCEPTANCE.md'), /EA-EXTRACT-02/);
});

test('clarification is finite, explicit, idle while waiting and retention-aware across turns', () => {
  const flow = source('conversation');
  assert.equal(reachable(flow, 'resolve', 'ask', 'budget'), false);
  assert.equal(reachable(flow, 'wait', 'resolve', 'validate'), false);
  assert.equal(reachable(flow, 'update', 'ask', 'budget'), false);
  assert.equal(reachable(flow, 'update', 'turn'), false);
  assert.match(node(flow, 'ask')[2], /^debit_and_record/);
  assert.match(node(flow, 'ask')[3], /before display/);
  assert.match(node(flow, 'wait')[3], /Suspend generation and new source reads/);
  assert.match(node(flow, 'validate')[3], /separate explicit permission review/);
  assert.match(node(flow, 'budget')[3], /three rounds/);
  assert.match(node(flow, 'session')[3], /lifetimes and RAM limits/);
  assert.match(node(flow, 'remember')[3], /Collection-off/);
  assert.match(node(flow, 'restore')[3], /never recreates an expired source grant/);
  assert.equal(reachable(flow, 'dispatch', 'present', 'freshness'), false);
  assert.deepEqual(node(flow, 'current')[4], [['yes', 'present'], ['no', 'partial']]);
  assert.deepEqual(node(flow, 'partial')[4], []);
  assert.equal(reachable(flow, 'end', 'turn'), false);
  assert.match(code, /without_renewing_deadline_or_question_budget/);
  assert.match(code, /task.deadline = min\(task.deadline, bounded_deadline\(\)\)/);
  const request = flows.find(f => f.id === 'request');
  assert.match(node(request, 'token')[2], /reuse_live_task_token_or_create_once/);
  assert.match(node(request, 'limits')[2], /tighten_existing_task_limits/);
  assert.match(node(request, 'session')[3], /collection changes cannot upgrade/);
  assert.match(code, /Clear|clear/);
  for (const id of ['EA-TALK-01', 'EA-TALK-02', 'EA-TALK-03', 'EA-CURRENT-01']) {
    assert.ok(read('ACCEPTANCE.md').includes(`| ${id} |`), id);
  }
});
