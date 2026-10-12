# EA ZI: Product Analysis

Status: analysis, capability mapping, and pseudocode only. The runnable board
is a planning tool. EA itself has not been implemented, and no models or
software-observation services have been installed or started.

The latest product contract is [ZI-SCOPE.md](ZI-SCOPE.md). ZI is Roman numeral
one, honoring Konrad Zuse. It reads, finds, assembles proposed work, previews,
and guides; it has no external execution backend. The detailed board contains
65 views and 1066 single-operation or single-decision nodes, indexed in
[FLOW-REFERENCE.md](FLOW-REFERENCE.md). See the expanded
[capability catalogue](CAPABILITIES.md) and [acceptance criteria](ACCEPTANCE.md)
for calculator scope, precise pointing, extension boundaries, and test evidence.
The complete proposed inventory and fixed-scope sign-off gates are now in
[END-STATE.md](END-STATE.md), with [complex scenarios](SCENARIOS.md),
[rich settings](SETTINGS.md) and [primary-source research](RESEARCH.md).
Every included ZI feature must work locally on 4 GB total RAM; reduced speed or
disclosed detail is allowed, not reduced accuracy, precision or privacy.
Earlier first-release wording below describes implementation sequencing only.
It cannot authorize features added after the analysis baseline is approved.

[ALIGNMENT.md](ALIGNMENT.md) records the alignment sweeps. The corrected
contracts cover typed result/presentation handoff, evidence-aware tool routing,
graph revisions, deletion races and final dataset-export checks. The version-2
index requires individual acceptance IDs and explicit scenario/flow links;
passing artifact checks is not human sign-off or evidence of EA runtime behavior.
The third sweep additionally checks exact reference blocks, domain setting links
and graph shape/reachability, and clarifies cache, voice and worker lifetimes.
The current audit record supersedes previous verification counts, not their history.

The user has now confirmed F-32: embed Archi's editable flowchart workspace inside
EA for requested methodology assistance. Chart creation is internal work, not
external-app control. Shared finite budgets, repetition/no-progress detection,
independent timeouts and no self-triggered revisions prevent runaway generation;
the detailed contract is in END-STATE.md and scenario SC-21.

The earlier R-01..08 research pass added eight detailed views and scenarios
SC-22..29 to the then-32-family inventory. They specify evidence cases,
independent typed-output validation, selected chart patches, finite-domain branch
checks, resource supervision, per-store forgetting, artifact trust and traceability.
These are proposed refinements under the open analysis, not a signed expansion or
an implemented assistant. RESEARCH.md separates primary-source facts from EA
design inferences; REFINEMENTS.json connects each item to requirements, settings,
pseudocode and diagram nodes. Exact logic/default limits and all 4 GB runtime
results remain open. No new features may enter after explicit sign-off.

The user also confirmed computer-wide information discovery within reviewed local
permissions, exact readable extraction, focused clarification and eligible
conversation continuity. SC-30..33 specify search gaps, exact rule identifiers,
sports context and corrected follow-ups; SEEK/EXTRACT/TALK detail the flows.
Approved local files and visible apps/pages remain sources. Confirmed on
2026-09-19: explicit public-source research is allowed, with all AI and screen
context local; outbound public queries have separate review. No cloud inference,
background research, browser control or private-context transmission.
Screen-history saving is confirmed off by default, with short-lived RAM context
and no retrospective saving. Exact formats, search/question/cache limits and
optional saved-memory lifetimes still need
approval and 4 GB evidence. Conversation memory is not automatic weight training.

The new customization/creation direction explicitly adds F-33..35, making 35
proposed feature families. The five CFG/INK/MAKE/LEARN/CARE flows and SC-34..38
detail module profiles, requested screen objects, code/text artifacts, guided
learning and humane support. The user confirmed peace/love/respect as core values
and export/import with actual training in a separately launched self-hosted tool.
Exact defaults/providers/formats remain open, not automatically approved by this
addition. ZI can complete bounded internal work on request but gains no external
executor or web lookup. This remains an analysis workspace, not a working assistant.

## The Problem

