// Structural traceability only. Human review and EA runtime evidence remain separate.
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const strings = values => values.every(value => typeof value === 'string');
const identifier = value => typeof value === 'string' && value.trim().length > 0;
const validDocuments = documents => record(documents) && strings(Object.values(documents));
const validFlows = flows => Array.isArray(flows) && flows.length > 0 && flows.every(flow =>
  record(flow) && strings([flow.id, flow.prefix, flow.title, flow.notes]) &&
  Array.isArray(flow.nodes) && flow.nodes.length > 0 && flow.nodes.every(node =>
    Array.isArray(node) && node.length >= 5 && strings(node.slice(0, 4)) &&
    (node[5] === undefined || typeof node[5] === 'string') && Array.isArray(node[4]) &&
    node[4].every(edge => Array.isArray(edge) && edge.length === 2 && strings(edge))));
const validBoard = board => record(board) && Array.isArray(board.views) && board.views.length > 0 &&
  board.views.every(view => record(view) && strings([view.id, view.title, view.notes]) &&
    Array.isArray(view.shapes) && view.shapes.length > 0 && view.shapes.every(shape =>
      record(shape) && Number.isSafeInteger(shape.shapeId) && shape.shapeId > 0 &&
      strings([shape.nodeKey, shape.text, shape.description, shape.pseudocode, shape.shapeKind, shape.linkView])) &&
    Array.isArray(view.arrows) && view.arrows.every(edge => record(edge) &&
      Number.isSafeInteger(edge.fromId) && Number.isSafeInteger(edge.toId) && typeof edge.label === 'string'));

// This is the fixed generated reference format, not a general Markdown renderer.
export function renderFlowReference(board, {draft = false} = {}) {
  if (!validBoard(board)) throw new Error('Malformed board for flow reference');
  const nodes = board.views.reduce((n, view) => n + view.shapes.length, 0);
  let text = `# EA ZI: Atomic Flow Reference\n\nAnalysis only. ${board.views.length} views, ${nodes} nodes. Every numbered node maps to one shape in the editable board.\n\n`;
  text += (draft ? 'Generated from the initial analysis draft.' : 'Reconciled from the saved Archi project.') +
    ' The saved Archi JSON is authoritative after interactive edits; do not regenerate over it.\n\n';
  text += '## Reading The State Machines\n\nEach state performs one operation or evaluates one predicate. Arrows are explicit transitions. CALL denotes a conceptual subflow, not an implemented function. Common cancellation, policy revalidation, error handling, and resource cleanup apply at every I/O boundary; see PSEUDOCODE.md.\n\n';
  for (const view of board.views) {
    text += `## ${view.title}\n\n${view.notes}\n\n`;
    for (const node of view.shapes) {
      text += `### ${node.nodeKey}: ${node.text}\n\n${node.description}\n\n\`\`\`text\n${node.pseudocode}\n`;
      const edges = view.arrows.filter(edge => edge.fromId === node.shapeId);
      for (const edge of edges) {
        const target = view.shapes.find(shape => shape.shapeId === edge.toId);
        if (!target) throw new Error(`Invalid reference edge in ${view.id}`);
        text += `${edge.label ? 'ON ' + edge.label : 'THEN'} -> ${target.nodeKey}\n`;
      }
      if (!edges.length) text += 'END FLOW\n';
      text += '\`\`\`\n\n';
      if (node.linkView) {
        const linked = board.views.find(view => view.id === node.linkView);
        if (!linked) throw new Error(`Invalid reference detail link at ${node.nodeKey}`);
        text += `Detailed flow: ${linked.title}.\n\n`;
      }
    }
  }
  return text.trimEnd() + '\n';
}

