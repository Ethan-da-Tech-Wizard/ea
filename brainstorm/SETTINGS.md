# EA ZI: Setup, Defaults And Rich Help

Status: end-state requirements, not an implemented settings screen. All numeric
defaults below are proposals for the 4 GB profile; approval/measurement is required.
Every included feature must remain available on that profile, even if serialized
or rendered with less detail. No hidden high-RAM feature tier is permitted.
Approved local files and visible apps/pages remain sources; public research uses
the separate S-49 task grant, with all AI and private screen context kept local.

## First-Run Wizard

1. Explain local operation, ZI's no-execution boundary and the permission model.
2. Check named hardware/OS capabilities with consent; no personal-content inventory.
3. Review offline bundle/model integrity, disk needs, licenses and optional explicit downloads.
4. Choose Standard/Minimal/Custom modules and an independent privacy preset; review dependencies and effective permissions.
5. Select apps/files/tabs and any background scope, purpose and consent lifetime.
6. Choose retention, recall, deletion/export behavior and storage location/protection.
7. Configure internal tools, annotations, output formats, appearance, accessibility and optional learning workflows.
8. Preview the complete change set; save atomically only after confirmation.
9. Run synthetic self-tests; show actual ready/blocked/disabled states and repair options.

Every setting is reachable after setup through searchable categorized pages.
Search returns the control, its current effective value and the reason it might
be disabled. Required consent is not buried in a tooltip. No preset itself
constitutes an OS/source grant or authorizes an external action.

## Presets And Defaults

Confirmed on 2026-09-19: saving observed screen history is off by default.
Permitted reads use short-lived RAM context, even while the panel is hidden.
Enabling memory affects only new observations; existing temporary content keeps
its original expiry and cannot become saved history. Exact cache limits and
optional saved-memory lifetimes remain proposals. This confirms the retention
default without approving every other value in the proposed presets below.

| Preset | Observation | Retention | Presentation |
| --- | --- | --- | --- |
| Private On Request, proposed default | No background; source access requested per task | Collection off; expiring RAM only | Typed help, reduced motion, no unsolicited hints |
| Remember Selected Sources | On request; selected grants only | Explicit selected-source collection and lifetimes | Same quiet presentation |
| Quiet Background Context | Explicit selected background sources | Collection remains off unless separately changed | Visible observation status, no proactive hints |
| Custom | Individually reviewed values | Individually reviewed values | Individually reviewed values |

Presets produce a reviewable diff, not a silent application. A modified preset
becomes Custom. Restore Page Defaults and Restore All Defaults preview settings
changes and revoke incompatible active work; they do not delete memories,
workbooks, model files or notes. Forget is a separate explicit operation.
Importing a profile cannot import consent from another machine/user. New or
widened grants require fresh review. Save errors expose the actual enforced state.

Module composition is independent of these privacy presets. Standard proposes a
ready-on-request text core, source readers, calculator, notes, Archi, artifact
workspace and annotations; workers load lazily. Minimal selects the host and
explicitly chosen providers. Custom exposes every supported option. Voice,
animation, background observation, semantic retrieval and collection remain
separately opt-in; selecting a profile is not permission to activate them.
The immutable host enforcement/Stop/Hide All/data-management controls cannot be
removed by a theme. Users can quit/uninstall EA; the product does not lock them in.

Profiles, the advanced versioned JSON editor and GUI use the same schema and
validation. Show value origin, unsupported keys, dependencies, conflicts, required
restart and an exact before/after diff. Reject executable hooks, external references
and unknown capabilities. Explicit profile switching does not infer new scope,
restore grants, renew budgets or erase work. Existing restrictions survive failed
saves; last-valid rollback never restores revoked sources or adapters.

## A Help Icon For Every Option

Each control has a familiar info icon with an accessible name. Hover or keyboard
focus shows concise rich help; clicking/tapping pins the detailed version.
Escape dismisses it; moving into the help surface keeps it open. It must fit
small windows, enlarged text and screen magnification without covering the
focused setting. Long content has a keyboard-operable details view. No essential
meaning is available only through hover, color or animation.

