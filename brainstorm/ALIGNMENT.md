# EA: Whole-Analysis Alignment Audit

Date: 2026-09-17. Analysis only, not approval or EA runtime verification.

## Coverage

The current inventory is 35 feature families, 39 scenarios, 72 setting groups,
32 evidence entries and 18 proposed experiments. The editable board has 64 views,
1035 nodes and 1300 connections. Thirteen current Markdown documents are linked
in Archi Document Sync; none is approved by this audit.
The index also covers all 108 acceptance criteria and 42 pseudocode sections.

[ALIGNMENT.json](ALIGNMENT.json) maps 20 sectors to feature IDs, flow IDs,
pseudocode headings, individual acceptance IDs, settings, evidence and experiments.
Feature/scenario links must agree in both directions. Every node in each mapped
flow is checked against the saved board and [flow reference](FLOW-REFERENCE.md).
The version-2 index names exact acceptance IDs; every criterion must be cited by
a scenario and every scenario must name existing detailed flows. A new criterion
cannot inherit coverage merely by sharing a requirement-family prefix.
[REFINEMENTS.json](REFINEMENTS.json) retains the narrower R-01..08 node-level index.
Shared requirements deliberately appear in multiple sectors; these links identify
relevant contracts, not proof that a broad composite fixture tests every operation.

Evidence entries support particular engineering choices, not entire feature
families. User-confirmed requirements are not invented scientific findings.
Named experiments are plans, not completed tests. ZII has boundary-only coverage;
its exact action adapters, hardware and action-level acceptance remain open.

## Corrections

- Freeze flow now includes F-33..35; scenario counts and 22 incomplete inventory backlinks corrected.
- Registry allowlisting and strict-menu defaults now agree; verified reveal remains an unresolved exception, not enabled permission.
- Protected-source checks precede acquisition; owner-scoped recall, locked-session publication and final write guards are explicit.
- Continuation creates a new requested task; nested chart work tightens its existing parent ledger; compaction never schedules its own model retry.
- Evidence packing preserves required clauses; inference releases before waiting on screen-marker interactions.
- Ordinary knowledge export is distinct from training export; guided external training and separate-profile wording agree.
- Startup loads compatibility receipts instead of running the release suite; README distinguishes source reconciliation from automatic live mirroring.
- Shared operation and owner-namespace contracts apply to old and new flows alike. Geometry, stable IDs, connection routes and user colors remain owned by the saved project.

## Verification

Run all planning checks with the commands in [README.md](README.md#verification).
The added `node brainstorm/tests/test_alignment.mjs` checks complete index
coverage, reciprocal links, current document tracking and repaired contracts.
Negative mutations exercise missing/duplicate links, undefined IDs, stale source
semantics, unindexed documents and false verification status.
The second sweep added `node brainstorm/tests/test_contracts.mjs`: all ten new
checks failed on the preceding draft before repairs. They cover typed result
handoffs, source-aware dispatch, graph revisions, deletion transaction ordering,
bounded menu bookkeeping, dataset commit guards, exact-criterion coverage,
invalid IDs/indexes and previously ignored board edges/entry order/duplicate IDs.

Final run results are recorded in [RESEARCH.md](RESEARCH.md). These static checks
cannot prove every sentence agrees, every diagram is complete, or EA is accurate,
private, responsive or functional on 4 GB. Native Archi tests exercise the planning
tool, not the future embedded EA application.

Previous sweep: 49 planning checks passed; native Archi 20, sync 11, math 3.
Second sweep: all 59 planning checks passed, including ten reproduced regressions;
native Archi 20, sync 11 and math 3 passed. All 64 views rendered. Native totals
include setup/cleanup. Saved/source/reference semantics agree under these checks;
all node IDs/order/geometry/colors and connection routes match the pre-sweep backup.
Sync reports 13 documents needing review, zero file errors and no human approvals.

Third sweep: all 66 planning checks passed, including seven further regressions
that first failed on the previous draft. Native Archi 20, sync 11 and math 3
passed; all 64 views rendered. Exact reference blocks, shape meaning, reachable
entry/terminal paths and domain-named setting assignments are now checked too.
Reachability is structural evidence, not proof that a runtime loop terminates.

## Second-Sweep Repairs

- Help now returns typed results for permitted speech and transfers bounded presentation handles; cleanup cannot immediately destroy requested marks or wait for graph closure before returning.
- Already-acquired evidence routes to the requested calculator/chart/artifact/annotation handler without another acquisition loop or parent budget.
- Graph revisions replace validated inputs; domain, sampling and query workers release before user-event waits.
- Deletion recomputes descendants inside the tombstone/cleanup-inventory transaction, including commits made after preview.
- Menu queues and seen sets share bounded bookkeeping; denied/duplicate branches consume visits before processing.
- Training export binds exact bytes and a new destination in a reviewed preview, then rechecks owner/source/policy and filesystem constraints at commit.
- Five previously uncited acceptance criteria now have explicit fixture variants; all scenarios name detailed flows. Checker mutations reject family-wide false coverage and malformed artifacts.

These are integration and validation repairs within the existing inventory, not
additional features or proof that the future EA runtime satisfies these contracts.

## Third-Sweep Repairs

The third sweep corrected original cache expiry and aggregate reservations,
voice-task ownership from recording through reply, output-only speech for typed
requests, own-data/settings confirmation routing, and worker launch/result/cleanup
ownership. It moved angle mode S-28 into mathematics and added the missing SC-14
calculator/deletion backlinks. Current sources, board and reference agree under
the expanded tests; no new feature or approved baseline was introduced.

Read-grant expiry, temporary-use expiry and saved-data retention are distinct.
An eligible reviewed saved copy cannot extend the RAM copy/read grant; derivatives
remain bounded by their source retention rules. Source expiry is never renewed
by a cache hit or reinsert. Tests and the human review below remain different gates.

## Still Open

- Explicit human semantic review of current revisions; sync flags stay pending.
- Inventory include/exclude decisions, exact formats/languages/platforms and optional menu-reveal/hint choices.
- Local identity/storage protection, defaults, retention and detailed threat-model decisions.
- Positive 4 GB feasibility, independent per-operation oracles and full distribution licensing.
- Exact ZII action contracts, separate from ZI; no silent permission expansion.

These are the existing G-01..08 exit gates in [END-STATE.md](END-STATE.md#analysis-exit-gates),
not new features. Analysis remains open and unfrozen.

## Artifact Boundaries

`assistant-expanded.archi.json` is the authoritative saved project. Flow source
modules and the generated reference must reconcile with it, preserving interactive
edits. Sync hashes detect changed bytes, not semantic approval. No automatic merge
or chart-generation loop is introduced by the audit.

`assistant.archi.json`, `assistant-before-*.archi.json`, `.bak` and `.sync.bak`
files are historical snapshots, deliberately not current specifications. Build
products and native QML/C++/math helpers implement standalone Archi, not EA.
Their documented behavior and focused native tests are a separate verification
layer; this was not a full security audit of Archi's implementation. KARL and
remote repository contents were not re-inspected or changed in this audit.
