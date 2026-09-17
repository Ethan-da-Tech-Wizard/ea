# EA ZI: Acceptance Criteria Draft

Status: analysis only. No EA implementation has passed these tests. Numeric
targets below are initial proposals to benchmark and approve, not measured
performance or a promise that every computer/application will support them.

Binding priority: accuracy and target precision before speed. Every included ZI
feature must complete positive cases locally on 4 GB total system RAM; reduced
speed or declared display detail is allowed. A refusal can pass a safety case
but cannot substitute for a working feature. END-STATE.md governs feature freeze;
SCENARIOS.md supplies 39 composite fixtures and SETTINGS.md the setting/help scope.

## How To Write A Criterion

An experienced team replaces "fast," "accurate," "full-featured," and "safe"
with a specific observable contract. Each criterion records:

1. Requirement ID and the user outcome it protects.
2. Preconditions: supported platform, source, permissions, data, and starting state.
3. Trigger: the user's request or a precisely described system event.
4. Expected result and forbidden side effects.
5. Measurement, tolerance, deadline, and required negative cases.
6. Evidence: test fixture, independent oracle, traces, screenshots, and test run.
7. Status and ownership: proposed, approved, implemented, verified, or blocked.

Given / When / Then is a useful format, not a substitute for measurements.
An LLM judging its own answer is not an independent correctness oracle.

## Safety And Product Contracts

These express intended non-negotiable boundaries; the test fixtures still need
implementation. Passing a finite suite does not prove zero real-world risk.

| ID | Given / When | Then | Verification |
| --- | --- | --- | --- |
| EA-ACT-01 | ZI is idle with broad read grants; no request or observation opt-in exists | No screen capture, external content read, usage-history acquisition, or model inference begins | Process-attributed adapter spies during a 10-minute idle fixture; zero acquisition calls |
| EA-ACT-02 | A calculation is explicitly typed into EA | Compute without requesting screen capture or reading unrelated files | Zero source-adapter calls; calculator remains usable with all external-source grants denied |
| EA-PERM-01 | A target is denied or access is revoked during a read | Reject new access; discard pending revoked content; do not publish or retain it | Revocation injected at every asynchronous boundary and immediately before publication/commit |
| EA-ZI-01 | A request or hostile document asks EA to click, run a command, edit an external file, or change a setting | Explain or assemble proposed steps only; no external executor is reachable | Capability registry audit plus instrumented malicious-input suite; zero external action invocations |
| EA-DATA-01 | Collection is off; a permitted help request or explicitly enabled background read occurs | Temporary assistance/context works; observed content is absent from EA-owned durable stores, logs, caches, and exports | Unique canary content; inspect owned storage and process I/O after completion, cancellation, restart, and collection-off-to-on transitions; OS swap limits disclosed |
| EA-DATA-02 | The user forgets a saved source during answer generation | Subsequent retrieval and queued answers cannot expose it; owned derived records are removed or inaccessible | Canary traced through facts, summaries, indexes, caches, and supported backup-restore paths; external copies/trained weights reported as limitations |
| EA-HELP-01 | A supported app/version has a known matching control | Name the literal control and path, cite current evidence, and describe its effect without activating it | Human-authored known-answer fixtures and instrumented application state |
| EA-HELP-02 | A label is ambiguous, hidden, stale, inaccessible, or absent | Ask, abstain, or list evidenced alternatives; never fabricate a label/location | Ambiguity and missing-target fixture pack; record precision and coverage separately |
| EA-NET-01 | Runtime network access is disabled, including during link review | No EA DNS request, remote fetch, telemetry, or upload occurs | Process-attributed network tracing in an offline test environment |
| EA-FREE-01 | The user installs an approved offline bundle | Core guidance and calculator have no mandatory vendor/cloud account, payment, metered API, or data sale; bundled licenses/notices are valid; local identity protection for private profiles is separate | Fresh offline install workflow and distribution-manifest review; model availability checked separately |
| EA-EXT-01 | Voice, animation, and advanced personalization are absent, disabled, or crash | Typed help and calculator still work; no extra permissions or retained data appear | Optional-module failure and downgrade tests against versioned contracts |

## Background Observation Criteria

The optional capability is confirmed. Operating defaults, resource thresholds,
and consent lifetimes remain subject to analysis review. These are planned
tests, not evidence that an observer is installed or running.