The interaction requirements follow the W3C guidance for content revealed on
hover/focus: users must be able to dismiss and read it without unpredictable
disappearance. This is a design reference, not a claim of WCAG conformance.
[W3C explanation](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)

Every option's help includes these fields, generated from the same settings
schema as its control/default, not independently maintained copies:

- What it does and what changes when enabled, disabled or adjusted.
- Proposed/approved default, chosen value, effective value and any overriding rule.
- Data read, retained, deleted or transmitted; scope and consent lifetime.
- Expected CPU/RAM/storage/battery costs and whether work can be paused/cancelled.
- Dependencies, conflicting settings, security/privacy limitations and restart effects.
- A concrete example and a link to the relevant requirement/retention explanation.

Example for Background Observation:

```text
Purpose: keep context from sources you explicitly select while you work.
Off: no automatic acquisition; questions can still request a permitted read.
On: bounded passive reads within the approved sources, types and lifetime.
Saving: unchanged. Collection off keeps context in an expiring RAM cache only.
Network: no screen/private-context upload or cloud inference. Public research
requires a separate reviewed query/provider; background observation sends nothing.
Cost: event processing and temporary memory; optional OCR is separately budgeted.
Overrides: Pause, lock, protected-source exclusion, expiry or revoked grants.
Example: watch your chosen editor without watching a private browser window.
Stop/forget: turning this off stops observation; Forget removes saved knowledge.
```

## Settings Inventory

These stable IDs must each have the help fields above. This is the complete
proposed control inventory for review; "advanced" does not mean undocumented.
Controls use toggles for booleans, menus for option sets, numeric inputs/steppers
for quantities, and source pickers for grants. Commands such as Forget are
separate buttons with consequence previews, never misleading binary toggles.

