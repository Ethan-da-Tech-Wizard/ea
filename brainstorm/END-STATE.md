# EA: End-State Scope And Feature Freeze

Status: analysis proposal, not a signed baseline or implemented product.
Updated 2026-09-19. The user requires the complete end goal to be specified now,
with no new features after analysis sign-off. This supersedes earlier language
that left unspecified feature additions for later.

## Binding Direction

- ZI provides full internal assistance and passive external guidance. It never
  operates other applications, runs shell commands, submits forms, or launches scans.
- Every included ZI feature must work locally on a computer with 4 GB total RAM,
  without a required GPU, payment, vendor/cloud account, or hosted inference service.
  Tested local identity/storage protection for private profiles is separate; guest
  use never opens another user's private data.
- Accuracy and target precision take precedence over speed. Optimize latency
  among configurations that pass the approved correctness and privacy gates.
- Smaller inputs, bounded searches, fewer display samples, shorter explanations,
  and serialized workers may conserve resources. No silent loss of mathematical
  correctness, mandatory evidence, source provenance, or privacy protection.
- A successful refusal is a safety outcome, not a successful feature demo.
  Every included feature needs positive conformance cases on the baseline machine.
- Observation, collection, recall, training eligibility, voice recording, and
  proactive interruptions have independent permissions and lifetimes.
- Voice, animation, advanced personalization, platform adapters, and ZII are
  being specified before the freeze, not left as unspecified future additions.
- These documents do not approve downloads, enable background services, or inspect KARL.
- Confirmed 2026-09-19: approved local files and visible apps/pages plus explicit
  public-source research. Screen content and all AI stay local. No cloud inference,
  private-context query generation, authenticated website bot or background feed.
- Click or Super+Shift+8 toggles the panel; separately granted screen observation
  continues while hidden. Menu opening remains manual. Hints need separate opt-in.
- Confirmed screen-history default: no durable observation storage; short-lived
  context stays in RAM. Enabling memory affects only future observations and
  cannot save earlier temporary content retroactively.
- User-confirmed values: peace, love and respect for people and technology;
  patient, noncoercive help, accessibility, user agency, privacy and resource care.
- Useful defaults must coexist with deep module/profile customization. Customization
  does not remove ZI's execution boundary, source permissions or finite budgets.
- User-confirmed training path: guided dataset export and trained-adapter import;
  actual weight training runs in a separately launched self-hosted tool, not ZI.
- User-confirmed companion direction: funny, familiar, practical help when asked,
  including frustrated moments; no generic social check-ins. Separate user profiles
  only, with no blended personality or pooling of private mannerisms/opinions.

## Engineering The 4 GB Constraint

Keep the full included feature set while reducing simultaneous working memory:
structured/exact retrieval, typed specialist engines, bounded file and OCR stages,
then a small local model where interpretation is needed. Each heavy stage releases
its residency before the next. Cache reuse never extends permission or discards
required evidence; reduced drawing detail never changes a mathematical tolerance.
The WORK flow and RESEARCH.md P-17 specify cost accounting and optimization trials.
EA-OPT-01..04 require equal correctness/coverage before any speedup is claimed.
This is a proposed engineering strategy within the 35-family inventory, not a
new hardware tier, approved allocation, selected model or completed benchmark.

## Complete Inventory For Review

The table is the proposed complete product boundary, not a claim that every
individual detail has already been approved. Each row must receive an explicit
include/exclude decision before sign-off. An optional feature means the user can
disable it; it does not mean we can omit its specification until after the freeze.

