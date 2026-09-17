# Archi Document Sync

This is change tracking and reviewed synchronization, not an AI claim that
two pieces of prose mean the same thing. It operates locally without a model,
network access, a server, or a background daemon.

## Research Traceability

Thirteen Markdown documents are linked for review, including this guide and the
workspace README. REFINEMENTS.json adds machine-readable R-01..08 links to the
feature inventory, acceptance criteria, scenarios, settings, research sources,
pseudocode headings and atomic flow nodes. Native Document Sync currently accepts
Markdown/text, not JSON; the JSON index and JavaScript sources are checked by the
analysis tests, not falsely advertised as native linked documents.

```sh
node brainstorm/tests/test_design.mjs
node brainstorm/tests/test_analysis.mjs
node brainstorm/tests/test_refinements.mjs
node brainstorm/tests/test_conversation.mjs
node brainstorm/tests/test_customization.mjs
node brainstorm/tests/test_optimization.mjs
node brainstorm/tests/test_personality.mjs
node brainstorm/tests/test_alignment.mjs
node brainstorm/tests/test_contracts.mjs
node brainstorm/tests/test_cross_sector.mjs
```

These checks catch broken references and saved/source/reference semantic field
drift, including explicit negative mutation tests. They cannot judge whether all
prose agrees in meaning or whether an unimplemented EA feature works. Preserve
human review flags until a person reviews exact revisions. A sync warning never
starts EA chart generation or automatically records analysis sign-off.

Computer research and conversation are confirmed user requirements, not additional
primary-source findings. Their SEEK/EXTRACT/TALK views, SC-30..33 scenarios,
EA-SEEK/EXTRACT/TALK/CURRENT criteria and S-54..57 controls are covered by the
same saved/source/reference checks and focused conversation-contract tests.
The local-files/visible-apps-only decision must agree across the linked documents;
these checks do not permit a runtime web lookup or certify actual search behavior.

The customization update adds explicit F-33..35, SC-34..38, S-58..70 and
EA-CFG/INK/MAKE/LEARN/CARE contracts, with CFG/INK/MAKE/LEARN/CARE diagram views.
The 35-family inventory is not a silently expanded 32-family baseline. Focused
tests check configuration gates, bounded generation, annotation lifetime, external
training and humane presentation alongside source/saved/reference equivalence.
That pass had twelve linked Markdown documents; no review approval was inferred.

The optimization pass adds WORK, EA-OPT-01..04, E-31/32 and P-17 while retaining
35 feature families, 38 scenarios and 70 setting groups. Focused planning tests
check finite stage visits, cache validation, worker release and result freshness.
The illustrative budget and unrun experiment must not be labelled measured or
approved merely because the docs and diagram agree structurally.

The personality pass adds TONE/OWNER, SC-39, S-71/72, EA-PERSONA-02..05 and P-18.
Current totals are 35 feature families, 39 scenarios and 72 setting groups.
Separate user profiles and no generic social check-ins are confirmed, not pending
choices. Account/storage enforcement, style defaults and runtime behavior still
need review and evidence. Planning tests cannot establish personal-data isolation.

The whole-workspace audit adds ALIGNMENT.md as the thirteenth linked document.
ALIGNMENT.json indexes all 20 sectors, 35 feature families, 64 flows, pseudocode
sections, individual acceptance IDs, settings, evidence and experiments; reciprocal
scenario links are checked. JSON/source files remain covered by planning tests,
not falsely advertised as native Markdown links. Historical backups are excluded
from current-spec equivalence. No review baseline is written by those tests.
The expanded checks compare complete reference blocks, including extra text,
edges and detail links, as well as shape meaning, entry/terminal reachability and
domain-named setting ownership. Reordering or moving geometry alone is not a
human semantic review; source/saved entry order remains an explicit check.

## Daily Workflow

Open Document Sync using the link icon in Archi's bottom status strip.
The EA project already links the flow reference, pseudocode, ZI scope, and
analysis notes. New links start with **Initial review needed**; no one has
silently certified that they agree.

Select a document, compare it with the diagram, and update the relevant side.
Save the diagram, check **Diagram and document agree**, and choose
**Confirm alignment**. This records a per-document baseline and review time.
It does not rewrite either document or dismiss other documents' warnings.

After a baseline exists:

