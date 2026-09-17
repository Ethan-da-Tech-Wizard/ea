import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { compareFlowSemantics, validateRefinementLinks, validateWholeAnalysis } from '../analysis-links.mjs';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const documents = Object.fromEntries(fs.readdirSync(root).filter(n => n.endsWith('.md')).map(n => [n, read(n)]));
const index = JSON.parse(read('ALIGNMENT.json'));
const refinements = JSON.parse(read('REFINEMENTS.json'));
const board = JSON.parse(read('assistant-expanded.archi.json'));
const check = (i = index, d = documents, f = flows, b = board) => validateWholeAnalysis(i, d, f, b);
const section = name => documents['PSEUDOCODE.md'].split(`## ${name}\n`)[1]?.split('\n## ')[0] || '';
const node = (flow, id) => flows.find(f => f.id === flow).nodes.find(n => n[0] === id);

test('cache insertion cannot extend source expiry or bypass aggregate task quotas', () => {
  const cache = section('Temporary Cache');
  assert.match(cache, /evidence\.expires_at/);
  assert.match(cache, /existing_entry\.expires_at/);
  assert.match(cache, /reserve_global_and_task_cache_bytes_atomically/);
  assert.match(cache, /source_bindings: evidence\.source_bindings/);
  assert.match(cache, /current_policy_allows\(entry\.source_bindings\)/);
  assert.match(cache, /captured_key: key/);
  assert.doesNotMatch(cache, /min\(task\.deadline, now \+ short_TTL\)/);
});

test('typed and voice requests share reply delivery without resetting the voice task', () => {
  const voice = section('Voice And Internal Work');
  assert.match(voice, /task = create_explicit_voice_task_before_capture/);
  assert.ok(voice.indexOf('create_explicit_voice_task_before_capture') < voice.indexOf('bounded_local_capture'));
  assert.match(voice, /close_microphone_before_transcription_or_confirmation/);
  assert.match(voice, /deliver_requested_help\(transcript, existing_task = task\)/);
  assert.match(voice, /on_typed_request\(question\):\n    return deliver_requested_help\(question\)/);
  assert.match(voice, /result = on_help_request\(question, existing_task = task\)/);
  assert.match(voice, /speech_failure_does_not_rerun_help_or_discard_text/);
  assert.match(voice, /request.kind == OWN_DATA_OR_SETTINGS/);
  assert.match(voice, /exact_control_scope_and_separate_required_confirmation/);
  assert.match(section('Help Loop'), /on_help_request\(question, existing_task = NONE\)/);
  assert.match(node('voice', 'request')[2], /create_explicit_voice_task_before_capture/);
  assert.match(node('voice', 'dispatch')[2], /existing_task/);
});

test('worker launch failure is inside cleanup and returned payload survives reaping', () => {
  const worker = section('R-05 Independent Resource Supervision');
  assert.ok(worker.indexOf('try:') >= 0 && worker.indexOf('try:') < worker.indexOf('worker = launch_internal_worker'));
  assert.match(worker, /detach_bounded_result_into_parent_owned_storage/);
  assert.match(worker, /finite_stop_and_reap_owned_launch_group/);
  assert.match(worker, /release_only_untransferred_worker_buffers/);
  assert.match(worker, /quarantine_slot_if_owned_children_or_residency_unresolved/);
  assert.match(node('resourceGuard', 'release')[3], /returned payload/);
});

test('mathematics settings are assigned to their actual sector', () => {
  const math = index.sectors.find(s => s.id === 'mathematics');
  for (const line of documents['SETTINGS.md'].split('\n').filter(l => /^\| S-\d{2} \| Mathematics \//.test(l)))
    assert.ok(math.settings.includes(line.match(/^\| (S-\d{2})/)[1]), line);
  const moved = structuredClone(index);
  moved.sectors.find(s => s.id === 'mathematics').settings = math.settings.filter(id => id !== 'S-28');
  moved.sectors.find(s => s.id === 'desktop').settings.push('S-28');
  assert.ok(check(moved).some(e => /S-28.*mathematics/.test(e)));
});

test('reference mutations cannot hide behind expected substrings', () => {
  const original = documents['FLOW-REFERENCE.md'];
  for (const altered of [
    original.replace('event = await user_or_policy_event()', 'event = await user_or_policy_event()\nRUN an_unapproved_action()'),
    original.replace('ON question -> MAP-14', 'ON question -> MAP-14\nON forged -> MAP-11'),
    original.replace('Detailed flow: 02 Request & Scope.', 'Detailed flow: 00 ZI System Map.'),
    original + '\n### MAP-99: Unexpected node\n\n```text\nRETURN forged\n```\n',
    original.replace('### MAP-01:', '### MAP-01: Duplicate\n\n### MAP-01:')
  ]) {
    assert.notEqual(altered, original, 'Mutation must change the fixture');
    assert.ok(check(index, {...documents, 'FLOW-REFERENCE.md': altered}).some(e => /reference/i.test(e)));
  }
});

test('shape meaning and disconnected source/saved cycles are not cosmetic edits', () => {
  const changed = structuredClone(board);
  changed.views[0].shapes[0].shapeKind = 'decision';
  assert.ok(compareFlowSemantics(flows, changed).some(e => /shapeKind/.test(e)));
  const source = structuredClone(flows), saved = structuredClone(board);
  const flow = source[0], view = saved.views.find(v => v.id === flow.id);
  flow.nodes[0][4] = [['repeat', flow.nodes[0][0]]];
  const first = view.shapes[0].shapeId;
  view.arrows = view.arrows.filter(a => a.fromId !== first);
  view.arrows.push({fromId: first, toId: first, label: 'repeat'});
  assert.ok(compareFlowSemantics(source, saved).some(e => /unreachable|no terminal/.test(e)));
});

test('malformed nested catalogs return diagnostics instead of crashing an audit', () => {
  const invalidBoard = structuredClone(board);
  invalidBoard.views[0].arrows[0] = null;
  const invalidNodes = structuredClone(flows);
  invalidNodes[0].nodes[0] = null;
  for (const run of [
    () => check(index, null), () => check(index, {}), () => check(index, {...documents, 'ACCEPTANCE.md': {}}),
    () => check(index, documents, null), () => compareFlowSemantics(invalidNodes, board),
    () => compareFlowSemantics(flows, invalidBoard),
    () => check({...index, documents: [{toString: null}]}),
    () => check({...index, sectors: [{id: {toString: null}}]}),
    () => validateRefinementLinks(null, documents, flows, board),
    () => validateRefinementLinks({...refinements, refinements: [{id: {toString: null}}]}, documents, flows, board),
    () => validateRefinementLinks({...refinements, refinements: [{id: 'R-01', flow: {toString: null}}]}, documents, flows, board),
    () => validateRefinementLinks({...refinements, refinements: [null]}, documents, flows, board)
  ]) {
    let errors;
    assert.doesNotThrow(() => { errors = run(); });
    assert.ok(Array.isArray(errors) && errors.length);
  }
});