| ID | Proposed End-State Capability | Contract And Boundary | Scenario Coverage |
| --- | --- | --- | --- |
| F-01 | Movable, resizable companion | Click or Super+Shift+8 shows/hides the panel without changing observation; reachable status/Pause/Stop, remap fallback, no forced focus | SC-04, SC-16, SC-34, SC-35, SC-38, SC-39 |
| F-02 | Intent and task context | Resolve pronouns/goals using eligible conversation context; focused choice/free-text clarifications, explicit answers, corrections and bounded rounds | SC-01, SC-03, SC-14, SC-18, SC-23, SC-30, SC-31, SC-32, SC-33, SC-36 |
| F-03 | Desktop software guidance | Read permitted labels, menus, tooltips, state, and app/version evidence; user performs navigation/actions | SC-01, SC-03 |
| F-04 | Website evidence and public-source research | Read permitted visible-page evidence or explicitly requested public sources; bounded credentialless fetch, public-query preview, local AI and private screen context; no browser control | SC-01, SC-02, SC-23, SC-32 |
| F-05 | Files and documents | Requested computer-wide discovery across approved roots; bounded supported plain text/log/Markdown/CSV/TSV/PDF/image extraction with explicit unsupported/unread coverage; no scripts/macros/remote resources | SC-01, SC-05, SC-06, SC-12, SC-30, SC-31, SC-36 |
| F-06 | Precise screen pointing | Fresh identity plus calibrated click-through circle/outline; explicit fallback when unsupported | SC-01, SC-02, SC-04, SC-32, SC-35 |
| F-07 | Evidence and explanation | Literal labels/sections, readable excerpts/tables/comparisons, source/edition/freshness, contradictions, casework and visible inference/unknown status | SC-01, SC-02, SC-03, SC-05, SC-12, SC-22, SC-23, SC-30, SC-31, SC-32, SC-33, SC-38 |
| F-08 | Opt-in background observation | Scoped passive change events, visible status, bounded RAM context, no implicit unsolicited help | SC-08, SC-10, SC-26 |
| F-09 | Knowledge and software history | Search, source provenance, corrections, eligible conversation continuity, explicitly saved thread history, expiry and per-source preferences; memory is not training | SC-08, SC-09, SC-19, SC-23, SC-27, SC-30, SC-33, SC-37, SC-39 |
| F-10 | Forget, export, backup, restore | Derived-data deletion, per-store verified cleanup including FTS/history, restore tombstones, clear trained-weight/external-copy limits | SC-09, SC-14, SC-17, SC-19, SC-27, SC-33, SC-34, SC-35, SC-37, SC-39 |
| F-11 | Scientific and symbolic calculator | Exact/approximate arithmetic, algebra, supported systems/inequalities, calculus, complex numbers, units and assumptions | SC-06, SC-07, SC-10, SC-14 |
| F-12 | Interactive 2D graphing | Cartesian, implicit, inequality, polar, parametric and data plots; sliders, tables, trace, roots, extrema, intersections, area | SC-06, SC-07, SC-10 |
| F-13 | Bounded advanced mathematics | 3D surfaces/parametric curves, supported ODE initial-value problems, matrices, probability/statistics and regression | SC-07, SC-10 |
| F-14 | Workbooks and inert exports | Undo/redo, named expressions, explicit save/reopen, selected image/table export under source data rules | SC-06, SC-07, SC-10, SC-17, SC-27, SC-36 |
| F-15 | Notes, drafts and checklists | EA-owned editable work, citations, explicit save, search and export; no edits to another application's document | SC-01, SC-12, SC-18, SC-21, SC-23, SC-31, SC-36, SC-38 |
| F-16 | Local calendar, timers and reminders | Explicit scheduling, recurrence/time-zone rules, snooze/cancel, sleep/restart handling; no sending invites or external calendar writes | SC-11 |
| F-17 | Planning and logic | Help reason through likely information needs, alternatives and proposed steps; dependency drafts and bounded logic checks; no mind-reading, universal proof or external task execution | SC-01, SC-18, SC-21, SC-25, SC-32, SC-33, SC-38 |
| F-18 | Units, durations and time zones | Dimensional validation and dated offline rules; user-supplied rates identified as such, no invented live rates | SC-07, SC-11 |
| F-19 | Passive security assistance | Explain link signals and user-run scanner reports; never certify safety or run/quarantine/delete anything | SC-13 |
| F-20 | Local voice input/output | Push-to-talk, editable transcript, spoken typed/voice results, Stop/mute, chosen language/voice; separate recording consent and one original task budget | SC-10, SC-14 |
| F-21 | Character and animation | Defined idle/listening/working/result/error states, reduced motion/static mode, independent mute, resource cap | SC-10, SC-15 |
| F-22 | Advanced personalization | Separate per-user profiles, reviewed learned mannerisms, humor/language choices, session/saved lifetime and correction/reset; no mixed private personalities, altered facts or covert sensitive profiling | SC-09, SC-15, SC-37, SC-38, SC-39 |
| F-23 | Guided learning and adapter lifecycle | Accessible preference/knowledge/example/adapter workspace, reviewed dataset export, independent evaluation and rollback; user separately runs training | SC-19, SC-27, SC-28, SC-37, SC-39 |
| F-24 | Full setup and settings | Presets, individual overrides, rich help per option, effective-policy preview, per-page/all defaults, import/export with permission review | SC-14, SC-16, SC-17, SC-21, SC-24, SC-25, SC-28, SC-29, SC-33, SC-34, SC-37 |
| F-25 | Local model/resource management | Verified model artifacts, independent supervisor, tested enforcement, finite deadlines, scoped cache reuse, sequential heavy workers and honest reduced-detail mode | SC-10, SC-16, SC-19, SC-21, SC-22, SC-26, SC-28, SC-30, SC-34, SC-39 |
| F-26 | Diagnostics and compatibility | Content-free health/status, explicit redacted support export, named tested app/OS versions, accessible fallbacks | SC-03, SC-05, SC-16, SC-26, SC-29 |
| F-27 | GNU/Linux, macOS and Windows adapters | Same read-only ZI contracts; separate OS permission and coordinate validation; Linux is first in delivery order | SC-04, SC-16, SC-20 |
| F-28 | Free, offline installation lifecycle | Trusted versioned artifacts, explicit staged updates, distinct user-managed import status, offline freshness limits and uninstall/data choices | SC-16, SC-17, SC-28 |
| F-29 | User-approved proactive hints | Confirmed included: separate opt-in, bounded local technical hints, quiet hours and rate limits; no automatic speech/circle/action, panel reopening or web research | SC-08, SC-15 |
| F-30 | Optional semantic retrieval | Same deletion/provenance/purpose rules as exact retrieval; admitted only when measured quality improves and it fits 4 GB | SC-09, SC-10 |
| F-31 | ZII execution edition | Separate scoped broker, exact confirmations, reversible effects where possible, bounded loops, checkpoints, no-progress stop | SC-20 |
| F-32 | Embedded Archi methodology workspace | Confirmed direction: editable flowcharts inside EA on request; bounded generation/repair, typed selected changes, revision preview/undo, protected layout and no workflow execution | SC-21, SC-22, SC-24, SC-25, SC-26, SC-27, SC-29 |
| F-33 | Module composition and portable profiles | Confirmed customization direction: defaults/minimal/custom setups, explicit named profiles, dependency-aware module/provider choices, declarative configuration and reversible changes | SC-34, SC-38, SC-39 |
| F-34 | Code, text and structured artifact workspace | Confirmed creation direction: format-specific inert drafts, selected revisions/diffs, bounded checks, explicit Copy or new-file export; no execution or project overwrite | SC-36, SC-38 |
| F-35 | Screen annotation layers | Confirmed drawing direction: user-requested circles, arrows, boxes, freehand strokes and text callouts in EA-owned layers; calibrated, dismissible, editable and source-lifetime-aware | SC-35, SC-38 |