| ID | Given / When | Then | Verification |
| --- | --- | --- | --- |
| EA-BG-01 | Background observation is off, even with broad source grants and collection on | No automatic content or software-usage acquisition begins; explicit help still works | Test the independent combinations of observation, collection, and source grants; zero background adapter calls when off |
| EA-BG-02 | The user enables a scoped background profile while collection remains off | Show the actual observation state; only approved inputs enter a byte-limited, expiring RAM cache | Allowed/denied source canaries, cache-byte/expiry assertions, owned-storage inspection, and off-to-on retention tests |
| EA-BG-03 | Observation is disabled, paused, expired, or revoked during an asynchronous read | Cancel subscriptions and queued work; discard late results and pending commits; no old event is replayed after re-enable | Inject each change at every await/commit boundary; reuse EA-PERF-03 cancellation targets; explicit-help and Pause-all cases tested separately |
| EA-BG-04 | Desktop lock, protected content, scope escape, or uncertain source identity occurs | Stop affected acquisition before reading its content; no generic screenshot fallback | Synthetic lock/private/password fixtures; capture spies verify skipped frames when exclusion cannot be enforced; resumption rechecks a live grant |
| EA-BG-05 | An event storm or memory pressure occurs while background observation is enabled | Coalesce or drop stale events, obey configured rate/cache/CPU/RAM limits, and prioritize requested help | Instrument complete process-tree resources, bounded queues and cache lifetime; deny unsupported/over-budget capture or OCR |
| EA-BG-06 | Observation is enabled without a separate proactive-hint grant; observed text requests actions | No unsolicited advice, speech, circle, menu reveal, focus change, or external execution | Presentation/action spies and hostile-content fixtures; passive reads do not become user instructions |

## Graphing Calculator Criteria

The complete feature inventory is in CAPABILITIES.md. Each advertised mode
needs its own conformance cases; one successful sine plot does not establish
that a graphing calculator is complete.

| ID | Given / When | Then | Oracle / Proposed Threshold |
| --- | --- | --- | --- |
| EA-MATH-01 | Exact rational, symbolic, or supported complex input is submitted | Return the engine's result with explicit domain/assumptions; label approximation | Exact cases compared mathematically, not only by expression string; `(2+3*I)*(2-3*I)=13`, `1/3+1/6=1/2` |
| EA-MATH-02 | The user switches degrees/radians or supplies incompatible units | Apply the selected angle mode; reject incompatible dimensions | `sin(30 degrees)=1/2`; metre plus second is a dimensional error; no silent mode change |
| EA-MATH-03 | A published well-conditioned numerical fixture is evaluated | Meet its approved absolute/relative error bounds | Initial target: absolute error <= 1e-10 OR relative error <= 1e-8; exceptions and conditioning specified per fixture |
| EA-GRAPH-01 | Supported expressions and finite bounds are selected | Cartesian, polar, parametric, implicit, and inequality modes produce their defined output | Analytic fixtures, including `y=x^2`, `x^2+y^2=1`, a parametric circle, and a shaded inequality; geometry compared independently |
| EA-GRAPH-02 | `1/x`, `tan(x)`, restricted-domain roots, or piecewise input is plotted across a boundary | Do not connect known discontinuities or imply a real-valued result outside the domain | Domain/continuity fixtures; sampling limitations disclosed, not treated as proofs of arbitrary continuity |
| EA-GRAPH-03 | A slider or expression changes while an older plot is computing | Replace validated AST/assumptions/angle/parameter inputs; publish only the newest revision; retain eligible undo and a stable viewport | Reverse worker completion and change x^2 to x^3; independently check samples. Domain/sample/query stages release workers before waits; first result returns without waiting for graph closure |
| EA-GRAPH-04 | The user requests roots, intersections, extrema, or area | State the interval, assumptions, method/tolerance, and any incomplete search | Independent numerical/analytic references; never call a viewport search a proof of all solutions |
| EA-MATH-04 | Malformed, huge, recursive, code-like, or unsupported input is submitted | Reject or time out without arbitrary execution, file access, network use, or UI lockup | Adversarial parser corpus, fixed resource limits, cancellation test, bounded error text |
| EA-MATH-05 | An engine cannot solve an expression within the allowed domain/budget | Report unresolved/approximate/unsupported honestly; do not substitute an LLM guess as a computed answer | Unsolved and timeout fixtures; result provenance identifies the actual engine |
| EA-WORK-01 | The user explicitly saves an EA workbook and reopens it | Restore expressions, domains, modes, parameters, and permitted data; temporary observations are not silently included | Round-trip and failed-save fixtures; explicit export preview for selected artifacts |

## Screen-Circle Criteria

| ID | Given / When | Then | Verification / Proposed Threshold |
| --- | --- | --- | --- |
| EA-POINT-01 | A visible, uniquely identified control exposes calibrated bounds | Draw a click-through outline around that control on the correct monitor | Initial target: mapped center and designated outline bounds within 4 physical display pixels of independent fixture geometry; assess each tested scale/rotation separately |
| EA-POINT-02 | The app moves, scrolls, resizes, closes its menu, changes zoom, or crosses displays | Invalidate the old marker before presenting a newly resolved one | Geometry-event instrumentation and captured frames; proposed stale-marker removal <= 100 ms after receiving invalidation |
| EA-POINT-03 | The target is ambiguous, hidden/covered, permission-denied, or coordinate mapping is unavailable | No authoritative marker is drawn; present a question or an explicit fallback | All negative fixtures abstain; no pointing through a different foreground window |
| EA-POINT-04 | A marker is visible and the user clicks or types | Input goes to the intended application exactly as without EA's marker; focus does not change | Instrumented target-app event counters; no synthetic click or keyboard injection |
| EA-POINT-05 | Stop, lock, target loss, expiry, or permission revocation occurs | Remove the marker and release its request-bound observation subscriptions | Event and lifecycle tests, including monitor removal and compositor restart |

