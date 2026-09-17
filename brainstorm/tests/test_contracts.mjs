import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { analysisReferences, compareFlowSemantics, validateWholeAnalysis } from '../analysis-links.mjs';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const docs = Object.fromEntries(fs.readdirSync(root).filter(n => n.endsWith('.md')).map(n => [n, read(n)]));
const index = JSON.parse(read('ALIGNMENT.json'));
const board = JSON.parse(read('assistant-expanded.archi.json'));
const code = docs['PSEUDOCODE.md'];
const node = (flow, id) => flows.find(f => f.id === flow).nodes.find(n => n[0] === id);
const section = name => {
  const start = code.indexOf(`## ${name}\n`);
  assert.notEqual(start, -1, name);
  const end = code.indexOf('\n## ', start + 4);
  return code.slice(start, end < 0 ? undefined : end);
};
const ordered = (text, ...tokens) => {
  let previous = -1;
  for (const token of tokens) {
    const next = text.indexOf(token, previous + 1);
    assert.ok(next > previous, `Missing/out-of-order contract: ${token}`);
    previous = next;
  }
};

test('help returns eligible results for voice without destroying transferred presentation', () => {
  const help = section('Help Loop');
  assert.match(help, /return handoff_eligible_result\(result, task\)/);
  assert.match(help, /return handoff_eligible_result\(answer, task\)/);
  assert.match(help, /release_only_untransferred_task_resources/);
  assert.match(help, /register_requested_marker_session/);
  assert.doesNotMatch(help, /^        remove_task_overlays_and_subscriptions\(task\)/m);
  assert.match(section('Voice And Internal Work'), /result\.has_live_speakable_payload/);
});

test('supplied evidence returns to typed tools without another acquisition loop', () => {
  assert.match(node('overview', 'contextMathCheck')[2], /registered_internal_result_kind/);
  assert.equal(node('overview', 'contextMath')[5], 'capabilities');
  assert.match(node('capabilities', 'context')[2], /NOT validated_evidence_attached/);
  assert.match(node('capabilities', 'ownTask')[2], /existing_parent/);
  for (const kind of ['CHART', 'ARTIFACT', 'ANNOTATION'])
    assert.ok(section('Voice And Internal Work').includes(`request.kind == ${kind}`), kind);
  assert.match(section('Help Loop'), /run_supported_internal_service_with_evidence/);
});

test('graph revisions replace their inputs and release expensive stages before waiting', () => {
  const math = section('Internal Mathematics');
  assert.match(math, /ast, assumptions, angle_mode, parameters = validate_and_apply_user_revision/);
  assert.match(node('plotting', 'cancelOld')[2], /join/);
  assert.match(node('plotting', 'sample')[2], /supervised_plot_stage/);
  assert.match(node('plotting', 'domains')[2], /supervised_domain_stage/);
  assert.match(math, /return await_first_plot_result_or_limit\(session\)/);
  ordered(math, 'series = supervised_plot_stage', 'require no_heavy_worker_is_owned_by_plot()', 'event = await_graph');
});

test('forget closure is authoritative only inside the same transaction as tombstones', () => {
  const memory = section('Collection and Knowledge');
  ordered(memory, 'on_forget(selection):', 'transaction under shared_policy_and_memory_lock:',
    'affected = current_owned_derivation_closure(selection)', 'publish_tombstones(affected)',
    'persist_content_free_cleanup_job(affected.ids)', 'commit()', 'cancel_workers_that_reference(affected)');
  assert.match(node('forget', 'lock')[2], /begin_serialized_delete_transaction/);
  assert.match(node('forget', 'tombstone')[2], /current_derivation_closure/);
  assert.match(node('forgetProof', 'tombstone')[2], /current_closure_tombstones_and_cleanup_inventory/);
});