The current inventory is **35 feature families**. F-33..35 are explicit additions
during open analysis, not hidden refinements of a frozen baseline. Their detailed
scope, format lists, defaults and numeric limits still require review and positive
4 GB evidence. F-23's separate-training boundary is confirmed, not pending.

F-13, F-16, F-29 and the exact language/format/platform lists are proposed
expansions of the broad end goal and require approval before the freeze. F-31
is not a ZI capability. F-23 covers export and inference-time adapter use in ZI;
actually training weights is a user-launched separate self-hosted workflow or a
separately approved ZII operation, not a concealed high-RAM ZI feature. No KARL
integration or trainer has been selected; KARL has not been inspected.

## Computer-Wide Research And Conversation

Confirmed user direction: EA should find relevant information across the computer,
extract it into readable answers, ask useful clarification questions and improve
follow-up assistance with eligible conversation knowledge. These extend F-02/05/07/09/17,
not a separate uncontrolled agent. They refine the original 32 families; the
subsequent customization/creation direction adds the explicit F-33..35 rows above.
Detailed bounds/defaults and format support still need review and 4 GB testing.

"Every file" means discovery across explicitly approved locations and content
inspection of supported, permitted regular files. It does not mean cracking
encrypted files, obtaining administrator access, opening device/virtual files,
crossing unapproved network mounts, executing macros or silently adding parsers
for every format. Protected sources and other people's privacy remain excluded.
Show skipped, unreadable, changed and unsupported categories without leaking
protected filenames. A metadata-only match is not a content-analysis result.

Fast search can prioritize known indexes, filenames and likely matches. Thorough
search continues through eligible file content even when the filename is not
promising; it streams bounded chunks instead of loading the disk into RAM.
Neither an early match nor exhausting a budget proves complete coverage. Report
the inspected snapshot, byte/file coverage, omitted results and why work stopped.
All decoding, ranking and extraction share the request budget. Proposed search
caps: 60 active seconds, 10000 visited entries, 64 MiB source bytes, with bounded
queues/results/identity sets inside existing cache limits. These are unmeasured;
continuation is an explicit user request with revalidated scope, not self-renewal.

Extraction returns exact relevant excerpts plus explanation, or structured tables
and comparisons with source locations. Resolve document identity, edition/date,
rule/section numbering, printed versus viewer page and table units. Do not
confuse rule 432 with 4320 or omit a qualifying exception. Calculations use the
existing math service with cited inputs. Missing/corrupt/OCR-uncertain content
remains uncertain. Original files are unchanged; saving/exporting an EA result
requires its own explicit authorization and original-source retention eligibility.