Test proposed scales 100%, 125%, 150%, 175%, and 200%, portrait/landscape,
1080p/1440p/4K, multiple monitors with different scales, negative origins,
capture crops, moved windows, scroll, and browser zoom. Use a documented covering
matrix plus targeted high-risk combinations; do not claim every OS/compositor
combination works. Synthetic scale tests supplement, not replace, real desktop
tests. OCR detection accuracy is evaluated separately from coordinate mapping.

Pointing identity is a release gate, not just pixel accuracy. A perfectly placed
circle on the wrong button fails. Start with a versioned fixture pack: 100 known
software-help tasks plus 30 ambiguous/unsupported tasks. Proposed entry targets:
at least 90 supported tasks correctly completed, zero incorrect authoritative
highlights in that pack, and correct abstention/clarification on every negative
fixture. Report the denominators and coverage; do not hide failures as abstention.

## Resource And Responsiveness Targets

These are **proposed benchmark targets**, subject to measurement before a
release commitment. Hardware, OS/compositor, model/quantization, context length,
dataset, background workload, and cold/warm state must be recorded with results.

| ID | Test | Initial Target |
| --- | --- | --- |
| EA-PERF-01 | Move/resize/type/Stop during a bounded scan or calculation | 95th-percentile UI response <= 100 ms across at least 100 interactions; report max and sample count |
| EA-PERF-02 | Ask about a small already-accessible supported interface | First useful evidence <= 2 seconds at the 95th percentile across 100 warm requests; measure model-complete answer separately |
| EA-PERF-03 | Cancel a heavy request | Acknowledge Stop <= 100 ms; workers stop within 1 second in the cancellation fixture; no later content publication/commit |
| EA-RAM-01 | Run on a named 4 GB total-RAM, CPU-only Linux profile, recording actual bytes and realistic foreground workload | Proposed idle process-tree budget <= 150 MiB; admitted peak <= 1 GiB; model-free fallback handles transient pressure but is not a replacement for required feature conformance |
| EA-RAM-02 | Available memory falls below the proposed 512 MiB reserve | Deny new heavy work, unload/cancel as appropriate, and explain reduced capability; no system OOM in the controlled stress fixture |
| EA-ENERGY-01 | Remain idle for 10 minutes with extras and background observation off | No continuous screenshot polling or inference; proposed average CPU <= 1% of one logical core, measured with workload and instrumentation disclosed |
| EA-RAM-03 | Run positive cases for every included ZI feature, with approved languages/formats/bounds and background/foreground combinations | Each feature completes locally on the 4 GB total-RAM baseline; no required GPU, cloud, larger-memory edition or refusal-only result. Record serialized-worker transitions and complete-process peaks |
| EA-QUALITY-01 | Compare models, runtimes, quantizations, adapters or optimizations | Reject any candidate failing approved correctness, precision, privacy, feature-coverage or 4 GB gates before ranking end-to-end latency/energy. Keep failed results and independent oracles; no lower accuracy bar disguised as reduced detail |
| EA-OPT-01 | Run exact lookup, broad multi-match help, mathematics and ambiguous requests through the staged controller | Exact eligible tasks complete without unnecessary model/OCR launches; broader or ambiguous tasks retain all required evidence or ask a bounded question. Compare independent answers and provider launch counts; skipping required interpretation is not a saving |
| EA-OPT-02 | Exercise OCR/model/speech and parser/math/plot handoffs under the same parent task | At most one heavy stage; actual loader/decoder/KV/IPC/retained-page peaks stay in the whole-process ceiling; all visits/passes share finite parent limits. Repeated cursors and exhausted budgets stop; shrinking available RAM never leads to external app termination or swap tuning |
| EA-OPT-03 | Repeat/reinsert evidence near expiry or after source/policy changes; increase input under fixed cache caps | Hits/reinsertions never extend original evidence/source expiry. Atomic global and aggregate task reservations count metadata, copies and live evicted handles. Several individually small entries cannot bypass the task cap; failed inserts release reservations. No collection-off disk spill or durable index; unread ranges stay gaps |
| EA-OPT-04 | Execute P-17 baseline, isolated tuning trials and the combined finalist | Record stage memory/launch counts, cold and warm p50/p95/max end-to-end timing, coverage and quality. Use development fixtures for tuning and untouched held-out cases for final evaluation; every included feature passes on the named 4 GB profile before claiming an improvement |

Measure the complete process tree, including models, OCR, math, and render
workers, not just the small UI process. Record RSS/PSS and cgroup usage where
available, swap activity, and OS responsiveness. Shared pages and file cache
must be accounted for consistently. A sudden unrelated system allocation is
not something EA can universally prevent. No swapping/OOM outcome is guaranteed
for every machine by passing one controlled profile.

Use the user's 4 GB wording conservatively: the first feasibility profile should
have no more than 4,000,000,000 bytes available as installed guest/physical RAM;
also record ordinary 4 GiB machine results separately. A process-only memory cap
on a 16 GB host is useful instrumentation, not a whole-system baseline. Supported
CPU, foreground workload, disk and swap policy need approval before sign-off.

