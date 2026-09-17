import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { personalityFlows } from '../personality-flows.mjs';
import { customizationFlows } from '../customization-flows.mjs';
import { endStateFlows } from '../end-state-flows.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const board = JSON.parse(read('assistant-expanded.archi.json'));
const tone = personalityFlows.find(f => f.id === 'mannerisms');
const owner = personalityFlows.find(f => f.id === 'sessionBoundary');
const node = (f, id) => f.nodes.find(n => n[0] === id);

function reachable(f, from, to, removed) {
  const pending = [from], seen = new Set();
  while (pending.length) {
    const current = pending.pop();
    if (current === removed || seen.has(current)) continue;
    if (current === to) return true;
    seen.add(current);
    pending.push(...node(f, current)[4].map(edge => edge[1]));
  }
  return false;
}

test('separate profiles and practical humorous help are confirmed and linked', () => {
  assert.match(board.decisions.multiUserPersonality, /confirmed: separate profiles only/);
  assert.match(board.decisions.companionStyle, /no generic social check-ins/);
  assert.match(read('END-STATE.md'), /Separate profiles only is confirmed/);
  assert.match(read('SETTINGS.md'), /S-71/);
  assert.match(read('SETTINGS.md'), /S-72/);
  for (const flow of personalityFlows) {
    assert.ok(board.views.some(v => v.id === flow.id));
    assert.ok(flows.some(f => f.id !== flow.id && f.nodes.some(n => n[5] === flow.id)));
  }
  for (const id of ['02', '03', '04', '05']) {
    assert.ok(read('ACCEPTANCE.md').includes(`| EA-PERSONA-${id} |`));
  }
});

test('learning and persistence cannot bypass owner, review or capture-time eligibility', () => {
  for (const guard of ['owner', 'known', 'consent', 'evidence', 'proposal', 'valid', 'preview', 'approve', 'current', 'lifetime', 'eligible']) {
    assert.equal(reachable(tone, 'event', 'save', guard), false, guard);
  }
  assert.equal(reachable(tone, 'event', 'session', 'current'), false);
  assert.equal(reachable(tone, 'limited', 'save'), false);
  assert.equal(reachable(tone, 'end', 'proposal'), false);
  assert.match(node(tone, 'evidence')[3], /not a permanent temperament label/);
  assert.match(node(tone, 'eligible')[3], /cannot be laundered/);
  assert.match(node(tone, 'proposal')[3], /16 fields and 4 KiB/);
  assert.match(node(tone, 'proposal')[3], /Opinions remain attributed knowledge/);
  assert.match(node(tone, 'preview')[3], /help does not wait for acceptance/);
});

test('identity changes close publication and release private context before opening another session', () => {
  for (const guard of ['barrier', 'hide', 'stop', 'release', 'closed', 'target', 'known', 'artifacts', 'fresh']) {
    assert.equal(reachable(owner, 'event', 'open', guard), false, guard);
  }
  assert.equal(reachable(owner, 'event', 'namespace', 'known'), false);
  assert.equal(reachable(owner, 'guest', 'namespace'), false);
  assert.equal(reachable(owner, 'unavailable', 'open'), false);
  assert.equal(reachable(owner, 'idle', 'open'), false);
  assert.match(node(owner, 'barrier')[3], /before awaiting/);
  assert.match(node(owner, 'fresh')[3], /A-to-B-to-A/);
  assert.match(node(owner, 'target')[3], /Same-OS-account/);
  assert.match(node(owner, 'artifacts')[3], /Selection is not worker launch/);
});

test('humor respects current overrides, exact payloads and response-only presence', () => {
  const care = customizationFlows.find(f => f.id === 'peacefulSupport');
  assert.match(node(care, 'preferences')[3], /no-jokes\/serious requests override/);
  assert.match(node(care, 'format')[3], /No extra joke-generation pass/);
  assert.match(node(care, 'format')[3], /exact code\/text payloads/);
  assert.match(node(care, 'present')[2], /owner_session_style_and_source_revisions/);
  assert.match(node(care, 'quiet')[3], /No generic social check-ins/);
  assert.match(node(care, 'quiet')[3], /technical hints and user-requested reminders/);
  assert.match(read('SCENARIOS.md'), /no jokes, just the steps/);
  const override = read('PSEUDOCODE.md').split('on_current_presentation_override(command):')[1].split('propose_style_change(')[0];
  assert.ok(override.indexOf('increment_style_revision') < override.indexOf('cancel_stale_presentation'));
  assert.match(override, /live_owner_epoch/);
  assert.match(override, /parent_bounds/);
  assert.match(override, /SESSION_ONLY_WITHOUT_LEARNING_OR_SAVE/);
  assert.doesNotMatch(override, /await|model_call|review_approval/);
});

test('private models, datasets and cached output retain owner and epoch boundaries', () => {
  const adapters = endStateFlows.find(f => f.id === 'adapterLifecycle');
  assert.match(node(adapters, 'eligible')[2], /exclusively_authorized_for_current_owner/);
  assert.match(node(adapters, 'eligible')[3], /renaming merged weights/);
  assert.match(node(adapters, 'activate')[2], /live_owner_epoch/);
  const code = read('PSEUDOCODE.md');
  assert.match(code, /principal_id, session_generation/);
  assert.match(code, /records_are_authorized_for_current_owner_without_pooled_private_users/);
  assert.match(code, /without_new_generation_or_training/);
  assert.match(read('RESEARCH.md'), /P-18 is planned and unrun/);
  assert.match(board.decisions.easyTraining, /separately launched self-hosted tool/);
});
