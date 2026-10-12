# EA: Evidence And Feasibility Record

Reviewed 2026-09-16; companion/public-research sources checked 2026-09-19. Primary documentation below informs analysis; it does not
prove EA's implementation, compatibility, accuracy, speed or 4 GB feasibility.
Publisher performance claims are not substituted for our own measurements.

## Evidence Ledger

| ID | Direct Evidence | EA Inference / Required Experiment |
| --- | --- | --- |
| E-01 | AT-SPI exposes component extents with a requested coordinate type. [GNOME](https://gnome.pages.gitlab.gnome.org/at-spi2-core/libatspi/method.Component.get_extents.html) | Candidate structured target bounds; test each toolkit/compositor and record source coordinate space. An accessible rectangle does not prove current visibility or target meaning. |
| E-02 | AT-SPI's action method invokes an action. [GNOME](https://gnome.pages.gitlab.gnome.org/at-spi2-core/libatspi/method.Action.do_action.html) | Read-only adapters must not expose generic action invocation. The user confirmed manual-only menu opening on 2026-09-19; no action adapter is included. |
| E-03 | ScreenCast portals negotiate source/session selection and persistence; session restore may require renewed permission. [Portal specification](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.ScreenCast.html) | Use supported permission paths and actual returned metadata; test denial, expired tokens, window/monitor loss and lock. The interface is not universal overlay placement or a privacy guarantee. |
| E-04 | Qt distinguishes logical, raster/device and native coordinate systems, including mixed-display geometry. [Qt](https://doc.qt.io/qt-6/highdpi.html) | Calibrate the entire source-to-overlay transform and test rotation/crops/zoom. Do not assume a DPI multiplier alone proves physical screen accuracy. |
| E-05 | Firefox activeTab is interaction-scoped; navigation and frame origins constrain access. [Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions) | A website transition is a new permission/revision check. Test the chosen Firefox and Chromium implementations separately; do not assume identical lifetime semantics. |
| E-06 | Content scripts have API/site restrictions and communicate through extension messages. [Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts) | A narrowly typed read-only bridge is a candidate, not blanket script injection. Test privileged pages, nested frames, private browsing and message spoofing. |
| E-07 | Hover/focus content must remain readable and dismissible under the stated accessibility conditions. [W3C](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Rich help also needs keyboard/focus/click access. Test actual tooltips and details panels; a compliance claim requires broader auditing. |
| E-08 | SymPy documents multiple symbolic plot modes. [SymPy plotting](https://docs.sympy.org/latest/modules/plotting.html) | Reuse domain machinery; still build/test interaction, discontinuities, ranges and bounded 3D data. Documentation is not a complete calculator UI. |
| E-09 | SymPy warns that parse_expr uses eval. [SymPy parsing](https://docs.sympy.org/latest/modules/parsing.html) | Untrusted user/OCR/model input needs a restricted grammar and isolated bounded worker, not unrestricted parse_expr/eval. |
| E-10 | SciPy provides numerical integration/ODE methods with tolerance controls. [SciPy](https://docs.scipy.org/doc/scipy/tutorial/integrate.html) | Candidate numerical engine; validate against analytic fixtures and conditioning, and cap dimensions/steps/time on 4 GB. |
| E-11 | SQLite FTS5 provides full-text indexing/search. [SQLite](https://www.sqlite.org/fts5.html) | Exact labels/errors can use a lightweight index. Database/index/backup deletion and memory usage still require EA-specific tests. |
| E-12 | Tesseract documents input-quality concerns and fast-model/thread tradeoffs. [Tesseract](https://tesseract-ocr.github.io/tessdoc/FAQ.html) | Compare OCR modes against held-out GUI/equation crops; a faster configuration cannot pass by misreading a minus sign or label. Disable diagnostic image writes in temporary-only mode. |
| E-13 | llama-bench separates prompt processing and generation, reports repeats, and excludes tokenization/sampling time. [llama.cpp benchmark](https://github.com/ggml-org/llama.cpp/blob/master/tools/llama-bench/README.md) | Useful component benchmark, insufficient end-to-end evidence. Measure acquisition, model load, parsing, validation, pointing and time to verified output too. |
| E-14 | The current llama-server documentation exposes optional built-in actions and MCP/agent integrations. [llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) | ZI must not enable bundled shell/write/MCP/agent tools. Pin and audit the runtime; an inference engine can contain capabilities absent from EA's allowed registry. Local transport must be authenticated/restricted, not broadly exposed. |
| E-15 | whisper.cpp publishes different memory estimates for different speech models. [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | Small local speech workers are candidates; measure selected model/language, complete-process memory and noisy-speech accuracy. Documentation estimates are not our 4 GB acceptance result. |
| E-16 | Piper's maintained repository describes local synthesis and identifies GPL-3.0 licensing. [Piper](https://github.com/OHF-Voice/piper1-gpl) | Evaluate local TTS and exact voice artifacts separately; packaging/voice-license review remains required. No assumption that engine and voice licenses are identical. |
| E-17 | iCalendar specifies interchange for calendaring/scheduling data and has later updates. [RFC 5545](https://www.rfc-editor.org/info/rfc5545/) | Use a maintained standards-aware parser and explicit supported subset; test recurrence, zones, import deduplication and inert attachments. Do not hand-roll scheduling semantics. |
| E-18 | Windows provides UI Automation interfaces for accessibility clients. [Microsoft](https://learn.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32) | A separate read-only adapter and coordinate/permission suite are needed; Linux success cannot certify Windows. |
| E-19 | Apple documents AXUIElement; detailed content did not render in this research tool. [Apple](https://developer.apple.com/documentation/applicationservices/axuielement) | Treat as a platform research lead only, not verified macOS permissions/overlay behavior. Native platform investigation remains a freeze risk. |
| E-20 | llama.cpp converts a subset of JSON Schema to grammars; unsupported constraints may be skipped. [Grammar documentation](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md) | R-01: use trusted, versioned local schemas with no remote references, test conversion warnings, then independently validate output. Correct syntax is not correct evidence or authority. |
| E-21 | OWASP identifies indirect instructions in external content and says retrieval/fine-tuning do not fully prevent injection. [OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | R-01: origin, permissions, source IDs and budgets belong to the controller, never model text. Test hostile pages/images and inert rendering; do not claim perfect injection detection. |
| E-22 | W3C PROV describes derivation and revision relationships. [Provenance primer](https://www.w3.org/TR/prov-primer/) | R-02/R-06: lightweight relational claim/source/derivative records can retain lineage without an ontology server. Provenance records do not establish that a claim is true. |
| E-23 | JSON Patch defines precondition tests and unsuccessful-patch handling; HTTP PATCH adds atomic application. [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902) | R-03: typed graph edits need explicit revision checks and an EA-owned atomic transaction. Do not assume a JSON library provides concurrency safety or expose arbitrary document paths. |
| E-24 | ELK lists routing, model-order and algorithm-specific position constraints. [Layout options](https://eclipse.dev/elk/reference/options.html) | R-03: evaluate established layout components, but independently verify unchanged/pinned coordinates. No blanket claim that every algorithm preserves pins or fits the 4 GB budget. |
| E-25 | Z3 distinguishes satisfiable, unsatisfiable and unknown; a satisfying model supplies a witness. [Basic commands](https://microsoft.github.io/z3guide/docs/logic/basiccommands/) | R-04: bounded declarative branch checks can show example inputs exposing gaps or overlaps. Results concern the formalized assumptions, not real-world workflow safety. |
| E-26 | Z3 defaults include unlimited resource limits/infinite timeouts, with per-solver overrides. [Parameters](https://microsoft.github.io/z3guide/programming/Parameters/) | R-04: set finite limits explicitly, disable payload traces and retain an independent worker watchdog. An unknown/timeout result is never a passed check. |
| E-27 | Linux cgroup v2 documents memory.high throttling, memory.max enforcement with possible temporary overshoot, and memory.pressure. [Kernel documentation](https://cdn.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html) | R-05: probe actual delegated controls, keep supervision outside the worker, and budget headroom. Limits reduce risk; they do not promise a crash-proof host or confer filesystem/network isolation. |
| E-28 | FTS5 deletion can leave old index entries; its secure-delete option costs performance and requires compatible SQLite versions, introduced in 3.42.0. Core secure_delete is separate. [SQLite FTS5](https://sqlite.org/fts5.html) | R-06: test FTS shadow data, database pages and every EA-owned derivative/store. No forensic erasure claim for SSD, swap or external copies; a removed visible row is insufficient evidence. |
| E-29 | TUF specifies trusted metadata, signatures, version/rollback and expiry checks. [Update specification](https://theupdateframework.github.io/specification/latest/) | R-07: use a maintained verifier for publisher bundles; stage explicitly requested updates before activation. Offline verification cannot establish current revocation or that an artifact is the latest. |
| E-30 | Hypothesis state machines generate action sequences and can run invariants after each step. [Stateful tests](https://hypothesis.readthedocs.io/en/latest/stateful.html) | R-08: test revoke/save/cancel/restore races and shared-budget invariants with synthetic content. Generated tests supplement independent oracles and human review, not certify completeness. |
| E-31 | SQLite's cache_size is a per-database page-cache suggestion, not a limit on all process allocations; its built-in cache allocates on demand. [SQLite PRAGMA](https://sqlite.org/pragma.html#pragma_cache_size) | Bound connections, query results, sorts and parser work as well as the page cache. Audit temporary-file behavior; a small cache setting cannot certify the EA memory or temporary-only contract. |
| E-32 | Tesseract recommends selecting segmentation appropriate to a small region and notes that overly tight crops can need borders. [Input quality](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html#page-segmentation-method) | Test bounded GUI crops with enough surrounding text, rather than assuming smaller images always preserve meaning. Account for the source-frame decode and verify labels, negation and target geometry. |
| E-33 | DeepSeek bills its API by tokens; its published terms restrict automated capture/replication of service content. [Pricing](https://api-docs.deepseek.com/quick_start/pricing/) and [terms, section 3.5](https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html) (the terms fetch redirected to the official Korean version). | Reject a website-login relay as the EA foundation: hosted inference also conflicts with the user's local-AI choice. A free chat UI is not a guaranteed free integration API. |
| E-34 | SearXNG has a search API; JSON/CSV/RSS availability is instance-configured and many public instances disable it. Queries pass to external search services. [Search API](https://docs.searxng.org/dev/search_api.html). MediaWiki exposes source-specific search. [API](https://www.mediawiki.org/wiki/API:Search). | Prefer supplied publisher URLs/source APIs for focused research; evaluate a permitted configured SearXNG endpoint for general discovery. Self-hosting costs resources; public-instance availability and terms need testing. Neither route guarantees full-web or unlimited free search. |
| E-35 | The GlobalShortcuts portal provides app-bound sessions, activation events and configurable preferred triggers; returned bindings can be a subset of those requested. [Portal specification](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.GlobalShortcuts.html). | Prefer Super+Shift+8, show the actual desktop binding, ignore autorepeat, and provide remap/click fallback. Portal documentation is not proof that every compositor/keymap supports this binding. |

## Companion And Public Research Decision — 2026-09-19

Current draft: **65 views, 1066 nodes and 1341 connections**; 35 feature families,
39 scenarios, 72 settings, 111 acceptance criteria and 43 pseudocode sections.
There are 35 evidence entries and 19 proposed experiments. These are artifact
counts, not completed implementations or successful feasibility measurements.

Verification on 2026-09-19: all **69 planning checks** in the ten existing
JavaScript test files passed, including three new research/presence/hint checks.
The generated reference agrees with the saved board and flow sources, and the
new view's branch labels pass collision checks. These are analysis checks;
native GUI tests and EA runtime/4 GB experiments were not run for this update.
Human Document Sync review remains pending; no approvals were recorded.

Confirmed user choices: click/Super+Shift+8 toggles EA; opted-in observation keeps
up with permitted active screens while hidden; hints are included with their own
opt-in; the user opens menus. Explicit public-source research is now allowed,
superseding the earlier local/visible-only rule. Screen content and all AI stay
local. The lower sections named Earlier and the dated alignment sweeps are
historical verification records, not approval of today's revisions.

Recommended KISS design: supported accessibility events first, bounded OCR only
where needed and granted, short RAM context, a single supervised local model
worker, and a small inert public-page reader. Separate the public network planner
from private context. Combine private screen context with public evidence locally
only after fetching, without permitting the result to generate another query.

For the first comparison, use the existing Qwen3-0.6B text-model candidate with
llama.cpp and evidence extraction; compare other already-listed small candidates
on the same fixtures. The publisher documents local runtime support and a
thinking-mode control; llama.cpp documents CPU execution and integer quantization.
[Model card](https://huggingface.co/Qwen/Qwen3-0.6B),
[runtime](https://github.com/ggml-org/llama.cpp).
This is a benchmark recommendation, not a chosen best model or a proven fit.
Small models may fail research reasoning; correct citations alone do not prove
their interpretation is right. Source extracts are an honest fallback, not a
substitute for required positive synthesis cases.

Reject the proposed DeepSeek website bot: it requires hosted inference, account
automation and continuing compatibility with a third-party UI. The official API
is billed, and the service's published restrictions cover automated extraction
(E-33). No account login, scraper, dependency download or service was started.

Free-to-use EA with no mandatory paid AI service remains achievable as a design
goal. Its work still consumes CPU/RAM, electricity and internet bandwidth; zero
impact and permanently available free search cannot be guaranteed. Exact public
queries/URLs and normal connection metadata reach recipients even though screen
content and AI processing remain local. General discovery is still a provider
feasibility item: SearXNG is optional infrastructure, not a free hosted entitlement.

## Research-Led Strengthening

R-01..08 refine the existing F-01..32 inventory during open analysis. The user
authorized research and analysis updates, not approval of every default or an EA
implementation. These are recommended contracts pending sign-off; named libraries
are candidates, not selected dependencies. [REFINEMENTS.json](REFINEMENTS.json)
maps each refinement to features, acceptance, scenarios, settings, evidence,
pseudocode and detailed chart nodes. It is an index, not another prose specification.

| Refinement | User Benefit And Proposed Contract | Tradeoff / Evidence Needed |
| --- | --- | --- |
| R-01 Typed, grounded outputs | Separate schema validation, reference validation and factual support. Permit only inert text and typed internal results. A source cannot invent consent, target IDs or another chart job. | Slight validation cost; measure unsupported-schema and hostile-content fixtures, not just JSON success rates. |
| R-02 Evidence-backed casework | Troubleshooting can show goal, symptom, competing hypotheses, supporting/conflicting evidence, one proposed user test, actual reported result and unresolved questions. Exact app/version/label lookup precedes optional semantic search. | This is a proposed presentation of F-02/07/09/15, not autonomous diagnosis. Do not invent probabilities or mark an unperformed test complete. |
| R-03 Selected chart revisions | Typed changes target stable IDs and a base revision. Preview only the requested edit; preserve unrelated text, manual layout, colors and pinned nodes. Accept as one undoable change or reject all. | Full re-layout requires its own explicit request. Measure visual invariants and stale-preview behavior, including edits arriving during review. |
| R-04 Bounded branch analysis | Check pure Boolean/finite-domain guards for overlap, gaps and inconsistent assumptions; show counterexample inputs and bounded path coverage. Never run a depicted action or execute pseudocode. | Formalization can be wrong; user reviews assumptions. UNKNOWN, TIMEOUT and unvisited paths stay visible. Solver and exact limits need 4 GB experiments. |
| R-05 Independent resource supervision | A protected supervisor admits one heavy worker, checks live pressure and cancels hung generation/parsing/layout/solver work without losing the permitted draft. Reuse only current scoped caches. | Requires tested OS enforcement; unavailable protection blocks the affected worker, not a silent unsafe fallback. A 4 GB release still needs positive cases for every feature. |
| R-06 Verifiable forgetting | Track claims, chunks, FTS/vectors, prompt caches, diagrams, undo/history, datasets and owned backups by lineage. Tombstones block reuse immediately; cleanup reports each store separately. | Logical exclusion can succeed before physical cleanup. Interrupted cleanup stays pending; trained weights/external copies have honest limitations. Test canaries in shadow stores, not only search UI. |
| R-07 Trusted artifact lifecycle | Explicit setup/update requests verify artifact identity, provenance and compatibility before staging. Keep a verified last-working version without lowering trusted metadata/version floors. | A hash from the same untrusted file is not authentication. Expired metadata or uncertain clock blocks a new update; existing offline use has a visible stale-status limitation. |
| R-08 Traceability and failure drills | Check that every refinement has a requirement, scenario, setting, flow and source. Test adversarial state transitions; keep semantic document-review flags until a human approves. | Structural consistency is automatable; agreement in meaning and actual EA behavior require separate evidence. |

Priority: first R-01/R-03/R-05/R-06 because incorrect output, lost user work,
memory exhaustion and residual private data can undermine every other feature.
Then R-02/R-04 for stronger assistance and R-07 before distributing artifacts.
R-08 applies throughout. Do not choose a larger model, always-on vision, a separate
vector service or background fine-tuning merely to appear more capable. Compare
small grounded models with deterministic services on the same held-out fixtures.

## Local Model Shortlist

No winner selected. None downloaded or benchmarked in this work. The model names
are candidates for comparative tests, not a requirement to ship all of them.
The exact revision, quantization, tokenizer, runtime support and license bundle
must be recorded; parameter count and file size are not peak runtime RAM.

| Candidate | Evidence / Reason To Test | Caution |
| --- | --- | --- |
| Qwen3-0.6B | Publisher documents text-model thinking/non-thinking controls and local runtime support. [Card](https://huggingface.co/Qwen/Qwen3-0.6B) | Test bounded reasoning modes for each task; do not disable useful reasoning solely to lower latency. |
| Qwen3.5-0.8B | Publisher offers a small vision-language model under Apache-2.0 metadata. [Card](https://huggingface.co/Qwen/Qwen3.5-0.8B) | The card positions this scale for prototyping/task-specific R&D. That is not evidence of reliable general desktop assistance; vision adds cost. |
| Qwen3.5-2B | Publisher provides a larger comparison point with vision-language support and Apache-2.0 metadata. [Card](https://huggingface.co/Qwen/Qwen3.5-2B) | Admit only if measured whole-process memory and quality pass on 4 GB; no high-RAM exception. |
| SmolLM2-1.7B-Instruct | Publisher describes compact on-device-oriented instruction models and Apache-2.0 licensing. [Card](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct) | Compare grounded tasks and abstention, not just published general benchmarks. |
| SmolLM3-3B | Publisher describes a 3B model with selectable extended reasoning and multilingual support. [Card](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | A stretch comparison, not a presumed fit. Reject if any required 4 GB resource/quality gate fails. |

llama.cpp's repository carries an MIT license. That is one distribution input,
not a conclusion that the complete application/model/voice/data bundle meets all
requirements. [Runtime license](https://github.com/ggml-org/llama.cpp/blob/master/LICENSE)

## Quality-First Performance Protocol

1. Freeze versioned public/synthetic fixtures and a held-out test split before tuning.
2. Define independent expected labels, states, formulas, targets, source citations
   and prohibited effects. Score every advertised feature family separately.
3. Reject a candidate/configuration on any approved privacy, external-action,
   target-identity, mathematical-conformance or memory/cancellation gate.
4. Measure solved-task coverage, false confident answers, correct abstentions,
   citation correctness and exact/approximate numerical correctness. Abstention
   counts must not conceal low coverage or an absent feature.
5. Only among passing configurations compare end-to-end p50/p95/max latency,
   first verified useful evidence, complete answer, cold/warm start and energy.
6. Repeat on the named 4 GB profile with representative OS/apps already resident;
   record usable RAM, swap policy, CPU, temperatures, runtime/model hashes,
   context/output budgets and all worker memory, including renderer/OCR/voice.
7. Test caching, short context, quantization and reasoning changes independently.
   Re-run quality/privacy gates after each optimization and model/adapter update.
8. Keep reproducible traces and a regression record. Do not present token streaming,
   an empty loading indicator or a fast wrong answer as "time to help."

Baseline requirements are 4 GB total machine RAM, not 4 GB allocated to EA.
The current proposed 1 GiB EA process-tree ceiling and 512 MiB system reserve
need measurement; each included feature still needs a working in-bounds case.
Use a real representative low-memory machine as acceptance evidence. A constrained
process or VM on a faster host is supplementary, not equivalent CPU/desktop proof.

## Bounded-Memory Engineering Strategy

The 4 GB requirement is a design constraint to engineer toward, not a reason to
remove the promised features. Proposed approach: a small event-driven controller,
specialist services and one loaded heavy stage at a time. The model interprets
questions and explains grounded results; it need not perform exact arithmetic,
redraw the desktop, repeatedly parse every file or remember an entire computer in
its context. WORK is the detailed scheduling flow; RAM/GUARD enforce admission;
QUAL evaluates configurations. This refines existing scope, not a new feature.

| Work | Proposed Saving | Required Invariant |
| --- | --- | --- |
| Known labels, rule numbers and errors | Structured UI reads, literal matching and scoped FTS before optional semantic retrieval | Match exact identity/version; gather all required matches for a broad request. A fast path must satisfy the same result contract. |
| Files and conversation | Stream bounded chunks; keep a small working set of cited evidence and eligible conversation state | Preserve clause boundaries, exceptions, units, revisions and unread ranges. No summary can replace an exact quote or erase an unresolved question. |
| Screen interpretation | Reuse current accessibility/DOM facts; OCR only a permitted region with a real evidence gap | No continuous full-screen vision by default. Crop transforms and decode peaks count; icon-only/unsupported interfaces still need positive tests. |
| Math, logic and graphing | Use typed specialist engines; compute in bounded stages and render only the needed viewport detail | Lower drawing density is not lower numerical precision. Validate discontinuities, ranges and target identity. |
| Model inference | Test compact quantized models, prompt packing, smaller prefill batches, thread counts and supported KV formats independently | No blanket removal of useful reasoning. Short context must retain required evidence or stage a bounded continuation; no automatic second model. |
| Module residency | Load providers on demand; release OCR before model, model before speech, and completed parser scratch before layout | At most one heavy worker; include IPC copies, loader peaks, retained weights and handoff results. Disabled modules do not run background work. |
| Repeated work | Cache exact eligible stage results keyed by operation, inputs, artifact/schema versions and live source/policy state | Stale, denied, expired or forgotten data is a miss. Collection-off data stays temporary; no disk spill or retention upgrade for speed. |
| Idle time | Event-driven UI, bounded observation coalescing and proposed zero-second model warm lifetime | No inference or capture polling with observation/extras off. Foreground help takes priority; cache warmth never extends consent. |

These are EA engineering proposals inferred from the evidence, not published
EA performance results. The benchmark tool exposes thread, batch, context-depth
and KV-format comparisons, but excludes application overhead such as tokenization
and sampling; pin the tested revision. [llama-bench](https://github.com/ggml-org/llama.cpp/blob/master/tools/llama-bench/README.md)
SQLite cache tuning and cropped OCR have separate limits, recorded in E-31/32.

### Initial Allocation Experiment

Subdivide the existing proposed 1024 MiB process-tree ceiling for an experiment.
These allocations are targets, not measured component sizes or approved defaults.
The existing <=150 MiB idle acceptance proposal remains an outer target; this
experiment tries a tighter 128 MiB resident-core envelope under active work.

| Allocation | MiB | Includes |
| --- | --- | --- |
| Resident core | 128 | UI, supervision, renderer bookkeeping, bounded database page caches and core libraries |
| Shared working set | 16 | Handoff payloads, transient evidence, bounded queues/frontier/dedup IDs and previews; the 8 MiB per-task extracted-text proposal is a sublimit, not extra memory |
| One heavy stage | 768 | Provider/runtime, charged weight pages, KV state, tokenizer, prefill/scratch, decoder frames and worker-owned copies |
| Unallocated margin | 112 | Overshoot and estimation error; never a second worker allowance |

`128 + 16 + 768 + 112 = 1024 MiB`. Shared pages are attributed consistently,
not counted twice across PSS and cgroup totals; distinct copies count separately.
Do not add the full measured stage peak to its already-included weights again.
Any memory outside these buckets, including graphics/system allocations affected
by capture or rendering, still appears in the whole-system trace. A failed bucket
is evidence to optimize or rebalance the proposal within the existing ceiling,
not permission to hide allocations. Decompression and full-frame capture peaks
must be preflighted even when the retained crop is tiny.

Admission separately checks the EA ceiling and **current available system memory
minus the system reserve against the additional allocation**. Already-resident EA
memory is reflected in available memory and is not subtracted a second time.
The proposed 512 MiB OS/app reserve is outside the EA ceiling; other applications
keep the remaining capacity. A 4 GB machine does not donate all its RAM to EA.
Account for anonymous/file/shared/kernel categories and swap/pressure without
summing overlapping counters. [Kernel memory accounting](https://docs.kernel.org/admin-guide/cgroup-v2.html#memory)
Memory mapping, file compression and OS reclaim are not a promise that weights
cost zero RAM. No swap-setting changes or external-app termination by ZI.

### P-17 Optimization Experiments

Declare a finite candidate list and engineering time budget before tuning. First
record an unoptimized development baseline; change one factor per comparison.
After development tuning, freeze the candidate and run untouched, source-separated
held-out cases. Retain failed configurations and traces. Compare a combined
optimized candidate again: individual wins can interact badly.

| Trial | Comparison / Fixture | Evidence To Keep |
| --- | --- | --- |
| Exact fast path | Known menu label and rule number; broad query with several matches and an exception on the next page | Model/provider launch counts, first verified result, complete coverage and independent answers. Exact eligible tasks should not need inference. |
| Bounded streaming | Same synthetic corpus at 16/64 MiB; late match, duplicate aliases, compressed expansion and unread sections | Peak working set, bytes/entries visited, gaps, cancellation and denied-write spies. More source bytes must not produce a hidden full-corpus RAM list. |
| Targeted OCR | Whole permitted fixture versus bounded crops; small text, negation, adjacent labels, icon-only controls and crop-edge clauses | Decode plus OCR peak, exact text/target quality, geometry and p95 latency. An incorrectly cropped fast result fails. |
| Inference knobs | Baseline versus weight quantization, then batch size, then thread count, then supported KV precision, then evidence packing | Full-process peak, prompt/generation timings, grounded correctness and abstention. Do not change several knobs and attribute the win to one. |
| Worker handoffs | ASR -> read/OCR -> model -> validated result -> TTS; separately parse -> math -> plot and chart -> layout | Owned-process timeline and actual residency: no heavy overlap, timely release, bounded intermediates and responsive Stop. |
| Cold/cache behavior | Restart, repeated request, edited source, changed scope, forgotten source and expired cache | Cold/OS-page-cache-warm/application-cache-warm timings separately, cache invalidation and zero forbidden persistence. Do not drop the host's caches or alter swap for a cosmetic benchmark. |
| Combined quality | Every included feature plus realistic browser/desktop pressure on the named 4 GB profile | Positive coverage, exact accuracy gates, UI latency, p50/p95/max completion, energy when measurable, failures and reproducible versions/workload. |

The first engineering deliverable is a per-stage cost table from a small vertical
slice, not another feature proposal: a question about an approved local manual,
an exact clause lookup, one screenshot/OCR gap, a grounded explanation and a
current-target circle. Follow with the speech, calculator and chart handoffs.
Performance traces use synthetic/public fixtures and contain no private payloads.
P-17 is planned and unrun; there is no claimed speedup factor or model winner.

## What Was Actually Checked Locally

Read-only hardware inspection found a development host with an Intel i7-12650H
and 15,604 MiB reported total RAM. `llama-bench` was not found on PATH. These facts
do not establish the availability of all runtimes elsewhere and are not a model
benchmark. No personal files outside the EA analysis workspace were indexed;
no models, browser bridges, screen readers or observation services were installed.

Existing Archi tests validate the planning tool and document structure, not EA.
All model timing, complete 4 GB feature runs, real-browser permission checks,
mixed-monitor pointing, speech accuracy and cross-platform claims remain unmeasured.

## Recommended Investigation Order

| Spike | Evidence To Produce | Release/Freeze Risk |
| --- | --- | --- |
| P-01 | One Qt fixture, one GTK fixture and two browser implementations: current labels, menus, origins/frames, denied sources | Read-only coverage and trustworthy identity |
| P-02 | Independent moving/mixed-scale display target fixture with actual compositor captures | Correct screen circles without guessed mapping |
| P-03 | Offline math conformance and bounded 3D/ODE/CSV workload on 4 GB | Full calculator availability and numerical correctness |
| P-04 | Shortlisted models on identical grounded-help fixtures with cold/warm full-process measurements | Small-model reasoning/abstention versus latency |
| P-05 | Deletion/revocation canaries through RAM, database, FTS/vectors, exports/backups and adapters | Data lifecycle and honest unlearning limitations |
| P-06 | Speech plus animation plus foreground/background scheduling, serial worker policy | All features remain usable on 4 GB |
| P-07 | Keyboard/touch/screen-reader settings and help; failed-save/import/reset fixtures | Understandable consent and actual-state reporting |
| P-08 | macOS/Windows permission/overlay probes and complete distribution inventory | Already-declared platform/license obligations |
| P-09 | Embedded Archi host/diagram round-trip on 4 GB; adversarial repeated/nested chart generation; cancellation and retention canaries through undo/autosave/export | New F-32 internal-workspace direction; finite parent budgets must be enforced outside the model |
| P-10 | Schema conversion plus independent validation; stale/fabricated source IDs and hostile page/image content; counterexample casework fixtures | R-01/R-02: structure and citations alone do not prove factual support |
| P-11 | Selected patch/pin invariants, bounded branch checks and independent watchdog under parser/layout/solver hangs | R-03/R-04/R-05: no loss of user edits, false proofs or hidden infinite work |
| P-12 | FTS residual canaries, interrupted cleanup/restore, forged/expired update bundles and stateful revoke/save races | R-06/R-07/R-08: deletion, artifact integrity and policy ordering |
| P-13 | Synthetic approved/denied roots, traversal and extraction traps, local visible sports fixtures and multi-turn correction/expiry on 4 GB | SC-30..33: discovery, extraction and eligible conversation; P-19 adds public research, query privacy and hidden-panel behavior |
| P-14 | Standard/Minimal/Custom profile round-trips and disabled-worker spies; invalid schema/dependency/theme/rollback cases; mixed-monitor annotation geometry, click-through, edit/undo, Hide All and expiry on 4 GB | F-33/F-35: actual customization, accessibility and non-stuck screen layers without imported authority or memory overruns |
| P-15 | Exact code/JSON/CSV/newline fixtures, inert parser isolation, repetitive generation, stale preview, safe new-file exports and clipboard-owner races; everyday recipes under parent limits | F-34: useful format-specific drafts, honest untested status and explicit transfers, not hidden execution or infinite repair |
| P-16 | Keyboard-accessible dataset review/export, source-grouped held-out fixtures, bad/revoked examples, exact adapter compatibility and independent 4 GB inference comparison; human peace/respect rubric | F-23/F-22: understandable learning without trainer launch, test leakage, false unlearning or coercive support; actual training remains user-run outside ZI |
| P-17 | Baseline, isolated optimization trials, measured stage memory table and combined held-out regression on the named 4 GB profile; see the bounded-memory strategy above | EA-OPT-01..04: preserve full capability/accuracy, prove real release between stages, avoid cache/streaming privacy regressions and distinguish useful speed from missing work |
| P-18 | Synthetic two-user style/knowledge/adapter canaries; A-to-B-to-A switches during generation, review, save and speech; collection-off style review; unknown identity and failed isolation; human humor/no-jokes comparisons with equal evidence on 4 GB | EA-PERSONA-02..05: useful situational wit, distinct private styles, unchanged facts, no extra joke jobs or pooled training; establish actual authentication/storage support rather than trusting a profile name |
| P-19 | Hidden-panel observation, shortcut conflicts, hints and explicit public-source research with isolated local AI on a named 4 GB host | EA-PRESENCE-01, EA-RESEARCH-01/02; positive sourced answers, bounded resources, no private-context egress and honest provider limitations |

No spike may acquire real private content by default or bypass a permission to
collect evidence. Where a capability cannot be established, retain the blocker;
do not silently downgrade the end-state scope, 4 GB requirement or quality gates.

### P-19 Companion And Public Research Feasibility

Not run. Use a named physical 4 GB total-RAM system with declared CPU, desktop,
keymap, apps and browser workload. Compare observation off, hidden structured
observation, admitted OCR, local hints and explicit multi-source research. Measure
complete-process-tree peak memory, model load, CPU/energy, dropped/covered events,
time to supported answer, cancellation and host input/redraw latency against the
same workload without EA. Apply existing quality/resource gates; numeric defaults
are not measured promises. A low-cost refusal alone does not pass.

Test exact citation support, primary-source conflicts, query privacy canaries,
screen-to-query separation, permitted public destinations, redirects/DNS changes,
compressed/decoded limits, denial/throttling, source expiry and hidden completion.
Compare direct publisher URLs, source-specific APIs and a permitted SearXNG
endpoint. Record availability and coverage separately from local-model accuracy.
Choose the smallest configuration meeting all positive cases; disclose a blocker
if none does. No silent scope cut or cloud fallback.

## Earlier Planning Checks

The prior end-state analysis pass expanded the saved board to 44 views, 706 nodes and 882
connections. The original node positions/sizes/colors, connection routes, viewports,
active view and #CAFFEE background were preserved. All 44 views rendered in the
native Qt test harness; the journey and settings charts were visually inspected.

The 7 diagram/reference checks and 6 inventory/traceability checks passed. Native
Archi reported 20 passing tests; Document Sync reported 11 passing tests. Those
counts include each native suite's setup/cleanup cases. Ten linked documents
remained correctly marked for initial human review, with no I/O errors or fabricated
sign-off. These results validate planning artifacts/tool behavior, not EA features,
model accuracy, local voice, real screen pointing or 4 GB performance.

## Local Archi Evidence For F-32

Read-only inspection of the actual local Archi source, not an unrelated product
with a similar name, found editable JSON projects and revision-checked ordinary
saves in `/home/ethan/archi/qml/ProjectWorkspace.qml` (`loadDocument` and
`saveDocument`). `/home/ethan/archi/qml/WorkflowChecks.js` checks graph structure
and explicitly does not establish semantic correctness. Cycles are review items,
not automatically invalid workflows. These are useful existing components.

Inference for EA: evaluate reusing the canvas, editing and structural-check
components inside the EA host, with EA owning policy, source provenance and
bounded generation. Existing standalone autosave/recovery behavior is not proof
of a privacy-safe embedded mode; collection-off drafts must not leak through it.
No EA embedding, generation controller, component license manifest or 4 GB
integration benchmark has been implemented or verified by this source inspection.

The preceding F-32 analysis update contained 45 views, 733 nodes and 923 connections.
Seven diagram/reference checks and nine analysis/traceability checks pass;
native Archi and sync suites pass with 20 and 11 reported cases respectively.
All 45 views rendered, including the visually inspected Embedded Archi flow.
These checks validate the saved planning artifact, not a running generation
controller or a completed embedded EA feature. Its watchdog, stopping rules,
privacy behavior and 4 GB feasibility still require implementation and runtime tests.

## Earlier Research Refinement Verification

The preceding research pass contained **53 views, 841 nodes and 1047 connections**.
R-01..08 add eight detailed views, 108 nodes, eight composite scenarios and two
setting groups. Totals at that pass: 32 feature families, 29 scenarios, 53 setting
groups and 30 evidence-ledger entries. The 11 new primary-source entries record
source facts separately from EA recommendations and required experiments.

The 7 diagram/reference, 9 analysis and 6 refinement checks pass (22 total),
including negative mutations for dangling links, stale node semantics and false
verification status. Native Archi reports 20 passing cases and Document Sync 11;
native counts include setup/cleanup. All 53 views rendered, and all eight new
views were visually inspected. Every original node's position/size/color, existing
connection route, saved viewport, active view and #CAFFEE background was preserved.
The pre-research saved board is retained in assistant-before-research-strengthening.archi.json.

Twelve linked Markdown documents correctly remain marked for initial human
review, with no I/O errors or fabricated approvals. JSON/source cross-references
are checked by analysis tests, not native Markdown-only sync. These results
validate the planning artifacts and existing Archi tool, not an implemented EA
supervisor, solver integration, model, deletion engine or trusted updater. No new
dependencies/models were installed and no 4 GB EA runtime claims were measured.

## Earlier Computer Research And Conversation Verification

The preceding analysis specified **56 views, 895 nodes and 1115 connections**.
Three flows add 54 nodes; SC-30..33 bring the scenario count to 33, and S-54..57
bring setting groups to 57. That pass kept the feature inventory at 32 families and the
research ledger remains 30 entries. These additions record confirmed user needs,
not new external research findings. Current sports/rule help is limited to
approved local files and visible apps/pages; runtime networking stays disabled.

P-13 is a planned, unrun feasibility experiment. No actual computer-wide discovery,
document extraction, conversation-memory service or EA runtime has been built or
started. Search/question caps and all positive 4 GB cases remain unmeasured.
The 7 diagram/reference, 9 analysis, 6 refinement and 4 conversation checks pass
(26 total). They check source/saved/reference agreement, finite search/question
paths, current-information boundaries and traceable acceptance contracts. Native
Archi reports 20 passing cases and Document Sync 11; native totals include
setup/cleanup. All 56 views rendered, and the three new views were visually
inspected. These are artifact/tool checks, not EA runtime acceptance results.

Comparison with assistant-before-conversation-search.archi.json confirms all 53
preceding views' 841 node positions/sizes/colors, all original arrows/routes and
saved viewports remain unchanged. The active presence view and #CAFFEE background
are preserved. Twelve linked documents remain correctly marked for initial human
review, with no I/O errors or fabricated approvals. No new dependencies/models
were installed, no user files were indexed, and analysis remains open and unsigned.

## Earlier Customization And Creation Record

That draft specified **61 views, 976 nodes and 1227 connections**: five
new flows and 81 nodes. Totals were 35 proposed feature families, 38
scenarios and 70 setting groups. F-33..35 expose the customization/code/annotation
expansion explicitly before freeze. The existing 30-entry evidence ledger and
eight research refinements are unchanged; these additions come from user direction
and analysis, not newly claimed external research conclusions.

User-confirmed: peace/love/respect as core values, deep customization with defaults,
requested internal code/text/screen-object creation, and guided export/import with
actual training in a separately launched self-hosted tool. Numeric defaults,
specific formats/providers and all P-14..16 outcomes remain unmeasured proposals.
No EA assistant, training job, observation service or model was started/installed.

The supplied [GitHub repository](https://github.com/Ethan-da-Tech-Wizard/ea) was
checked read-only through its [contents API](https://api.github.com/repos/Ethan-da-Tech-Wizard/ea/contents),
which reported an empty repository. At that review, the local directory had no Git
metadata; no commit, remote write or publication was performed. No existing remote source
implementation or license was assumed. KARL remains uninspected and unchanged.

The 7 diagram/reference, 9 analysis, 6 refinement, 4 conversation and 5 customization
checks pass (31 total). They cover references, source/saved semantics, profile
gates, annotation lifetime, shared generation limits, explicit transfers, external
training and the supportive-presentation contract. These are specification tests,
not proof of runtime safety, correctness, trained improvement or complete semantic
agreement. Human review and the 4 GB feasibility experiments remain outstanding.

Native Archi reports 20 passing cases and Document Sync 11; native counts include
setup/cleanup. All 61 views rendered, and the five new views were visually
inspected. Comparison against assistant-before-customization.archi.json confirms
all prior 56 views' 895 node positions/sizes/colors, arrows/routes and viewports
were preserved, along with the active presence view and #CAFFEE background.
Twelve linked Markdown documents still need initial human review, with no I/O
errors or fabricated approvals. No EA service, model, trainer or dependency was
installed and no content was published to the supplied GitHub repository.

## Earlier Optimization Analysis Record

That draft specified **62 views, 1002 nodes and 1259 connections**. WORK
adds 26 single-operation/predicate nodes to detail bounded staged work. The
inventory stays at 35 feature families, 38 scenarios and 70 setting groups.
EA-OPT-01..04 and P-17 refine existing 4 GB, correctness and privacy requirements.
The evidence ledger now has 32 entries; the eight R refinements are unchanged.

Primary-source review for this update covered llama-bench, SQLite cache semantics,
Tesseract regional input and kernel memory accounting. Candidate strategies and
the illustrative allocation split are still proposals. No model, EA runtime,
training job or new dependency was installed; no 4 GB performance run occurred.

Verification: 7 diagram/reference, 9 analysis, 6 refinement, 4 conversation,
5 customization and 5 optimization checks pass (36 total). These check analysis
contracts, traceability and source/saved/reference agreement, not implemented
worker behavior or measured optimization gains. The native render-all-views test
passed (3 reported cases including setup/cleanup); all 62 views rendered, and
the new WORK view was visually inspected. Document Sync's 11 reported cases pass.

Comparison with assistant-before-optimization.archi.json confirms the original
61 views' 976 nodes retain positions, sizes and colors, with all original arrows,
routes and saved viewports preserved. The active presence view and #CAFFEE
background are unchanged. Twelve linked documents still require human review;
the native status check has no I/O errors and no approvals were fabricated.

## Earlier Personal Companion Analysis Record

Updated 2026-09-17. The current draft specifies **64 views, 1035 nodes and 1300 connections**.
TONE/OWNER add 33 atomic nodes for reviewed mannerisms and user-session isolation.
There are 35 feature families, 39 scenarios and 72 setting groups. These refinements
come from confirmed user direction, not new empirical research. The evidence
ledger remains 32 entries and R-01..08 are unchanged.

Confirmed: funny, familiar, practical on-request help; no generic social check-ins;
separate profiles only. No blending of private styles/opinions or pooled training.
Proposed engineering approach: compact owner-scoped preferences and an unchanged
common base artifact, with owner-bound optional adapters and fresh session epochs.
No automatic weight training, new inference pass just for humor or model download.
The 16-field/4 KiB active-style envelope and humor/profanity defaults need review.

P-18 is planned and unrun. Its human evaluation must separate task usefulness,
timing, style fit and factual correctness; engagement or attachment is not the
success metric. Compare the same evidence across humor/serious and different-user
conditions. Technical tests need private canaries in every relevant store/channel,
not just a check that two screenshots look different. Same-OS-account identity
and storage isolation require a tested mechanism; a name selector does not suffice.
No EA, multi-user service, learning worker or training job has been implemented.

Verification: all 41 planning checks pass (7 diagram/reference, 9 analysis,
6 refinement, 4 conversation, 5 customization, 5 optimization and 5 personality).
They verify links, saved/source/reference agreement and specified gates, not
runtime authentication, humor quality, isolation or model behavior. The native
render-all test passed with 3 reported cases including setup/cleanup; all 64 views
rendered and both new views were visually inspected. Document Sync reports 11
passing cases including setup/cleanup.

Comparison against assistant-before-personality.archi.json preserves all previous
62 views' 1002 node positions/sizes/colors, original arrows/routes and viewports.
The active presence view and #CAFFEE background remain unchanged. Twelve linked
documents still need human review, with no status-check I/O errors or invented
approvals. No runtime service, model, trainer, dependency or remote publication
was added by this analysis update.

## Whole-Analysis Alignment Record

Audited 2026-09-17. The current draft retains **64 views, 1035 nodes and 1300 connections**,
35 feature families, 39 scenarios and 72 setting groups. There are 108 acceptance
criteria, 42 pseudocode sections, 32 evidence entries and 18 proposed experiments.
ALIGNMENT.json maps all of them through 20 sectors, with reciprocal inventory and
scenario links. Thirteen current Markdown documents are linked in native sync.
The report in ALIGNMENT.md distinguishes structural coverage from open decisions,
human semantic review and unimplemented behavior. No new external research or
model/version verification was performed by this alignment audit.

The audit corrected the stale F-32 freeze endpoint, missing scenario backlinks,
older training/export wording, registry/menu defaults, pre-acquisition protection,
owner-scoped access/locked publication, automatic-compaction-retry ambiguity,
parent-budget renewal and a heavy-worker wait. Existing diagrams were reconciled
with the source and reference; no new EA feature or runtime was introduced.

Verification: all 49 planning checks pass: 7 diagram/reference, 9 analysis,
6 refinement, 4 conversation, 5 customization, 5 optimization, 5 personality and
8 whole-alignment checks. Negative cases deliberately break coverage, reciprocal
links, definitions, saved semantics and verification status. Native Archi reports
20 passing cases, including rendering all 64 views; Document Sync reports 11
passing cases. Native totals include setup/cleanup. The separate existing math
worker suite reports 3 passing tests. Policy, freeze, export routing, inference,
continuation and owner-boundary renders were visually inspected.

Comparison against assistant-before-alignment-audit.archi.json confirms all 1035
nodes retain IDs, order, positions, sizes and colors; all 1300 connections/routes,
saved viewports, active presence view and #CAFFEE background remain unchanged.
Native sync returns review-needed, with 13 unreviewed documents, no I/O errors
and no fabricated approval. Earlier snapshots and historical test records remain
historical. No model, dependency, observer, trainer or EA runtime was installed,
and nothing was published. Every EA feasibility experiment remains unrun.

## Second Alignment Sweep

Audited 2026-09-17 after the user requested another full pass. Inventory remains
35 feature families, 39 scenarios, 72 setting groups, 108 acceptance criteria,
42 pseudocode sections, 32 evidence entries and 18 proposed experiments. The saved
board retains 64 views, 1035 nodes and 1300 connections. No new feature was added.

Ten new contract checks were run against the preceding draft: all ten failed.
The sweep repaired missing typed help/voice result handoff, premature presentation
cleanup, source-based internal-tool dispatch, graph input replacement and worker
release, deletion closure outside the transaction, unbounded menu bookkeeping,
and dataset destination/commit guards. Graph and marker sessions return bounded
handles without keeping the help caller blocked until dismissal. No handoff
renews authority, source lifetime, retention eligibility or the parent ledger.

The version-2 alignment index names exact acceptance IDs, not family wildcards.
Five previously uncited criteria gained concrete scenario variants; 25 scenarios
gained missing detailed-flow lists. Checker mutations now detect an unindexed
criterion within an existing family, missing scenario coverage, malformed IDs or
indexes, invalid edge endpoints, changed entry order and duplicate shape identities.
Existing valid compact references and cosmetic layout edits remain supported.

Final verification: 59 planning checks passed when run through the nine individual
commands documented in README.md: 7 diagram/reference, 9 analysis, 6 refinement,
4 conversation, 5 customization, 5 optimization, 5 personality, 8 whole-alignment
and 10 contract checks. These are static planning/traceability tests, not executed
EA scenarios. Native Archi reports 20 passing cases, including all 64 rendered
views; Document Sync reports 11; the existing standalone math suite reports 3.
Native totals include setup/cleanup. Overview, capability, plotting, deletion and
dataset-export renders were visually inspected for readable labels and layout.

Compared against assistant-before-second-sweep.archi.json, all node IDs/order,
positions/sizes/colors, connection routes, saved view metadata, active presence
view and #CAFFEE background are preserved. Three-way reconciliation checked for
concurrent semantic edits before applying saved-board/reference patches; final
file hashes matched. Sync reports 13 unreviewed documents and zero file errors;
no human approvals were fabricated. The backup and prior audit records remain
historical. ALIGNMENT.md lists remaining analysis gates and verification limits.

This sweep did not inspect KARL or the remote repository, install dependencies,
start an observer/trainer/model, perform new external research, build EA or publish
anything. Semantic completeness and runtime correctness are not guaranteed by
these tests. Human sign-off and all EA feasibility experiments remain outstanding.

## Third Alignment Sweep

Audited 2026-09-17. The unchanged inventory has 35 feature families, 39 scenarios,
72 setting groups, 108 acceptance criteria, 42 pseudocode sections, 32 evidence
entries and 18 proposed experiments. The saved board retains 64 views, 1035 nodes
and 1300 connections. This is analysis/tooling work, not an EA runtime release.

The prior 59 planning checks passed as a baseline. Seven new cross-sector checks
then failed on that draft before repairs. The cache contract now intersects
original evidence/source-use expiry without renewal and atomically accounts for
global/task totals, metadata, replacement deltas and still-live evicted handles.
Read consent, working-data expiry and approved durable retention are distinct;
the saved-data path respects source retention without extending cache/read bounds.

Voice now binds its task before capture, closes the microphone before ASR/waits,
and preserves the same owner/deadline/budget through confirmation and help. Typed
and voice requests share optional spoken delivery; typed output needs no mic
grant. Speech failure cannot rerun help or repeat a memory/settings operation.
Those operations use existing controllers and separate exact-scope confirmation.
The already-present SC-14 calculator/deletion cases gained their missing feature
backlinks; no additional capability was introduced.

Worker cleanup now covers configuration and partial-launch failures, tracks the
owned launch group, detaches bounded output into charged parent storage before
reaping and rechecks it afterward. Unresolved shutdown/residency quarantines the
slot instead of admitting overlapping heavy work. These remain proposed contracts.

Archi reference generation and comparison share a canonical renderer; comparison
checks complete blocks, transitions and detail links, not mere inclusion of the
expected text. Mutation tests add instructions/edges/duplicate blocks while
retaining old text. Checks also cover shape meaning, unreachable nodes/no terminal
path, malformed nested inputs and domain-named setting ownership. S-28 angle mode
was incorrectly indexed under desktop and is now in mathematics. Structural
reachability is not a proof of execution, termination or semantic completeness.

Verification: all 66 planning checks passed across ten documented suites. Native
Archi reports 20 passing cases including all 64 rendered views; sync reports 11;
the existing standalone math suite reports 3. Native totals include setup/cleanup.
Voice and resource-supervisor renders were visually inspected. Comparing with
assistant-before-third-sweep.archi.json confirms unchanged IDs/order, geometry,
colors, connection routes, saved view metadata, active presence view and #CAFFEE.
Three-way saved-board/reference reconciliation checked concurrent edits and final
hashes. Historical snapshots and earlier audit results remain historical.

No EA model, observer, trainer or dependencies were installed; no remote research,
KARL inspection, publication or EA feasibility experiment was performed. All 13
current documents still require human sync review; file checks report no errors
and no approval was fabricated. Defaults, detailed scope decisions, exact platform
and format support, licensing, identity protection and positive 4 GB measurements
remain open gates. Passing these artifact checks does not close them.