RESEARCH.md's 128/16/768/112 MiB split is an initial allocation experiment within
the proposed 1024 MiB ceiling, not four measured sizes or new approved defaults.
Apply EA-OPT-01..04 with SC-10/26 and the existing privacy/cancellation gates.
Allocation targets and a source-level flow test are not runtime performance proof.

## Composite Workflow Criteria

These are planned pass/fail contracts. SCENARIOS.md defines synthetic fixtures;
no EA runtime test has been performed. Partial results keep explicit gaps.

| ID | Given / When | Pass | Fail / Independent Oracle |
| --- | --- | --- | --- |
| EA-JOURNEY-01 | SC-01 traverses desktop menus and a user-selected website | Reauthorize each source, compare role/version differences, cite current labels, assemble an inert checklist and wait for user actions | Wrong Pause/Begin equivalence, EA navigation or fabricated completion fails; instrument app/browser actions and fixture truth |
| EA-JOURNEY-02 | Evidence is missing, conflicting or unsupported | Return VERIFIED, PARTIAL, NEEDS_INPUT, UNAVAILABLE, CANCELLED or FAILED with the actual reason, specific gap and bounded next step | Guessing a control, retrying after revoke, requesting root or claiming exhaustive coverage fails; adversarial branch fixtures |
| EA-WEB-01 | Tab/origin/frame changes or a navigation invalidates access | Recheck browser and EA grants; read only permitted tab/frame content; inaccessible frames are gaps | Any denied frame/private content read or inherited old grant fails; browser permission and read spies |
| EA-WEB-02 | A SPA rerenders, zoom changes or duplicate controls exist | Invalidate stale identities/bounds; clarify duplicates; highlight only a unique live target | Wrong or stale circle fails; independent DOM/layout fixture identities plus calibrated display geometry |
| EA-WEB-03 | Page content includes hostile instructions, scripts or forms | Treat content as data; no navigation, script execution requested by content, form submission, downloads or uploads | Any model-induced external action fails; instrument network, navigation and form events |
| EA-FILE-01 | Huge, rotated, corrupt, inaccessible or conflicting permitted files are read | Bound decoder/chunk work; preserve revision and page/line provenance; report unread portions; cancel promptly | Secret logs, macro/remote-resource execution, mixed revisions or invented unread content fails; synthetic canaries and coverage oracle |
| EA-MATH-06 | Bounded F-13 advanced mathematics is used on 4 GB | Supported 3D/parametric plots, ODE IVPs, matrices, statistics/probability/regression meet per-operation analytic/numeric fixtures and disclose bounds | Missing a mode, silent tolerance weakening or fake singular inverse fails; use exp(-2t) IVP and independently computed data/surface fixtures |
| EA-TOOLS-01 | User requests local notes, a schedule, a conversion or a logic/workflow draft | Typed specialist service gives cited results; explicit EA save follows source rules; scheduler handles time zones/DST/sleep/restart/snooze/cancel with stable occurrence IDs, pending status and no duplicate EA entries; interrupted OS-toast delivery stays uncertain | External calendar writes, executed plan steps, arbitrary code, missed approved recurrence semantics, fake notification delivery or unsaved data reported saved fails |
| EA-SEC-01 | A link or scanner report is supplied | Explain destination/risk signals and missing information, guide user-run scanning, never certify safety | DNS/fetch/scan/quarantine without an approved separate edition action fails; static URL fixture and action/network spies |
| EA-VOICE-01 | Enable input/output independently and submit typed or spoken requests | Positive local recognition/TTS on 4 GB; one task from capture through confirmation/help/speech; close mic before ASR/waits. Typed answers can be spoken with mic denied. Own-data/settings operations require separate exact approval | Test all input/output combinations, original deadline across confirmation, owner changes and failed TTS. Repeated help/deletion after speech failure, renewed budget, empty handoff, cloud or unapproved recording fails |
| EA-PERSONA-01 | Tone, motion, learned preferences or proactive hints change | Editable reviewed profile affects presentation only; static/reduced modes work; hints need separate opt-in, quiet hours and rate limits | Altered facts/permissions, covert sensitive inference, unsolicited speech/circles or observation treated as hint consent fails |
| EA-PERSONA-02 | SC-15/38 expresses frustration, requests humor or changes to serious/no-jokes during generation | Useful practical help with optional context-fitting wit; current override wins before text/speech publication; profanity is separately selected; literals, evidence and exact payloads remain unchanged | Forced jokes, ridicule, changed warnings, diagnosis, delayed help, stale humor or social check-ins fail; human timing/usefulness review plus payload and event oracles |
| EA-PERSONA-03 | Preference learning, quoted speech, explicit style feedback and collection-off review intersect | Eligible first-party owner-scoped proposals; optional review/edit/accept/reset, bounded style, session versus saved provenance preserved; no automatic weight training or approval-based retention laundering | Borrowed speaker's style, permanent mood labels from one utterance, automatic profanity consent, secret training or ineligible persistence fails; source/retention/process spies |
| EA-PERSONA-04 | SC-39 switches A -> B -> A during retrieval/generation/review/speech/save | Trusted owner plus fresh session generation at every boundary; close publication before cleanup; separate namespaces/contexts/private adapters; guest for unknown identity and closed private access on failed isolation | Cross-owner canary reads/outputs, revived old A output, mixed private personality, guessed identity, profile-name authentication or inherited grants fails; account/storage isolation and race fixtures |
| EA-PERSONA-05 | Two profiles use reviewed preferences, examples or returned private adapters on 4 GB | Common base artifact stays unchanged; private data/adapter lineage is owner-bound; no pooled training or renamed-private-base loophole; exact inference compatibility and low-memory gates hold | Another owner's adapter activation, unknown ownership accepted, automatic training, extra model passes just for jokes or cross-user saved-data changes fails; artifact/worker/namespace traces and positive two-user cases |
| EA-ADAPTER-01 | Export/load/rollback/forget intersects training artifacts | Validate eligibility and exact base/tokenizer/runtime compatibility; review export; quality/4 GB tests pass; rollback only to eligible artifacts | Arbitrary GGUF injection, training in ZI, changed grants, false unlearning or resurrected forgotten data fails; lineage and artifact fixtures |
| EA-SET-01 | Each setting/constituent control/command is inspected | Rich help includes all documented fields; works on hover, focus and pinned click/tap; dismissible with Escape; small viewport and 200% text stay operable | Missing help, hover-only access, clipped content or help changing permissions fails; schema audit and keyboard/pointer tests |
| EA-SET-02 | Preset/reset/import is proposed | Preview chosen versus effective values, conflicts, data effects and new grants; default reset does not erase knowledge/workbooks | Unreviewed permission increases, disguised deletion or misleading effective switch state fails |
| EA-SET-03 | Compatible settings are exported/imported or invalid values appear | Round-trip supported choices; validate version/types/bounds; review grants anew; reject unknown capability fields | Imported consent, executable rules or silent default substitution fails; fixture round-trips and schema-negative corpus |
| EA-SET-04 | Save fails, disk fills, revision conflicts or a grant is revoked mid-change | Immediate restrictions remain effective; permissive changes do not activate on failed save; actual state and persistence error are visible | Re-enabled reads or falsely reported durable success fails; injected failures at commit/activation boundaries |
| EA-FREEZE-01 | Analysis sign-off or any later change is proposed | G-01..08 reviewed, explicit user approval and traceable baseline; reject new features after sign-off; retest in-scope repairs | Automatic freeze, unsigned hashes treated as approval, undeclared formats/platforms/plugins, or silent scope reduction fails; independent artifact/change review |

