# EA ZI: Capability Catalogue

Analysis draft, not an implemented assistant. This expands the intended product,
not the set of capabilities already demonstrated. A complete assistant is a
coherent set of finished workflows, not unlimited access or a claim to know
everything. See ACCEPTANCE.md for proposed release evidence.

END-STATE.md now defines the complete proposed inventory F-01..35 and the
feature-freeze contract. Every included ZI feature must work locally on 4 GB
total RAM. All candidates below must be included or excluded before sign-off;
none remain an unspecified feature to add during design or implementation.

## Product Structure

1. Understand the user's intent and clarify ambiguous references, or consume an event covered by an explicitly enabled background-observation policy.
2. Select a supported internal service under an explicit task and resource budget.
3. Read only task-relevant sources within the user's grants, when reading is needed.
4. Use specialist tools for calculations and verified evidence for software guidance.
5. Explain the result, limits, source references, and next user-controlled step.

Explicit mathematical input needs no screen capture. A question about another
app does not authorize opening every file the account can read. A planned
feature must be identified as unavailable until implemented and accepted.

## Confirmed Additions To ZI's Intended Scope

### Free Graphing Calculator

The requested direction is a fully equipped graphing calculator inside EA,
not merely a chatbot that guesses arithmetic. The following 2D feature inventory
is proposed for scope review; individual priorities and supported domains remain
subject to approval. Basic calculation and plotting must work without an LLM.

| Area | Proposed Capabilities | Boundaries |
| --- | --- | --- |
| Expressions | Multiple named expressions, constants, variables, exact fractions, powers, roots, trig/log functions, complex arithmetic | Published grammar; explicit real/complex domain; no arbitrary code |
| Algebra | Simplify, expand, factor, solve equations and supported systems, inequalities | State assumptions, domains, excluded solutions, incomplete/unevaluated results |
| Calculus | Derivatives, integrals, limits, numerical approximations | Label exact versus approximate results and numerical tolerance |
| Graph modes | Cartesian functions, implicit relations, inequalities, polar and parametric curves | Supported grammar and domains documented per mode |
| Graph controls | Axes, grid, bounds, pan/zoom/reset, expression visibility/style, parameter sliders | Stable viewport; bounded work; no plotting of unvalidated model text |
| Inspection | Trace coordinates, roots, intersections, extrema, slopes, bounded area | Report search interval and tolerance; never claim all roots from a finite sampled view |
| Data | Tables, scatter plots, descriptive statistics, supported regression fits | User-selected data; show units, missing-value rules, residuals, and fit limitations |
| Linear algebra | Vectors and matrices, determinants, inverse, eigenvalues | Dimension checks, singularity errors, bounded matrix sizes |
| Units | Compatible-unit conversion, dimensional checks, angle modes | No silent degree/radian change; live exchange rates are not offline constants |
| Workbooks | Editable expressions, undo/redo, explicitly saved sessions, selected image/data export | Unsaved work is temporary; observed source data retains its original privacy restrictions |
| Accessibility | Keyboard-operable controls, readable formulas, text/table alternative to plots | Meaning is not conveyed by color or speech alone |

F-13 proposes bounded 3D surfaces/parametric curves and supported ODE initial-value
problems alongside matrices, probability, statistics and regression. These need
explicit pre-freeze approval, supported domains and positive 4 GB cases (SC-07).
General proof assistants and specialized simulation suites are proposed exclusions,
not an implicit part of "full calculator." No feature is claimed implemented.