| ID | Page / Option | Control / Proposed Default | Rich-Help Subject And Dependency |
| --- | --- | --- | --- |
| S-01 | Privacy / Background observation | Toggle / off | Automatic reading versus requested help; independent of saving |
| S-02 | Privacy / Background sources | Source picker / none | Selected apps/windows/paths/origins and excluded contexts; never implicit all tabs |
| S-03 | Privacy / Background lifetime | Menu / session | Expiry, restart/unlock behavior and explicit remembered consent |
| S-04 | Privacy / Collection | Toggle / off; screen-history default confirmed | Short-lived RAM context by default; enabling saving applies only to future observations, never existing temporary context |
| S-05 | Privacy / Recall | Toggle / on | Existing knowledge can be recalled with collection off; current permissions still apply |
| S-06 | Privacy / Software-use history | Toggle / off | Requires background, collection and a scoped metadata grant; no titles/keystrokes |
| S-07 | Sources / Foreground grants | Source picker / request-specific | App/file/tab/region scope, user identity and revocation |
| S-08 | Sources / Exclusions | Rule editor / protected sources denied | Password/private contexts and deny precedence; uncertain isolation means skip |
| S-09 | Sources / Task capture | Permission picker / ask | Selected screenshot/crop, coordinate provenance, temporary image handling |
| S-10 | Sources / Background capture | Toggle plus scoped grant / off | Recurring visual reads are separate from a task screenshot; no covert video |
| S-11 | Memory / Save raw images | Toggle / off | Storage/privacy impact; OCR does not require image retention |
| S-12 | Memory / Retention | Duration menu/input / task-only | Scope-specific expiry; shorter deny/retention rules win; collection still required |
| S-13 | Memory / Temporary cache size | Numeric / 16 MiB proposal | Atomic global and aggregate per-task accounting, including metadata/live handles and replacement deltas; 8 MiB per-task text is a sublimit, not extra; evicted-but-referenced buffers remain charged; EA-OPT-03 |
| S-14 | Memory / Temporary cache lifetime | Numeric / 120 seconds proposal | Earliest task, evidence and source-use deadline wins; hits/reinsertions cannot renew old evidence; fresh acquisition is distinct; no forensic-erasure promise |
| S-15 | Memory / Durable quota | Numeric / 256 MiB proposal | Index/owned backup accounting, full-store behavior and explicit cleanup review |
| S-16 | Memory / Semantic retrieval | Toggle / off | Optional local embeddings, extra RAM, source lineage and deletion; no quality exemption |
| S-17 | Memory / Owned backups | Toggle / off | Included data, quota, encryption/protection status and tombstone-aware restore |
| S-18 | Training / Eligible sources | Purpose/source picker / none | Separate dataset consent, redaction, provenance and revocation limits |
| S-19 | Models / Local model | Artifact selector / none until validated | Publisher/license/hash, tokenizer, runtime support, memory and measured quality |
| S-20 | Models / Adapter | Artifact selector / none | Exact base/tokenizer compatibility, evaluation, rollback and deletion lineage |
| S-21 | Performance / RAM ceiling | Numeric / 1024 MiB proposal | Whole process tree, finite reviewed stage profiles, loader/handoff peaks, no overcommit loophole; RESEARCH allocation experiment is not measured usage; EA-OPT-02 |
| S-22 | Performance / System reserve | Numeric / 512 MiB proposal | OS/app headroom; cannot prevent unrelated applications consuming memory |
| S-23 | Performance / CPU allowance | Numeric/preset / measured low-RAM profile | One heavy worker; tested thread/prefill profiles, responsiveness, battery and thermal behavior; no worker accumulation |
| S-24 | Performance / Context limit | Numeric / 2048 tokens proposal | Input selection, cited coverage, no silent removal of required evidence |
| S-25 | Performance / Answer budget | Numeric / 512 tokens proposal | Concision versus needed explanation; allow reviewed continuation without guessing |
| S-26 | Performance / Model warm lifetime | Duration / 0 seconds proposal | Cold-start cost versus measured residency; weights and private prompt caches differ; retained pages remain charged and consent never extends for speed |
| S-27 | Observation / Event rate | Numeric / 2 admitted events/sec proposal | Coalescing, bounded queues and priority for requested help |
| S-28 | Mathematics / Angle mode | Segmented menu / radians | Visible degrees/radians, expression-level explicit units and saved workbook state |
| S-29 | Mathematics / Domain | Menu / real | Complex-domain support, excluded solutions and variable assumptions |
| S-30 | Mathematics / Numerical tolerance | Validated numeric/profile / per-operation approved defaults | Exact versus approximate answers; conditioning; never silently loosen tolerance |
| S-31 | Mathematics / Plot detail | Menu / automatic bounded | Display samples/mesh versus mathematical accuracy; incomplete-region disclosure |
| S-32 | Voice / Input | Toggle / off | Local push-to-talk and explicit mic grant; one owner-bound ledger starts before capture; close mic before ASR/confirmation; uncertainty never renews the task |
| S-33 | Voice / Spoken replies | Toggle / off | Speak requested typed or voice answers; typed output needs no mic grant. Same original task limits, mute/revoke checks; failed speech preserves text and never reruns help |
| S-34 | Voice / Language and voice | Tested-language/voice selectors / chosen during setup | Supported language/voice artifacts, quality, licenses and offline availability |
| S-35 | Voice / Retain raw audio | Toggle / off | Separate purpose/lifetime; transcript permissions do not authorize raw recordings |
| S-36 | Appearance / Character motion | Segmented menu / reduced | Static/reduced/full states; animation cannot block interaction or change task truth |
| S-37 | Accessibility / Text size and contrast | Numeric plus theme menu / system-readable defaults | Reflow, help placement, keyboard visibility and screen-reader labels |
| S-38 | Personality / Tone and detail | Menus / friendly, balanced | Presentation only; no altered evidence, permissions or computed results |
| S-39 | Personality / Learn preferences | Toggle / off | First-party owner-scoped proposals; preview/edit/accept/reset, proposed 16 fields/4 KiB active style cap within existing budgets; no background training, sensitive profiling or borrowed speakers; EA-PERSONA-03 |
| S-40 | Personality / Preference lifetime | Menu / session | Explicitly saved setting versus observed behavioral data and its source rules |
| S-41 | Suggestions / Proactive hints | Toggle / off until separately enabled, inclusion confirmed | Bounded local technical hints, quiet hours and rate limits; hidden-panel badge without reopening; no background research, speech/circles or generic social check-ins |
| S-42 | Suggestions / Quiet hours | Time/zone controls / user review | Suppress unsolicited hints, not explicit answers; no inferred time zone |
| S-43 | Suggestions / Hint frequency | Numeric / at most 2/hour proposal | Deduplication, eligibility, cooldown and silent suppression |
| S-44 | Reminders / Missed events | Menu / show once on resume | Sleep/restart, recurrence/DST semantics, snooze/cancel and duplication prevention |
| S-45 | Startup / Launch EA | Toggle / off | Availability is not observation; persisted consent lifetimes checked on restart |
| S-46 | Diagnostics / Local diagnostics | Toggle / off | Content-free bounded metadata, explicit redacted export, no telemetry upload |
| S-47 | Installation / Download consent | Per-artifact confirmation / ask | Explicit installer traffic, publisher/destination/size; runtime networking unchanged |
| S-48 | Storage / Protection status | Read-only status plus configured setup choice | Actual encrypted/OS-account protection, key recovery/loss, backup implications; never label unencrypted data encrypted |
| S-49 | Network / Public-source research | Separate task grant / no request until reviewed, confirmed | Public terms/URL and recipient shown; AI and screen content stay local. No private-context query generation, cloud fallback, background fetch, login or browser control. Search-provider availability and limits remain unmeasured. |
| S-50 | Flowcharts / Requested chart generation | Toggle / on in the proposed included feature | Embedded Archi creates EA-owned drafts only after an explicit request; diagram edits, observation and sync events never self-trigger generation |
| S-51 | Flowcharts / Generation limits | Bounded numeric controls / 3 total passes, 90 active seconds, 200 nodes, 400 edges, 8 subflows, depth 3 proposed | Shared parent limits include repairs and children; settings can tighten caps, never select infinity; repetition/no-progress and Stop terminate early; preserve the last valid draft |
| S-52 | Flowcharts / Layout scope | Menu / preserve existing layout | R-03: only new or explicitly selected unpinned elements may move; full re-layout needs an explicit preview; unrelated text/colors/routes remain protected; EA-PATCH-01/02 |
| S-53 | Logic / Branch-check limits | Bounded numeric controls / 5 active seconds, 16 variables, 16 values each, 200 predicates, 32 path edges, 32 witnesses proposed | R-04: shared shrinking limits for all queries; tighter parent wins; user-confirmed guards/domains, incomplete coverage and UNKNOWN/TIMEOUT never imply a proof; EA-LOGIC-01/02 |
| S-54 | Search / Locations and exclusions | Source picker / no broad roots by default | Computer-wide discovery needs reviewed local roots; filename enumeration is a read; protected sources, link escapes and unapproved mounts remain excluded; EA-SEEK-01 |
| S-55 | Search / Mode and limits | Fast/thorough segmented control plus bounded numeric inputs / fast, 60 active seconds, 10000 entries, 64 MiB source bytes proposed | Thorough scans eligible supported content, not just filenames; all traversal/decoding/extraction shares caps and cache RAM; report partial coverage; explicit continuation only; EA-SEEK-02/03 |
| S-56 | Conversation / Clarification rounds | Bounded numeric input / 3 proposed | One material question per round; meaningful choices/free text/Skip/Cancel; no automatic answer or grant; no repeated-question loop or unbounded waiting; EA-TALK-01 |
| S-57 | Conversation / Saved thread history | Toggle plus reviewed lifetime/source selection / off | Active bounded context is separate from disk history; saved content remains editable/deletable and source-eligible; collection off cannot be bypassed through recaps; memory is not training; EA-TALK-02/03 |
| S-58 | Modules / Composition | Preset plus per-module toggles / Standard proposed | Standard/Minimal/Custom independent of privacy; dependencies, lazy loading, no workers for disabled modules, invariant host controls; EA-CFG-01 |
| S-59 | Profiles / Active workspace profile | Named-profile selector and explicit switch command / Standard | Chosen/effective value origin, revision preview, no automatic foreground-app switching or transferable grants; EA-CFG-02 |
| S-60 | Profiles / Advanced configuration | Versioned JSON editor and validate/import/export commands | Same schema/help as GUI, unknown-key/cycle errors, secret-free portability, no eval/hooks/remote references; EA-CFG-02/03 |
| S-61 | Appearance / Workspace customization | Color/font/layout menus and key-binding editor / Super+Shift+8 or click toggles panel, confirmed | Hide preserves observation; Pause/Stop remain separate and reachable with an observation indicator. Show actual binding, remap/conflict/unsupported fallback; no key logging. EA-CFG-03 and EA-PRESENCE-01. |
| S-62 | Annotations / Tools and style | Icon tools, color swatches and width/text numeric inputs / ellipse, 2-pixel stroke proposed | Arrow/box/stroke/text choices, source versus user-positioned anchor, click-through display and EA-only editing; EA-INK-01/02 |
| S-63 | Annotations / Limits and lifetime | Bounded inputs / 50 objects, 10000 points, 16 KiB text, 60 seconds proposed | Tighter task/source/RAM limits win; stale/lock/revoke hides first, no self-renewal; EA-INK-03 |
| S-64 | Artifacts / Output contract | Format/version/encoding/newline menus, indentation stepper, exact-payload toggle / plaintext, UTF-8, LF proposed | Explicit supported grammar/schema; exact JSON has no prose/fences; explanations separate, syntax validity not runtime proof; EA-MAKE-01 |
| S-65 | Artifacts / Generation limits | Bounded numeric inputs / 3 passes, 60 active seconds, 256 KiB total, 8 file previews proposed | Shared repairs/children, repetition/no-progress stop, no generated tests or code execution; EA-MAKE-02 |
| S-66 | Artifacts / Delivery | Explicit Copy/Export commands plus owned-clipboard clear timer / 60 seconds proposed | No auto-copy/paste; current payload/source/destination checks, new-file-only exports, never clear a newer clipboard owner; external histories cannot be recalled; EA-MAKE-03 |
| S-67 | Learning / Improvement method | Preferences/Knowledge/Examples/Adapters tabs / no automatic method | Distinguish memory, style and weights; actual training stays in separately launched self-hosted tool, no trainer launch; EA-LEARN-01 |
| S-68 | Learning / Dataset preparation | Schema selector and bounded inputs / 1000 examples, 16 MiB, 20 percent held out proposed | Review/redact/exclude, group duplicates/sources across splits, insufficient-data status, consent/lineage, no invented evaluation; EA-LEARN-02/03 |
| S-69 | Support / Communication style | Direct/encouraging menu with detail control / supportive, balanced | Peace and respect without forced cheerfulness, shaming, guilt, hidden engagement pressure or changed facts; EA-CARE-01/02 |
| S-70 | Recipes / Local templates | Reviewed catalogue and inert-template editor / no automatic recipe runs | Everyday task inputs and format defaults only; no new tools, hooks, source grants or recursive jobs; EA-MAKE-01/02, EA-CFG-02 |
| S-71 | Personality / Humor and language | Humor mode menu, intensity slider, slang and profanity toggles / light situational humor, profanity off proposed | Funny is not mandatory in every reply; serious/no-jokes overrides immediately; language does not alter evidence, warnings or exact payloads; independent accessible help for each control; EA-PERSONA-02 |
| S-72 | Users / Active identity | Verified account selector and explicit switch/guest commands / trusted current user or guest | Separate profiles only; not a sharing-mode toggle or S-59 workspace preset. No voice/style identification; switch closes old output, clears private context and checks auth/storage before restore; EA-PERSONA-04/05 |