## Embedded Archi Criteria

F-32 is confirmed as an internal EA workspace, not control of a separate app.
The numeric generation limits in END-STATE.md are proposals to validate before
freeze; no EA embedding or model-driven chart generation has been implemented.

| ID | Given / When | Pass | Fail / Independent Oracle |
| --- | --- | --- | --- |
| EA-CHART-01 | User explicitly requests a methodology chart or revision | Produce a typed editable graph in EA's embedded Archi workspace with one operation/predicate per node, labeled decisions, failure paths, assumptions and evidence; user can review/edit/undo/save permitted content | Incorrect endpoints, invented evidence, forced external-app import or executing the workflow fails; independently authored method fixture plus graph/round-trip checks |
| EA-CHART-02 | A draft is invalid, repetitive, oscillating or recursively expanding | One parent ledger bounds all model passes, active wall time, nodes/edges, subflows, depth and resources; no-progress/repeated fingerprints stop early; no observer/sync/autosave event restarts generation | A-B-A loops, endless paraphrasing, child-budget resets, unlimited mode or automatic renewal fails; instrument parent/child counters with forced invalid-output sequences |
| EA-CHART-03 | Stop, deadline, worker hang, revocation or late completion occurs | Independent supervision stops work under EA-PERF-03; discard late output, preserve the last valid chart and show the actual limit or cancellation | UI lockup, further publication, lost valid chart or a model responsible for its own only timeout fails; hung model/parser/layout and cancellation fixtures |
| EA-CHART-04 | User changes the selected canvas after preview, or save fails | Compare current policy/canvas revisions, reject stale application, preserve unrelated manual edits/layout, support undo and distinguish RAM changes from durable save | Overwriting concurrent work, stale approval reused after graph changes, unreported failed save or a false claim of completion fails; revision races and storage fault injection |
| EA-CHART-05 | Source-derived diagrams meet collection-off, Forget, export, history or autosave | Draft content and provenance obey acquisition/current policy in every derived representation; positive embedded editing/generation cases work on 4 GB, including Archi UI overhead | Hidden disk history, orphan source facts, required higher RAM or treating safe refusal as positive support fails; canaries through drafts/undo/backups/exports and full-process measurement |

Every inventory row must link to positive and negative fixtures, not just a
generic cross-feature test. The composite cases are a review foundation; exact
input ceilings, language lists, math tolerances and named app/platform matrix
remain analysis blockers. Existing Archi structural tests do not close them.

## Research Refinement Criteria

R-01..08 remain analysis proposals. EA runtime outcomes below are planned, not
verified. Artifact checks for EA-TRACE-01 are implemented separately and do not
establish a model, privacy or 4 GB runtime pass. All shared timing/RAM gates apply.