Clarification uses a small inline question with two or three meaningful choices
when available, plus free text and Skip/Cancel. A default/highlighted option is
not an answer or consent. Ask only about ambiguity that materially changes the
answer, source scope or interpretation. Proposed limit: three rounds per task;
one focused question each, no repeated-question loop, and no heavy worker or new
source acquisition while waiting. A scope increase requires a separate grant.
Skipped essential questions yield NEEDS_INPUT; low-risk assumptions must be labeled.

Maintain bounded goals, named entities, corrections, cited facts and unresolved
questions across turns while their permissions and lifetimes remain valid. Show
why an answer follows from the evidence, compare alternatives and suggest useful
next questions; do not presume the user's hidden intention or act on their behalf.
User reports remain attributed reports. Summaries cannot silently lose qualifiers,
resurrect forgotten evidence or extend retention. Clear-topic/correction/forget
controls must affect cached and derived context. Saved threads are explicit and
editable/deletable; collection-off observations cannot become durable chat history.
Conversation memory, summaries and preferences do not train model weights.

For sports, resolve participant/game/season and live-versus-recorded or historical
context. Approved local files and visible apps/pages remain evidence. The user's
2026-09-19 decision adds explicit public-source research with local AI and private
screen context. Exact outbound public terms/provider need review; no background
feed, browser refresh or navigation. Record source URL, edition and acquisition
time; a model, old cache or visible logo cannot prove a live state. Unsupported
current claims and contradictions stay visible. WEBR details the bounded reader.

## Customizable Internal Assistance

The intended approach is a useful default system that the user can compose deeply,
not a compulsory bundle of always-running features. Offer Standard, Minimal and
Custom module selections independently of the privacy presets. Disable optional
calculator, graphing, Archi, code/text, annotation, voice, animation, semantic
retrieval and reminder providers individually, subject to visible dependencies.
Being included in the product means the feature works when enabled on 4 GB; it
does not require simultaneous residency of every worker. Minimal mode preserves
the host, settings, source enforcement, Stop/Hide All, data deletion and diagnostics.

Named work/study/support profiles hold module choices, appearance, tone, output
defaults and bounded budgets. Switching is explicit, revision-checked and previewed;
do not infer a switch or new permission from the foreground app. Effective settings
show their origin: defaults, selected profile, explicit task preference, resource
constraint or stronger denial. Grants are separately intersected, never merged as
permissive unions. A profile cannot enable another user's grants, load a revoked
adapter, reset counters or widen a live task silently.

One versioned declarative schema drives the GUI, rich help and advanced JSON
configuration/import/export. Show errors for unknown keys, unsupported versions,
dependencies and cycles; no eval, startup hooks, shell expansion, project plugins
or remote theme resources. Editable themes, colors, fonts, key bindings, panel
layout, preferred formats and compatible local providers must remain accessible
and reversible. Keep a last valid profile, restart notices and actual save state;
failed permissive activation cannot reverse already-applied restrictions.

Configuration portability excludes secrets, source payloads and transferable
consent. Uninstall/disable is not Forget; data controls remain reachable when the
feature that created a record is disabled. Users can author inert recipes and
replace approved providers under the frozen contracts. New executable plugins,
new permissions or undeclared post-freeze features remain outside the product
contract. Source/build transparency and the exact free-software distribution
license need G-06 review; no license has been selected by this document.

### Requested Internal Initiative

ZI is not passive in its own workspace: once explicitly asked, it may assemble a
multi-part answer, generate code/text, calculate, lay out a chart, or compose a
screen annotation without asking about every token/stroke. The parent request
defines success, source/output scope and finite resource/time/pass limits. It
stops on completion, cancellation, stale evidence, no progress or budget exhaustion.
No artifact, observer, template, saved profile or sync event is a new user request.
Working for hours in other applications remains a separately specified ZII task;
there is no hidden ZI execution/autonomy switch.

### Code And Text Artifacts

Provide editable plaintext, Markdown, code/configuration snippets, JSON, CSV/TSV
tables, local document templates and inert unified-diff/test drafts. Proposed
structured formats additionally include YAML, TOML, INI and JSONL; proposed code
languages include Python, JavaScript/TypeScript, Bash, SQL, HTML and CSS. Each exact
format/version and level of validation requires approval before freeze. Arbitrary
text may be displayed as unvalidated text, never advertised as supported parsing.

The user chooses the target language/schema, filenames, indentation, encoding,
line endings, exact-only payload versus explanatory notes and selected edit scope.
An exact JSON request must not contain Markdown fences, prose or comments. Keep
sidecar explanations/diagnostics outside payloads; preserve unrelated draft edits.
Use inert maintained parsers without evaluation, external references, compiler
hooks or project imports. Syntax/schema checks do not prove correctness. Code,
tests, shell commands, HTML and patches are never run, installed, rendered actively
or applied. Show untested behavior, assumptions and placeholders explicitly.