test('menu traversal debits denied branches and uses bounded bookkeeping', () => {
  const menu = section('Menu Exploration');
  ordered(menu, 'bounded_menu_frontier', 'bounded_menu_seen_set', 'while ',
    'debit_menu_visit_before_pop', 'visited.add', 'fresh =');
  assert.match(menu, /append_within_remaining_queue_and_byte_caps/);
  assert.match(node('menus', 'roots')[2], /bounded/);
  assert.match(node('menus', 'next')[2], /debit/);
});

test('dataset write rechecks the destination preview, data and owner at commit', () => {
  assert.match(node('export', 'destination')[2], /reviewed_new_destination/);
  assert.match(node('export', 'write')[2], /commit_reviewed_new_dataset_with_final_guards/);
  const learning = section('Guided Learning Workbench');
  ordered(learning, 'destination = review_new_dataset_destination', 'explicit_preview_approval',
    'commit_reviewed_new_dataset_with_final_guards');
  assert.match(learning, /no_overwrite_AND_no_symlink_escape/);
});

test('specific acceptance IDs cannot disappear behind a requirement-family wildcard', () => {
  assert.equal(index.version, 2);
  assert.ok(index.sectors.flatMap(s => s.requirements).every(id => /^EA-[A-Z]+-\d{2}$/.test(id)));
  const changed = {...docs, 'ACCEPTANCE.md': docs['ACCEPTANCE.md'] + '\n| EA-MATH-99 | new | new | new |\n'};
  const errors = validateWholeAnalysis(index, changed, flows, board);
  assert.ok(errors.some(e => e.includes('Unindexed requirements: EA-MATH-99')));
  const orphan = {...docs, 'SCENARIOS.md': docs['SCENARIOS.md'].replaceAll('EA-ENERGY-01', '')};
  assert.ok(validateWholeAnalysis(index, orphan, flows, board).some(e => e.includes('No scenario for requirement: EA-ENERGY-01')));
});

test('semantic comparison rejects hidden edges, changed entry order and duplicate identities', () => {
  const orphan = structuredClone(board);
  orphan.views[0].arrows.push({fromId: -1, toId: 1, label: 'hidden'});
  assert.ok(compareFlowSemantics(flows, orphan).length);
  const reordered = structuredClone(board);
  [reordered.views[0].shapes[0], reordered.views[0].shapes[1]] = [reordered.views[0].shapes[1], reordered.views[0].shapes[0]];
  assert.ok(compareFlowSemantics(flows, reordered).some(e => e.includes('entry/order')));
  const duplicate = structuredClone(board);
  duplicate.views[0].shapes[1].shapeId = duplicate.views[0].shapes[0].shapeId;
  assert.ok(compareFlowSemantics(flows, duplicate).some(e => e.includes('duplicate shape ID')));
});

test('malformed indexes produce diagnostics and long IDs are never truncated', () => {
  for (const invalid of [null, {...index, sectors: {}}, {...index, sectors: [null]}, {...index, documents: null}]) {
    let errors;
    assert.doesNotThrow(() => { errors = validateWholeAnalysis(invalid, docs, flows, board); });
    assert.ok(errors.length);
  }
  assert.throws(() => analysisReferences('EA-MATH-010', 'EA-[A-Z]+-'), /Malformed/);
  assert.throws(() => analysisReferences('F-01..03/99', 'F-'), /Malformed/);
});

test('every scenario names actual detailed flows and every requirement has a fixture', () => {
  for (const part of docs['SCENARIOS.md'].split(/^## /m).filter(s => /^SC-\d{2}:/.test(s)))
    assert.match(part, /\bFlows: [a-zA-Z]/, part.split('\n')[0]);
  const definition = new Set([...docs['ACCEPTANCE.md'].matchAll(/^\| (EA-[A-Z]+-\d{2}) \|/gm)].map(m => m[1]));
  const cited = analysisReferences([...docs['SCENARIOS.md'].matchAll(/Requirements: ([^\n]+)/g)].map(m => m[1]).join('\n'), 'EA-[A-Z]+-');
  assert.deepEqual([...definition].filter(id => !cited.has(id)), []);
});
