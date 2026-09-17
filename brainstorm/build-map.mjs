import fs from 'node:fs';
import path from 'node:path';
import { flows } from './design.mjs';
import { capabilityFlows } from './capability-flows.mjs';
import { endStateFlows } from './end-state-flows.mjs';
import { strengtheningFlows } from './strengthening-flows.mjs';
import { conversationFlows } from './conversation-flows.mjs';
import { customizationFlows } from './customization-flows.mjs';
import { optimizationFlows } from './optimization-flows.mjs';
import { personalityFlows } from './personality-flows.mjs';
import { placeConnectionLabels } from './label-layout.mjs';
import { renderFlowReference } from './analysis-links.mjs';

// Generate a NEW draft directory. Never overwrite a board being edited in Archi.
const output = process.argv[2];
if (!output) throw new Error('Usage: node build-map.mjs NEW_OUTPUT_DIRECTORY');
if (fs.existsSync(output)) throw new Error('Output directory already exists; choose a new draft directory.');

const knownViews = new Set(flows.map(f => f.id));
if (knownViews.size !== flows.length) throw new Error('Duplicate view ID');
if (new Set(flows.map(f => f.prefix)).size !== flows.length) throw new Error('Duplicate node-key prefix');
const colors = { terminal: '#dff1e6', process: '#e4edf9', decision: '#fff1be', external_method: '#eee6f7', input_output: '#dff1f2' };
const views = flows.map(flow => {
  const ids = new Map(flow.nodes.map((n, i) => [n[0], i + 1]));
  if (ids.size !== flow.nodes.length) throw new Error(`Duplicate node in ${flow.id}`);
  const shapes = flow.nodes.map((n, i) => {
    const row = Math.floor(i / 3);
    const col = row % 2 ? 2 - i % 3 : i % 3;
    const kind = !n[4].length ? 'terminal' : n[2].startsWith('IF ') ? 'decision' : n[5] ? 'external_method' : 'process';
    if (n[5] && !knownViews.has(n[5])) throw new Error(`Unknown flow ${n[5]}`);
    return {shapeId: i + 1, px: 60 + col * 410, py: 60 + row * 225, pw: 290, ph: kind === 'decision' ? 126 : 100,
      text: n[1], shapeKind: kind, shapeColor: colors[kind], nodeKey: `${flow.prefix}-${String(i + 1).padStart(2, '0')}`,
      description: n[3], pseudocode: n[2], linkView: n[5] || ''};
  });
  const arrows = flow.nodes.flatMap((node, i) => node[4].map(([label, target], branch) => {
    if (!ids.has(target)) throw new Error(`Missing ${flow.id}.${target}`);
    if (node[4].length > 1 && !label) throw new Error(`Unlabeled branch: ${flow.id}.${node[0]}`);
    const from = shapes[i], to = shapes[ids.get(target) - 1];
    const fx = from.px + from.pw / 2, fy = from.py + from.ph / 2;
    const tx = to.px + to.pw / 2, ty = to.py + to.ph / 2;
    const edge = {fromId: from.shapeId, toId: to.shapeId, label};
    const sameRow = from.py === to.py;
    const neighboringColumns = Math.abs(from.px - to.px) === 410;
    const neighboringRows = Math.abs(from.py - to.py) === 225;
    if ((sameRow && neighboringColumns) || (fx === tx && neighboringRows)) return edge;
    // Route non-neighbor edges through the gaps between rows and columns.
    const side = branch % 2 ? -1 : 1;
    const exitX = fx + side * (from.pw / 2 + 32 + branch * 5);
    const exitY = fy + (branch - (node[4].length - 1) / 2) * 26;
    const channelY = from.py + 150 + branch * 22;
    const gutterX = to.px - 32 - (i % 3) * 12;
    const entryY = to.py - 28 - (branch % 2) * 14;
    edge.points = [{x: exitX, y: exitY}, {x: exitX, y: channelY}, {x: gutterX, y: channelY},
      {x: gutterX, y: entryY}, {x: tx, y: entryY}];
    edge.labelX = (exitX + gutterX) / 2;
    edge.labelY = channelY;
    return edge;
  }));
  const reached = new Set([1]);
  for (let pass = 0; pass < shapes.length; pass++)
    for (const a of arrows) if (reached.has(a.fromId)) reached.add(a.toId);
  if (reached.size !== shapes.length) throw new Error(`Unreachable nodes in ${flow.id}`);
  return {id: flow.id, title: flow.title, notes: flow.notes, shapes, arrows};
});