Proposed generation caps: three total model passes, 60 active seconds, 256 KiB
combined output and eight file previews, within existing parent/cache budgets.
Repairs consume the same counters and stop repeated/no-progress/A-B-A drafts.
No infinite formatter loop, recursive recipe chain or automatic validation job.
Copy writes only the selected payload after an explicit user action; no automatic
paste, clipboard monitoring or covert reading of clipboard history. Export creates
explicitly selected new EA artifact files with safe paths, no executable bit and
no source/project-file overwrite. Report actual per-file outcomes on partial
failure; multiple file writes are not magically atomic.

Every transfer rechecks the exact payload, destination and source eligibility.
Temporary-only observations cannot silently become durable clipboard/history/files.
User-authored or eligible generated work may be copied/exported under explicit
transfer rules. Clipboard managers and external copies cannot be recalled; even
best-effort clipboard clearing must never erase newer content owned by another app.

### Screen Annotation Layers

F-06's precise pointing remains a supported subset of F-35. Add editable EA-owned
ellipses, rectangles, arrows, freehand polylines and plain-text callouts, with
move/resize/style/delete, undo/redo, a layer list and Hide All. Object-linked
marks reuse tested identity/visibility/transforms; user-positioned notes use an
explicit display/region without pretending to identify a real control. Both
respect monitor scale, origin, rotation, cropping, layout revision and OS support.
Never paint into application files, change underlying pixels, impersonate system
prompts or inject input. Default presentation is click-through and does not steal
focus; edit controls live in EA. A supported shortcut and the always-reachable
panel control dismiss layers; unsupported compositor shortcuts are disclosed.

Proposed bounds: 50 objects, 10000 stroke points, 16 KiB caption text and a 60-second
layer lifetime, shortened by task/source expiry. Hide first on target/layout change,
lock, revoke or cancellation; no background capture/re-generation to keep it alive.
Keep labels inside visible bounds without covering targets, system permission
prompts or emergency controls. Text/list alternatives and style controls support
accessibility. Save/export is separate and follows source-derived data rules;
drawing an annotation does not grant permission to capture or save the screen.

### Guided Learning

The user confirmed guided export/import with actual weight training performed in
a separately launched self-hosted tool. Proposed Preferences, Knowledge, Examples
and Adapters tabs make the distinct workflows accessible; the boundary is fixed.
Provide reviewable examples, source filters, corrections, redaction, exclusions,
schema errors, compatible export formats, held-out evaluation, adapter comparison,
explicit activation and rollback. Record exact base model/tokenizer/runtime,
artifact/data licenses and provenance. Do not imply any adapter fits any GGUF.

Proposed dataset-pass caps: 1000 examples and 16 MiB, sharing existing task limits;
20 percent held out, split by source/duplicate groups where possible. Too little
independent data means evaluation is insufficient, not that quality passed.
Feedback is not automatically a training example. Collection-off, revoked or
third-party protected data remain excluded; deletion reaches EA-owned datasets
and derivations, while externally trained weights need replacement/retraining.
EA explains the separate user-run training step and its documented hardware needs;
export does not start a trainer, schedule training or connect to a hosted service.
The final preview binds exact bytes to a chosen new destination. Its commit gate
rechecks owner/session, source/policy revisions and no-overwrite/no-symlink rules
after the picker and approval waits; earlier consent is not a reusable write token.

## Peace, Love And Respect

These values are confirmed product principles, not an ideological message inserted
into every response. Be patient and non-shaming with beginners; support legitimate
technical exploration; make uncertainty and repair options clear. Respect the
user's right to disagree, correct, mute, disable, export, delete and leave. Offer
direct or encouraging language without compulsory cheerfulness, fake intimacy,
engagement streaks, guilt prompts or manipulative pressure to enable collection.

Protect other people's private information, preserve accessibility, avoid focus
theft and conserve resources through idle unloading and bounded work. Do not claim
zero risk, universal correctness, emotional diagnosis or measured environmental
savings without evidence. Presentation never changes evidence, source rules,
mathematical precision or warnings. A neutral concise answer can be caring.
SC-38 and EA-CARE-01/02 make these principles reviewable rather than slogans.

## Funny, Familiar And Useful

The requested character is a practical sidekick with wit: help when the user says
they are frustrated, offer a useful next step, and use humor when it fits. This is
not a social-check-in service. No "where have you been?", generic concern pings,
attention streaks, guilt or claims of exclusive friendship. Technical hints still
require their own opt-in; requested reminders are not unsolicited social contact.