| Status | Since That Document's Last Review |
| --- | --- |
| Current since review | Neither content fingerprint changed |
| Diagram changed | Diagram content changed, document did not |
| Document changed | Document content changed, diagram did not |
| Both changed | Both changed; reconciliation is still required |
| Document unavailable | Missing, unreadable, or over its size limit |

Changing both files does **not** automatically clear a warning. Both may have
changed in incompatible ways. Undoing content back to its reviewed state does
restore current status. Initial review and errors cannot show as current.

The persistent status strip updates for unsaved diagram edits and externally
saved document changes. It does not inspect unsaved buffers in other editors.
Archi watches files and their directories, reattaches after atomic replacement,
and checks every five seconds as a fallback while the project is open.

## Updating The Flow Reference

The reference is a generated view of the diagram's view names/notes, node IDs,
labels, descriptions, pseudocode, transitions, and linked flows. Select it and
choose **Preview reference**. Compare Current document and From diagram before
confirming replacement. Archi keeps the preceding text in
`FLOW-REFERENCE.md.sync.bak` and records a new baseline for that reference only.

Manual reference edits are detected. They are not parsed back into nodes or
silently discarded. Transfer meaningful edits to the diagram before explicitly
replacing the reference. The broader scope and pseudocode documents are linked
as notes; they cannot be overwritten by the reference generator.

A preview/review is tied to the observed file hashes and sync manifest. If
either side changes afterward, the operation refuses the stale request. A
diagram edited on disk by another instance must be reconciled using Archi's
existing Save Copy / Reload workflow first. Unsaved diagram content cannot be
certified or exported as a reviewed reference.

## What Counts As A Change

Diagram comparison includes the project title and decisions, views, node
identity/type/text/details/code, connections, and branch labels. Unknown
metadata is included conservatively. Node order is retained because the first
node can be a workflow's entry. Cosmetic changes are ignored: positions,
dimensions, colors, arrow routing, pan/zoom, and the active view.

Document comparison hashes the exact saved bytes with SHA-256. Formatting and
line-ending changes count; timestamps alone are not used. The status indicates
change since a recorded review, not proof of semantic correctness.

## Storage And Limits

Each project has `<project>.sync.json` alongside it. It contains linked paths,
roles, SHA-256 fingerprints, and last-review timestamps, not copied document
contents. Relative paths keep neighboring project documents relocatable.
Unlinking removes tracking metadata, not the document. Save Copy starts a
separate project without silently copying its links.

Limits are 32 linked Markdown/text documents, 4 MiB per document or manifest,
and 16 MiB for a project. Missing files and corrupt manifests remain visible
errors. Reference writes through symbolic links are disabled. Ordinary saves
do not clear sync warnings, and sync warnings never block saving your work.

Writes use atomic replacement and cooperating lock files. Reference replacement
and manifest update are separate operations: a crash between them leaves the
reference needing review rather than incorrectly marking it current. The
backup is one preceding revision, not version control or forensic recovery.
An external editor that ignores locks can still race a write; the hash check,
explicit preview, and backup reduce that risk, not eliminate it.

## Command-Line Check

The same tracker is available without a GUI:

```sh
/home/ethan/archi/build/archi --sync-status \
  /home/ethan/ea/brainstorm/assistant-expanded.archi.json
```

It emits JSON. Exit codes: `0` means current since review, `2` means review is
needed or no documents are linked, and `1` means a project/manifest error.
Missing or oversized linked documents require review and return `2`.
This can be used in a local check or future CI workflow. It reads disk state;
the live GUI additionally accounts for unsaved diagram content. When Archi is
closed, there is no resident monitor; run the check or reopen the project.

## Verification

`brainstorm/build/sync-tests` exercises per-document baselines, simultaneous
changes, drafts/undo, cosmetic exclusions, structural changes, stale tokens,
external project edits, atomic replacement/deletion/recreation, previewed
reference writes/backups, unlinking, project isolation, and invalid inputs.
The UI suite checks the live status strip, unapplied inspector edits, review
controls, and desktop/narrow layouts using temporary documents.

The file-watcher and atomic-write behavior use Qt's documented
[QFileSystemWatcher](https://doc.qt.io/qt-6/qfilesystemwatcher.html) and
[QSaveFile](https://doc.qt.io/qt-6/qsavefile.html) interfaces.