S-71/72 receive the same hover/focus/pinned descriptions, keyboard access and
current/effective value reporting as all other controls. Humor/language defaults
and the 16-field/4 KiB style envelope are proposals; separate profiles and no
generic social check-ins are confirmed. The active style's token allowance must
fit alongside mandatory evidence. Do not expose a pretend account-security switch:
same-OS-account isolation needs a tested design, otherwise use guest behavior.
No shared-personality option, covert identity inference or automatic training.

Every constituent control of S-58..70 receives the same hover/focus/pinned rich
help, keyboard access and current-value reporting. Preset, profile and recipe
names are user content, not reserved personality types or permission grants.
Learning tab names and all new numeric defaults are proposals; guided export/import
with external training is confirmed. No actual trainer or model is installed here.

Each constituent of S-54..57 has the same accessible rich help as other settings.
Clear Topic, Correct Conversation Fact and Forget Saved Conversation are separate
commands with clear scope; forgetting saved content uses the existing deletion
barrier. No conversation setting permits source reads while a clarification waits,
extends a source grant or automatically enables collection/training. S-49's
public-source research with local AI and private screen context is confirmed
(2026-09-19); exact providers and other unapproved defaults remain proposals.

S-53 has a separate help icon for every numeric control. No unlimited setting,
automatic diagram-check loop or automatic chart generation accompanies it. The
guard/domain editor is a task input with explicit review, not a global grant.
Defaults require pre-freeze measurement and approval on the same 4 GB baseline.

