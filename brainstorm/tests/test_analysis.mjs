import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { flows } from '../design.mjs';
import { endStateFlows } from '../end-state-flows.mjs';
import { strengtheningFlows } from '../strengthening-flows.mjs';
import { conversationFlows } from '../conversation-flows.mjs';
import { customizationFlows } from '../customization-flows.mjs';
import { optimizationFlows } from '../optimization-flows.mjs';
import { personalityFlows } from '../personality-flows.mjs';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const scope = read('END-STATE.md');
const scenarios = read('SCENARIOS.md');
const settings = read('SETTINGS.md');
const acceptance = read('ACCEPTANCE.md');
const board = JSON.parse(read('assistant-expanded.archi.json'));
const defined = (text, expression) => [...text.matchAll(expression)].map(match => match[1]);

// Documentation uses bounded ID ranges such as EA-WEB-01..03 and EA-HELP-01/02.
function references(text, prefix) {
  const result = new Set();
  const pattern = new RegExp(`\\b(${prefix})(\\d{2})(?:\\.\\.(\\d{2})|\\/(\\d{2}))?`, 'g');
  for (const match of text.matchAll(pattern)) {
    const start = Number(match[2]);
    const end = match[3] ? Number(match[3]) : start;
    assert.ok(end >= start && end - start < 100);
    for (let i = start; i <= end; i++) result.add(match[1] + String(i).padStart(2, '0'));
    if (match[4]) result.add(match[1] + match[4]);
  }
  return result;
}