const capabilityViewIds = new Set([...capabilityFlows, ...endStateFlows, ...strengtheningFlows, ...conversationFlows, ...customizationFlows, ...optimizationFlows, ...personalityFlows].map(flow => flow.id));
for (const view of views) if (capabilityViewIds.has(view.id)) placeConnectionLabels(view);

const board = {format: 'archi-brainstorm', version: 1, title: 'EA ZI: Read, Understand, Guide', activeView: 'overview', backgroundColor: '#caffee',
  decisions: {phase: 'analysis-only', presence: 'always-visible-help-on-request', platform: 'GNU/Linux first',
    collectionOff: 'explicit help or separately opted-in observation; temporary-only; never retroactively retained',
    backgroundObservation: 'explicit opt-in; scoped passive reads; retention and proactive hints independent',
    commandExecution: 'ZI has no execution backend', freeToUse: 'no paid API, vendor/cloud account, subscription, ads, or data sale required; private profiles require a tested local identity/storage boundary',
    privacy: 'local by default; explicit grants; no zero-risk guarantee',
    futureAutonomy: 'ZII: separate execution broker; not a ZI toggle',
    baselineRAM: 'Every included ZI feature must work locally on 4 GB total system RAM; reduced speed or detail allowed; no higher-RAM tier; unbenchmarked',
    qualityPriority: 'accuracy and target precision before latency; no silent mathematical tolerance changes',
    optimization: '4 GB is an engineering constraint: staged specialists, exact retrieval, bounded working sets and measured quality-preserving profiles; WORK/P-17 are analysis proposals, not runtime benchmark results',
    companionStyle: 'confirmed: funny, practical help on request; learns reviewed user mannerisms; no generic social check-ins; exact humor/language defaults remain proposals; no automatic weight training',
    multiUserPersonality: 'confirmed: separate profiles only; no blended personality or pooled private opinions, conversations, examples or adapters; trusted identity/session isolation required; not implemented',
    featureFreeze: 'no new features after explicit analysis sign-off; currently open and unsigned',
    embeddedArchi: 'confirmed internal chart workspace; explicit requests; finite shared generation/repair budgets; no workflow execution; not implemented',
    researchRefinements: 'R-01..08 proposed before sign-off: typed evidence, casework, selected chart patches, bounded logic, independent resource supervision, verified forgetting, artifact trust and traceability; no EA runtime verification',
    computerResearch: 'confirmed direction: permission-scoped computer-wide search, cited extraction, explicit clarification and bounded conversation continuity; unsupported files and incomplete coverage remain visible; not implemented',
    currentInformation: 'confirmed: approved local files and visible apps/pages only for sports/rules/current information; no runtime web lookup; fresh identity and timestamps required; missing evidence stays unknown',
    customization: 'confirmed direction: useful defaults, selectable modules, editable profiles and user-controlled internal creation; exact F-33..35 scope/defaults pending review; no permission bypass or new post-freeze capabilities',
    internalCreation: 'confirmed direction: requested screen annotation layers and code/text artifacts; EA-owned results, explicit copy/new-file export, no external app actions or code execution; not implemented',
    easyTraining: 'confirmed: guided dataset export and trained-adapter import/evaluation; actual training runs in a separately launched self-hosted tool; no ZI trainer launch and no change to the 4 GB ZI requirement',
    productValues: 'confirmed: peace, love, respect for people and technology; supportive noncoercive help, accessibility, privacy, user agency and resource care; no forced cheerfulness or hidden engagement optimization'}, views};
const count = views.reduce((n, v) => n + v.shapes.length, 0);
const doc = renderFlowReference(board, {draft: true});
fs.mkdirSync(output, {recursive: true});
fs.writeFileSync(path.join(output, 'assistant-expanded.archi.json'), JSON.stringify(board, null, 2) + '\n', {flag: 'wx'});
fs.writeFileSync(path.join(output, 'FLOW-REFERENCE.md'), doc, {flag: 'wx'});
console.log(JSON.stringify({views: views.length, nodes: count, edges: views.reduce((n, v) => n + v.arrows.length, 0), output}));