export function compareReferenceSemantics(reference, board) {
  if (typeof reference !== 'string') return ['Missing flow reference text'];
  try {
    const normalize = text => text.replace(/\r\n/g, '\n').trimEnd();
    const actual = normalize(reference);
    const expected = normalize(renderFlowReference(board));
    if (actual === expected || actual === normalize(renderFlowReference(board, {draft: true}))) return [];
    const lines = expected.split('\n'), changed = actual.split('\n');
    let context = 'header';
    for (let i = 0; i < Math.max(lines.length, changed.length); i++) {
      if (/^#{2,3} /.test(lines[i] || '')) context = lines[i].replace(/^#+ /, '');
      if (lines[i] !== changed[i]) return [`FLOW-REFERENCE.md: reference block mismatch at ${context}, line ${i + 1}`];
    }
  } catch (error) { return [`Flow reference: ${error.message}`]; }
  return [];
}

export function validateRefinementLinks(index, documents, flows, board) {
  const errors = [];
  if (!record(index) || !validDocuments(documents) || !validFlows(flows) || !validBoard(board))
    return ['Malformed refinement index, documents, source flows or saved board'];
  const definitions = (file, expression) => {
    const ids = [...(documents[file] || '').matchAll(expression)].map(m => m[1]);
    if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate definitions`);
    return new Set(ids);
  };
  const catalogs = {
    features: definitions('END-STATE.md', /^\| (F-\d{2}) \|/gm),
    requirements: definitions('ACCEPTANCE.md', /^\| (EA-[A-Z]+-\d{2}) \|/gm),
    scenarios: definitions('SCENARIOS.md', /^## (SC-\d{2}):/gm),
    settings: definitions('SETTINGS.md', /^\| (S-\d{2}) \|/gm),
    evidence: definitions('RESEARCH.md', /^\| (E-\d{2}) \|/gm)
  };
  const refinementDefinitions = definitions('END-STATE.md', /^\| (R-\d{2}) \|/gm);
  const headings = definitions('PSEUDOCODE.md', /^## (.+)$/gm);
  if (index.format !== 'ea-analysis-refinement-index' || index.version !== 1)
    errors.push('Unsupported refinement index format/version');
  if (index.status !== 'proposed-before-sign-off') errors.push('Unexpected analysis approval status');
  if (!Array.isArray(index.refinements) || !index.refinements.length)
    return [...errors, 'Missing refinement records'];
  const seen = new Set();
  for (const row of index.refinements) {
    if (!record(row)) { errors.push('Malformed refinement record'); continue; }
    if (!identifier(row.id)) { errors.push('Malformed refinement ID'); continue; }
    if (!identifier(row.flow)) { errors.push(`${row.id}: malformed refinement flow`); continue; }
    if (seen.has(row.id)) errors.push(`Duplicate refinement ${row.id}`);
    seen.add(row.id);
    if (!refinementDefinitions.has(row.id)) errors.push(`Undefined refinement ${row.id}`);
    if (!row.title || row.runtimeStatus !== 'planned-not-verified')
      errors.push(`${row.id}: missing title or unsupported runtime status`);
    for (const [field, ids] of Object.entries(catalogs)) {
      const refs = row[field];
      if (!Array.isArray(refs) || !refs.length || !strings(refs)) {
        errors.push(`${row.id}: missing ${field}`);
        continue;
      }
      if (new Set(refs).size !== refs.length) errors.push(`${row.id}: duplicate ${field}`);
      for (const id of refs) if (!ids.has(id)) errors.push(`${row.id}: undefined ${field} ${id}`);
    }
    if (!headings.has(row.pseudocodeHeading)) errors.push(`${row.id}: missing pseudocode heading`);
    const flow = flows.find(f => f.id === row.flow);
    const view = board.views.find(v => v.id === row.flow);
    if (!flow || !view) errors.push(`${row.id}: missing flow ${row.flow}`);
    else {
      if (!flow.notes.includes(row.id)) errors.push(`${row.id}: flow lacks refinement attribution`);
      const sourceKeys = new Set(flow.nodes.map((_, i) => `${flow.prefix}-${String(i + 1).padStart(2, '0')}`));
      const savedKeys = new Set(view.shapes.map(n => n.nodeKey));
      if (!Array.isArray(row.nodes) || !row.nodes.length || !strings(row.nodes)) errors.push(`${row.id}: missing nodes`);
      else for (const id of row.nodes) {
        if (!sourceKeys.has(id) || !savedKeys.has(id)) errors.push(`${row.id}: missing node ${id}`);
      }
    }
  }
  for (const id of refinementDefinitions) if (!seen.has(id)) errors.push(`Unindexed refinement ${id}`);
  return errors;
}

export function compareFlowSemantics(flows, board) {
  const errors = [];
  if (!validFlows(flows) || !validBoard(board))
    return ['Malformed source flows or saved board structure'];
  const unique = (values, name) => {
    if (new Set(values).size !== values.length) errors.push(`duplicate ${name}`);
  };
  unique(flows.map(f => f.id), 'source flow ID');
  unique(flows.map(f => f.prefix), 'source prefix');
  unique(board.views.map(v => v.id), 'saved view ID');
  if (flows.length !== board.views.length) errors.push('Source/saved view count mismatch');
  for (const view of board.views)
    if (!flows.some(f => f.id === view.id)) errors.push(`Unknown saved flow ${view.id}`);
  for (const flow of flows) {
    const view = board.views.find(v => v.id === flow.id);
    if (!view) { errors.push(`Missing saved flow ${flow.id}`); continue; }
    for (const field of ['title', 'notes'])
      if (view[field] !== flow[field]) errors.push(`${flow.id}: ${field} mismatch`);
    if (flow.nodes.length !== view.shapes.length) errors.push(`${flow.id}: node count mismatch`);
    const key = i => `${flow.prefix}-${String(i + 1).padStart(2, '0')}`;
    unique(flow.nodes.map(n => n[0]), `source node ID in ${flow.id}`);
    unique(view.shapes.map(s => s.shapeId), `shape ID in ${flow.id}`);
    unique(view.shapes.map(s => s.nodeKey), `node key in ${flow.id}`);
    if (JSON.stringify(view.shapes.map(s => s.nodeKey)) !== JSON.stringify(flow.nodes.map((_, i) => key(i))))
      errors.push(`${flow.id}: entry/order mismatch`);
    const shapeIds = new Set(view.shapes.map(s => s.shapeId));
    for (const arrow of view.arrows)
      if (!shapeIds.has(arrow.fromId) || !shapeIds.has(arrow.toId))
        errors.push(`${flow.id}: invalid saved edge endpoint`);
    if (view.arrows.length !== flow.nodes.reduce((sum, n) => sum + n[4].length, 0))
      errors.push(`${flow.id}: edge count mismatch`);
    for (const [i, node] of flow.nodes.entries()) {
      const shape = view.shapes.find(s => s.nodeKey === key(i));
      if (!shape) { errors.push(`Missing saved node ${key(i)}`); continue; }
      const shapeKind = !node[4].length ? 'terminal' : node[2].startsWith('IF ') ? 'decision' : node[5] ? 'external_method' : 'process';
      if (node[5] && !flows.some(flow => flow.id === node[5])) errors.push(`${key(i)}: undefined detail flow ${node[5]}`);
      for (const [field, value] of Object.entries({text: node[1], pseudocode: node[2], description: node[3], linkView: node[5] || '', shapeKind}))
        if (shape[field] !== value) errors.push(`${key(i)}: ${field} mismatch`);
      const expected = node[4].map(([label, id]) => {
        const target = flow.nodes.findIndex(n => n[0] === id);
        if (target < 0) errors.push(`${key(i)}: undefined source edge target ${id}`);
        return [label, key(target)];
      });
      const actual = view.arrows.filter(a => a.fromId === shape.shapeId)
        .map(a => [a.label, view.shapes.find(s => s.shapeId === a.toId)?.nodeKey]);
      const canonical = edges => edges.map(e => JSON.stringify(e)).sort();
      if (JSON.stringify(canonical(expected)) !== JSON.stringify(canonical(actual)))
        errors.push(`${key(i)}: transition mismatch`);
    }
    const forward = new Map(flow.nodes.map(node => [node[0], node[4].map(edge => edge[1])]));
    const reverse = new Map(flow.nodes.map(node => [node[0], []]));
    for (const [id, targets] of forward) for (const target of targets) reverse.get(target)?.push(id);
    const visit = (starts, adjacency) => {
      const pending = [...starts], seen = new Set();
      while (pending.length) {
        const id = pending.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        pending.push(...(adjacency.get(id) || []));
      }
      return seen;
    };
    const reached = visit([flow.nodes[0][0]], forward);
    const canEnd = visit(flow.nodes.filter(node => !node[4].length).map(node => node[0]), reverse);
    for (const [i, node] of flow.nodes.entries()) {
      if (!reached.has(node[0])) errors.push(`${key(i)}: unreachable from flow entry`);
      if (!canEnd.has(node[0])) errors.push(`${key(i)}: no terminal path`);
    }
  }
  return errors;
}

// Canonical documentation IDs support compact ranges and slash lists, not free-form prose inference.
export function analysisReferences(text, prefix) {
  const found = new Set();
  const pattern = new RegExp(`\\b(${prefix})(\\d+(?:(?:\\.\\.|/)\\d+)*)`, 'g');
  for (const match of text.matchAll(pattern)) {
    const suffix = match[2];
    const rest = text.slice(match.index + match[0].length);
    const separatedFullId = /^\/(?:[A-Z]+-)+\d/.test(rest);
    if (!/^\d{2}(?:\.\.\d{2}|(?:\/\d{2})+)?$/.test(suffix) ||
        /^\w|^\.\./.test(rest) || (rest.startsWith('/') && !separatedFullId))
      throw new Error(`Malformed reference: ${match[0]}`);
    const [first, last] = suffix.split('..');
    const start = Number(first.split('/')[0]), end = Number(last || start);
    if (end < start) throw new Error(`Reversed reference range: ${match[0]}`);
    for (let n = start; n <= end; n++) found.add(match[1] + String(n).padStart(2, '0'));
    for (const id of first.split('/').slice(1)) found.add(match[1] + id);
  }
  return found;
}

export function validateWholeAnalysis(index, documents, flows, board) {
  const errors = [];
  if (!index || typeof index !== 'object' || Array.isArray(index))
    return ['Malformed whole-analysis index'];
  if (!validDocuments(documents) || !validFlows(flows) || !validBoard(board))
    return ['Malformed documents, source flows or saved board'];
  const references = (text, prefix) => {
    try { return analysisReferences(text, prefix); }
    catch (error) { errors.push(error.message); return new Set(); }
  };
  const definitions = (file, expression) => {
    const ids = [...(documents[file] || '').matchAll(expression)].map(m => m[1]);
    if (!ids.length) errors.push(`${file}: missing definitions`);
    if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate definitions`);
    return new Set(ids);
  };
  const features = definitions('END-STATE.md', /^\| (F-\d{2}) \|/gm);
  const requirements = definitions('ACCEPTANCE.md', /^\| (EA-[A-Z]+-\d{2}) \|/gm);
  const settings = definitions('SETTINGS.md', /^\| (S-\d{2}) \|/gm);
  const scenarios = definitions('SCENARIOS.md', /^## (SC-\d{2}):/gm);
  const evidence = definitions('RESEARCH.md', /^\| (E-\d{2}) \|/gm);
  const experiments = definitions('RESEARCH.md', /^\| (P-\d{2}) \|/gm);
  const headings = definitions('PSEUDOCODE.md', /^## (.+)$/gm);
  const catalogs = {
    features, settings, evidence, experiments, pseudocode: headings,
    flows: new Set(flows.map(f => f.id)),
    requirements
  };
  if (index.format !== 'ea-whole-analysis-index' || index.version !== 2)
    errors.push('Unsupported whole-analysis index format/version');
  if (index.status !== 'proposed-before-sign-off' || index.runtimeStatus !== 'planned-not-verified')
    errors.push('Index cannot grant sign-off or runtime verification');
  const covered = Object.fromEntries(Object.keys(catalogs).map(k => [k, new Set()]));
  const sectorIds = new Set(), featureOwners = new Set();
  if (!Array.isArray(index.sectors) || !index.sectors.length) errors.push('Missing sectors');
  for (const sector of Array.isArray(index.sectors) ? index.sectors : []) {
    if (!sector || typeof sector !== 'object' || Array.isArray(sector)) {
      errors.push('Malformed sector');
      continue;
    }
    if (!identifier(sector.id)) { errors.push('Malformed sector ID'); continue; }
    if (sectorIds.has(sector.id)) errors.push(`Duplicate/missing sector: ${sector.id}`);
    sectorIds.add(sector.id);
    for (const [field, definitions] of Object.entries(catalogs)) {
      const refs = sector[field];
      const mayBeEmpty = (sector.id === 'assurance' && ['features', 'settings'].includes(field)) ||
        (sector.id === 'zii' && field === 'settings');
      if (!Array.isArray(refs) || !strings(refs) || (!refs.length && !mayBeEmpty)) {
        errors.push(`${sector.id}: missing ${field}`);
        continue;
      }
      if (new Set(refs).size !== refs.length) errors.push(`${sector.id}: duplicate ${field}`);
      for (const id of refs) {
        if (!definitions.has(id)) errors.push(`${sector.id}: undefined ${field} ${id}`);
        covered[field].add(id);
        if (field === 'features') {
          if (featureOwners.has(id)) errors.push(`Multiple primary sectors for ${id}`);
          featureOwners.add(id);
        }
      }
    }
    if (['zii', 'assurance'].includes(sector.id) && !sector.limitation)
      errors.push(`${sector.id}: missing boundary limitation`);
  }
  for (const [field, definitions] of Object.entries(catalogs))
    for (const id of definitions) if (!covered[field].has(id)) errors.push(`Unindexed ${field}: ${id}`);

  // Domain-named settings must link to their owning sector, not merely any sector.
  const categorySectors = {
    Mathematics: 'mathematics', Voice: 'voice-character', Flowcharts: 'charts',
    Logic: 'productivity', Reminders: 'productivity', Search: 'files', Conversation: 'conversation',
    Annotations: 'annotations', Artifacts: 'artifacts', Learning: 'learning', Training: 'learning',
    Personality: 'personality', Support: 'personality', Users: 'personality',
    Modules: 'configuration', Profiles: 'configuration', Performance: 'resources',
    Diagnostics: 'diagnostics', Suggestions: 'technical-hints'
  };
  for (const match of (documents['SETTINGS.md'] || '').matchAll(/^\| (S-\d{2}) \| ([^|/]+) \//gm)) {
    const sectorId = categorySectors[match[2].trim()];
    if (!sectorId) continue;
    const sector = (Array.isArray(index.sectors) ? index.sectors : []).find(s => s?.id === sectorId);
    if (!Array.isArray(sector?.settings) || !sector.settings.includes(match[1]))
      errors.push(`${match[1]}: setting category requires sector ${sectorId}`);
  }

  const scenarioFeatures = new Map();
  const scenarioRequirements = new Set();
  for (const section of (documents['SCENARIOS.md'] || '').split(/^## /m).slice(1)) {
    const id = section.match(/^(SC-\d{2}):/)?.[1];
    if (!id) continue;
    const declared = section.match(/^Features: ([^\n]*?)(?:\. |\.$|$)/m)?.[1] || '';
    const refs = references(declared, 'F-');
    scenarioFeatures.set(id, refs);
    if (!refs.size) errors.push(`${id}: missing feature links`);
    for (const ref of refs) if (!features.has(ref)) errors.push(`${id}: undefined feature ${ref}`);
    const requirementLine = section.match(/^.*?Requirements: ([^\n]+)/m)?.[1] || '';
    const criteria = references(requirementLine, 'EA-[A-Z]+-');
    if (!criteria.size) errors.push(`${id}: missing requirement links`);
    for (const ref of criteria) {
      if (!requirements.has(ref)) errors.push(`${id}: undefined requirement ${ref}`);
      scenarioRequirements.add(ref);
    }
    const namedFlows = section.match(/\bFlows: ([^.\n]+)/)?.[1];
    if (!namedFlows?.trim()) errors.push(`${id}: missing flow links`);
    if (namedFlows) for (const flow of namedFlows.split(',').map(s => s.trim()))
      if (!catalogs.flows.has(flow)) errors.push(`${id}: undefined flow ${flow}`);
  }
  for (const id of requirements)
    if (!scenarioRequirements.has(id)) errors.push(`No scenario for requirement: ${id}`);
  for (const row of (documents['END-STATE.md'] || '').split('\n').filter(l => /^\| F-\d{2} \|/.test(l))) {
    const id = row.match(/^\| (F-\d{2})/)[1];
    const declared = references(row, 'SC-');
    if (!declared.size) errors.push(`${id}: missing scenarios`);
    for (const scenario of declared)
      if (!scenarioFeatures.get(scenario)?.has(id)) errors.push(`${id}: nonreciprocal scenario ${scenario}`);
    for (const [scenario, refs] of scenarioFeatures)
      if (refs.has(id) && !declared.has(scenario)) errors.push(`${scenario}: missing backlink in ${id}`);
  }

  const allText = Object.values(documents).join('\n') + '\n' + JSON.stringify(flows);
  for (const [prefix, definitions] of [['F-', features], ['SC-', scenarios], ['S-', settings],
    ['EA-[A-Z]+-', requirements], ['E-', evidence], ['P-', experiments]]) {
    for (const ref of references(allText, prefix))
      if (!definitions.has(ref)) errors.push(`Undefined cross-document reference: ${ref}`);
  }
  if (!Array.isArray(index.documents) || !strings(index.documents) || new Set(index.documents).size !== index.documents.length)
    errors.push('Missing/duplicate document inventory');
  const documentNames = Array.isArray(index.documents) ? index.documents.filter(name => typeof name === 'string') : [];
  for (const name of documentNames) if (!documents[name]) errors.push(`Missing document: ${name}`);
  for (const name of Object.keys(documents))
    if (!documentNames.includes(name)) errors.push(`Unindexed document: ${name}`);
  errors.push(...compareFlowSemantics(flows, board));
  errors.push(...compareReferenceSemantics(documents['FLOW-REFERENCE.md'], board));
  return errors;
}
