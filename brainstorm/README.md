# EA ZI: Shared Analysis Workspace

EA is still in the analysis phase. No assistant, screen capture service, model,
or autonomous agent is running. Archi is our local, editable planning tool.

- [ZI scope and open decisions](ZI-SCOPE.md)
- [Whole-analysis alignment audit and remaining gaps](ALIGNMENT.md)
- [Complete end-state inventory and feature freeze](END-STATE.md)
- [39 complex scenarios and failure outcomes](SCENARIOS.md)
- [Setup, defaults and rich help for every setting](SETTINGS.md)
- [Primary-source research and 4 GB feasibility plan](RESEARCH.md)
- [Checked research refinement index](REFINEMENTS.json)
- [Calculator and assistant capability catalogue](CAPABILITIES.md)
- [Measurable acceptance criteria](ACCEPTANCE.md)
- [Detailed pseudocode](PSEUDOCODE.md)
- [Atomic flow reference](FLOW-REFERENCE.md)
- [Editable project](assistant-expanded.archi.json)
- [Earlier product analysis](ANALYSIS.md)

Project repository: [Ethan-da-Tech-Wizard/ea](https://github.com/Ethan-da-Tech-Wizard/ea).
The Git repository is rooted at `ea`; this analysis workspace is its `brainstorm`
subdirectory. Publishing these artifacts does not approve or freeze the analysis.

The expanded draft contains **65 views, 1066 nodes, and 1341 connections**.
Each shape names one operation or predicate. Details contains its explanation
and pseudocode; linked nodes can open their detailed flow. Branch labels show
the transition conditions. These are analysis models, not implemented APIs.

Views 28-34 cover intent routing, mathematics, interactive graphing, calibrated
screen circles, optional-module boundaries, acceptance evidence, and explicitly
enabled background observation. Views 35-43 add desktop-to-website journeys,
browser evidence, inability/failure handling, rich settings help, quality-first
4 GB evaluation, analysis sign-off, local voice, internal tools and adapter lifecycle. Numeric
acceptance targets are proposals, not measured results or guarantees.

View 44 specifies the requested embedded Archi workspace inside EA: methodology
charts on request, shared generation/repair limits, no-progress stops, revision
previews and retention-aware editing. It is an analysis flow, not an implemented
EA embedding. A drawn workflow is never executed by ZI.

Views 45-52 detail research refinements: typed output, evidence casework, selected
chart patches, bounded branch checks, resource supervision, verified forgetting,
artifact trust and specification/test traceability. They refined the earlier
32-family inventory; exact refinement defaults still need approval. The
pre-research saved board is preserved as `assistant-before-research-strengthening.archi.json`.

Views 53-55 detail requested computer-wide search, readable exact extraction and
clarification with conversation continuity. These refine the same 32 feature
families; SC-30..33 and S-54..57 specify the new cases and controls. Approved local
files and visible apps/pages remain supported. The 2026-09-19 decision adds
explicit public-source research with local AI and private screen context (view 64).
No browser control, hidden feed or automatic next search pass.
Search/question defaults remain unmeasured proposals, not approved promises.
The preceding board is preserved as `assistant-before-conversation-search.archi.json`.

Views 56-60 detail module profiles, screen annotation layers, code/text artifacts,
guided learning and peaceful support. That expansion introduced 35 feature
families, 38 scenarios and 70 setting groups. F-33..35 are explicit pre-freeze
additions, with exact options/formats/defaults still needing review. Peace, love,
respect, accessibility and user agency are core values; tone remains customizable.
Training uses guided dataset export and adapter import/evaluation; the user runs
actual training in a separate self-hosted tool. No ZI trainer launch or execution.
The prior board is backed up as `assistant-before-customization.archi.json`.

View 61, **Bounded Working Set**, details the 4 GB optimization strategy: exact
fast paths, finite stage scheduling, scoped caches, contract-preserving input
packing and one heavy worker's real release before the next. RESEARCH.md adds an
illustrative memory allocation and P-17 baseline/optimization experiments;
EA-OPT-01..04 define their pass/fail conditions. This refines existing scope, not
another feature. The prior board is backed up as `assistant-before-optimization.archi.json`.

Views 62-63, **Learned Mannerisms** and **User Session Boundary**, specify funny,
practical on-request companionship and separate profiles only. No generic social
check-ins, blended private personalities or automatic weight training. Current
totals are 35 feature families, 39 scenarios and 72 setting groups. SC-39 and
EA-PERSONA-02..05 cover humor overrides, source eligibility, identity-switch races
and private adapter isolation; P-18 is the unrun evaluation plan. The prior board
is backed up as `assistant-before-personality.archi.json`.

Every included ZI feature must work locally on **4 GB total machine RAM**, with
reduced speed/detail when needed but no silent loss of correctness or privacy.
There is no higher-memory feature tier. The complete feature inventory must be
approved before design; no new features may be added after that sign-off.
This draft is **not signed or frozen**. Scope decisions and feasibility evidence
remain open; Archi tests validate our planning artifacts, not EA's promised behavior.

View 64, **Public Research With Local AI**, records the 2026-09-19 source-policy
change: requested public fetches, reviewed public-query egress, local synthesis
and citations. Existing presence/background/menu flows now specify Super+Shift+8
or click show/hide, continued opted-in hidden observation, separately enabled
hints and manual-only menu opening. P-19 covers the unrun integrated 4 GB trial.
The saved board before these decisions is preserved as
`assistant-before-public-research.archi.json`. This is analysis, not an EA runtime.

## Open Archi

```sh
/home/ethan/archi/build/archi /home/ethan/ea/brainstorm/assistant-expanded.archi.json
```

The EA shortcut remains available:

```sh
bash /home/ethan/ea/brainstorm/open-board.sh
```

Both use the same generic Archi workspace. The native application now supports
New Project, Open Project, recent projects, and multiple views per project.
Starting native Archi without a filename restores its last project.
The EA shortcut always starts with the EA project.

## Editing

- Right-click a shape: Edit text, Details, Duplicate, or Delete.
- Middle-drag: pan the canvas. The canvas does not accept middle-click paste.
- Left-drag a shape: move it. Double-click its text: edit it.
- Double-click blank canvas: create a shape using the toolbar's type and size.
- Escape leaves inline editing. Delete removes a selected shape or connection;
  while editing text, Delete removes text instead.
- Ctrl+Z undoes an edit; Ctrl+Shift+Z redoes it. History is per view and remains
  available while changing views, but is not stored across application restarts.
- Connection and resize handles remain available. The inspector edits node
  descriptions, pseudocode, and connection labels.
- Ctrl+F searches nodes, Ctrl+0 fits the view, Ctrl+S saves, and Ctrl+R reloads
  with a discard prompt when needed.

Long labels are fitted and clipped inside shapes. Full content is editable in
the inspector. New draft views fit their contents on first opening; subsequent
saved viewports preserve your position and zoom.

## Projects And Colors

The top row provides New, Open, a recent-project picker, the background swatch,
Math & Logic, Workflow Check, and Save. The next row selects or adds views and
searches nodes. The canvas toolbar scrolls horizontally in narrow windows.

The EA background is **#CAFFEE**. Backgrounds are stored in each project;
favorite swatches and the last background are also stored locally in
`~/.config/Archi/appearance.ini`. Recent projects are in
`~/.config/Archi/projects.ini` (or the corresponding `XDG_CONFIG_HOME`).
The bookmark control adds/removes a favorite; the palette opens saved swatches.

Autosave is on by default for projects with a filename. Ordinary saves are
atomic, keep one preceding `.bak`, and compare against the last disk revision.
If another instance changes the file, Archi refuses to overwrite it and tries
to save the current work as `<project>.recovery.json`. Save Copy can preserve
that work separately. Resolve conflicts before changing projects.

The original `assistant.archi.json` and
`assistant-before-expansion.archi.json` remain untouched by the expansion.
The latter backs up the earlier saved file, not unsaved edits in an old window.

The saved JSON is authoritative after interactive editing. [Document Sync](SYNC.md)
now detects when the diagram, linked notes, or both changed since each document's
last confirmed review. Its status stays visible in Archi, including for unsaved
diagram edits. The flow reference can be regenerated after preview, with a backup;
scope and pseudocode notes require explicit reconciliation. This is not automatic
two-way prose merging. `design.mjs` and its imported flow modules are reconciled
with the saved board by the planning checks, not updated automatically by GUI edits.
`build-map.mjs` creates a NEW draft directory and refuses an existing directory;
never replace an active edited project with a generated draft.

## Math, Logic, And Workflows

Archi uses a local SymPy worker, not an LLM, for simplification, expansion,
factoring, differentiation, integration, equations, complex numbers, matrices,
Boolean simplification, and propositional satisfiability. A result can be added
to the diagram with its expression and operation.

Examples:

| Expression | Operation |
| --- | --- |
| `(x + 1)**3` | Expand |
| `x**2 - 4` | Solve = 0 |
| `(2 + 3*I)*(2 - 3*I)` | Expand |
| `[[1,2],[3,4]]` | Determinant |
| `(a & b) \| (a & ~b)` | Boolean simplify |

`**` is exponentiation; `^` is Boolean XOR. Symbols have SymPy's default
assumptions, not an assumed real or positive domain. An unevaluated symbolic
result is not a numerical solution. Propositional SAT does not establish
arithmetic constraints or prove that a workflow achieves its intended goal.

Inputs use a restricted AST parser, not Python eval or arbitrary scripts.
Calculations have a 6-second wall limit, a 4-second CPU limit, a 512 MiB
address-space limit on this Linux installation, bounded expressions/output,
and cancellation. These limits reduce resource risk; they do not establish a
general-purpose security sandbox or guarantee every calculation will finish.

SymPy 1.14 is installed in `/home/ethan/archi/.venv-math`; it requires no network
at calculation time. `install-math-engine.sh` recreates this environment when
needed. This math worker is an **Archi tool**, not permission for EA ZI to execute
actions in another app.

Workflow Check reports missing endpoints, unnamed nodes, unreachable nodes,
missing/duplicate decision labels, cycles, and absence of terminal paths.
The first node is the default entry unless the document declares `entryId`.
A cycle requires review, not automatic removal. Structural checks do not prove
semantic correctness or execute the pipeline.

## Verification

Native Archi sources are in `/home/ethan/archi`. The small EA runner imports the
same workspace and shares its file and math helpers. Both require Qt 6; do not
use this machine's Qt 5 `/usr/bin/qml` to launch the board.

```sh
cmake -S brainstorm -B brainstorm/build -DBOARD_TESTS=ON
cmake --build brainstorm/build --parallel 2
env XDG_CONFIG_HOME=/tmp/archi-test-config QT_QPA_PLATFORM=offscreen \
  QT_QUICK_BACKEND=software brainstorm/build/board-tests
/home/ethan/archi/.venv-math/bin/python -m unittest discover \
  -s brainstorm/tests -p test_math.py -v
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
brainstorm/build/sync-tests
```

Tests use disposable project files and settings, not the active EA board.

The whole-inventory check maps every current sector in ALIGNMENT.json, including
all 35 feature families, individual acceptance IDs and reciprocal scenario links.
Every criterion needs a scenario citation; every scenario names its detailed flows.
Ten contract regressions exercise integration and false-green checker cases.
Seven cross-sector regressions check lifetime and worker handoffs, independent
typed/voice replies, setting ownership, complete reference blocks and malformed
catalogs. Generated references share a canonical renderer; extra instructions,
edges and duplicate blocks cannot hide behind matching substrings.
Thirteen Markdown documents
are tracked for human sync review. Historical backups are intentionally excluded
from current-spec equivalence; matching files are not analysis sign-off.