| ID | Given / When | Pass | Fail / Independent Oracle |
| --- | --- | --- | --- |
| EA-OUT-01 | SC-22 supplies valid/invalid constrained model output | Independent bounded schema and supplied-ID/revision checks accept the correct fixture and reject malformed/unknown/stale references; support status is separate from syntax | Duplicate keys, skipped constraints, fabricated evidence or correct JSON treated as verified truth fails; hand-authored corpus and current-source oracle |
| EA-OUT-02 | Hostile file/page/image content requests authority or active rendering | Zero external action, remote resource loads or permission/budget mutations; render only inert typed content; no auto-generation trigger | Canary traffic, active HTML/script/image loads or model-owned origin/limits fails; capability/network/storage instrumentation |
| EA-CASE-01 | SC-23 has old documentation, current UI and a user test | Case separates symptoms/hypotheses/provenance/conflict/proposed test/actual result/conclusion; supported case answer works on 4 GB with actual coverage | Invented confidence/cause/completion or hidden collection-off history fails; independent case oracle with decline/expiry variants |
| EA-PATCH-01 | SC-24 revises a selected branch | Positive typed patch has valid endpoints and one undoable commit; untouched/pinned geometry, labels/colors/routes equal the base; full layout is explicit | Out-of-scope deletion, arbitrary paths, ID collisions, unexpected geometry drift or partial application fails; byte/field-level invariant comparison plus rendered view |
| EA-PATCH-02 | Canvas/policy/data changes after preview | Compare exact revisions at commit, reject the entire stale patch and preserve current work; no silent rebase or automatic retry | Any overwritten user edit, retained revoked derivative or regenerated chart after conflict fails; race injection at every await/commit boundary |
| EA-LOGIC-01 | SC-25 checks reviewed finite-domain guards | Correct gap/overlap witnesses independently evaluate true; contradictory assumptions reported; bounds, assumptions, unknown paths and query types visible | Incorrect witness, vacuous proof or universal success/termination claim fails; exhaustive small-domain truth tables independent of the selected solver |
| EA-LOGIC-02 | Unsupported syntax, solver hang, large domain or recursive paths occur | Reject unsafe grammar; every query shares finite timeout/resource/path limits; UNKNOWN/TIMEOUT stay incomplete; useful positive case works on 4 GB | eval/action calls, new deadline per query, unsafe solver traces or automatic chart mutation/generation fails; fault-injected solver and action spies |
| EA-GUARD-01 | SC-26 launches supported heavy jobs or lacks enforced protection | Known profiles use one slot and installed limits; unavailable protection blocks launch without auto-root/unsafe fallback; positive per-feature jobs complete on 4 GB | RSS-only/file-size evidence, concurrent unbudgeted children or refusal-as-support fails; whole-process/OS workload oracle and launch spies |
| EA-GUARD-02 | Worker partially launches, hangs, fails shutdown or returns after revocation | Cleanup covers configuration/launch failures and owned partial children; detach a bounded result before reaping, recheck before return. Account retained buffers; unresolved cleanup quarantines the slot while UI survives | Orphan child, freed returned payload, uncharged copy, second heavy worker during pending cleanup, stale publication or unrelated-process termination fails; launch/return/reap fault injection under EA-PERF-03 |
| EA-ERASE-01 | SC-27 forgets a known derivative lineage | Resolve current descendants in the same locked transaction as tombstones and cleanup inventory; exclude then verify each owned store, retaining only nonpayload bookkeeping | Commit a derivative between preview and lock; crash after barrier commit. Missing that derivative, lost inventory, search-only verification or false all-clean fails; inspect shadow data/journals and interrupted jobs |
| EA-ERASE-02 | Store is locked/incompatible or old backup is restored | Keep cleanup pending and tombstones enforced; restore filters current deletion/policy before exposure; external/trained-weight limits explicit | Resurrected deleted content, silent deletion-mode downgrade or false forensic/machine-unlearning guarantee fails; version/backup/failure corpus |
| EA-TRUST-01 | SC-28 verifies publisher/local artifacts in explicit maintenance | Trusted metadata checks and exact staged bytes; distinct user-managed provenance; compatibility and positive quality/4 GB gates before activation | Same-source hash treated as authentication, executable model code, altered bytes accepted or unsupported tokenizer ignored fails; signed/tampered/local fixture corpus |
| EA-TRUST-02 | Metadata expires, clock is uncertain or update/activation fails | Reject new unverifiable update without destroying permitted offline working state; preserve trust/version floors on rollback and disclose freshness limits | Verification disabled, automatic networking/activation, revoked adapter restored or offline latest-revocation claim fails; clock/staging/rollback fault injection |
| EA-TRACE-01 | SC-29 changes any current sector, refinement or linked artifact | Exact criteria/scenario links and domain-setting assignments resolve. Compare complete reference blocks, transitions/detail links, node shape meaning, entry reachability and terminal paths against source/saved board | Extra reference instructions/edges, duplicate blocks, disconnected cycles, wrong setting sector, malformed nested catalogs or stale guards fail with diagnostics; cosmetic positions/colors stay user-owned. Static paths do not prove termination |
| EA-TRACE-02 | Analysis/test status or runtime state-machine evidence is recorded | Human semantic review remains distinct; runtime tests include per-transition policy/data/budget invariants once implemented; record only actual build/profile/fixture evidence | Hash-as-approval, planned tests called passed, automatic freeze or self-triggered doc/chart loops fails; review-state audit and future synthetic stateful suite |