People encounter unfamiliar software whose vocabulary, icons, menus, and
errors do not match the words they use to describe their goal. Help is
scattered across the interface, local documentation, configuration files,
and previous troubleshooting. Users repeatedly rediscover the same facts.

EA helps someone understand the software in front of them. It observes
permitted evidence, finds relevant controls and explanations, and remembers
only what the user permits. A friendly movable, resizable panel connects
the user's question to specific places in their actual software.

The first product promise: "Ask about this software; I can show what I found,
where I found it, and what you could do next. You control what I remember."

"All-knowing" is not a testable capability. A useful replacement is
"thorough within a stated scope, with visible gaps and source evidence."
EA must be able to say that it found three relevant controls and could not
inspect two menu branches. Missing evidence must not become invented labels.

## Confirmed Direction

- Available through click or Super+Shift+8; hiding preserves separately enabled observation.
- Optional scoped background observation, only when explicitly enabled; this does not authorize unsolicited assistance or external actions.
- Friendly panel that moves, resizes, and reflows its contents.
- GNU/Linux first; macOS and Windows are future targets.
- Every included ZI feature works locally on 4 GB total system RAM with no required GPU; this needs feasibility evidence, not just a file-size estimate.
- Read permitted files and interface content, including menus and submenus.
- Search reviewed local roots for relevant supported file content, with visible coverage limits.
- Extract readable sourced answers, ask focused clarification questions, and carry eligible corrected context across turns.
- Use approved local files and visible apps/pages, plus explicitly requested public-source research with local AI; no private-context upload, browser control or background feed.
- Reveal information without activating application commands or running shell commands.
- Maintain a user-controlled knowledge database, including permitted software-use history.
- Collection toggle; accessible inspection, correction, deletion, and export.
- Consider compacting knowledge and preparing future training data.
- Collection off still allows explicit, temporary-only inspection; no retrospective saving.
- Free to use without a required account, paid API, subscription, ads, or data sale.
- User-driven setup wizard and easily revisited settings.
- Cyborg-inspired, funny practical companionship; transparent learned mannerisms, separate user profiles and no generic social check-ins.
- Passive link-risk guidance and interpretation of user-run antivirus scans.
- A free, fully equipped internal graphing calculator; exact feature priorities remain under review.
- Accurate, click-through screen circles based on target identity and current display geometry.
- A text-first core plus predeclared optional local voice, animation and advanced personalization, all specified before freeze.
- ZII is the future execution/autonomy edition, separate from ZI.
- Useful defaults plus deep module/profile customization with visible dependencies and effective settings.
- Requested EA-owned annotation layers, exact-format code/text drafts and explicit Copy/new-file exports.
- Accessible guided examples/export/adapter review; user launches actual self-hosted training separately.
- Peace, love, noncoercive support, accessibility and respect for people, privacy and devices.

## Proposed Scope

| Capability | Proposed End-State Direction | Boundary Or Analysis Decision |
| --- | --- | --- |
| Companion | Movable/resizable panel, readable reflow, focus on demand, pause/stop | Predeclared voice/animation must be specified before freeze |
| Software catalog | App identity/version, first/last observed use, what EA has learned | Installed software and used software are distinct; past usage cannot be reconstructed without evidence |
| Interface reading | Accessible names, roles, state, menu paths, tooltips, control bounds | Apps with custom rendering may expose little usable information |
| Menu exploration | Confirmed: read exposed menus; user opens hidden ones | No menu-reveal adapter, generic clicking or keyboard injection |
| File reading | Selected sources or explicit computer-wide discovery over reviewed local roots; streamed supported content and readable extraction | No default whole-disk crawl, unsupported-decoder promise, scripts, macros, privilege escalation or app invocation; disclose gaps |
| Visual evidence | Selected crop, OCR when needed, visible-control highlighting | General interpretation of unlabeled icons is an experiment until evaluated |
| Answers | Clarify material ambiguity, explain, cite exact labels/document sections, show discovered matches and improve follow-ups with eligible context | No claim of exhaustive coverage, live facts without dated evidence, or retention through conversation beyond source rules |
| Memory | Local database, exact search, preferences, app facts, sources, user feedback | Predeclared optional F-30 needs a measured benefit and an include/exclude decision before freeze |
| Data controls | Observe, retain, recall, correct, forget, expire, export | Continuous watching remains a separate opt-in capability |
| Training | Reviewed dataset export and compatible adapter lifecycle with provenance | Weight training is outside ZI, not a high-RAM ZI feature |
| Calculator | Exact/numerical math, interactive 2D and proposed bounded 3D/ODE modes | Approve finite domains before freeze; positive 4 GB cases and independent correctness tests |
| Pointing | Fresh target bounds transformed to a noninteractive overlay | Resolution alone is insufficient; uncertain mappings abstain |
| Assistant tools | Notes, explicit reminders, conversions, document comparison, and planning | Candidates for prioritization, not all confirmed release commitments |