Research refinements also extend existing help: S-05/16 explain exact-before-
semantic retrieval and source eligibility; S-15/17 distinguish exclusion from
per-store cleanup; S-19/20/47 show artifact identity, trust and offline freshness;
S-21..26 explain tested enforcement, scoped prompt-cache reuse and unavailable
protection. S-38 affects case presentation only, not the evidence. These are
not switches to disable output validation, tombstones or the ZI action boundary.

F-32's built-in workspace is confirmed; numeric caps remain analysis proposals,
not measured performance. Every numeric constituent of S-51 has its own rich-help
icon. Explain that a deliberate loop drawn in a methodology is different from
an assistant stuck repeatedly generating charts. There is no automatic chart
execution or a switch that disables all stopping limits.

S-34, S-37 and S-38 contain paired controls; each constituent control receives
its own info icon/help content and individual accessible name. Exact supported
language lists and storage-protection choices are freeze-blocking decisions.
Data-collection controls do not block explicit writes of user-authored notes or
settings, but observed source content cannot be relabelled to evade retention.

## Commands And Failure Behavior

Pause All Reading, Stop Current Task, Forget Selection, Forget All, Export
Selection, Preview Training Export, Backup/Restore, Validate Model/Adapter,
Reset Page, Reset All, Import/Export Settings and Uninstall each require a clear
outcome/status and appropriate preview or confirmation. None invokes a ZI
external executor. Help content must explain consequences for each command too.