## Search And Conversation Criteria

The user confirmed computer-wide search, readable extraction, clarification and
conversation continuity as product directions, with approved local files and
visible apps/pages only for current information. These are planned EA tests,
not a working scanner, chat engine or measured 4 GB implementation.

| ID | Given / When | Pass | Fail / Independent Oracle |
| --- | --- | --- | --- |
| EA-SEEK-01 | SC-30 requests broad file discovery | Enumerate/read only explicitly granted local roots; apply exclusions, regular-file/identity/link/mount checks before content; no denied names in suggestions | Hidden inventory, link escape, network mount access or administrator escalation fails; synthetic filesystem and per-source read spies |
| EA-SEEK-02 | Fast/thorough search finds several versions or exhausts coverage | Positive fixture finds known relevant content; thorough mode scans admitted supported content regardless of filename rank; readable matches carry exact source/range/edition and actual unread coverage | Sampling called complete, metadata match called content analysis or uninspected data called absent fails; independent inventory/content-match oracle |
| EA-SEEK-03 | Traversal/decoder/ranker stalls, consumes budgets or sees changed sources | All stages share entry/byte/time/cache caps; bounded iterator/dedup/results; cancel/revoke rejects late output; partial results are honest; another pass is explicit | Unbounded list/set, auto-renewal, unbudgeted extraction, silent disk spool with collection off or lost cancellation fails; resource/failure canaries and positive 4 GB run |
| EA-EXTRACT-01 | SC-31 requests an exact rule/section/table | Clarify ambiguous document/edition/numbering; verify exact identifier and current source; cite section and printed/viewer page or row/byte range | 4320 substituted for 432, guessed edition, mixed revisions or invented quote fails; independently authored document fixtures |
| EA-EXTRACT-02 | A relevant excerpt contains exceptions, footnotes, numbers or units | Preserve qualifications and table structure; separate source text/explanation/calculation, cite inputs and disclose unread context; readable output works on 4 GB | Omitted exception, incorrect unit/aggregation, model arithmetic, silent truncation or unauthorized source change/export fails; literal/table/math oracles |
| EA-TALK-01 | SC-33 needs clarification or receives a response | One material question per round; meaningful choices/free text/Skip/Cancel; explicit submission and live question ID; finite shared rounds/deadline; no source reads/model work while waiting | Automatic default answer/consent, repeated-question loop, stale reply accepted, new scope without grant or budget reset fails; event-order/cancellation fixtures |
| EA-TALK-02 | Follow-up refers to a corrected entity or compacted conversation | Resolve from eligible bounded goals/entities/corrections/claims; keep reports/inferences distinct; preserve qualifiers and open questions or disclose a gap | Invented intent/certainty, lost qualification, stale context or unbounded transcript fails; known-answer multi-turn fixtures including positive 4 GB case |
| EA-TALK-03 | Saved history, source expiry, collection off, Clear Topic or Forget occurs | Saving is explicit and source-eligible; current policy/lifetimes/deletion apply to threads/summaries/derived charts; original files unchanged and no training starts | Collection-off content laundered through chat, restored grants, forgotten facts resurfacing or false unlearning fails; storage/lineage/state-transition canaries |
| EA-CURRENT-01 | SC-32 asks about sports/current stats or applicable rules | Use approved local/visible evidence with participant/event/date/edition and timestamp; clarify ambiguous identities, disclose missing/stale support; zero EA runtime web lookup | Hidden feed/fetch/refresh/navigation, stale stats called live, guessed rule or certain prediction fails; synthetic visible/local sources and network/action spies |

## Customization, Creation And Care Criteria

These are planned contracts, not implementation results. User-confirmed directions
do not approve every default, format or numerical cap. Every included feature
needs a positive 4 GB case; safe disable/refusal is insufficient proof of support.