Humor, phrasing, slang, formality and detail are inspectable preferences. The user
can choose dry/playful/off humor and separately permit profanity. A current "no
jokes" or serious-mode request overrides stored style immediately. Do not mock
the user, mirror hostility toward people, diagnose their emotions, soften a real
warning or put banter into exact code/data payloads. Being funny is not a quota;
usefulness, timing and factual integrity are evaluated with people before sign-off.

Learn mannerisms from eligible first-party interaction only when preference
learning is enabled, or accept explicit manual choices. Preview/edit/accept/reset
the proposed change without interrupting help. Quoted documents, another speaker
and tool output do not teach the user's personality. One angry message is not a
permanent temperament label or profanity permission. Opinions belong to attributed
owner-scoped knowledge, not automatic agreement or global facts. Session learning
with collection off stays temporary; saved behavioral preferences need capture-time
collection/retention eligibility. Approval does not launder ineligible sources.

**Separate profiles only is confirmed.** A common immutable base model and default
character are permissible, but personal vocabulary, examples, opinions, history,
caches and private adapters never form a combined personality. Optional fine-tuning
remains reviewed export/import with external training, scoped to that owner. A
merged private model does not become public just by calling it a base model.

Trusted user identity is distinct from S-59's workspace/configuration profile.
Before switching: close publication, hide private surfaces, stop outgoing work
and release private inference/context state. Bind new work to a verified owner
and fresh session generation; A-to-B-to-A must reject stale A output. Unknown
identity gets guest defaults without private retrieval; failed isolation stays
closed. A name picker, writing style or voice similarity is not authentication.
Same-OS-account sharing needs a tested authentication/storage design; without it,
only guest behavior is supported there. Account/administrator compromise remains
in the threat model, not a solved privacy guarantee.

TONE/OWNER, SC-39, S-71/72, EA-PERSONA-02..05 and P-18 detail the proposed contracts.
The proposed active style envelope is 16 fields/4 KiB including examples, inside
existing memory/token budgets. Only eligible active-user context is loaded; style
must not displace required evidence or trigger extra joke-generation passes.
Exact defaults, identity mechanisms and positive 4 GB behavior need review/testing.

## Research Refinements For Review

The complete inventory is F-01..35. R-01..08 detail the earlier families,
not an unlimited expansion clause. Research is recorded with primary sources in
RESEARCH.md; REFINEMENTS.json connects these contracts to tests and chart nodes.
All are analysis proposals pending explicit sign-off. The embedded workspace
itself remains confirmed; its exact behavior/defaults are not yet approved.

| ID | Proposed Refinement | Required Boundary |
| --- | --- | --- |
| R-01 | Typed, grounded results | Controller-owned origin/permissions/budgets; independent schema/reference checks; inert rendering; unsupported claims stay unknown |
| R-02 | Evidence casework | Goal/symptom/hypotheses/sources/proposed test/actual result/conclusion in existing EA notes; user performs any test; no invented confidence scores |
| R-03 | Selected chart patches | Stable IDs, explicit edit scope, private candidate, protected layout/text/colors/routes, exact preview and atomic revision-checked undoable commit |
| R-04 | Declarative branch checks | Reviewed Boolean/enum/bounded-integer grammar, overlap/gap witnesses and bounded path coverage; no eval, action simulation or universal proof |
| R-05 | Independent resource supervision | Tested OS limits plus separate access isolation; protected UI, shared deadlines and one heavy worker; unsupported protection blocks launch |
| R-06 | Verified forgetting | Immediate tombstones, complete derivative inventory, per-store cleanup status, interrupted-cleanup recovery and tombstone-aware restore |
| R-07 | Trusted artifact lifecycle | Explicit installer/settings maintenance outside assistant tools, staged validation, trust/version checks and offline freshness disclosure |
| R-08 | Traceability and failure drills | Engineering artifact checks plus planned stateful runtime tests; no automated semantic approval or inferred analysis sign-off |

R-04 starting caps are 5 active seconds, 16 variables, at most 16 values per
variable, 200 predicates, 32 path edges and 32 reported witnesses. These are
unmeasured proposals, all shared across a request; nested checks inherit the
tighter parent budget. Settings can tighten, never remove, the bounds. The
reviewed guard subset permits literals/comparisons/Boolean connectives, not
calls, assignments, unrestricted expressions or executable node pseudocode.
Unmodeled state changes and unvisited paths remain unknown. Domain confirmation
is separate from accepting a natural-language guess at a guard's meaning.