Use established symbolic/numerical and plotting engines. The LLM can translate
or explain, but the engine owns the numerical result. A translated expression
must be shown with its assumptions before ambiguous input is evaluated.
Engine choice and maximum expression/matrix/sample sizes are design/benchmark
decisions, not fixed by this catalogue. SymPy is a candidate, not the entire
calculator UI; its documented plotting interfaces demonstrate existing domain
machinery we can evaluate rather than invent. See the
[SymPy plotting documentation](https://docs.sympy.org/latest/modules/plotting.html).

### Precise Screen Pointing

EA can be asked to circle the visible object it is referring to. This is an
EA-owned, noninteractive overlay, not an application click. Each target needs
evidence of its identity, current bounds, coordinate space, and source revision.

The placement contract includes:

- Monitor identity, origin, rotation, and the current desktop layout.
- Device-independent coordinates versus capture/device pixels and crop offsets.
- Window/client-area origins, scroll/layout revisions, and any adapter-specific
  content transforms, including browser zoom when it is not already reflected.
- Per-monitor scale and the overlay surface's coordinate system, applied once.
- Current app/window/control identity, visibility, clipping, and occlusion.

Resolution alone is insufficient. Qt, for example, distinguishes logical
geometry from raster image pixels and documents gaps in some mixed-DPI desktop
layouts. Adapter transforms must be tested instead of assuming a universal
scale factor. See [Qt high-DPI coordinate systems](https://doc.qt.io/qt-6/highdpi.html).

When a window moves, a menu closes, the display layout changes, the target is
covered, or the permission expires, hide the old marker before resolving again.
An ambiguous target must produce a question or a list of candidates, not an
authoritative circle around a guess. If the compositor cannot provide reliable
overlay placement, explain the limitation and show a permitted labelled crop
or literal control path instead. Never bypass protected screens.

### Computer-Wide Search, Extraction And Conversation

Confirmed additions refine F-02/05/07/09/17; they are not a separate execution
agent. This is analysis, not an implemented scanner or a claim to decode every
file type. SC-30..33 and EA-SEEK/EXTRACT/TALK/CURRENT define pass/fail cases.

| Capability | User Outcome | Required Boundary |
| --- | --- | --- |
| Permission-scoped discovery | Find relevant content across reviewed local roots, including files with unhelpful names | No default whole-home scan, protected-file inventory, administrator access, link escape, unapproved mounts or special-file reads |
| Fast or thorough search | Prioritized useful matches or a bounded systematic pass, with actual coverage | Stream supported content; unsupported/encrypted/corrupt/changing files stay visible gaps; no false all-files claim |
| Readable extraction | Exact relevant excerpts, explanations, tables and comparisons | Preserve document/edition, literal rule IDs, page/row/range, qualifiers and units; original files stay unchanged |
| Focused clarification | Meaningful choices or free text, Skip/Cancel, explicit answer | Ask only when it changes the answer/scope; no fabricated options, default submission, implied grant or repeated-question loop |
| Conversation continuity | Keep goals, entities, attributed reports, corrections and unresolved questions | Bounded eligible context; source expiry/deletion applies to summaries/history; saved threads require explicit policy, never automatic training |
| Current information and public research | Explain visible/local evidence or fetch public sources for an explicit word/question | Confirmed: public sources allowed; screen content and AI stay local. Public-query preview, finite reads, citations and honest gaps; no cloud fallback or background feed |

Proposed search ceilings are 60 active seconds, 10000 visited entries and 64 MiB
source bytes per pass, including traversal, decoding, ranking and extraction.
Queues, identity sets and results share existing cache/RAM limits. Parent limits
can tighten these; no child can renew them. Another pass requires an explicit
request and revalidated scope. These defaults are unmeasured, not approved targets.

Proposed clarification limit: three rounds per task, one focused question each.
Waiting releases heavy workers and stops fresh source reads. A saved conversation
cannot restore grants or rescue expired content. Clear Topic, Correct Fact and
Forget Saved Conversation are distinct controls; neither a summary nor a vector
trains weights. Current facts need actual evidence, not model recall. Selecting
the exact file formats, languages and coverage guarantees remains a freeze gate;
this direction does not silently include every office/archive/video parser.

### Complete Customization With A Useful Default

F-33 adds explicit Standard/Minimal/Custom composition, named profiles, individual
module/provider controls and a versioned advanced configuration editor. GUI/help
and configuration use one declarative schema. Preview effective values, reasons,
dependencies, source grants, resource costs and changes before activation. Keep
disabled modules unloaded and preserve data access/Forget independently of the
module that created it. Themes, fonts, layouts, colors, keys, tone and formats are
customizable without hiding Stop/Hide All or breaking accessible reflow.

Imported settings never carry consent or enable scripts/downloads. Profiles cannot
renew limits, broaden live tasks, restore revoked adapters or create a ZII executor.
Exact providers and configuration/theme/recipe formats are freeze decisions.
User-authored inert recipes are content inside those contracts, not a loophole for
adding unspecified capabilities after sign-off. Standard is usable by default;
Minimal is a choice, not proof that disabled advertised features work on 4 GB.

The 4 GB strategy applies to every enabled capability: exact lookups and typed
specialists when sufficient, bounded streaming/OCR and a local model for unresolved
interpretation. WORK stages providers with finite shared budgets and real residency
accounting; RESEARCH.md P-17 tests cold/warm behavior and quality before speed.
No optimization may quietly remove a feature, required evidence or precision.

Personalization is separate per user, with no shared-personality mode. EA should
be funny and familiar while helping on request, including frustrated moments;
it must not become a generic social-check-in service. Review/edit/reset learned
mannerisms, choose humor/slang/profanity and immediately override with no jokes.
TONE/OWNER keep profile learning, private context and optional adapters owner-bound.
Quoted material does not teach a user's style; their opinions do not redefine
facts. Compact preferences first, external training only when explicitly chosen,
no extra model pass for jokes, and the same 4 GB resource/correctness requirements.

### Creation Inside EA

F-34 creates editable code/text/configuration/data and inert diff/test drafts with
explicit language/version/schema, encoding, indentation and line endings. Exact
payloads stay separate from explanations. Copy is explicit; new-file export is
explicit, revision-checked and source-eligible. No automatic paste, project
overwrite, dependency install, interpreter/compiler invocation or test execution.
Parser/schema success is not a correctness guarantee. Proposed formats and language
lists are in END-STATE.md and must be approved rather than expanded silently.

F-35 extends precise pointing with user-requested arrows, boxes, freehand strokes
and text callouts on EA-owned layers. Object-linked annotations need current
identity/geometry; free-positioned notes use a selected display without guessing
an app target. Layers stay click-through; edit/delete/undo and Hide All live in EA.
Stale/locked/revoked layers hide first. Drawing grants no screen capture or durable
save. Source retention applies to text, undo, thumbnails and exported annotations.

### Easy Learning, Honest Outcomes

Confirmed: guided dataset review/export and adapter import/evaluation, with actual
weight training in a separately launched self-hosted tool. Proposed learning tabs
separate Preferences, Knowledge, Examples and Adapters. Provide editable examples,
eligibility filters, exact trainer schemas, source-grouped held-out data, compatibility
checks, independent evaluation and explicit activation/rollback. No automatic
training from conversation, arbitrary GGUF injection or fake unlearning claims.

### Everyday Recipe Candidates

These are concrete proposed task templates within declared capabilities, not
automatically approved new services. Review/include/exclude the templates before
freeze. Additional user-authored text templates can use the same frozen types.
All are request-driven, offline and bounded; none applies results to another app.

| Use Case | EA Can Assemble | Feature Contract |
| --- | --- | --- |
| Coding | Function, docstring, test fixture and unexecuted patch preview in a selected style | F-34 |
| Configuration | Exact JSON/YAML/TOML/INI draft with declared validation status | F-34; approve each grammar |
| Troubleshooting | Cited symptom timeline, competing causes and a redacted bug-report draft | F-03/07/15/34 |
| Data cleanup | CSV/TSV preview, missing-value report, unit conversions and proposed formulas | F-05/11/14/34 |
| Learning | Selected-note summaries, worked examples and plain-text practice questions with answer provenance | F-07/11/15/34 |
| Writing | Proofreading, tone variants, outlines, letters and application drafts | F-15/22/34 |
| Meetings | Action items and unresolved questions from user-supplied notes, not secret recording | F-05/15/17 |
| Daily planning | Explicit checklist, timer/reminder or calendar draft with user-approved times | F-15/16/17 |
| Documents | Exact rule/section extraction, edition comparison and a cited decision summary | F-05/07/17 |
| Expenses | Readable tables and checked totals from selected receipts/data, not account access or purchases | F-05/11/14/34 |
| Accessibility | Enlarged callouts, text alternatives and separately enabled local reading aloud | F-01/20/35 |
| Communities | Respectful messages, shared-task outlines and fair comparisons of stated options | F-15/17/22/34 |
| Workflow design | Editable Archi decision trees, assumptions, branch checks and user-run steps | F-17/32 |
| Text conversion | Selected plain text/Markdown/structured outputs with exact delimiters and encoding | F-34 |

Peace, love and respect guide these workflows: patient explanations, honest limits,
accessible controls and no shaming/coercion or pressure to surrender privacy.
The user can choose concise/direct language, correct EA, dismiss it or disable
modules. No generic "do anything" claim, automatic execution, hidden profiling or
guaranteed accuracy is implied by broad usefulness. SC-34..38 cover these additions.

## Companion And Research Decisions — 2026-09-19

Click or Super+Shift+8 toggles only panel visibility. Separately enabled observation
continues on permitted active screens while hidden, with a reachable indicator and
Pause/Stop. Accessibility reads and bounded OCR build short local context; no
always-running vision model or promise to decode protected/unsupported content.
The user opens menus. Hints require a separate opt-in and never reopen the panel.
Requested public research uses WEBR's constrained reader, reviewed public queries
and local synthesis. Screen/private context never enters outbound queries. Free
software is achievable; zero CPU/RAM/energy cost and unlimited free search-service
availability are not promises. Provider and 4 GB quality remain evidence gates.

## Permissions Are Not Activity

Four independent questions must stay visible in the product:

| Dimension | Intended ZI Behavior |
| --- | --- |
| What may EA read? | Optional broad user-approved read access, or narrower app/file grants; OS and protected-source restrictions still apply |
| When may it read? | On an explicit help request, a still-active bounded request, or an explicitly enabled scoped background-observation policy |
| What may it retain? | Separate collection, lifetime, recall, and training rules; broad access never turns these on |
| What may it execute externally? | Nothing in ZI; root/admin, shell, arbitrary clicks, file modification, and generic command tools are not requested |

Confirmed: ZI supports explicitly enabled background observation as well as
help on request. Broad read scope remains an explicit option, not a default
whole-disk crawl. Private/protected exclusions and Stop still apply. Calculation,
drawing inside EA, and user-driven edits to EA-owned notes/settings are internal
work, not the external execution reserved for ZII.

### Background Observation Controls

The capability is confirmed; the following default settings and operating
contract are analysis proposals to review, not permissions enabled on this PC:

- Off on a fresh installation. Enabling it requires an explicit scope, purpose,
  input types, and consent lifetime, with a visible active/paused/blocked state.
- Prefer scoped change events and bounded, coalesced reads. No implicit continuous
  screen recording, keystroke logging, permanent inference, or unrestricted crawl.
- Captures/OCR need their own background grant and resource budget. A foreground
  screenshot grant does not authorize recurring screenshots.
- Collection remains separate: with background observation on and collection off,
  permitted context may exist only in a byte-limited, expiring RAM cache. Turning
  collection on cannot save earlier temporary observations retroactively.
- Turning background observation off cancels its subscriptions, queued reads,
  and in-flight results. Explicit help remains available. Pause all reading
  cancels both background and foreground source acquisition; Forget deletes memory.
- Lock, private/protected sources, permission loss, or uncertain source identity
  stop affected acquisition. If a capture cannot reliably exclude a protected
  region, skip it. Content classification is not a perfect privacy guarantee.
- Background observation alone does not authorize unsolicited advice, speech,
  screen circles, menu opening, or focus changes. Confirmed included proactive hints require
  a separate explicit opt-in and acceptance design; they remain off here.
- Bound event rate, cache bytes/lifetime, CPU, and RAM. Foreground help has priority;
  overload drops stale events instead of building an unlimited backlog.

Software-use history also requires background observation, its own history
toggle, and permission to retain metadata. Restart/unlock never widens a grant;
resuming requires a still-valid consent lifetime and fresh source checks. Whether
the user chooses session-only or remembered consent remains a setup decision.

## Other End-State Capabilities

These proposed additions are expanded in END-STATE.md, including a local calendar.
They require include/exclude decisions now, not after the feature freeze:

| Candidate | Useful Workflow | Additional Constraint |
| --- | --- | --- |
| Units and time tools | Convert quantities, durations, and time zones | Offline data can age; do not invent current rates or schedules |
| Notes and checklists | Capture user-authored notes and assemble a plan inside EA | No editing another application's document |
| Timers and reminders | Notify at a time the user explicitly scheduled | A scheduled user instruction is separate from background observation; no automatic task execution |
| Document comparison | Summarize or compare selected files with citations | Preserve scope, provenance, temporary-only restrictions, and coverage limits |
| Research notebook | Keep eligible user-selected sources, decisions, questions and corrections | Approved local files and visible apps/pages plus explicit public-source research; source lifetimes and reviewed saving still apply |
| Software explainer | Explain menus, errors, shortcuts, configuration, and user-provided logs | Verify app/version and labels; show gaps rather than fabricate controls |
| Planning and reasoning | Work through tradeoffs, dependencies, proposed workflows, and logic checks | Separate assumptions, evidence, and recommendations; no claim of universal correctness |
| Embedded Archi workspace | Build and refine editable methodology flowcharts directly inside EA when asked | Confirmed direction F-32; shared pass/time/size caps, no-progress stop, preview/undo, retention-aware saves; charts never execute |
| Personal knowledge | Search, correct, forget, or export selected remembered facts | Existing memory-policy and deletion requirements apply |

The existing passive link review and user-run antivirus guidance remain part
of the proposed assistant suite. They do not certify safety or run scanners.

The embedded chart workspace is internal assistance, not permission to control a
separate Archi process. A deliberate cycle drawn in a chart is valid to review;
unbounded generation, recursive expansion and self-triggered revision loops are
not. END-STATE.md defines the bounded request contract and SC-21 exercises it.

### Research-Led Refinements

The proposed R-01..08 contracts refine these existing capability families:

- Evidence and notes: an inspectable case distinguishes symptoms, competing
  hypotheses, sources, suggested user tests, actual reported results and unknowns.
- Embedded charts: typed selected changes preserve unrelated/pinned text, colors,
  geometry and routes; stale previews reject all changes without automatic retry.
- Logic: reviewed finite-domain guards support bounded gap/overlap witnesses and
  path coverage, with UNKNOWN/TIMEOUT and unmodeled state changes explicit.
- All services: validate typed output and source references independently, enforce
  resources outside the model, track derived-data cleanup and stage trusted updates.
- Engineering: checked cross-references and planned stateful failure drills connect
  these outcomes to evidence; neither hashes nor document tests certify EA behavior.

No chart execution, autonomous diagnosis, covert caching or post-freeze plugin
expansion is introduced. END-STATE.md records exact proposed boundaries;
SC-22..29 and EA-OUT/CASE/PATCH/LOGIC/GUARD/ERASE/TRUST/TRACE criteria specify
positive and negative outcomes. Libraries/defaults remain candidates to validate
on 4 GB, and the new case/logic presentation needs pre-freeze include/exclude review.

## Predeclared Optional Modules

Voice, character animation, and advanced personalization should attach to
documented input/output contracts without rewriting the permission system.
This is an analysis constraint; implementation technology is not selected.
Local voice, character states, personalization and adapter lifecycle are described
in SCENARIOS.md and SETTINGS.md, with their detailed Archi flows. Being disabled
by default does not excuse omitting a positive baseline test.

```text
RequestEnvelope:
    request_id, explicit_user_intent, input_mode, purpose
    source_grants, retention_policy, cancellation_token, resource_budget
    trusted_principal, session_generation, policy_generation, data_generation

ResultEnvelope:
    result_kind, exact_data, evidence_references, assumptions
    coverage_gaps, uncertainty, optional_live_highlight_target
    trusted_principal, session_generation, source_revisions, lineage, expires_at

PresentationEvents:
    task_started, progress, result_ready, task_cancelled, resource_limited
```

Voice may produce a request or speak a result, but cannot grant itself screen
access, retention, or an executor. Recording requires its own visible consent.
The task starts before microphone capture and carries the same owner/expiry and
remaining budget through confirmation, help and speech. The microphone closes
before transcription or waiting. Spoken replies can accompany typed requests
with microphone input disabled; speech failure preserves the text and cannot
rerun help or repeat a reviewed own-data/settings operation. Those operations
still require their separate exact-scope confirmation, not merely a transcript.
Animation consumes presentation events, not raw desktop content. Personalization
can change tone and presentation, not factual results or capability boundaries.
Each optional module has a versioned contract, a budget, a disable switch, and
failure isolation. Typed interaction still works with all extras absent.
ZII remains a separately controlled execution edition, not a plugin loophole.

Every capability also uses PSEUDOCODE.md's Shared Operation Contract. Detail
flows share their caller's budget and source envelope; they do not launch the
same work twice. Final publication, speech, save and export recheck the current
owner/session and source policy. ALIGNMENT.json covers every feature family,
including cross-cutting requirements and the separately proposed ZII boundary.
