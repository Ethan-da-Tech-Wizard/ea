import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { analysisReferences, validateWholeAnalysis } from '../analysis-links.mjs';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const documents = Object.fromEntries(fs.readdirSync(root).filter(n => n.endsWith('.md')).map(n => [n, read(n)]));
const index = JSON.parse(read('ALIGNMENT.json'));
const board = JSON.parse(read('assistant-expanded.archi.json'));
const check = (i = index, d = documents, f = flows, b = board) => validateWholeAnalysis(i, d, f, b);
const node = (flow, id) => flows.find(f => f.id === flow).nodes.find(n => n[0] === id);
const code = documents['PSEUDOCODE.md'];

test('whole inventory covers every current sector, definition and saved flow', () => {
  assert.deepEqual(check(), []);
  assert.equal(index.sectors.length, 20);
  assert.equal(index.sectors.flatMap(s => s.features).length, 35);
  assert.equal(flows.length, 65);
  const count = [...documents['SCENARIOS.md'].matchAll(/^## SC-\d{2}:/gm)].length;
  assert.ok(documents['ACCEPTANCE.md'].includes(`supplies ${count} composite fixtures`));
  assert.ok(node('freeze', 'inventory')[2].includes('F_01_to_F_35'));
  const criteria = [...documents['ACCEPTANCE.md'].matchAll(/^\| EA-[A-Z]+-\d{2} \|/gm)].length;
  const sections = [...code.matchAll(/^## /gm)].length;
  assert.ok(documents['ALIGNMENT.md'].includes(`all ${criteria} acceptance criteria and ${sections} pseudocode sections`));
  for (const file of fs.readdirSync(new URL('.', import.meta.url)).filter(n => /^test_.*\.mjs$/.test(n)))
    assert.ok(documents['README.md'].includes(`node brainstorm/tests/${file}`), `Undocumented verification: ${file}`);
});

test('missing, duplicate, undefined and unindexed sector links fail', () => {
  for (const field of ['features', 'flows', 'pseudocode', 'requirements', 'settings', 'evidence', 'experiments']) {
    const missing = structuredClone(index);
    missing.sectors[0][field] = [];
    assert.ok(check(missing).some(e => e.includes(`missing ${field}`)), field);
    const dangling = structuredClone(index);
    dangling.sectors[0][field].push('does-not-exist');
    assert.ok(check(dangling).some(e => e.includes(`undefined ${field}`)), field);
    const duplicate = structuredClone(index);
    duplicate.sectors[0][field].push(duplicate.sectors[0][field][0]);
    assert.ok(check(duplicate).some(e => e.includes(`duplicate ${field}`)), field);
  }
  const orphan = structuredClone(index);
  orphan.sectors = orphan.sectors.filter(s => s.id !== 'annotations');
  assert.ok(check(orphan).some(e => e.includes('Unindexed features: F-35')));
  assert.ok(check(orphan).some(e => e.includes('Unindexed flows: annotations')));
  assert.ok(check({...index, runtimeStatus: 'verified'}).some(e => e.includes('cannot grant')));
});

test('feature and scenario coverage is reciprocal, not just valid IDs', () => {
  const changed = structuredClone(documents);
  changed['END-STATE.md'] = changed['END-STATE.md'].replace(
    /^(\| F-01 \|.*)SC-39(.*)$/m, '$1$2');
  assert.ok(check(index, changed).some(e => e.includes('SC-39: missing backlink in F-01')));
  changed['END-STATE.md'] = documents['END-STATE.md'].replace(
    /^(\| F-19 \|.*SC-13)(.*)$/m, '$1, SC-39$2');
  assert.ok(check(index, changed).some(e => e.includes('F-19: nonreciprocal scenario SC-39')));
  assert.deepEqual([...analysisReferences('EA-WEB-01..03 E-11/13/27/31/32', 'E-')], ['E-11', 'E-13', 'E-27', 'E-31', 'E-32']);
  assert.throws(() => analysisReferences('F-35..01', 'F-'), /Reversed/);
  const wrongFlow = {...documents, 'SCENARIOS.md': documents['SCENARIOS.md'].replace('Flows: journey,', 'Flows: missingJourney,')};
  assert.ok(check(index, wrongFlow).some(e => e.includes('undefined flow missingJourney')));
});

test('every current Markdown document is tracked without fabricated approval', () => {
  const sync = JSON.parse(read('assistant-expanded.archi.json.sync.json'));
  assert.deepEqual(sync.documents.map(d => d.path).sort(), [...index.documents].sort());
  assert.equal(sync.documents.length, 13);
  // A valid future human review is allowed; tests never write review baselines.
  assert.ok(sync.documents.every(d => ['notes', 'reference'].includes(d.role)));
  assert.ok(check(index, {...documents, 'UNTRACKED.md': '# New analysis'}).some(e => e.includes('Unindexed document')));
  assert.ok(check(index, {...documents, 'ALIGNMENT.md': 'See EA-UNKNOWN-99'}).some(e => e.includes('EA-UNKNOWN-99')));
});

test('legacy flows retain the current registry, source and manual-retry boundaries', () => {
  assert.match(node('policy', 'execute')[2], /NOT_IN approved_enabled_ZI_registry/);
  assert.match(node('policy', 'eligible')[2], /sticky_capture_eligibility/);
  assert.match(node('menus', 'permit')[2], /READ_UI_METADATA/);
  assert.doesNotMatch(JSON.stringify(flows.find(f => f.id === 'menus').nodes.map(n => n[2])), /adapter\.reveal|authorize\(REVEAL_VERIFIED_MENU_CONTAINER/);
  assert.match(node('capture', 'protected')[2], /exclusions_cannot_be_enforced_before_capture/);
  assert.match(node('ui', 'tree')[2], /protection_filtered/);
  assert.match(node('recall', 'search')[2], /owner_scoped/);
  assert.match(node('compaction', 'defer')[2], /without_scheduling/);
  assert.match(node('platforms', 'tests')[2], /load_versioned_compatibility_receipts/);
  assert.match(node('inference', 'reduce')[2], /contract_preserving/);
});

test('continuations and nested charts cannot renew their old parent ledger', () => {
  const continuation = code.split('continue_thorough_read(previous_task, frontier):')[1].split('```')[0];
  assert.match(continuation, /close_previous_ledger_without_renewing/);
  assert.match(continuation, /original_expiry_still_valid/);
  assert.doesNotMatch(continuation, /task\.deadline\s*=/);
  assert.match(node('assembly', 'renew')[2], /new_explicit_continuation/);
  assert.match(node('methodology', 'budget')[2], /existing_parent_with_tighter/);
  assert.match(code, /tighten_existing_supervised_parent_budget\(parent_task\.ledger/);
  assert.doesNotMatch(code, /new_supervised_parent_budget\(/);
});

test('owner, lock and heavy-worker barriers also cover older helper paths', () => {
  assert.match(code, /## Shared Operation Contract/);
  assert.match(code, /before_publish_or_commit\(result\):/);
  assert.match(code, /protected_source_exclusions_enforceable_before_read/);
  assert.match(code, /candidate\.owner_epoch_matches_current_authenticated_context/);
  assert.match(node('sessionBoundary', 'fresh')[2], /desktop_unlocked_AND/);
  const answerEnd = code.split('revalidate_policy_and_source_revisions(task, answer)')[1].split('catch Cancelled:')[0];
  assert.ok(answerEnd.indexOf('release_heavy_worker(worker)') < answerEnd.indexOf('register_requested_marker_session'));
  assert.match(node('future', 'authorize')[2], /remaining_budgets/);
});

test('ordinary knowledge export stays separate from training-purpose handoff', () => {
  assert.match(node('controls', 'exportCall')[2], /selected_export_under_explicit_purpose/);
  const section = code.split('## Selected Knowledge Export')[1].split('## Wizard,')[0];
  assert.match(section, /TRAINING_DATASET/);
  assert.match(section, /SELECTED_KNOWLEDGE/);
  assert.match(section, /current_owner_epoch_policy_data_and_record_revisions_at_write/);
  assert.match(section, /without_overwrite_symlink_escape_or_auto_open/);
  const stale = structuredClone(board);
  stale.views.find(v => v.id === 'freeze').shapes[0].pseudocode = 'F_01_to_F_32';
  assert.ok(check(index, documents, flows, stale).some(e => e.includes('BASE-01: pseudocode mismatch')));
});