Casework and formal branch-check presentation are explicit proposed refinements,
not silently approved new UI modes. Include/exclude them now before freezing.
No particular schema, solver, layout engine or update library is mandated by
this analysis; compatibility, licensing and positive 4 GB tests govern selection.
Unknown/incomplete results are honest failure states, not positive feature tests.

## Embedded Archi, Not External App Control

The user wants Archi built into EA, not an external project-import workaround.
F-32 extends the internal planning tools with an editable canvas for methodologies,
decision trees, troubleshooting, logic and pipelines. Creating a chart changes
EA-owned work, not another application; the ZI external-execution ban is unchanged.
This is a confirmed product direction, not an implemented embedding.

An explicit request establishes the goal, inputs, start/end conditions and intended
level of detail. EA proposes one operation or predicate per node, labeled branches,
bounded subflows, assumptions, evidence references and visible unknowns. The user
can edit, accept, reject, undo, explicitly save or export it. Refining a selected
chart uses a revision preview; unrelated nodes, layouts and manual edits survive.
R-03 keeps edits within selected stable node/edge IDs, verifies all incident-edge
changes, and never silently rebases a stale preview. Full re-layout requires an
explicit scope choice; pinned/unrelated geometry is checked after layout. New
IDs are host-assigned. R-04 checks are explicit internal calculations with no
chart mutation or automatic generation. Ordinary structural validation does not
silently invoke a solver or start a second chart-generation ledger.
Importing an existing Archi file creates a selected EA-owned copy and grants no
authority to overwrite the original. Native save/open compatibility and exact
embedded surfaces must be tested; no current embedding or generation API is claimed.

### No Runaway Chart Generation

- Only explicit user requests start or renew a chart-generation job. EA-generated
  nodes, observation events, autosave and document-sync notices never self-trigger it.
- One parent request owns all generation/repair counters, deadlines, node/edge
  limits, subflow/depth limits and resource leases. A child chart cannot reset them.
- Initial proposals: at most 3 model passes total (one draft plus two repairs),
  90 seconds of active generation/validation/layout time, 200 generated nodes,
  400 edges, 8 subflows and 3 nesting levels per request. These are unmeasured
  starting limits, not approved performance promises; every included workflow
  still needs meaningful positive 4 GB cases. Settings may tighten these caps;
  there is no infinite/unlimited mode. Final caps require pre-freeze approval.
- Stop repeated semantic fingerprints, A-B-A oscillation and repair attempts that
  make no measurable progress. Stable node identity and cosmetic-independent
  comparison help detection; hard pass/time/resource caps still apply when a
  subtle repetition escapes detection. The model cannot supervise its own deadline.
- Stop/cancel invalidates queued output, releases workers and restores control.
  A supervisor enforces deadlines even if generation, parsing or layout hangs.
  Preserve the last valid draft and existing canvas; explain unresolved issues.
  Continuing requires another deliberate user request, not automatic budget renewal.
- A diagram may represent a deliberate loop, with its condition and exit shown.
  Drawing that cycle does not run it. Recursive subflow navigation/preview uses
  visited IDs and depth limits instead of expanding indefinitely. Structural checks
  do not prove that a real-world method is correct or guaranteed to terminate.

Generation starts in RAM. Embedded Archi autosave/history must follow EA's source
retention rules: a diagram cannot become a hidden durable copy of collection-off
observations. Revocation/deletion invalidates derived drafts and pending commits.
An explicit user-authored chart save is different from retaining observed data.
User review of a preview does not override acquisition-time ineligibility.

## Mathematical Completeness

"Full calculator" means the finite F-11..14 inventory above, with supported
domains, input grammar, precision rules, size/time bounds and test cases for
each operation. It does not promise solving every symbolic expression or
arbitrarily large problem. General proof assistants, unrestricted programming,
specialized CAD/simulation suites and arbitrary user code are outside the
proposed boundary unless added and fully specified before sign-off.

3D and ODE features must have bounded positive tests on 4 GB. Reducing display
mesh density is allowed when disclosed; changing a numerical tolerance requires
an explicit user choice within the approved contract. A coarse plot must not
pretend to establish continuity or find every solution.

## Proposed Exclusions

No cloud-required core, ads/data sale, covert recording, universal administrator
permissions, biometric identification, always-listening microphone, arbitrary
plugin tool execution, autonomous browser navigation in ZI, account messaging,
remote calendar synchronization, purchase/payment, or certified malware verdict.
Office macro execution and native DOCX/XLSX/ODT/ODS decoding are not in the
proposed initial format list; explicitly decide their inclusion or exclusion
now, not after the freeze. Passive browser inspection and explicitly requested
public-source fetching are distinct grants; neither permits browser control.