Export Selection is an ordinary knowledge export; Preview Training Export adds
independent training-purpose consent. Neither launches training. Both obey exact
payload, owner/session, source-retention and new-destination checks. Continuation
after a limit creates a new explicitly requested task, never resets the old ledger
or extends earlier evidence expiry. A clarification reply resumes the existing
task and its remaining limits. Linked controls are indexed in ALIGNMENT.json.

Acquisition consent, temporary working-data expiry and approved saved-data retention
are distinct clocks. Saving eligible data before its working copy expires may
create a reviewed durable record under source-retention limits; it never refreshes
the RAM copy, extends a read grant or saves collection-off content. Derivatives
cannot exceed their parents' permitted saved-data lifetime. Requested own-data or
settings commands use the same explicit controller review whether typed or spoken;
confirming a transcript is not approving a deletion, export or widened grant.

Changes validate before commit. Revalidation occurs after any asynchronous
permission prompt and immediately before publishing the effective policy.
Revocations/tightening apply safely even if settings persistence fails; the UI
reports unsaved restrictive state rather than a false success. Default restoration
and imported profiles never erase data or enlarge grants without explicit consent.

## Acceptance

EA-SET-01: every included control/command has accessible rich help with all fields.
EA-SET-02: preset/reset/import previews show chosen versus effective permissions.
EA-SET-03: compatible settings round-trip; invalid/imported grants cannot bypass consent.
EA-SET-04: corrupt settings/disk-full/revocation during save retain restrictive truth.
Test hover, keyboard, touch, Escape, focus order, 200% text, narrow windows and
the screen-reader path. Test help opening/dismissal causes zero settings changes.