The initial compatibility target should be a small tested set of Linux apps
and toolkits, including both a GTK app and a Qt app. Generic support can be
partial. Browser app inspection, private tabs, Electron, remote desktops,
games, and custom canvases need their own compatibility work.

Linux's AT-SPI exposes accessible objects and their actions. Actions can
include opening a popup or clicking a button, so introspection and invocation
must stay distinct. A name like "open" does not establish the absence of
side effects. ZI therefore exposes introspection only; the user confirmed that
all menu opening stays manual. See the
[AT-SPI action interface](https://gnome.pages.gitlab.gnome.org/at-spi2-core/devel-docs/doc-org.a11y.atspi.Action.html).

If zero application side effects is an absolute requirement for every app,
the user must open all unknown menus. Selecting a tab or expanding a custom
widget can trigger application behavior too. We should never assume that a
generic click is harmless because its target looks like a menu.

## Requisition Flow Example

User: "How do I stop the requisition flow?"

EA identifies the selected app and searches the inspected UI and permitted
documentation for relevant flow controls. It reads exposed labels and builds
paths such as `Workflow > Requisition`. Revealing a closed menu requires the
user. The previously proposed reveal adapter was excluded on 2026-09-19.

Suppose the upper-right icon looks like two red strokes and its accessible
label or tooltip says "Begin requisition flow". That is evidence for the
name and location, not evidence that pressing it stops the flow. EA should
say it found a Begin control and keep looking for Stop, Pause, or Cancel,
checking documentation for their different effects.

For "What can I do with requisition flows?", EA groups all discovered
relevant controls: start, pause, stop, configure, history, and so on, but
only lists controls backed by evidence. It reports the search scope and
unreadable branches. Locations are rechecked before highlighting because
the window may have moved, resized, or changed state.

Exact controls should come from structured observations. The model can
explain relationships between those observations. Checking that a quoted
control exists catches invented labels; it cannot prove every explanation
is correct. Evaluation and honest uncertainty still matter.

## Knowledge Database

Proposed starting storage: SQLite with full-text search. FTS5 supports
searchable text within the database, so app names and exact errors do not
require an embedding model. See [SQLite FTS5](https://www.sqlite.org/fts5.html).

| Record | Contents |
| --- | --- |
| Software | Stable app identity, version, platform, observed-use dates, collection policy |
| Source | UI snapshot reference, file/chunk reference or imported documentation, timestamp, scope |
| Control | Name, role, path, state, app/version, evidence reference; bounds valid only for that observation |
| Knowledge | Source-backed fact, explanation, correction, confidence, last verification |
| Episode | Question, evidence, user-performed steps, observed or user-reported outcome |
| Preference | Explicit user choice, scope, creation/update time |
| Derivation | Which source records produced a summary, index entry, or training example |
| Policy | Global/app/source rules, retention, allowed purposes, generation number |

Software history begins when collection is permitted. Collection being off
creates an intentional gap. An app upgrade makes old UI mappings historical
until they are checked again. Memory remains on disk; only relevant snippets
are loaded into a small model context.

With background observation, collection, and usage history enabled, lightweight app-activation events can record
app identity/version and time while EA stays quiet. This does not require
reading window contents or saving titles. Terminal programs would need a
separate optional integration; seeing a terminal does not reveal every
program ever run inside it. "All software used" therefore means observed
use within enabled integrations, with coverage made visible.

## Data Controls

Confirmed distinction:
**Collect off** allows an explicitly requested one-time inspection using
temporary task memory, with no persistent content. With a separate background
opt-in, the proposed behavior also allows bounded, expiring RAM-only context.
**Background observation off** stops automatic acquisition. **Pause observation**
blocks all new screen/file/app reading until resumed. These are separate
because remembering and looking are different operations.

| Setting | Proposed values / behavior |
| --- | --- |
| Pause everything | Stop all acquisition, including usage metadata |
| Background observation | Off by default / explicitly enabled for selected sources, types, purpose, and lifetime |
| Collection | Off by default, confirmed for screen history; explicit On applies only to future permitted observations |
| Remember software usage | Lightweight app events; separate from content reading and capped by collection |
| Source access | Per-app and per-folder permission; UI text, files, screenshots independently |
| Recall existing memory | Boolean; collection off does not have to erase past knowledge |
| Retention | Task only / chosen duration / until deleted; global cap plus narrower source rules |
| Raw screenshots | Off by default; task-specific capture does not authorize background capture |
| Proactive hints | Confirmed included; separate opt-in, quiet hours and resource limits; observation alone stays quiet |
| Menu reveal | Excluded; user opens menus |
| Training eligibility | Off by default; per-record/source opt-in and reviewed export |
| Resources | RAM ceiling, CPU allowance, context limit, idle unload, storage quota |
| Forget | Record, app, source, time range, session, or everything |
| Export | Selected readable records plus a manifest; training export separately |

Rules are structured conditions, not arbitrary scripts. Simple mode offers
presets and toggles; advanced mode adds "when app/source/purpose matches,
allow or deny, with this retention." Denials take precedence, the shortest
applicable retention wins, and app rules cannot grant capabilities absent
from the product. A visible decision explains which rule applied.

Examples: "When using App A, remember menu names for 30 days but no images";
"Never read this folder"; "When RAM is low, use exact lookup only";
"Keep this troubleshooting session only until I close it."

Changing a rule increments a policy generation, cancels affected pending
reads/writes, and causes permission to be checked again before committing.
Pause clears temporary capture buffers and blocks new observation. Existing
durable data is removed by Forget or retention, not silently by pausing.
Collection off prevents new persistent observations and pending writes;
turning it back on does not retroactively save a task captured while off.

Editing a fact regenerates or invalidates its dependent summaries/indexes.
Forgetting traverses those dependencies and removes app-managed caches,
search entries, summaries, dataset copies, and backups that contain it.
An existing training adapter must be discarded or rebuilt if it used the
deleted data. User-created external copies cannot be recalled automatically.
Logical deletion is distinct from guaranteed forensic erasure on a disk.

## Compression and Training

All memory records and indexes above live inside the authenticated owner's
namespace. Queries, corrections, exports, backups and cleanup never range across
private users. PSEUDOCODE.md's Shared Operation Contract adds owner/session checks
at reads and final effects; its Durable Data Model records the namespace boundary.
Naming a profile is not an implemented authentication or storage mechanism.

These are four different operations with different consequences:

1. **Deduplicate / losslessly compress:** save storage without changing information.
2. **Summarize:** shrink context, losing detail; keep source links and mark it derived.
3. **Retrieve:** select useful stored facts for a question without changing model weights.
4. **Fine-tune:** change model behavior using an explicit reviewed dataset.

Start with retrieval. It supports corrections, deletion, and rapidly changing
software much more directly. A summary or vector does not train the model.
Deleting a database row does not remove that information from already-trained
weights. Predeclared F-23 keeps replaceable adapters with dataset manifests and
supports discarding or externally rebuilding them after deletion. The confirmed
training path is reviewed export/import; actual training is separately launched
by the user on suitable self-hosted hardware, never launched by ZI.

User-confirmed direction: separate profiles only. A shared unchanged base model
can support different users without pooling their private phrasing, opinions,
history, examples or adapters. Use bounded reviewed style data first; no-jokes
overrides act immediately, humor is situational and profanity is separately chosen.
Opinions stay attributed knowledge rather than changing factual correctness.
TONE/OWNER detail learning and session isolation; SC-39/P-18 require two-user and
mid-answer-switch tests. A workspace-profile selector is not authentication; an
unverified owner receives guest behavior, and failed isolation stays closed.

## Local Model and 4 GB Design

**Text-model benchmark candidate: Qwen3-0.6B in llama.cpp.** Compare bounded
reasoning modes, quantization and prompt packing on the same grounded fixtures;
do not disable useful reasoning by default just to improve a timing number.
The model is not selected. Exact artifacts and current evidence are tracked in
RESEARCH.md; published file sizes are not measured runtime RAM or quality.

**Challenger: Qwen3.5-0.8B**, especially for testing selected visual questions.
Its publisher describes this small model as intended for prototyping and
task-specific development. It includes a vision encoder; that does not
establish reliable desktop understanding or a 4 GB runtime fit. Benchmark
the complete runtime and image path before choosing it. A 2B candidate must
pass the same 4 GB test; there is no larger-machine ZI feature tier. See the
[Qwen3.5-0.8B model card](https://huggingface.co/Qwen/Qwen3.5-0.8B).

The baseline should use accessible text, exact lookup, and bounded file
snippets. It should load one expensive worker at a time, use short prompts
and answers, and unload it on idle or memory pressure. OCR, vision, and
embeddings should not all remain resident beside an LLM.

The current shared budget proposal in SETTINGS.md is 1 GiB for the complete EA
process tree and a 512 MiB system reserve, with 2,048 context tokens, a 512-token
answer budget and one heavy stage at a time. These are unmeasured hypotheses,
not guarantees. Temporary pressure can trigger exact lookup or smaller inputs,
but every included feature still needs a successful baseline case. The approved
workload, CPU and meaningful input bounds must be settled before sign-off.

WORK and RESEARCH.md P-17 make the optimization work explicit: exact fast paths,
bounded streaming, scoped cache reuse, targeted OCR, measured provider handoffs
and independent inference-knob trials. Start with a per-stage cost table, then
validate the combined candidate. Keep all 35 feature families in scope; gains
must preserve accuracy, required evidence, permissions and completed-task coverage.
No positive speedup or memory-fit result has been recorded yet.

Model file size excludes working buffers, prompt/KV caches, UI, OCR, and
the operating system. Pin and audit runtime defaults explicitly, including
context, batch, slot and cache limits. Disable generic built-in action/MCP/agent
interfaces in ZI; an inference runtime may include tools that EA must not expose. See
[llama.cpp server options](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

Use an isolated worker with an enforced memory limit and cancellation;
keep the companion responsive when that worker fails. Check live headroom
before loading and during work. A memory-limited worker reduces impact but
does not make an unconditional "can never crash the computer" guarantee.

## Platform Shape

Keep the companion, policy evaluator, knowledge schema, and model interface
independent of OS APIs. Define adapters for presence, UI inspection, passive
menu inspection, public-source reads and capture. Linux gets the first tested adapters; predeclared macOS and
Windows adapters must meet the same evidence and action contracts with
their own APIs and permissions. Portability is a design boundary now, not
evidence that those adapters already work. Their exact end-state support matrix
must be decided before freeze; implementation order cannot add new platforms.

## Analysis Exit Criteria

Before building EA, agree on the first demo app and question, default retention,
and public-search providers/budgets. Manual-only menus are confirmed. Collection-off
temporary inspection is confirmed.
Prepare a small recorded set of realistic questions and known UI answers.

The current ACCEPTANCE.md proposal is 100 supported questions plus 30 negative
cases over named Linux apps,
including narrow/broad queries, similar Start/Stop controls, missing labels,
stale memory, unsupported menus, and a user correction. Measure correct
answers, invented controls, missed references, and appropriate abstention
separately. Broad search must disclose partial coverage.

The eventual prototype also needs checks for zero forbidden command
activations, no persistent content when collection is off, policy changes
during a read, deletion of derived records, offline operation, and memory
pressure on a 4 GB machine with another application open.

The earlier ideas for software knowledge, evidence inspection, version changes,
correction, coverage and knowledge export/restore belong to F-03/05/07/09/10.
Resolve their exact supported surfaces now under END-STATE.md, not as an unnamed
later-additions list. ALIGNMENT.json traces the full current inventory; matching
artifacts do not replace human review or positive feasibility evidence.