The user excluded the menu-reveal exception on 2026-09-19. ZI reads exposed
menus and asks the user to open hidden ones; no generic or tested accessibility
action is available. DeepSeek website automation and cloud inference are also
excluded by the confirmed local-AI requirement.

## Predeclared ZII Boundary

ZII is part of end-goal analysis, not a toggle that makes ZI execute. Its proposed
action families need include/exclude decisions and finite adapters before freeze:

| Family | Proposed Scope | Required Constraint |
| --- | --- | --- |
| App/browser interaction | User-approved navigation, typing, menu commands and form operations in named targets | Exact target/effect preview, current identity and session grants; no inherited authority from a webpage |
| File/workspace changes | Read/write/move explicitly selected workspace files and construct user-requested artifacts | Diff/preview, traversal and symlink checks, collision handling, recoverability where possible |
| Development workflows | Bounded build/test/tool invocations for an approved workspace | Isolated process, explicit allowed tools/network, resource/deadline caps; no unrestricted host shell inheritance |
| Scanner integration | Invoke a supported existing scanner and interpret its result | Separate launch grant; signature updates, quarantine and deletion require separate reviewed operations |
| Long-running work | Finite goal-directed propose/authorize/execute/observe/verify loops | Shared wall/step/CPU/RAM limits, no-progress stop, cancel, crash-safe checkpoints only if retention allows |
| Training orchestration | Optional user-selected external training workflow and adapter evaluation | Separate artifact, resource, license and dataset-purpose approval; not a ZI 4 GB training promise |

The table declares families, not unlimited operations. Exact adapters, irreversible
effects, remote/network scope and ZII hardware requirements remain open and block
the corresponding sign-off. Administrator escalation, financial transactions,
account messaging and unattended irreversible operations are proposed exclusions
unless fully specified and explicitly approved during this analysis. The model
cannot approve its own actions, extend a lease, or treat external text as consent.

Every action records actual effects separately from intended results. On a timeout
or crash, uncertain external effects are reported as uncertain; retry must not
duplicate a purchase, message or file mutation. Rollback is promised only where
the adapter has demonstrated it. Human cancellation revokes remaining actions;
it cannot magically undo an already completed external effect.

## Analysis Exit Gates

| Gate | Required Before Design Sign-Off | Current State |
| --- | --- | --- |
| G-01 | Approve every inventory row and every exclusion; no unnamed "other tools" or "add later" placeholders | Pending user review |
| G-02 | Approve math/code/data formats and languages, search coverage, annotation primitives, module/provider compatibility and OS delivery boundaries | Pending details; public-source research with local AI and private screen context confirmed |
| G-03 | Resolve storage protection, consent lifetimes, profile precedence, artifact/annotation/dataset/research limits, conversation saving and R-01..08 refinements | Manual menus, separate opt-in hints and external training confirmed; exact defaults and public-search provider still pending |
| G-04 | Demonstrate critical feasibility on a named 4 GB total-RAM profile, including one positive case per ZI feature family | Not measured |
| G-05 | Approve scenario oracles, failure contracts, numerical tolerances and quality-first latency gates | Drafted, not approved |
| G-06 | Review dependency/model/voice/data licenses and free/offline distribution constraints | Source review started; manifest incomplete |
| G-07 | Trace features to requirements, scenarios, settings, flow nodes, evidence and planned tests | ALIGNMENT.json names individual acceptance IDs and requires a scenario citation per criterion and detailed flows per scenario; R-01..08 retain node links. Structural checks do not replace human semantic review or runtime evidence |
| G-08 | Reconcile linked documents/Archi, resolve all semantic review flags, and record explicit user sign-off | Not signed; not frozen |

Full production tests run during implementation and release verification, not
before analysis can ever end. G-04 requires focused feasibility experiments for
high-risk promises, not a secretly completed application. Unresolved feasibility
must stay visible; it cannot be converted into an unsupported performance claim.

## Freeze Contract

At sign-off, store a baseline ID, date, approved feature IDs, exclusions,
requirement/scenario/settings revisions, document/diagram hashes, compatibility
matrix, risk decisions and test-plan references. The saved Archi JSON remains
authoritative for diagram content. Document Sync detects drift; hashes do not
prove semantic agreement or test success.

After sign-off, no new capabilities are added. Implementation milestones may
deliver different portions of the already frozen inventory; that is sequencing,
not expanding scope. Design chooses interfaces, libraries, layouts and algorithms
within the approved contracts. Bug/security fixes and compatibility repairs must
preserve those contracts and retain traceability. A change that introduces a new
user outcome, permission, format, platform or behavior is rejected as a feature
addition, not disguised as a refactor or plugin. A discovered infeasible promise
is reported as a blocker for the user; no silent removal or lowered quality bar.

The present analysis is still open. This document does not declare it complete.