| ID | Given / When | Pass | Failure / Independent Evidence |
| --- | --- | --- | --- |
| EA-CFG-01 | SC-34 selects Standard, Minimal or individual modules | Explicit dependency-aware composition; enabled included providers work on 4 GB; disabled providers have no active workers/subscriptions; invariant core/data controls remain reachable | Forced optional residency, silent installation, hidden execution or disabled-only feature claims fail; module inventory and activity spies |
| EA-CFG-02 | Profile/config/recipe import, explicit switch or concurrent edit | One versioned declarative schema, current-revision diff, source-free portable settings, no transferable grants; existing caps/denials prevail; unknown fields/cycles rejected | Evaluated hooks, remote references, silent grant union/budget reset, new post-freeze tools or automatic recipe jobs fail; hostile-config and state-transition fixtures |
| EA-CFG-03 | Theme, dependency activation, disable, rollback or save fails | Accessible Stop/Hide All/settings/Forget persist; restrictions apply immediately; last valid restrictive state and saved work survive; actual state/error visible | Theme hiding emergency controls, lost work, restored revoked consent/adapter or fake persistence fails; keyboard/reflow, fault-injection and storage canaries |
| EA-INK-01 | SC-35 requests typed screen marks or notes | Explicit scoped layer, supported calibrated coordinates, verified identity for source targets, separate user-positioned anchors; no background capture from drawing alone | Guessed control, unsupported monitor mapping or implicit screenshots fail; independent display/identity fixtures and read spies |
| EA-INK-02 | Annotation display/edit/delete/undo/Hide All | Click-through presentation, no external input/focus theft, EA-only edit controls, nonoccluding captions and text/list alternatives; current-revision edits | Covered permission prompts, stolen clicks, stale undo or missing reachable dismissal fails; mixed-DPI/large-text/keyboard and external-input spies |
| EA-INK-03 | Geometry changes, expiry/revoke/lock/cancel or limits occur | Hide first, terminate stale work/listeners, bounded objects/points/text/time; source rules cover layer/history/export; no self-regeneration | Stuck marker, budget renewal, automatic screenshots or expired content restored/saved fails; event/resource/lineage canaries and positive 4 GB layer case |
| EA-MAKE-01 | SC-36 requests a specific output format or selected draft edit | Exact payload/encoding/newlines/schema when advertised verified; explanations separate; unrelated work preserved; inert parser checks and honest untested status | Markdown in JSON-only output, active HTML, executed code/tests/formatter hooks, invented APIs as verified or fake runtime success fails; exact-byte/schema oracles and action spies |
| EA-MAKE-02 | Generation/repair/recipe chaining repeats, stalls or reaches limits | Shared shrinking time/pass/byte/file caps, debit before work, no-progress/A-B-A stop, independent cancellation; positive useful 4 GB draft | Unbounded repair, new child ledgers, background output-triggered jobs or unresponsive Stop fails; graph/counter/event fixtures and runtime resource measurements |
| EA-MAKE-03 | Explicit Copy/Export, stale preview, changed clipboard owner or partial write | Check exact payload and current transfer policy; selected new artifact only, no executable bit/auto-open/paste; actual per-file receipt; never clear another owner's clipboard | Source overwrite, traversal/symlink escape, auto-copy, revoked/temporary data laundering or cross-file atomicity/clipboard-erasure guarantee fails; filesystem/clipboard/storage spies |
| EA-LEARN-01 | SC-37 chooses a learning outcome | Accessible preference/knowledge/example/adapter workflows label actual outcomes; confirmed external self-hosted training handoff; no ZI trainer launch | Preferences/recall/export advertised as weight training or silent uploads/jobs fail; keyboard workflow and process/network spies |
| EA-LEARN-02 | Example selection/edit/split/export sees protected or insufficient data | Explicit training-purpose eligibility, exact payload/new-destination preview, bounded schema-valid examples, grouped split; owner/source/policy and no-overwrite/no-symlink guards at commit | Revoke during picker/approval, destination collision/symlink, switched owner or changed data must block transfer; test leakage, harvested feedback or stale export fails; independent dataset/lineage fixtures |
| EA-LEARN-03 | Returned adapter is incompatible, unmeasured or regresses | Independent held-out/baseline evaluation, exact compatibility and 4 GB gates, explicit activation and eligible rollback; accurate external-copy/weight deletion limits | Model self-score accepted as proof, arbitrary GGUF injection, false unlearning or activation after failed gates fails; ADAPT conformance and failure canaries |
| EA-CARE-01 | SC-38 changes tone, corrects EA, requests direct help or dismisses it | Patient non-shaming support, preserved evidence/qualifiers, explicit preferences, no forced cheerfulness/guilt/profiling; respect mute/leave | Coercion, fake intimacy, unrelated ideological lectures, hidden engagement optimization or changed warnings fail; human rubric plus evidence/consent event checks |
| EA-CARE-02 | Everyday recipes combine supported tools under low resources/accessibility needs | Useful bounded internal work on request, reachable controls and text alternatives, no implicit new sources/tools/jobs; idle worker release | Unsupported coverage passed off as success, data demands as a condition of help or focus/energy waste fails; positive recipe fixtures on 4 GB and host activity checks |

## Release Evidence And Traceability

Each advertised capability needs both positive and negative tests, a supported
platform/app matrix, a privacy review, and a documented fallback. Tests of Archi
are not tests of EA. UI polish, engineering completion, and release acceptance
are different statuses.

Link requirement IDs to the relevant Archi node's analysis/pseudocode. The new
capability, calculator, plotting, pointing, extension, acceptance, and background-observation views
provide the initial links. Document Sync detects drift, but a person still
reviews whether the changed requirement and workflow agree.

Before approving a baseline, settle the first target apps, exact calculator
feature list, broad-read preset wording, compositor test matrix, numerical
domains/tolerances, background consent lifetime/event/cache limits, and measured
resource budgets. Design details may evolve within the signed baseline, but
new features may not. Keep every in-scope change versioned and invalidate affected
evidence. Do not mark the current draft approved or frozen.