test('complete inventory has stable scenario references, without a signed baseline', () => {
  const features = defined(scope, /^\| (F-\d{2}) \|/gm);
  assert.equal(features.length, 35);
  assert.equal(new Set(features).size, 35);
  const cases = defined(scenarios, /^## (SC-\d{2}):/gm);
  assert.equal(cases.length, 39);
  assert.equal(new Set(cases).size, 39);
  for (const id of references(scope, 'SC-')) assert.ok(cases.includes(id), id);
  for (const id of references(scenarios, 'F-')) assert.ok(features.includes(id), id);
  const rows = scope.split('\n').filter(line => /^\| F-\d{2} \|/.test(line));
  assert.ok(rows.every(row => /SC-\d{2}/.test(row)));
  assert.match(scope, /not a signed baseline/);
  assert.match(board.decisions.featureFreeze, /currently open and unsigned/);
});

test('scenario and flow requirement references resolve to acceptance contracts', () => {
  const requirements = new Set(defined(acceptance, /^\| (EA-[A-Z]+-\d{2}) \|/gm));
  const cited = references(scenarios + settings + JSON.stringify([...endStateFlows, ...strengtheningFlows, ...conversationFlows, ...customizationFlows, ...optimizationFlows, ...personalityFlows]), 'EA-[A-Z]+-');
  assert.ok(cited.size >= 45);
  for (const id of cited) assert.ok(requirements.has(id), `Undefined requirement: ${id}`);
  for (const section of scenarios.split(/^## SC-\d{2}:/m).slice(1)) {
    assert.match(section, /Features:/);
    assert.match(section, /Requirements:/);
    assert.match(section, /Pass:/);
    assert.match(section, /Fail:/);
  }
});

test('all 72 setting groups have controls and accessible help coverage', () => {
  const ids = defined(settings, /^\| (S-\d{2}) \|/gm);
  assert.equal(ids.length, 72);
  assert.equal(new Set(ids).size, 72);
  assert.deepEqual(ids, Array.from({length: 72}, (_, i) => `S-${String(i + 1).padStart(2, '0')}`));
  assert.match(settings, /keyboard\s+focus/i);
  assert.match(settings, /Escape/);
  assert.match(settings, /effective/i);
  assert.match(settings, /S-34/);
  const help = endStateFlows.find(f => f.id === 'settingsHelp');
  assert.ok(help.notes.includes(`${ids.length} setting groups`));
  assert.ok(help.nodes.find(n => n[0] === 'definition')[3].includes('CPU/RAM'));
  assert.ok(help.nodes.find(n => n[0] === 'dismiss')[3].includes('never enables'));
  assert.deepEqual(help.nodes.find(n => n[0] === 'restrict')[4], [['', 'commit']]);
  assert.deepEqual(help.nodes.find(n => n[0] === 'commit')[4], [['saved', 'activate'], ['failed', 'error']]);
});

test('accuracy and whole-system feature gates precede every latency comparison', () => {
  const quality = endStateFlows.find(f => f.id === 'quality');
  const nodes = new Map(quality.nodes.map(node => [node[0], node]));
  const reachesLatencyWithout = removed => {
    const pending = ['profile'];
    const seen = new Set();
    while (pending.length) {
      const name = pending.pop();
      if (name === removed || seen.has(name)) continue;
      if (name === 'latency') return true;
      seen.add(name);
      pending.push(...nodes.get(name)[4].map(edge => edge[1]));
    }
    return false;
  };
  assert.equal(reachesLatencyWithout('qualityGate'), false);
  assert.equal(reachesLatencyWithout('ramGate'), false);
  assert.match(board.decisions.baselineRAM, /Every included ZI feature/);
  assert.match(board.decisions.baselineRAM, /no higher-RAM tier/);
  assert.match(board.decisions.qualityPriority, /before latency/);
  assert.match(acceptance, /cannot substitute for a working feature/);
});

test('analysis additions are tracked by sync without fabricated review approvals', () => {
  const manifest = JSON.parse(read('assistant-expanded.archi.json.sync.json'));
  for (const path of ['END-STATE.md', 'SCENARIOS.md', 'SETTINGS.md', 'RESEARCH.md', 'README.md', 'SYNC.md']) {
    const record = manifest.documents.find(doc => doc.path === path);
    assert.ok(record, path);
    assert.equal(record.role, 'notes');
  }
  assert.equal(new Set(flows.map(f => f.prefix)).size, flows.length);
  const freeze = endStateFlows.find(f => f.id === 'freeze');
  assert.deepEqual(freeze.nodes.find(n => n[0] === 'new')[4], [['yes', 'reject'], ['no', 'repair']]);
  assert.match(scope, /explicit user sign-off/);
});

test('artifact counts agree across the index, board and detailed source', () => {
  const views = board.views.length;
  const nodes = board.views.reduce((n, view) => n + view.shapes.length, 0);
  const edges = board.views.reduce((n, view) => n + view.arrows.length, 0);
  assert.ok(read('README.md').includes(`${views} views, ${nodes} nodes, and ${edges} connections`));
  assert.ok(read('FLOW-REFERENCE.md').includes(`${views} views, ${nodes} nodes`));
  assert.ok(read('ANALYSIS.md').includes(`${views} views and ${nodes} single-operation`));
  assert.ok(read('PSEUDOCODE.md').includes(`${views} Archi board views`));
  assert.ok(read('PSEUDOCODE.md').includes(`${nodes} atomic nodes`));
  assert.ok(read('RESEARCH.md').includes(`**${views} views, ${nodes} nodes and ${edges} connections**`));
  assert.equal(views, flows.length);
  assert.equal(nodes, flows.reduce((n, view) => n + view.nodes.length, 0));
});

test('embedded charts remain internal and only explicit requests start a job', () => {
  const chart = endStateFlows.find(flow => flow.id === 'methodology');
  const node = name => chart.nodes.find(n => n[0] === name);
  assert.match(board.decisions.embeddedArchi, /confirmed internal chart workspace/);
  assert.match(node('explicit')[2], /origin == USER_REQUEST/);
  assert.deepEqual(node('explicit')[4], [['yes', 'budget'], ['no', 'ignore']]);
  assert.deepEqual(node('ignore')[4], []);
  assert.match(node('apply')[2], /canvas\.compare_and_apply_in_memory/);
  assert.match(node('apply')[3], /revision checks at commit/);
  assert.match(node('eligible')[3], /Collection-off/);
  assert.match(node('finish')[3], /never executed/);
  assert.equal(endStateFlows.find(f => f.id === 'personalTools').nodes.find(n => n[0] === 'chart')[5], 'methodology');
});

test('chart repair cycles cannot bypass shared admission and pass consumption', () => {
  const chart = endStateFlows.find(flow => flow.id === 'methodology');
  const nodes = new Map(chart.nodes.map(n => [n[0], n]));
  const reachable = (from, to, removed) => {
    const pending = [from], seen = new Set();
    while (pending.length) {
      const name = pending.pop();
      if (name === removed || seen.has(name)) continue;
      if (name === to) return true;
      seen.add(name);
      pending.push(...nodes.get(name)[4].map(edge => edge[1]));
    }
    return false;
  };
  assert.equal(reachable('repair', 'generate'), true);
  assert.equal(reachable('repair', 'generate', 'admit'), false);
  assert.equal(reachable('repair', 'generate', 'consume'), false);
  assert.equal(reachable('repair', 'budget'), false);
  assert.equal(reachable('limited', 'generate'), false);
  assert.equal(reachable('conflict', 'generate'), false);
  assert.deepEqual(nodes.get('repeat')[4], [['yes', 'limited'], ['no', 'check']]);
  assert.match(nodes.get('budget')[3], /3 total model passes/);
  assert.match(nodes.get('budget')[3], /independent supervisor/);
  assert.match(nodes.get('admit')[3], /child cannot allocate a fresh parent budget/);
  assert.match(nodes.get('consume')[3], /No model-controlled counter reset/);
});

test('chart limits distinguish graph cycles from generation loops and remain unmeasured', () => {
  const chart = endStateFlows.find(flow => flow.id === 'methodology');
  assert.match(chart.nodes.find(n => n[0] === 'check')[3], /deliberate cycle/);
  assert.match(chart.nodes.find(n => n[0] === 'layout')[3], /never recursively generates/);
  assert.match(scope, /there is no infinite\/unlimited mode/);
  assert.match(scope, /unmeasured/);
  assert.match(settings, /S-51/);
  assert.match(acceptance, /EA-CHART-05/);
  assert.match(scenarios, /A-B-A/);
});
