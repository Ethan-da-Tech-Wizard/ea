# EA ZI: Atomic Flow Reference

Analysis only. 64 views, 1035 nodes. Every numbered node maps to one shape in the editable board.

Reconciled from the saved Archi project. The saved Archi JSON is authoritative after interactive edits; do not regenerate over it.

## Reading The State Machines

Each state performs one operation or evaluates one predicate. Arrows are explicit transitions. CALL denotes a conceptual subflow, not an implemented function. Common cancellation, policy revalidation, error handling, and resource cleanup apply at every I/O boundary; see PSEUDOCODE.md.

## 00 ZI System Map

EA ZI (Roman numeral one, honoring Konrad Zuse). Read, find, assemble, preview, and guide. No external task execution. All capabilities are analysis proposals until implemented and tested.

### MAP-01: Receive an event

Events are user questions, explicit memory operations, policy changes, or permitted observation events.

```text
event = await user_or_policy_event()
ON question -> MAP-14
ON control event -> MAP-13
```

### MAP-02: Handle a question

Own one bounded troubleshooting request. Stop and cancellation remain available throughout.

```text
CALL request
THEN -> MAP-03
```

Detailed flow: 02 Request & Scope.

### MAP-03: Authorize the request

Resolve acquisition separately from retention and recall. Collection off allows explicit temporary help.

```text
CALL policy
ON allowed -> MAP-04
ON denied -> MAP-11
```

Detailed flow: 03 Authorization.

### MAP-04: Inspect permitted sources

The UI flow delegates menus, selected files, and optional captures to bounded adapters.

```text
CALL ui
THEN -> MAP-05
```

Detailed flow: 05 Interface Reading.

### MAP-05: Retrieve allowed memory

Use only current-policy, non-deleted evidence. Retrieval must not secretly expand acquisition.

```text
CALL recall
THEN -> MAP-06
```

Detailed flow: 09 Knowledge Retrieval.

### MAP-06: Build an evidence set

Keep exact labels, source paths, versions, timestamps, and coverage gaps.

```text
CALL evidence
THEN -> MAP-15
```

Detailed flow: 10 Evidence & Meaning.

### MAP-07: Check resource headroom

No required GPU. A 4 GB computer means 4 GB for the entire desktop, not for EA alone.

```text
CALL resources
THEN -> MAP-08
```

Detailed flow: 11 Resource Admission.

### MAP-08: Draft an answer

Use a bounded local model only when the admission guard allows it; otherwise use evidence templates.

```text
CALL inference
THEN -> MAP-09
```

Detailed flow: 12 Local Inference.

### MAP-09: Present grounded help

The user activates commands. EA explains and can highlight a freshly verified control.

```text
CALL answer
THEN -> MAP-10
```

Detailed flow: 13 Answers & Highlights.

### MAP-10: Evaluate persistence

Only eligible, policy-authorized records enter the database. Off-captured data stays ineligible.

```text
CALL retain
THEN -> MAP-12
```

Detailed flow: 14 Durable Memory.

### MAP-11: Return to idle

No autonomous command execution follows any path.

```text
RETURN idle
END FLOW
```

### MAP-12: Release task buffers

Return a guarded typed result to the common typed/voice delivery path. Transfer only requested live presentation resources under original limits; output-only speech needs no microphone grant. Finally releases everything else; Stop, expiry, owner/source changes and deletion still invalidate results.

```text
release_only_untransferred_task_resources()
THEN -> MAP-11
```

### MAP-13: Handle a control event

Startup, permissions, memory operations, and personality changes are separated from the help pipeline.

```text
CALL controls
THEN -> MAP-11
```

Detailed flow: 27 ZI Control Events.

### MAP-14: Identify the requested capability

Interpret the explicit request first. Typed mathematics and other internal tools do not acquire desktop context. The common cleanup contract applies to every exit.

```text
CALL capabilities
ON context required -> MAP-02
ON internal result -> MAP-10
ON clarification or unavailable -> MAP-11
```

Detailed flow: 28 Intent & Capabilities.

### MAP-15: Internal tool needs this evidence?

Source-based mathematics, charts, code/text and requested annotations return to their typed internal handler after authorized extraction. Ordinary guidance continues to grounded explanation.

```text
IF intent.has_registered_internal_result_kind
ON yes -> MAP-16
ON no -> MAP-07
```

### MAP-16: Use the requested evidence tool

Reuse resolved intent, owner and parent ledger; no repeated classification or recursive context acquisition. Preserve evidence revisions and sticky retention eligibility. CAP dispatches to CAL, CHART, MAKE or INK as applicable; ambiguous extracted input needs confirmation.

```text
CALL capabilities(request, validated_evidence = bundle)
THEN -> MAP-10
```

Detailed flow: 28 Intent & Capabilities.

## 01 Presence

A visible companion is not permission to observe. Stay available without stealing focus. Help on request and explicitly enabled background observation are confirmed directions; operating defaults remain proposals.

### LIFE-01: Start EA

Create a local session identifier, not a content-bearing analytics event.

```text
session = new_session()
THEN -> LIFE-02
```

### LIFE-02: Load local settings

Use restrictive defaults when settings are absent. A corrupt policy cannot become allow-all.

```text
settings = read_settings()
THEN -> LIFE-16
```

### LIFE-03: Settings valid?

Validate types, permission values, paths, and resource limits before using them.

```text
IF validate(settings)
ON yes -> LIFE-05
ON no -> LIFE-04
```

### LIFE-04: Use restrictive defaults

Acquisition and retention begin disabled; user can repair settings explicitly.

```text
settings = restrictive_defaults()
THEN -> LIFE-05
```

### LIFE-05: Detect platform capabilities

Detect display server, accessibility interfaces, and compositor limitations.

```text
capabilities = CALL platforms
THEN -> LIFE-06
```

Detailed flow: 20 Platforms & Release Gates.

### LIFE-06: Create the companion panel

Movable, resizable, reflowing, keyboard-accessible UI. No permanent focus grab.

```text
panel = create_panel()
THEN -> LIFE-07
```

### LIFE-07: Restore panel placement

Keep it reachable after monitor removal or display-scale changes.

```text
restore_clamped_geometry(panel)
THEN -> LIFE-08
```

### LIFE-08: Foreground mode supported?

Wayland compositors decide stacking and overlay protocols. Do not promise unconditional supremacy.

```text
IF capabilities.overlay
ON yes -> LIFE-09
ON no -> LIFE-10
```

### LIFE-09: Request approved overlay mode

Use compositor-supported behavior while respecting locks, fullscreen policy, and user focus.

```text
request_overlay(panel)
THEN -> LIFE-11
```

### LIFE-10: Use an ordinary window

A pinned or normal accessible window is a valid fallback when overlay capability is absent.

```text
set_window_mode(panel)
THEN -> LIFE-11
```

### LIFE-11: Wait for an authorized event

Serve explicit questions and events from a separately enabled bounded observer. Startup and policy reconciliation install only live scoped subscriptions; no screen polling follows merely from being visible.

```text
event = await event_queue.next()
ON question -> LIFE-12
ON pause -> LIFE-13
ON stop -> LIFE-14
ON exit -> LIFE-15
ON background -> LIFE-18
```

### LIFE-12: Start a help request

Run the full request orchestrator, starting with intent classification. Typed mathematics does not read desktop sources. Do not start a second expensive worker while one is active; offer cancel or queue.

```text
CALL overview(question)
THEN -> LIFE-11
```

Detailed flow: 00 ZI System Map.

### LIFE-13: Pause acquisition

Pause differs from collection off: stop acquiring new source data, including active reads.

```text
CALL rules(pause = true)
THEN -> LIFE-11
```

Detailed flow: 15 Policy Changes.

### LIFE-14: Cancel the active request

Cancel pending reads and model output; no partial persistence after cancellation.

```text
cancel(active_request)
THEN -> LIFE-11
```

### LIFE-15: Release session resources

Unload model, close handles, invalidate temporary context. Memory-only does not promise forensic erasure from swap.

```text
release_session()
END FLOW
```

### LIFE-16: Setup already completed?

A new installation begins with explicit choices rather than silent observation.

```text
IF settings.setup_complete
ON yes -> LIFE-03
ON no -> LIFE-17
```

### LIFE-17: Run the user-driven setup wizard

Configure EA itself; this does not enable external application execution.

```text
CALL setup
THEN -> LIFE-03
```

Detailed flow: 21 ZI Setup Wizard.

### LIFE-18: Dispatch an observer event

The central event router selects Background Observation or separately authorized software-use history. This is not a user request and cannot borrow foreground privileges.

```text
CALL overview(event)
THEN -> LIFE-11
```

Detailed flow: 00 ZI System Map.

## 02 Request & Scope

Bound one question before reading. A broad question expands coverage within limits; it never grants whole-computer access.

### ASK-01: Accept the question

Keep question text ephemeral until a separate retention policy permits storing it.

```text
request = accept_user_text()
THEN -> ASK-02
```

### ASK-02: Another request active?

A single-worker design avoids accidental concurrent model loading on small machines.

```text
IF worker.busy
ON yes -> ASK-03
ON no -> ASK-06
```

### ASK-03: Ask for queue or cancel

Never silently discard an active investigation or launch another heavy worker.

```text
choice = ask_user()
ON queue -> ASK-04
ON cancel old -> ASK-05
ON dismiss -> ASK-17
```

### ASK-04: Queue a bounded request

Keep at most one pending question in temporary memory; additional input replaces only with consent.

```text
queue_one(request)
THEN -> ASK-17
```

### ASK-05: Cancel the previous request

Wait for cancellation acknowledgement before admitting another worker.

```text
cancel(active_request)
THEN -> ASK-06
```

### ASK-06: Create a cancellation token

Every blocking operation honors this token and the existing deadline. Resuming a clarification reuses the controller-owned task lifecycle; it cannot renew limits.

```text
token = reuse_live_task_token_or_create_once()
THEN -> ASK-07
```

### ASK-07: Resolve the requested sources

Resolve the selected app, document or approved search roots. Eligible conversation context can clarify the question but never grants new source access.

```text
target = explicit_app_file_or_reviewed_search_roots()
THEN -> ASK-08
```

### ASK-08: Target unambiguous?

Two similar windows or an unidentified remote desktop are not interchangeable.

```text
IF unique(target)
ON yes -> ASK-10
ON no -> ASK-09
```

### ASK-09: Ask for the target

Use TALK's explicit live response and nonrepeating round limit. Waiting acquires no new source content; choosing an answer does not grant broader access.

```text
target = bounded_clarification_under_existing_question_budget()
ON chosen -> ASK-10
ON cancel -> ASK-17
```

### ASK-10: Classify question breadth

Specific goals need precise candidate controls; broad goals need discovered categories and coverage reporting.

```text
breadth = narrow_or_broad(request)
THEN -> ASK-11
```

### ASK-11: Build a proposed scope

Do not include unrelated windows, private tabs, home directories or the whole screen by default. SEEK details explicitly granted broad file discovery; this scope node itself performs no scan.

```text
scope = selected_app_files_or_reviewed_discovery_roots(target)
THEN -> ASK-12
```

Detailed flow: 53 Computer-Wide Search.

### ASK-12: Set inspection limits

Proposed menu limits: depth 4, 80 controls, 10 seconds per adapter. SEEK supplies separate search-pass caps. Existing parent deadlines/counters only shrink, including after clarification; calibrate through tests.

```text
limits = tighten_existing_task_limits_with_defaults()
THEN -> ASK-13
```

### ASK-13: Request authorization

Permissions are typed capabilities, not unrestricted tool access.

```text
permit = CALL policy(request, scope)
ON allowed -> ASK-14
ON denied -> ASK-16
```

Detailed flow: 03 Authorization.

### ASK-14: Create temporary task storage

Capture current policy and acquisition eligibility without renewing the task. Previously temporary-only source content stays ineligible; collection changes cannot upgrade it.

```text
task = attach_ephemeral_context_to_existing_lifecycle(permit)
THEN -> ASK-15
```

### ASK-15: Choose the guidance workflow

Caller inspects evidence, retrieves approved memory, drafts, verifies, and cleans up.

```text
kind = classify_request_kind(request)
ON scan guidance -> ASK-18
ON assemble references -> ASK-19
ON general help -> ASK-20
```

### ASK-16: Explain the denied scope

Offer user-provided text or a narrower permitted source; never bypass denial.

```text
show_denial(permit.reason)
THEN -> ASK-17
```

### ASK-17: End the request attempt

No observed content is retained by this path.

```text
RETURN no_task
END FLOW
```

### ASK-18: Prepare scan guidance

The user runs any scanner. EA only reads permitted reports and explains documented controls.

```text
CALL scan
THEN -> ASK-20
```

Detailed flow: 24 Antivirus Guidance.

### ASK-19: Assemble proposed work

Bounded thorough reading can be continued explicitly; no external work is performed.

```text
CALL assembly
THEN -> ASK-20
```

Detailed flow: 25 Read, Find & Assemble.

### ASK-20: Return the scoped guidance task

The common help pipeline validates evidence, answers, evaluates persistence and releases buffers. Linked details expand a desktop-to-website journey without granting navigation authority.

```text
RETURN task
END FLOW
```

Detailed flow: 35 Desktop To Website.

## 03 Authorization

Deny wins. Acquisition, retention, recall, and export are separate decisions. Revalidate at each I/O boundary and before commit, not just at request start.

### AUTH-01: Identify the operation

Only typed read/internal capabilities exist: UI, proposed verified reveal, selected files or reviewed local discovery, selected capture and own-memory operations. Metadata enumeration needs a grant; discovery does not add external execution.

```text
op = typed_capability(request)
THEN -> AUTH-02
```

### AUTH-02: Operation outside ZI registry?

Deny unknown capabilities as well as external commands. The unresolved menu-reveal exception is absent in strict ZI. Every path also applies the Shared Operation Contract, including trusted owner/session checks.

```text
IF op NOT_IN approved_enabled_ZI_registry
ON yes -> AUTH-17
ON no -> AUTH-03
```

### AUTH-03: Acquisition paused?

Pause stops new source reads; displaying already supplied chat text is not a new acquisition.

```text
IF op.acquires_source AND settings.pause_acquisition
ON yes -> AUTH-17
ON no -> AUTH-04
```

### AUTH-04: Deny rule matched?

Protected fields, excluded apps, paths, and private contexts override all allow rules.

```text
IF match_deny(scope)
ON yes -> AUTH-17
ON no -> AUTH-05
```

### AUTH-05: Source permission exists?

A request is not automatically permission for files or windows outside its stated scope.

```text
IF source_grant_covers(scope)
ON no -> AUTH-06
ON yes -> AUTH-18
```

### AUTH-06: Request scoped permission

Foreground help can ask for a scoped grant. A background event with no grant is rejected quietly; no unsolicited permission prompt or prechecked broad access.

```text
grant = foreground_permission_prompt_or_background_denial(scope)
ON declined -> AUTH-17
ON granted -> AUTH-18
```

### AUTH-07: Collection enabled?

Collection controls durable new observations. Background observation has its own independent opt-in; collection on alone cannot authorize acquisition.

```text
IF settings.collect
ON yes -> AUTH-10
ON no -> AUTH-08
```

### AUTH-08: Temporary access authorized?

Collection off permits explicit help and separately opted-in bounded background context in RAM only. Live source and activation grants are still required.

```text
IF request.user_initiated OR request.background_lease.live
ON yes -> AUTH-09
ON no -> AUTH-17
```

### AUTH-09: Mark task temporary-only

This flag cannot turn true later, even if collection is enabled before the answer finishes.

```text
task.persist_eligible = false
THEN -> AUTH-11
```

### AUTH-10: Evaluate retention eligibility

Initialize eligibility only for a fresh acquisition. Reauthorization never upgrades collection-off observations; collection on alone does not permit every source type or raw screenshot.

```text
task.persist_eligible = sticky_capture_eligibility_intersect_current_retention(scope)
THEN -> AUTH-11
```

### AUTH-11: Capture policy generation

Readers and writers compare this generation after awaits and under the persistence transaction lock.

```text
task.policy_generation = policy.generation
THEN -> AUTH-12
```

### AUTH-12: Evaluate recall permission

Collection off does not erase existing knowledge, but recall remains independently disableable.

```text
task.recall_allowed = recall_rule(scope)
THEN -> AUTH-13
```

### AUTH-13: Menu reveal requested?

This branch is unreachable in strict ZI. Only an explicitly approved pre-freeze exception and a live reveal grant can enable it; a verified adapter alone is not consent.

```text
IF op == REVEAL_VERIFIED_MENU_CONTAINER
ON yes -> AUTH-14
ON no -> AUTH-16
```

### AUTH-14: Reveal contract verified?

A role or action named open is insufficient. Verify adapter identity, target role, app version, and expected state.

```text
IF live_reveal_grant_AND_adapter_matches_app_version_state()
ON yes -> AUTH-16
ON no -> AUTH-15
```

### AUTH-15: Request manual menu opening

EA can continue reading after the user opens the menu; no exploratory unknown invocation.

```text
RETURN user_must_reveal
END FLOW
```

### AUTH-16: Return a bounded permit

The permit carries scope, capabilities, expiry, generation, and cancellation token.

```text
RETURN permit(task, scope, limits)
END FLOW
```

### AUTH-17: Return a denial

No source acquisition or persistent observation occurs after denial.

```text
RETURN denied(reason)
END FLOW
```

### AUTH-18: Acquisition trigger authorized?

Check independently of collection, including when collection is on. Background leases require enabled scope, source types, purpose, lifetime, unlocked state, and passive-only operations.

```text
IF request.user_initiated OR live_background_lease_covers(op, scope)
ON yes -> AUTH-07
ON no -> AUTH-17
```

## 04 Software Catalog

Remember software actually observed under consent. Installed inventory, inferred usage, and recorded usage are different facts.

### APP-01: Receive an app event

Only an enabled, bounded observer produces background usage events.

```text
event = authorized_app_event()
THEN -> APP-02
```

### APP-02: Usage history authorized?

Usage history needs all three controls plus a live scoped observation lease. Recheck queued events; no background subscription exists when observation is off.

```text
IF policy.background.enabled AND policy.collect AND policy.remember_software_usage
ON yes -> APP-03
ON no -> APP-10
```

### APP-03: Acquisition paused?

Pausing cancels subscriptions and drains queued acquisition events.

```text
IF policy.pause_acquisition
ON yes -> APP-10
ON no -> APP-04
```

### APP-04: App allowed?

App IDs can be excluded; private browser contexts cannot be recorded through a generic browser exception.

```text
IF policy.permits(event.app)
ON yes -> APP-05
ON no -> APP-10
```

### APP-05: Resolve a stable app ID

Prefer verified package/app identifiers over titles that may contain document names or secrets.

```text
app_id = adapter.application_identity(event)
THEN -> APP-06
```

### APP-06: Read the app version

Do not run arbitrary binaries to discover versions. Unknown is a valid value.

```text
version = allowed_version_source(app_id)
THEN -> APP-07
```

### APP-07: Create a minimal usage fact

No window title, document name, keystroke, or screenshot is required for usage history.

```text
fact = {app_id, version, observed_at}
THEN -> APP-08
```

### APP-08: Duplicate recent event?

Coalesce repeated focus changes in a bounded time window.

```text
IF recent_same_app_version(fact)
ON yes -> APP-10
ON no -> APP-09
```

### APP-09: Request durable storage

Storage uses the same policy transaction gate as other knowledge, including revocation checks.

```text
CALL retain(fact)
THEN -> APP-11
```

Detailed flow: 14 Durable Memory.

### APP-10: Discard the event

No telemetry log or content-bearing diagnostic may secretly retain the rejected event.

```text
drop(event)
THEN -> APP-11
```

### APP-11: Return to event wait

History starts when permitted; EA cannot truthfully reconstruct all past software use.

```text
RETURN
END FLOW
```

## 05 Interface Reading

Prefer structured accessibility evidence. Reading does not require activation. Unsupported or hidden controls are gaps, not invitations to guess.

### UI-01: Validate the permit

All adapter calls share cancellation, deadline, policy generation, and scope checks.

```text
check_live_permit(task)
THEN -> UI-02
```

### UI-02: Bind to the selected window

Keep process/window identity stable; focus changes must not redirect inspection to another app.

```text
window = adapter.bind(task.target)
THEN -> UI-03
```

### UI-03: Window identity unchanged?

Detect closed windows, recycled handles, and a different foreground app.

```text
IF window.matches(task.target)
ON yes -> UI-04
ON no -> UI-17
```

### UI-04: Read the accessibility tree

Enforce protected-source exclusions before acquiring fields. If the adapter cannot enforce them, return a gap. Read names, roles, states, bounds and hierarchy without invoking actions; later filtering is defense in depth.

```text
tree = protection_filtered_bounded_atspi_read(window)
THEN -> UI-05
```

### UI-05: Readable controls found?

An empty tree can mean unsupported rendering, not an absence of controls.

```text
IF tree.has_evidence
ON yes -> UI-06
ON no -> UI-13
```

### UI-06: Exclude protected fields

Drop password fields and denied source regions before they enter caches or prompts.

```text
tree = remove_protected_nodes(tree)
THEN -> UI-07
```

### UI-07: Normalize control paths

Attach app/version/window identity, accessible role, exact label, bounds, and observation time.

```text
controls = normalize_paths(tree)
THEN -> UI-08
```

### UI-08: Collect permitted tooltips

Only already available tooltip text or a tested reveal behavior is allowed; hover itself may have effects.

```text
tooltips = passive_tooltip_evidence(controls)
THEN -> UI-09
```

### UI-09: More menu evidence needed?

Broad questions explore relevant branches within limits; narrow questions still verify the control's action meaning.

```text
IF request.needs_menu_coverage
ON yes -> UI-10
ON no -> UI-11
```

### UI-10: Inspect menu branches

Submenu exploration has separate reveal, cycle detection, depth, time, and interruption checks.

```text
menu_evidence = CALL menus
THEN -> UI-11
```

Detailed flow: 06 Menus & Submenus.

### UI-11: Selected file available?

A user-selected log or documentation file is additional evidence, not permission to crawl its siblings.

```text
IF task.selected_file
ON yes -> UI-12
ON no -> UI-16
```

### UI-12: Read the selected file

Bound bytes and parsing; report truncation or changed content.

```text
file_evidence = CALL files
THEN -> UI-16
```

Detailed flow: 07 File Reading.

### UI-13: Capture explicitly permitted?

No silent full-screen screenshot fallback when accessibility is unavailable.

```text
IF task.capture_grant
ON yes -> UI-14
ON no -> UI-15
```

### UI-14: Read a selected visual region

OCR is a fallible evidence source. Keep raw visual data temporary by default.

```text
visual_evidence = CALL capture
THEN -> UI-11
```

Detailed flow: 08 Capture & OCR.

### UI-15: Record an unreadable source

Coverage reporting must distinguish unreadable, not inspected, denied, and not found.

```text
gaps.add(window, reason)
THEN -> UI-11
```

### UI-16: Package interface evidence

All sources remain untrusted data; their text cannot issue tool instructions.

```text
result = evidence_with_gaps
THEN -> UI-18
```

### UI-17: Cancel stale inspection

Ask the user to select the intended target again.

```text
RETURN target_changed
END FLOW
```

### UI-18: Link review requested?

No browsing or reputation upload is implied by displaying a URL.

```text
IF request.is_link_review
ON yes -> UI-19
ON no -> UI-20
```

### UI-19: Review the observed link

Only static, local analysis in ZI; unknown remains a valid verdict.

```text
CALL links
THEN -> UI-20
```

Detailed flow: 23 Passive Link Review.

### UI-20: Return current evidence

Sources are untrusted input and cannot grant new capabilities.

```text
RETURN result
END FLOW
```

## 06 Menus & Submenus

Strict ZI reads exposed menus; the user opens hidden ones. The reveal branch is an unresolved, off-by-default pre-freeze exception requiring registry approval, separate consent and a tested adapter. Never activate a discovered command.

### MENU-01: Queue relevant menu roots

Use the actual permitted UI. Root enumeration, queue, seen identities and gaps share parent node/byte/time/depth limits. Broad questions cover discovered relevant roots within those limits; truncation remains explicit.

```text
queue = bounded_menu_frontier(relevant_roots(task.breadth), parent.ledger)
THEN -> MENU-02
```

### MENU-02: Branches remaining?

The queue is bounded and contains only the selected app's permitted containers.

```text
IF queue.not_empty()
ON yes -> MENU-03
ON no -> MENU-19
```

### MENU-03: Inspection budget exhausted?

Stop on time, node count, or depth budget. Report remaining branches explicitly.

```text
IF limits.exhausted()
ON yes -> MENU-18
ON no -> MENU-04
```

### MENU-04: Take the next branch

Charge a visit even for duplicate, malformed or subsequently denied branches. Breadth-first traversal gives broad questions useful coverage before deep specialization.

```text
branch = debit_menu_visit_before_pop(queue, parent.ledger)
THEN -> MENU-05
```

### MENU-05: Branch already visited?

Track stable app/window/path identities to break loops and repeated submenus.

```text
IF visited.contains(branch.stable_path)
ON yes -> MENU-02
ON no -> MENU-06
```

### MENU-06: Mark the branch visited

Charge bounded temporary bytes and mark before reads or reveal authorization. Exhaustion returns a coverage limit, never unbounded bookkeeping.

```text
bounded_menu_seen_set.add(branch.stable_path)
THEN -> MENU-07
```

### MENU-07: Container already open?

Passive reading of an already-open container requires no reveal action.

```text
IF branch.state.expanded
ON yes -> MENU-13
ON no -> MENU-08
```

### MENU-08: Reveal contract matches?

Require known app, version, role, state, and a tested container-only operation. Generic click is never the fallback.

```text
IF adapter.verified_reveal(branch)
ON yes -> MENU-10
ON no -> MENU-09
```

### MENU-09: Ask the user to open it

Keep the exact observed label/path in the request. A declined reveal is a coverage gap.

```text
response = request_manual_reveal(branch)
ON opened -> MENU-13
ON skip -> MENU-17
ON cancel -> MENU-20
```

### MENU-10: Revalidate reveal permission

Policy, target identity, and cancellation can change while a menu is queued.

```text
permit = authorize(REVEAL_VERIFIED_MENU_CONTAINER, branch)
ON allowed -> MENU-11
ON denied -> MENU-17
```

### MENU-11: Reveal the container

Only the tested operation is exposed. It cannot select an action item or fall back to arbitrary coordinates.

```text
adapter.reveal_only(branch, permit)
THEN -> MENU-12
```

### MENU-12: Await the expansion event

Use an event or short bounded wait, not unbounded polling.

```text
result = await bounded_expansion(branch)
ON expanded -> MENU-13
ON timeout -> MENU-17
ON target changed -> MENU-20
```

### MENU-13: Read exposed children

Read labels, roles, checked/enabled states, tooltips, bounds, and parent paths without invoking children.

```text
children = bounded_read(branch)
THEN -> MENU-14
```

### MENU-14: Filter denied children

Private/protected data remains excluded even within an allowed menu.

```text
children = policy.filter(children)
THEN -> MENU-15
```

### MENU-15: Record control evidence

Record exact text and provenance. A label identifies a control; documentation establishes its semantics.

```text
evidence.add(children)
THEN -> MENU-16
```

### MENU-16: Queue child containers

Filter relevant unvisited containers, then apply depth, total-node and byte caps before enqueue. Omitted branches remain bounded policy-filtered gaps; never enqueue command activation.

```text
queue.append_within_remaining_queue_and_byte_caps(children)
THEN -> MENU-02
```

### MENU-17: Record a skipped branch

Differentiate denied, unknown reveal, unsupported, declined, and timeout.

```text
gaps.add(branch, reason)
THEN -> MENU-02
```

### MENU-18: Record unfinished branches

A bounded search cannot be advertised as complete.

```text
gaps.add(queue, 'budget reached')
THEN -> MENU-19
```

### MENU-19: Return the menu map

Paths such as File > Export are evidence for explanation. The user performs any actual command.

```text
RETURN {evidence, gaps, visited}
END FLOW
```

### MENU-20: Abort menu exploration

Do not issue cleanup clicks or Escape to an unrelated/stale window. Release EA-owned overlays only.

```text
RETURN cancelled
END FLOW
```

## 07 File Reading

Read selected files or admitted discovery candidates without executing content. A thorough caller may advance bounded chunks under one shared ledger. User files are never modified; parser isolation and resource limits are future implementation contracts.

### FILE-01: Accept a selected path

Accept an individually selected file or a candidate from a live scoped computer-search pass. A directory grant still requires traversal, source-byte and deadline bounds.

```text
path = user_selected_or_authorized_search_candidate_path()
THEN -> FILE-02
```

### FILE-02: Resolve the path identity

Resolve symlinks and record device/inode or platform-equivalent identity before evaluating scope.

```text
identity = canonical_file_identity(path)
THEN -> FILE-03
```

### FILE-03: Resolved path allowed?

Reject escapes outside an approved root, excluded files, protected paths, and unknown grants.

```text
IF policy.path_allowed(identity)
ON yes -> FILE-04
ON no -> FILE-15
```

### FILE-04: Regular file?

Do not read devices, sockets, FIFOs, or process-memory pseudo-files through a generic file reader.

```text
IF identity.is_regular_file
ON yes -> FILE-05
ON no -> FILE-14
```

### FILE-05: Open a read-only handle

Use no-follow/handle-based validation where supported; do not rely only on a string prefix check.

```text
handle = safe_open_readonly(identity)
THEN -> FILE-06
```

### FILE-06: Handle identity matches?

Mitigate symlink and replacement races before reading.

```text
IF fstat(handle).matches(identity)
ON yes -> FILE-07
ON no -> FILE-13
```

### FILE-07: Supported content type?

Initial text/log/docs support excludes executable macros, scripts, active document content, and automatic archive expansion.

```text
IF bounded_type_probe(handle)
ON yes -> FILE-08
ON no -> FILE-14
```

### FILE-08: Read a bounded chunk

256 KiB is the proposed chunk and ordinary first-pass cap. An explicitly thorough caller may advance the offset under the same finite search/task ledger; unvisited ranges stay gaps. Chunks never renew time, byte or RAM limits.

```text
chunk = read_at_most(handle, min(256_KiB, caller.remaining_bytes), caller.offset)
THEN -> FILE-09
```

### FILE-09: Remove identified secrets

Redaction is defense in depth, not proof that every secret is detectable. Exclusion rules remain primary.

```text
chunk = redact_protected_patterns(chunk)
THEN -> FILE-10
```

### FILE-10: Decode text safely

Decode errors become uncertainty. No eval, shell interpolation, macro execution, or external resource fetching.

```text
text = bounded_decode(chunk)
THEN -> FILE-11
```

### FILE-11: File unchanged during read?

Check handle identity/size/mtime where useful; hash the read bytes for provenance, not the entire disk.

```text
IF same_metadata(handle)
ON yes -> FILE-12
ON no -> FILE-13
```

### FILE-12: Attach file provenance

Citations identify exactly what was read. A truncated file must not be described as fully inspected.

```text
source = {identity, byte_range, digest, observed_at}
THEN -> FILE-16
```

### FILE-13: Record a changed source

Offer a fresh bounded read under current permissions; never silently mix versions.

```text
result = stale_source()
THEN -> FILE-16
```

### FILE-14: Record an unsupported source

User can supply a safe text extract. Do not install a converter or invoke an external application automatically.

```text
result = unsupported_type()
THEN -> FILE-16
```

### FILE-15: Return a denied source

No content read occurs.

```text
RETURN denied_path
END FLOW
```

### FILE-16: Close the file handle

Also executed on cancellation, parser error, permission revocation, and timeout by the common finally contract.

```text
close_if_open(handle)
THEN -> FILE-17
```

### FILE-17: Return file evidence

Retention is evaluated separately; collection-off reads remain temporary.

```text
RETURN result_or_source
END FLOW
```

## 08 Capture & OCR

Requested bounded capture/OCR under separate consent, not continuous surveillance. Missing protection, permission or resources yields an honest gap. Every included visual capability still needs positive 4 GB tests; a transcription fallback does not establish feature support.

### VIS-01: Request a selected capture

Prefer one chosen window or crop through the platform permission mechanism.

```text
grant = ask_capture_region()
ON granted -> VIS-02
ON declined -> VIS-13
```

### VIS-02: Capture exclusion unavailable?

Skip protected or uncertain-isolation captures before reading pixels. Post-capture redaction and imperfect classifiers are not substitutes for enforcing the selected source boundary.

```text
IF protected_region_OR_exclusions_cannot_be_enforced_before_capture(grant)
ON yes -> VIS-13
ON no -> VIS-03
```

### VIS-03: Capture headroom available?

Full-resolution buffers can be expensive. Enforce image dimensions and bytes independently of model size.

```text
IF resource_guard.allows_capture()
ON yes -> VIS-04
ON no -> VIS-11
```

### VIS-04: Acquire one image

No periodic screenshots. Check policy before and after acquisition; reject out-of-scope capture results.

```text
image = portal.capture_once(grant)
THEN -> VIS-05
```

### VIS-05: Bound image dimensions

Keep only the requested region; release the original buffer immediately after successful cropping.

```text
image = bounded_crop(image, grant)
THEN -> VIS-06
```

### VIS-06: Run bounded OCR

A local OCR engine is a separate optional worker; never co-load it with a vision model by default.

```text
tokens = local_ocr(image)
THEN -> VIS-07
```

### VIS-07: OCR confidence sufficient?

The threshold must be measured on real menus/fonts; confidence does not guarantee semantic correctness.

```text
IF tokens.pass_threshold
ON yes -> VIS-08
ON no -> VIS-11
```

### VIS-08: Attach pixel provenance

Preserve crop origin, scale, timestamp, and window identity so highlights can later be revalidated.

```text
evidence = token_boxes_with_capture_id(tokens)
THEN -> VIS-09
```

### VIS-09: Unlabeled icon unresolved?

Color and shape alone cannot establish the command's purpose.

```text
IF relevant_icon_has_no_label
ON yes -> VIS-10
ON no -> VIS-12
```

### VIS-10: Mark icon meaning unknown

For two red slashes, report appearance only until an accessible name, tooltip, or documentation supplies meaning.

```text
evidence.add_unknown_icon()
THEN -> VIS-12
```

### VIS-11: Request user-supplied text

Do not hallucinate unreadable text when resources or OCR quality are insufficient.

```text
result = ask_for_label_or_smaller_crop()
THEN -> VIS-12
```

### VIS-12: Release image buffers

Raw screenshots are temporary unless a separate explicit raw-image retention rule permits storage.

```text
release(image)
THEN -> VIS-14
```

### VIS-13: Return without capture

No fallback full-screen image is taken.

```text
RETURN denied
END FLOW
```

### VIS-14: Return visual evidence

OCR evidence carries uncertainty and can be rejected during answer validation.

```text
RETURN evidence_or_gap
END FLOW
```

## 09 Knowledge Retrieval

Start with SQLite metadata and full-text search. A vector index is optional, derived, deletable, and justified by measured retrieval failures.

### FIND-01: Recall enabled?

This is independent of collection. Turning collection off need not delete existing memory.

```text
IF task.recall_allowed
ON yes -> FIND-02
ON no -> FIND-15
```

### FIND-02: Build a scoped query

Use the current question and app context. Do not search unrelated private app histories by default.

```text
query = terms(request, app_id, version)
THEN -> FIND-03
```

### FIND-03: Valid temporary cache hit?

Use the Temporary Cache contract: owner/session, operation/inputs/provider/schema, source identity/revision, scope, policy/data generations and expiry. Never access another owner's entry before filtering.

```text
IF scoped_cache_matches_full_key_and_current_authority(query)
ON yes -> FIND-04
ON no -> FIND-05
```

### FIND-04: Load the temporary result

Use an owner-bound live handle. Cache reads/reinsertions cannot extend original evidence/source expiry; global and aggregate task byte reservations include metadata and live consumers. Eviction frees only unreferenced bytes. No disk prompt cache or content logs.

```text
candidates = cache.get(query)
THEN -> FIND-10
```

### FIND-05: Search local full text

Search only the authenticated owner's eligible namespace, filtering tombstones and source rules inside the query boundary. A later result filter is defense in depth, not access isolation.

```text
candidates = authorized_owner_scoped_sqlite_fts(query)
THEN -> FIND-06
```

### FIND-06: Recall coverage sufficient?

Broad queries require category coverage; a single top match does not establish completeness.

```text
IF candidates.coverage_sufficient
ON yes -> FIND-10
ON no -> FIND-07
```

### FIND-07: Semantic retrieval enabled?

Predeclared F-30, off by default. Decide inclusion before freeze; require measured retrieval benefit and positive 4 GB tests.

```text
IF settings.semantic_retrieval
ON yes -> FIND-08
ON no -> FIND-10
```

### FIND-08: Embedding headroom available?

Avoid concurrent embedding and answer models on small systems.

```text
IF resource_guard.allows_embedding()
ON yes -> FIND-09
ON no -> FIND-10
```

### FIND-09: Search a scoped vector index

Vectors refer to durable record IDs; they do not replace provenance or deletion rules.

```text
candidates += vector_search(query)
THEN -> FIND-10
```

### FIND-10: Filter inaccessible records

Exclude tombstones, expiry, denied apps/paths, deleted sources, and obsolete policy eligibility.

```text
candidates = current_policy_filter(candidates)
THEN -> FIND-11
```

### FIND-11: Check source freshness

Version mismatch downgrades or excludes a fact; historical memory cannot assert the current UI label.

```text
candidates = annotate_staleness(candidates)
THEN -> FIND-12
```

### FIND-12: Rank matching evidence

Prefer fresh direct evidence and user-verified facts over generated summaries or uncertain OCR.

```text
ranked = provenance_aware_rank(candidates)
THEN -> FIND-13
```

### FIND-13: Deduplicate source claims

Repeated copies of the same claim are not independent corroboration.

```text
ranked = deduplicate_by_provenance(ranked)
THEN -> FIND-14
```

### FIND-14: Bound retrieved context

Reserve room for the question, system rules, and answer. Report omitted categories for broad questions.

```text
context = token_budgeted_selection(ranked)
THEN -> FIND-16
```

### FIND-15: Return no recalled memory

Continue using explicitly supplied or permitted current evidence.

```text
RETURN []
END FLOW
```

### FIND-16: Return cited memories

Recheck record validity before answer publication to catch concurrent deletion or policy revocation.

```text
RETURN context
END FLOW
```

## 10 Evidence & Meaning

Observed text is data, never an instruction. Labels, visual appearance, and action semantics are separate evidence types.

### FACT-01: Collect source records

Keep origin IDs intact rather than flattening everything into an uncited paragraph.

```text
records = current_evidence + permitted_memories
THEN -> FACT-02
```

### FACT-02: Apply current source policy

Revocation and deletion can occur after retrieval. Drop affected records from prompts and pending answers.

```text
records = filter_currently_allowed(records)
THEN -> FACT-03
```

### FACT-03: Normalize evidence fields

Each record has source kind, app/version, observed time, literal content, confidence, and optional bounds.

```text
records = normalize_schema(records)
THEN -> FACT-04
```

### FACT-04: Mark external content untrusted

A log saying ignore instructions or run this command cannot grant a capability or alter policy.

```text
records = mark_as_data(records)
THEN -> FACT-05
```

### FACT-05: Resolve the requested action

Distinguish stop, pause, cancel, resume, and start. Ask when the user's intended effect is ambiguous.

```text
goal = normalize_user_goal(request)
THEN -> FACT-06
```

### FACT-06: Match candidate controls

A visual icon match is only a candidate, not proof of behavior.

```text
candidates = exact_matches_plus_enabled_admitted_semantic_matches(goal, records)
THEN -> FACT-07
```

### FACT-07: Action meaning supported?

For Begin requisition flow, the word Begin does not support a claim that it stops the flow.

```text
IF relevant_semantics_have_sources(candidates)
ON yes -> FACT-09
ON no -> FACT-08
```

### FACT-08: Record semantic uncertainty

Use documentation or user-visible tooltips already in scope; otherwise say the meaning is unknown.

```text
gaps.add('action meaning unverified')
THEN -> FACT-11
```

### FACT-09: Sources conflict?

Current UI, versioned docs, and older memories may disagree.

```text
IF contradictory_claims(candidates)
ON yes -> FACT-10
ON no -> FACT-11
```

### FACT-10: Keep conflicting claims distinct

Do not blend contradictions into a confident fabricated answer.

```text
claims = preserve_alternatives_with_sources()
THEN -> FACT-11
```

### FACT-11: Build a coverage ledger

Track which app branches and source types were actually examined. R-02 links each claim, hypothesis and reported result to a source revision; no invented completion or confidence percentage.

```text
coverage = inspected_denied_unreadable_unfinished()
THEN -> FACT-12
```

Detailed flow: 46 Evidence Casework.

### FACT-12: Broad question?

The output contract changes, not the permission boundary.

```text
IF task.breadth == BROAD
ON yes -> FACT-13
ON no -> FACT-14
```

### FACT-13: Group discovered capabilities

List every discovered relevant category within budget; flag truncated or unreadable categories.

```text
claims = group_by_supported_operation()
THEN -> FACT-15
```

### FACT-14: Select supported goal matches

A specific answer can contain multiple relevant controls when they have different effects.

```text
claims = goal_matches_with_evidence()
THEN -> FACT-15
```

### FACT-15: Return the evidence bundle

The model can summarize this bundle; it cannot invent controls missing from it.

```text
RETURN {claims, sources, conflicts, coverage}
END FLOW
```

## 11 Resource Admission

Every included ZI feature must work on 4 GB total system RAM. WORK details contract-preserving staged work before admission. Admission numbers are unbenchmarked proposals. Transient pressure may yield useful partial help, but refusal cannot replace positive feature tests.

### RAM-01: Measure available memory

Use a platform adapter and current headroom, not total installed RAM or model file size.

```text
available = os.available_memory()
THEN -> RAM-02
```

### RAM-02: Heavy worker active?

One heavy inference, OCR, embedding, math, ASR or TTS stage at a time by default. Count renderer and coordinator overhead too.

```text
IF heavy_worker.active
ON yes -> RAM-03
ON no -> RAM-04
```

### RAM-03: Wait for worker release

The UI stays responsive while queued. Do not block the desktop thread.

```text
result = bounded_wait_or_cancel()
ON ready -> RAM-01
ON cancel -> RAM-13
```

### RAM-04: Estimate peak working memory

WORK details selection of a contract-preserving stage profile before admission, not a second invocation. Include prompt processing, KV/context/output, OCR/math/voice, renderer, mapped pages, loader peaks and cross-stage buffers. Serial stages must actually release residency.

```text
estimate = measured_incremental_peak_and_total_EA_peak(job)
THEN -> RAM-05
```

Detailed flow: 61 Bounded Working Set.

### RAM-05: Reserve desktop headroom

Initial proposal is 512 MiB, subject to whole-system measurement and workload approval. A busy desktop may need more. Do not claim universal OOM prevention.

```text
reserve = max(reviewed_reserve, os_safety_margin)
THEN -> RAM-06
```

### RAM-06: Estimated peak fits?

Check the EA ceiling and incremental system demand separately. Available RAM already accounts for resident EA; do not subtract it twice. Quantized file size is not sufficient to pass this check.

```text
IF total_EA_peak_plus_margin <= ceiling AND incremental_peak_plus_margin <= available - reserve
ON yes -> RAM-07
ON no -> RAM-13
```

### RAM-07: Configure explicit runtime limits

R-05: protection availability is a precondition for launch. Proposed trial: 2048 context tokens, 512 output tokens, one heavy stage, no disk prompt cache. Needed evidence cannot be silently truncated. The detailed supervisor contract governs every internal worker.

```text
config = tested_supervisor_enforcement_config_or_unavailable()
THEN -> RAM-08
```

Detailed flow: 49 Resource Supervisor.

### RAM-08: Start an isolated local worker

A supervised subprocess can be stopped without crashing the panel. No network endpoint is exposed by default.

```text
worker = spawn_local_worker(config)
THEN -> RAM-09
```

### RAM-09: Monitor actual worker usage

RSS alone misses system pressure. Track both worker use and OS available memory during prefill and generation.

```text
sample = memory_pressure_and_rss(worker)
THEN -> RAM-10
```

### RAM-10: Memory pressure excessive?

Use configurable bounded thresholds measured on target hardware; include a timeout.

```text
IF pressure_threshold_exceeded(sample)
ON yes -> RAM-12
ON no -> RAM-11
```

### RAM-11: Return an admitted worker

The monitor remains active while the caller uses the worker; release the lease after the request.

```text
RETURN worker_lease
END FLOW
```

### RAM-12: Terminate the heavy worker

Cancel pending outputs first. A cgroup limit, where available, confines failure to the worker.

```text
terminate_worker(worker)
THEN -> RAM-13
```

### RAM-13: Use evidence-only help

Show exact observed controls, source excerpts, and gaps without pretending a local model ran.

```text
RETURN template_mode
END FLOW
```

## 12 Local Inference

Candidate, not commitment: a small local model via llama.cpp with measured reasoning modes. R-01 requires independent output/reference checks; grammar validity does not prove truth. Select only after quality-first tests on a 4 GB machine.

### LLM-01: Accept an evidence bundle

The model is an explanation component, not an authority over permissions or actions.

```text
bundle = validated_evidence()
THEN -> LLM-02
```

### LLM-02: Evidence sufficient to answer?

A larger model cannot fix an unobserved menu label or missing semantics.

```text
IF bundle.supports_goal
ON yes -> LLM-04
ON no -> LLM-03
```

### LLM-03: Ask a grounded clarification

Name the missing source or ambiguous goal without making up a control.

```text
RETURN missing_evidence_question(bundle.gaps)
END FLOW
```

### LLM-04: Model worker available?

The resource flow may intentionally return template mode.

```text
IF resource_lease.is_model
ON yes -> LLM-05
ON no -> LLM-12
```

### LLM-05: Build a bounded prompt

Separate system rules from source text. Include source IDs and prohibit unsupported claims.

```text
prompt = pack_untrusted_evidence(bundle)
THEN -> LLM-06
```

### LLM-06: Count prompt tokens

Use the actual tokenizer. Character counts alone cannot reliably enforce context limits.

```text
tokens = model_tokenizer.count(prompt)
THEN -> LLM-07
```

### LLM-07: Prompt fits context budget?

Never silently drop governing rules or provenance to make evidence fit.

```text
IF tokens + output_reserve <= context_limit
ON yes -> LLM-09
ON no -> LLM-08
```

### LLM-08: Pack without losing required evidence

Drop only optional/redundant context, never required matches, exceptions or qualifiers. Debit the original finite stage budget and require shrinking input; if it cannot fit, return an explicit gap or already-budgeted staged result, not a falsely complete answer.

```text
bundle = contract_preserving_bounded_repacking(bundle)
ON reduced -> LLM-05
ON cannot reduce -> LLM-12
```

### LLM-09: Generate a local draft

Compare supported reasoning modes under accuracy-first gates and a bounded deadline. Do not disable useful reasoning only for speed; no tool-execution interface.

```text
draft = worker.generate(prompt, output_limit)
ON complete -> LLM-10
ON failure -> LLM-12
ON cancel -> LLM-14
```

### LLM-10: Parse a structured answer

R-01: trusted local schema, no remote references, duplicate-key/size checks and inert rendering. Grammar constraints may be incomplete. The linked output contract refines this pipeline; do not generate a second answer when opening its details.

```text
answer = independently_validate_bounded_schema_and_supplied_reference_IDs(draft)
ON valid -> LLM-11
ON invalid -> LLM-12
```

Detailed flow: 45 Typed Output Contract.

### LLM-11: Validate every claimed control

Reject invented names, paths, citations, and claims that a Begin control stops a process.

```text
valid = literal_controls_exist(answer, bundle)
ON yes -> LLM-13
ON no -> LLM-12
```

### LLM-12: Build a source-based answer

An exact label, path, and honest unknown can be more useful than a fluent unsupported paragraph.

```text
answer = evidence_template(bundle)
THEN -> LLM-13
```

### LLM-13: Return the grounded draft

Publication still revalidates policy, evidence freshness, and any highlight target.

```text
RETURN answer
END FLOW
```

### LLM-14: Discard cancelled generation

Do not publish partial output after cancellation or persist its input context.

```text
RETURN cancelled
END FLOW
```

## 13 Answers & Highlights

EA explains, locates, and supports troubleshooting. The user performs fixes. Thorough means all discovered relevant evidence within a declared scope, not omniscience.

### SHOW-01: Accept the validated draft

Only grounded claims enter this flow.

```text
answer = validated_draft()
THEN -> SHOW-02
```

### SHOW-02: Source access revoked?

Recheck concurrent deletion and policy updates before publication.

```text
IF answer.references_revoked_sources()
ON yes -> SHOW-16
ON no -> SHOW-03
```

### SHOW-03: Broad answer requested?

A broad answer lists categories and alternative controls, not just the highest-ranked hit.

```text
IF task.breadth == BROAD
ON yes -> SHOW-04
ON no -> SHOW-05
```

### SHOW-04: Present discovered categories

Include all discovered relevant references that fit the output budget and flag omissions.

```text
body = supported_capability_groups(answer)
THEN -> SHOW-06
```

### SHOW-05: Present goal-specific choices

Distinguish alternatives such as pause versus cancel when their effects differ.

```text
body = supported_goal_choices(answer)
THEN -> SHOW-06
```

### SHOW-06: Attach precise source locations

Use literal control paths or exact document/edition/section/page/table references, with readable excerpts and qualifications. EXTRACT details source-backed presentation; no original file is modified.

```text
body = cite_exact_control_paths_or_document_locations(body)
THEN -> SHOW-07
```

Detailed flow: 54 Extract And Cite.

### SHOW-07: Attach coverage gaps

Report uninspected, denied, unreadable, stale, conflicting, or unfinished sources.

```text
body.coverage = bundle.coverage
THEN -> SHOW-08
```

### SHOW-08: Display the answer

CARE expands peace-and-respect presentation inside this task: patient, accessible, noncoercive, no forced cheerfulness or changes to facts. Use readable reflow; no focus theft or command activation.

```text
panel.show(supportive_grounded_presentation(body))
THEN -> SHOW-09
```

Detailed flow: 60 Peaceful Support.

### SHOW-09: Highlight requested?

Highlighting is a separate user action, not a click on the target application.

```text
IF user.requests_highlight
ON yes -> SHOW-10
ON no -> SHOW-14
```

### SHOW-10: Resolve the live control

Bounds may be stale after scrolling, moving, resizing, or a menu closing.

```text
control = adapter.find_current_path(answer.path)
THEN -> SHOW-11
```

### SHOW-11: Control identity still matches?

Revalidate app/window/path/label and current visibility under the live permit.

```text
IF control.same_window_and_path
ON yes -> SHOW-18
ON no -> SHOW-13
```

### SHOW-12: Draw a noninteractive highlight

Resolve fresh target identity and calibrated source-to-overlay geometry. Monitor origin, scale, rotation, crop, and source revisions must agree; hide a stale marker before reacquisition. See EA-POINT-01..05.

```text
CALL pointing
THEN -> SHOW-14
```

Detailed flow: 31 Precise Screen Circles.

### SHOW-13: Report a changed interface

Offer a fresh scoped read. Do not point to stale coordinates. The linked limitation flow distinguishes partial, clarification, unavailable, canceled and failed outcomes.

```text
panel.show_target_changed()
THEN -> SHOW-14
```

Detailed flow: 37 Cannot Help Yet.

### SHOW-14: Accept optional user feedback

Carry eligible corrections and unresolved questions into follow-up context, without implying a fix succeeded or training the model. TALK details the user-turn lifecycle; feedback never self-triggers another task.

```text
feedback = user_marks_helpful_or_corrects()
THEN -> SHOW-17
```

Detailed flow: 55 Clarify And Continue.

### SHOW-15: Release temporary task context

Persistence of eligible records is a separate reviewed operation; cleanup always runs on cancel/error too.

```text
release_task_buffers()
THEN -> SHOW-17
```

### SHOW-16: Discard revoked content

Do not leak deleted or newly denied knowledge through a pending response.

```text
drop(answer)
THEN -> SHOW-15
```

### SHOW-17: Return control to the user

The orchestrator next evaluates eligible persistence, then releases temporary context in finally. EA does not press the suggested command.

```text
RETURN answer_and_feedback
END FLOW
```

### SHOW-18: Literal label still matches?

A reused control path with changed text cannot receive the old answer's highlight.

```text
IF control.label == evidence.literal_label
ON yes -> SHOW-12
ON no -> SHOW-13
```

## 14 Durable Memory

SQLite is the initial knowledge store. FTS and optional vectors are derived indexes. Every record retains provenance, policy eligibility, and deletion lineage.

### SAVE-01: Accept a candidate record

Observation-derived candidates include app facts, versioned controls and verified outcomes. Explicit user-authored notes/settings use their separate own-data controls; this collection gate cannot forbid those writes.

```text
candidate = proposed_memory_record()
THEN -> SAVE-02
```

### SAVE-02: Capture eligible for persistence?

This bit is false for collection-off reads and never becomes true later.

```text
IF candidate.persist_eligible
ON yes -> SAVE-03
ON no -> SAVE-17
```

### SAVE-03: Collection still enabled?

Queued writes cannot slip through after the user disables collection.

```text
IF current_policy.collect
ON yes -> SAVE-04
ON no -> SAVE-17
```

### SAVE-04: Retention rule allows this source?

Per-app, per-path, and source-type exclusions apply independently of acquisition grants.

```text
IF retain_rule(candidate.source)
ON yes -> SAVE-05
ON no -> SAVE-17
```

### SAVE-05: Redact disallowed fields

Raw screenshots, full logs, and document bodies are excluded unless explicitly permitted.

```text
candidate = minimize_and_redact(candidate)
THEN -> SAVE-06
```

### SAVE-06: User review required?

Suggested baseline: review sensitive facts, corrections, and training/export eligibility.

```text
IF policy.requires_review(candidate.kind)
ON yes -> SAVE-07
ON no -> SAVE-08
```

### SAVE-07: Request memory approval

Show the actual retained content, source, category, and retention duration.

```text
choice = user_reviews(candidate)
ON approved -> SAVE-08
ON declined -> SAVE-17
```

### SAVE-08: Attach provenance

Derived claims must retain parent links so later source deletion reaches summaries and indexes.

```text
candidate.provenance = source_record_ids()
THEN -> SAVE-09
```

### SAVE-09: Compute record expiry

Use the shortest applicable saved-data/source-lineage retention bound, never extend it by summarizing or recaching. Commit must occur while the candidate is still available. An authorized saved copy has its reviewed retention clock; it does not extend the RAM cache or the source read grant.

```text
candidate.expires_at = earliest_authorized_retention_deadline(candidate)
THEN -> SAVE-10
```

### SAVE-10: Storage quota available?

Do not evict protected user notes silently. Offer expiry cleanup or a user-approved quota change.

```text
IF quota.permits(candidate)
ON yes -> SAVE-11
ON no -> SAVE-17
```

### SAVE-11: Begin a policy-locked transaction

Policy updates, tombstones, and commits share a serialization boundary.

```text
tx = begin_serialized_memory_write()
THEN -> SAVE-12
```

### SAVE-12: Generation still valid?

A policy-generation mismatch requires fresh authorization, never optimistic persistence.

```text
IF tx.policy_matches(candidate.capture_generation)
ON yes -> SAVE-13
ON no -> SAVE-16
```

### SAVE-13: Insert the knowledge record

Store raw claim text, record category, confidence, app/version scope, source IDs, and expiry.

```text
tx.insert(candidate)
THEN -> SAVE-14
```

### SAVE-14: Update the full-text index

Predeclared optional vector indexing must use a revocation-aware queue keyed by record ID. Inclusion is decided before freeze, not introduced afterward.

```text
tx.update_fts(candidate)
THEN -> SAVE-15
```

### SAVE-15: Commit the transaction

Return success only after durable storage succeeds. On error, roll back and report failure.

```text
tx.commit()
THEN -> SAVE-18
```

### SAVE-16: Roll back the transaction

No partial record/index updates remain.

```text
tx.rollback()
THEN -> SAVE-17
```

### SAVE-17: Discard the candidate

Do not retain a rejected candidate in logs, recovery files, or an automatic training queue.

```text
release(candidate)
THEN -> SAVE-18
```

### SAVE-18: Return the storage outcome

A no-save result is expected for temporary help, not an error.

```text
RETURN saved_or_not_saved
END FLOW
```

## 15 Policy Changes

Proposed advanced rules use structured conditions, not scripts. Global deny and protected-source rules win. The user can inspect effective permissions before applying them.

### RULE-01: Accept a settings edit

Separate controls: observation scope/types/purpose/lifetime, collection, pause, recall, menu reveal, file/capture scope, retention, export and training. Proposed proactive hints F-29 need pre-freeze approval and independent consent.

```text
proposal = user_settings_change()
THEN -> RULE-02
```

### RULE-02: Rule structure valid?

Allow app IDs, path identities, source types, time/size limits, and booleans; never eval arbitrary expressions.

```text
IF validate_typed_rules(proposal)
ON yes -> RULE-03
ON no -> RULE-16
```

### RULE-03: Compute effective permissions

Deny first, then narrow explicit grants. Acquisition allowed does not imply retention or export allowed.

```text
preview = evaluate_precedence(proposal)
THEN -> RULE-04
```

### RULE-04: User confirms the change?

Show consequential effects such as pausing active reads or shortening retention.

```text
IF user_confirms(preview)
ON yes -> RULE-05
ON no -> RULE-17
```

### RULE-05: Acquire the policy write lock

Serialize changes against durable memory commits and indexing jobs.

```text
lock = policy_transaction_lock()
THEN -> RULE-06
```

### RULE-06: Close the previous policy epoch

Atomically invalidate the previous generation and apply restrictions before disk I/O. Stale reads, writes and publication are blocked immediately; permissive changes wait for successful commit. Failure never restores revoked authority.

```text
transition = close_old_policy_epoch_under_restrictive_proposal(proposal)
THEN -> RULE-07
```

### RULE-07: Persist the policy document

If persistence fails, keep runtime access restrictive and report that settings did not save.

```text
atomic_write_policy(proposal)
ON success -> RULE-08
ON failure -> RULE-15
```

### RULE-08: Publish effective permissions

Workers observe a single consistent version, not partially edited settings. Reconcile observer subscriptions against the effective scope and lifetime; display the actual active, paused, blocked, or off state.

```text
policy = compile_rules(proposal)
THEN -> RULE-09
```

### RULE-09: Cancel affected source readers

Pause stops all acquisition. Background off cancels background subscriptions, queued reads, and late results; explicit help still works. Collection off blocks persistence, while separately authorized reads remain temporary-only.

```text
cancel_readers_outside(policy)
THEN -> RULE-10
```

### RULE-10: Reject affected pending writes

Tasks captured while off stay temporary when collection is re-enabled.

```text
reject_ineligible_write_queue()
THEN -> RULE-11
```

### RULE-11: Invalidate affected caches

Prompt contexts, retrieval results, embeddings in flight, and pending answers must drop newly disallowed data.

```text
invalidate_by_policy_generation()
THEN -> RULE-12
```

### RULE-12: Existing retention shortened?

Turning collection off alone does not erase existing memories. Forget and retention changes are separate actions.

```text
IF change.shortens_existing_retention
ON yes -> RULE-13
ON no -> RULE-14
```

### RULE-13: Queue affected record expiry

Persist a cleanup job under the lock; run the Forget flow only after this transaction releases its lock.

```text
enqueue_cleanup_after_unlock(expired_record_ids)
THEN -> RULE-14
```

Detailed flow: 16 Forget & Expire.

### RULE-14: Release the policy lock

Do not wait for user input while holding this lock. Cascaded cleanup runs from a committed job after release.

```text
unlock(lock)
THEN -> RULE-17
```

### RULE-15: Keep access restrictive

Abort affected tasks and surface the save failure instead of falsely showing a successful toggle.

```text
runtime_policy = restrictive_failure_policy()
THEN -> RULE-14
```

### RULE-16: Explain the invalid rule

No partially valid rule is applied.

```text
show_validation_errors()
THEN -> RULE-17
```

### RULE-17: Return the effective policy

The UI should show the actual enforced state, not just the user's requested switch position.

```text
RETURN policy_status
END FLOW
```

## 16 Forget & Expire

Logical deletion is immediate. Physical cleanup is tracked and retried. No claim of forensic SSD erasure or automatic unlearning from trained weights.

### DEL-01: Select the deletion scope

Allow per-record, app, source, time range, and everything. Expiry invokes the same mechanism without a second user prompt.

```text
scope = selected_records_or_app_or_all()
THEN -> DEL-02
```

### DEL-02: Preview dependent records

Preview summaries, chunks, indexes, caches, pending exports and owned backups. Authorization covers the selected records and their descendants; this unlocked preview is not the final deletion inventory.

```text
preview = lineage_closure(scope)
THEN -> DEL-03
```

### DEL-03: Deletion authorized?

Show impact before destructive manual deletion. Cancellation leaves data unchanged.

```text
IF explicit_confirm_or_expiry_rule(scope)
ON yes -> DEL-04
ON no -> DEL-19
```

### DEL-04: Acquire the memory write lock

Acquire the shared policy/memory lock and recheck owner and confirmed selection or expiry rule. Closure and commit below occur under this same transaction.

```text
tx = begin_serialized_delete_transaction(scope)
THEN -> DEL-05
```

### DEL-05: Publish deletion tombstones

Recompute authoritative descendants after acquiring the lock, including concurrent commits since preview. Readers honor committed tombstones; later writes reject deleted parents. Physical cleanup can remain pending.

```text
impact = tx.mark_deleted(tx.current_derivation_closure(scope))
THEN -> DEL-06
```

### DEL-06: Advance data generation

Invalidate cache keys and active answer contexts that depended on removed records.

```text
data_generation += 1
THEN -> DEL-07
```

### DEL-07: Commit the deletion barrier

Persist the exact opaque-ID cleanup inventory with the tombstones before releasing the lock. ERASE expands this same receipt, not another deletion or a later lineage snapshot.

```text
receipt = tx.commit_tombstones_and_cleanup_job(impact)
THEN -> DEL-08
```

### DEL-08: Cancel dependent workers

Late embedding/model outputs cannot resurrect deleted knowledge.

```text
cancel_jobs_referencing(impact)
THEN -> DEL-09
```

### DEL-09: Evict dependent temporary data

Drop current prompts, retrieval results, screenshots, and prepared answer text that reference deleted sources.

```text
evict_contexts(impact)
THEN -> DEL-10
```

### DEL-10: Delete owned database rows

Delete primary records, FTS entries and vectors by stable record ID using audited deletion modes. Preserve nonpayload cleanup IDs/tombstones until dependent cleanup is verified; deleting lineage too early loses the cleanup inventory.

```text
delete_rows_and_indexes(impact)
THEN -> DEL-11
```

### DEL-11: Remove owned derived files

Limit cleanup to EA-owned files listed in the manifest; never delete original user software or documents.

```text
remove_owned_files(impact)
THEN -> DEL-12
```

### DEL-12: Reconcile owned backups

A backup that retains the deleted content is still a retained copy. Restore must reapply tombstones.

```text
purge_or_rewrite_owned_backups(impact)
THEN -> DEL-13
```

### DEL-13: Request database cleanup

WAL checkpointing and vacuuming can reduce retained pages but do not guarantee forensic erasure on storage hardware.

```text
checkpoint_and_compact_when_safe()
THEN -> DEL-14
```

### DEL-14: External copies exist?

User-managed exports, third-party backups, and trained weights may be outside EA's deletion control.

```text
IF exports_or_trained_adapters_reference(impact)
ON yes -> DEL-15
ON no -> DEL-16
```

### DEL-15: Report unremoved copies

Deletion from the DB does not untrain a model. A separately trained adapter may need removal or rebuilding.

```text
report_external_copy_manifest(impact)
THEN -> DEL-16
```

### DEL-16: Owned cleanup complete?

R-06: verify each owned store, FTS shadow entries, database/journal cleanup, chart history and owned backups. Search absence alone is insufficient; pending cleanup stays visible. Detailed flow separates immediate exclusion from physical cleanup.

```text
IF verify_absence(impact)
ON yes -> DEL-18
ON no -> DEL-17
```

Detailed flow: 50 Verify Forgetting.

### DEL-17: Persist a cleanup retry

Keep tombstones enforced. Tell the user deletion is logically effective but cleanup is incomplete.

```text
cleanup_queue.retry_with_error(impact)
THEN -> DEL-19
```

### DEL-18: Record a content-free receipt

No deleted text, paths, hashes of sensitive low-entropy data, or embeddings in the receipt.

```text
record_cleanup_counts_and_status()
THEN -> DEL-19
```

### DEL-19: Return deletion status

Honest statuses: cancelled, blocked from recall, cleanup pending, owned copies removed, external copies remain.

```text
RETURN cleanup_status
END FLOW
```

## 17 Memory Correction

A user must be able to see and change what EA remembers. Correction is not rewriting source evidence to pretend it originally said something else.

### EDIT-01: Select a knowledge record

Expose the stored claim, provenance, category, app/version, confidence, and expiry.

```text
record = user_selected_record()
THEN -> EDIT-02
```

### EDIT-02: Record still exists?

Concurrent deletion can invalidate an open editor.

```text
IF record.is_live
ON yes -> EDIT-03
ON no -> EDIT-13
```

### EDIT-03: Accept replacement content

Allow edited text and metadata within typed fields, not executable policy code.

```text
replacement = user_edit(record.claim)
THEN -> EDIT-04
```

### EDIT-04: Replacement valid?

Check size, source references, version scope, and sensitivity. Do not auto-approve training export.

```text
IF validate_memory_edit(replacement)
ON yes -> EDIT-05
ON no -> EDIT-14
```

### EDIT-05: Review the correction

Deleting the original text is a separate choice from keeping revision history.

```text
choice = show_before_after(record, replacement)
ON apply -> EDIT-06
ON cancel -> EDIT-15
```

### EDIT-06: Begin a correction transaction

Recheck record revision and current modification authorization under the lock.

```text
tx = begin_memory_transaction()
THEN -> EDIT-07
```

### EDIT-07: Record revision unchanged?

Avoid overwriting another user's edit or a concurrent delete.

```text
IF tx.expected_revision_matches(record)
ON yes -> EDIT-08
ON no -> EDIT-12
```

### EDIT-08: Store the corrected claim

Keep source provenance distinct. Revision text retention follows the user's history policy, not an assumed forever log.

```text
tx.supersede(record, replacement, author='user')
THEN -> EDIT-09
```

### EDIT-09: Invalidate dependent summaries

Generated summaries and embeddings must not continue serving the old meaning.

```text
tx.mark_derived_stale(record.id)
THEN -> EDIT-10
```

### EDIT-10: Refresh derived search entries

An optional asynchronous vector index must verify the new record revision before publishing.

```text
tx.reindex_live_claim(record.id)
THEN -> EDIT-11
```

### EDIT-11: Commit the correction

On failure roll back; return no false success. Later retrieval prefers the corrected live claim.

```text
tx.commit()
THEN -> EDIT-15
```

### EDIT-12: Roll back the stale edit

Offer reload or a new explicit edit; no silent last-writer-wins overwrite.

```text
tx.rollback()
THEN -> EDIT-15
```

### EDIT-13: Report the missing record

Do not resurrect deleted knowledge from the editor's cached copy.

```text
show_record_deleted()
THEN -> EDIT-15
```

### EDIT-14: Explain validation failures

Leave the durable record unchanged.

```text
show_edit_errors()
THEN -> EDIT-15
```

### EDIT-15: Return the correction status

A correction updates memory, not model weights or the source application.

```text
RETURN edit_status
END FLOW
```

## 18 Knowledge Compaction

Deduplication and summaries can reduce storage/context, but a summary can lose details or introduce mistakes. Compression, retrieval, and training are separate features.

### PACK-01: Select eligible records

Temporary-only content is never eligible, even if collection later turns on.

```text
records = live_retained_records(scope)
THEN -> PACK-02
```

### PACK-02: Find exact duplicates

Do not collapse records with different versions, scopes, or provenance just because their labels look alike.

```text
groups = group_by_content_and_provenance(records)
THEN -> PACK-03
```

### PACK-03: Deduplicate redundant copies

Preserve all valid source references and deletion lineage while avoiding duplicate payload storage.

```text
records = retain_canonical_records(groups)
THEN -> PACK-04
```

### PACK-04: Lossy summary requested?

Lossless deduplication and lossy summaries have different risk and review requirements.

```text
IF user_requests_summary_compaction
ON yes -> PACK-05
ON no -> PACK-10
```

### PACK-05: Summary worker admissible?

Do not load another model beside the answer worker. Maintenance must yield to interactive tasks.

```text
IF CALL resources permits_model
ON yes -> PACK-06
ON no -> PACK-14
```

Detailed flow: 11 Resource Admission.

### PACK-06: Draft a bounded summary

Keep exact control labels and action semantics literal; generated prose is a derived claim.

```text
draft = summarize_with_source_ids(records)
THEN -> PACK-07
```

### PACK-07: Summary supported by sources?

Reject invented steps, lost negation, merged versions, or contradictions.

```text
IF validate_summary_claims(draft, records)
ON yes -> PACK-08
ON no -> PACK-13
```

### PACK-08: User approves the summary?

Show what would change and whether originals would remain. Approval is not training consent.

```text
IF user_reviews(draft, originals)
ON yes -> PACK-09
ON no -> PACK-13
```

### PACK-09: Store summary lineage

Summary inherits the most restrictive source policy and expiry. It cannot outlive deleted parent evidence by accident.

```text
CALL retain(summary_with_parent_ids)
THEN -> PACK-10
```

Detailed flow: 14 Durable Memory.

### PACK-10: Compute compaction results

Measure storage and retrieval quality; do not claim compression is automatically an accuracy improvement.

```text
report = compare_bytes_and_record_counts()
THEN -> PACK-11
```

### PACK-11: Original removal approved?

Do not delete originals merely because a summary exists. Removing a parent requires a reviewed lineage-transfer policy or summary deletion.

```text
IF explicit_original_removal_consent
ON yes -> PACK-12
ON no -> PACK-15
```

### PACK-12: Delete selected originals

The deletion impact preview includes dependent summaries; retained summaries cannot secretly carry forgotten content.

```text
CALL forget(approved_scope)
THEN -> PACK-15
```

Detailed flow: 16 Forget & Expire.

### PACK-13: Discard the summary draft

Keep the original retained records unchanged.

```text
release(draft)
THEN -> PACK-15
```

### PACK-14: Defer costly compaction

No automatic retry or model work. Only another deliberate user request may start a new finite budget; existing eligible data remains under its original lifetime.

```text
offer_new_explicit_compaction_request_without_scheduling()
THEN -> PACK-15
```

### PACK-15: Return compaction results

The model weights remain unchanged.

```text
RETURN report
END FLOW
```

## 19 Training Data Export

Predeclared F-23 reviewed export and adapter contract. Export is not training. Actual weight training is outside ZI, not a hidden high-RAM feature tier. No KARL integration or external API authority is implied.

### DATA-01: Accept an export request

Never create a training dataset automatically from everything the assistant sees.

```text
request = explicit_user_export()
THEN -> DATA-02
```

### DATA-02: Select training-eligible records

Training eligibility is a separate opt-in bit. Temporary records, deleted data, and denied sources are excluded.

```text
records = live_records_with_training_consent()
THEN -> DATA-03
```

### DATA-03: Resolve source lineage

A summary cannot bypass the restrictions of its source records.

```text
sources = provenance_closure(records)
THEN -> DATA-04
```

### DATA-04: Source permissions sufficient?

User-controlled data can still contain third-party confidential or licensed content; uncertain items require exclusion or review.

```text
IF rights_and_consent_allow_export(sources)
ON yes -> DATA-06
ON no -> DATA-05
```

### DATA-05: Exclude unapproved items

Report counts and categories without leaking excluded content into the export manifest.

```text
records = remove_ineligible(records)
THEN -> DATA-06
```

### DATA-06: Redact sensitive content

Use user review as well as automated detection. A regex cannot prove a dataset is secret-free.

```text
records = export_redaction(records)
THEN -> DATA-07
```

### DATA-07: Build structured examples

Keep task instructions separate from observed hostile text; include evidence and uncertainty labels.

```text
examples = curated_question_evidence_answer(records)
THEN -> DATA-08
```

### DATA-08: Separate evaluation examples

Split by source/app session to reduce leakage from near-identical examples into both sets.

```text
splits = source_grouped_train_eval_split(examples)
THEN -> DATA-09
```

### DATA-09: Review dataset content

Review actual rows, source counts and consent limits. This content review alone cannot authorize a write; the destination stage binds a final exact-byte preview to a new path.

```text
choice = user_reviews_dataset(splits)
ON approved -> DATA-10
ON cancel -> DATA-15
```

### DATA-10: Records still exportable?

Catch deletions, corrections, and revoked training consent that occurred during review.

```text
IF live_policy_and_revisions_match(splits)
ON yes -> DATA-11
ON no -> DATA-15
```

### DATA-11: Approve the destination preview

User selects a new local path and approves exact payload, destination and lineage. Cancel or stale data returns cancelled; no network upload, project overwrite or automatically inferred path.

```text
preview = reviewed_new_destination_and_exact_dataset(splits)
THEN -> DATA-12
```

### DATA-12: Write the dataset atomically

The narrow committer rechecks exact preview, owner epoch, source revisions, permissions, no-overwrite and no-symlink-escape at commit. Gate against concurrent revocation/deletion; atomic new-file delivery where supported. Any failure returns actual status without following success nodes.

```text
result = commit_reviewed_new_dataset_with_final_guards(preview)
THEN -> DATA-13
```

### DATA-13: Store an export manifest

Track the owned export destination and originating record IDs for future deletion impact reports.

```text
record_export_ids_and_policy_versions()
THEN -> DATA-14
```

### DATA-14: Explain the training boundary

Future training runs on suitable hardware under separate consent. DB deletion alone does not unlearn exported or trained content.

```text
show_export_complete_not_trained()
THEN -> DATA-16
```

### DATA-15: Discard export buffers

No partial dataset or automatic retry after consent withdrawal.

```text
release_export_buffers()
THEN -> DATA-16
```

### DATA-16: Return export status

No training process or external API call starts here.

```text
RETURN dataset_or_cancelled
END FLOW
```

## 20 Platforms & Release Gates

Linux first, with a small declared compatibility matrix. A shared core cannot erase OS permission and window-manager differences.

### PORT-01: Identify the operating system

Do not claim cross-platform support solely because the language or UI toolkit runs there.

```text
os = platform_id()
ON Linux -> PORT-02
ON macOS -> PORT-03
ON Windows -> PORT-04
ON unknown -> PORT-16
```

### PORT-02: Detect Linux display capabilities

AT-SPI handles structured UI where apps expose it; screenshot/overlay permissions vary by desktop and compositor.

```text
display = wayland_or_x11_capabilities()
THEN -> PORT-05
```

### PORT-03: Select the declared macOS adapter

Future scope only. Requires platform-specific accessibility and screen-capture permission testing.

```text
adapter_plan = accessibility_and_capture_permissions()
THEN -> PORT-15
```

### PORT-04: Select the declared Windows adapter

Future scope only. Test privilege boundaries, application toolkits, and secure desktops explicitly.

```text
adapter_plan = ui_automation_and_capture_permissions()
THEN -> PORT-15
```

### PORT-05: Load the Linux adapter manifest

Adapters expose typed read/reveal/highlight operations; no arbitrary execution hook is handed to the model.

```text
manifest = tested_app_version_contracts()
THEN -> PORT-06
```

### PORT-06: App/version tested?

Generic passive accessibility reads can be partially useful, but an untested reveal contract stays disabled.

```text
IF manifest.matches(target)
ON yes -> PORT-07
ON no -> PORT-09
```

### PORT-07: Run adapter contract checks

Check roles, object identity, permission state, and expected control structures before enabling reveal.

```text
result = validate_available_interfaces()
THEN -> PORT-08
```

### PORT-08: Contract checks pass?

Missing or changed controls invalidate the capability, not just the test report.

```text
IF result.valid
ON yes -> PORT-10
ON no -> PORT-09
```

### PORT-09: Declare partial support

User-opened menus, supplied text, or selected crops are honest fallbacks.

```text
capabilities = passive_read_only_subset()
THEN -> PORT-10
```

### PORT-10: Publish capability status

Support is granular: accessible labels, menus, capture, overlay, file reads, and memory are separate.

```text
matrix = per_feature_supported_partial_denied()
THEN -> PORT-11
```

### PORT-11: Read compatibility evidence

Startup checks available adapters against reviewed receipts; it does not run the full acceptance suite or probe personal content. Missing or obsolete evidence remains a compatibility gap. AC and QUAL are separate engineering procedures.

```text
results = load_versioned_compatibility_receipts()
THEN -> PORT-12
```

### PORT-12: Acceptance gates pass?

Evaluate narrow and broad questions on both Qt and GTK apps and a real 4 GB machine, including high memory pressure.

```text
IF results.meet_measured_targets
ON yes -> PORT-13
ON no -> PORT-14
```

### PORT-13: Mark the capability releasable

Only tested versions/features are advertised. Regressions revoke support until fixed.

```text
RETURN verified_capability_matrix
END FLOW
```

### PORT-14: Keep the capability experimental

A model leaderboard score cannot replace end-to-end desktop safety and usefulness tests.

```text
RETURN failing_tests_and_gaps
END FLOW
```

### PORT-15: Record the unimplemented adapter

No macOS or Windows support is implemented by this board. F-27 must be resolved before freeze, and missing platform support remains an explicit gap.

```text
RETURN predeclared_platform_gap
END FLOW
```

Detailed flow: 40 Analysis Sign-Off.

### PORT-16: Return an unsupported platform

Offer manual text input without implying desktop inspection capability.

```text
RETURN no_adapter
END FLOW
```

## 21 ZI Setup Wizard

A user-driven installer configures EA itself outside the assistant tool registry. Free local use needs no vendor/cloud account or paid API. Private user profiles still require a tested local identity/storage boundary; guest use does not unlock private data.

### SET-01: Open the ZI setup wizard

Explain the read-and-guide scope in the installer consent screen. Do not start observing while setup is incomplete.

```text
wizard = user_launched_setup()
THEN -> SET-02
```

### SET-02: Review dependency licenses

Verify app code, runtime, model weights, OCR, icons, and bundled datasets can be distributed under the chosen free-software terms.

```text
manifest = approved_license_manifest()
THEN -> SET-03
```

### SET-03: Free-use requirements satisfied?

Free to use does not mean zero electricity or download costs. Never require a subscription, account, advertising, or data sale.

```text
IF no_mandatory_paid_service(manifest)
ON yes -> SET-04
ON no -> SET-18
```

### SET-04: Measure host resources

Read only necessary hardware information after installer consent; no personal file inventory.

```text
profile = local_hardware_probe()
THEN -> SET-05
```

### SET-05: Choose a resource preset

Every included ZI feature must have positive 4 GB tests. Text-first and no-model modes preserve assistance under transient pressure, not excuse missing features.

```text
preset = user_selects_low_ram_profile()
THEN -> SET-06
```

### SET-06: Choose the local model source

Model downloads are explicit installer actions, not permission for runtime web access.

```text
source = user_selects_local_file_or_download()
ON local file -> SET-08
ON download approved -> SET-07
ON no model -> SET-09
```

### SET-07: Download an approved artifact

Show publisher, size, license, destination, and network use before downloading. No arbitrary post-install scripts.

```text
artifact = installer_download(source)
THEN -> SET-08
```

### SET-08: Verify artifact integrity

R-07: trusted metadata and artifact identity checks precede activation; user-managed imports carry a separate trust label. A hash from the same untrusted source does not authenticate it. Offline cannot prove latest revocation; stale metadata blocks new updates, not existing offline use.

```text
result = verify_trusted_manifest(artifact)
ON verified -> SET-09
ON failed -> SET-18
```

Detailed flow: 51 Artifact Trust.

### SET-09: Choose local storage

Show expected disk use and ownership. Keep EA data private to the OS user where supported.

```text
location = user_selects_data_directory()
THEN -> SET-10
```

### SET-10: Choose source permissions

Do not grant the whole screen or home directory by default. Availability on screen does not waive others' privacy.

```text
grants = explicit_app_file_capture_choices()
THEN -> SET-20
```

### SET-11: Choose collection behavior

Collection off allows permitted help or opted-in background observation in bounded temporary memory, without durable retention. Pause and background observation remain separate controls.

```text
collect = user_toggle(default=false)
THEN -> SET-12
```

### SET-12: Choose retention limits

Prefer task-only until the user deliberately chooses lasting memory.

```text
retention = user_selects_lifetimes_and_quota()
THEN -> SET-13
```

### SET-13: Choose companion preferences

Cyborg-inspired visual identity and conversational style remain user-adjustable.

```text
preferences = CALL personality
THEN -> SET-14
```

Detailed flow: 22 Personality & Presence.

### SET-14: Review effective settings

Present actual read, recall, retention, network, startup and resource choices. Each option has rich hover/focus/pinned help; linked details expand the settings contract.

```text
choice = user_reviews_actual_permissions()
ON apply -> SET-15
ON cancel -> SET-19
```

Detailed flow: 38 Settings & Rich Help.

### SET-15: Save EA settings atomically

Only EA-owned installation/settings files are written by this consent-driven setup process.

```text
installer.write_settings(grants, preset, retention)
THEN -> SET-16
```

### SET-16: Run a synthetic self-test

Use bundled dummy menus and sample text, not a sweep of the user's real desktop.

```text
results = test_with_fixture_data()
ON pass -> SET-17
ON fail -> SET-18
```

### SET-17: Finish setup

Offer a normal user-controlled startup option and an uninstall path that separately asks whether to remove personal data.

```text
RETURN configured_read_only_ZI
END FLOW
```

### SET-18: Report the setup blocker

Keep acquisition disabled. Do not hide incompatible licenses, failed integrity checks, or inadequate resources.

```text
RETURN failed_requirement
END FLOW
```

### SET-19: Cancel setup changes

Remove only installer-owned temporary downloads after user-approved cleanup; leave user files intact.

```text
RETURN cancelled_setup
END FLOW
```

### SET-20: Choose observation mode

Optional background observation is confirmed. Its initial off state, visible status, consent lifetime, source exclusions, capture grant, and rate/cache limits are proposed for review; no permission to interrupt or execute follows.

```text
background = reviewed_scope_types_purpose_lifetime(default=OFF)
THEN -> SET-11
```

## 22 Personality & Presence

User-confirmed: funny practical companionship, learned mannerisms and separate per-user profiles only. No generic social check-ins or blended private personalities. TONE/OWNER detail reviewed adaptation and identity isolation; lightweight preferences first, with no automatic weight training.

### STYLE-01: Accept a style preference

Examples: concise or detailed, formal or casual, dry/playful/off humor, approved slang, optional profanity, reduced motion and visibility. No jokes now overrides the usual style immediately; anger is not permanent profanity consent.

```text
choice = explicit_user_preference()
THEN -> STYLE-02
```

### STYLE-02: Choose preference lifetime

A saved preference is an explicit EA settings write, not background observation of the user's behavior.

```text
scope = this_session_or_saved_profile()
THEN -> STYLE-03
```

### STYLE-03: Preference within safety boundaries?

Tone cannot authorize secret collection, execution, deceptive certainty, or pressure to keep the companion enabled.

```text
IF style_preserves_privacy_and_truthfulness(choice)
ON yes -> STYLE-04
ON no -> STYLE-13
```

### STYLE-04: Apply conversational style

Change phrasing, not factual claims, evidence or permissions. TONE details optional reviewed learning from eligible first-party input, not another invocation of this settings write. Never blend different users' mannerisms or attributed opinions.

```text
style = bounded_current_owner_style_profile(choice)
THEN -> STYLE-05
```

Detailed flow: 62 Learned Mannerisms.

### STYLE-05: Apply accessible visual preferences

Use a recognizable companion without blocking menus or readable content. Respect reduced motion and adjustable size.

```text
appearance = cyborg_theme_with_user_controls()
THEN -> STYLE-06
```

### STYLE-06: Preview the personality

Use a fictional example instead of mining private conversations to demonstrate adaptation.

```text
preview = synthetic_dialogue(style)
THEN -> STYLE-07
```

### STYLE-07: User accepts the preview?

The user can reset the profile without deleting unrelated knowledge.

```text
IF user_accepts(preview)
ON yes -> STYLE-08
ON no -> STYLE-14
```

### STYLE-08: Persistent profile requested?

Saving selected settings is explicit consent. Inferred behavioral preferences still need collection/retention permission.

```text
IF scope == SAVED_PROFILE
ON yes -> STYLE-09
ON no -> STYLE-10
```

### STYLE-09: Save the selected preferences

Provide inspect, edit, export, reset and delete. Recheck trusted owner/session/revision at commit; no secret sensitive-trait inference or hidden personality score. Configuration profile names are not authentication.

```text
compare_and_write_current_owner_settings(style, appearance)
THEN -> STYLE-11
```

### STYLE-10: Keep preferences in session memory

Discard on session end. No retrospective persistence after collection is enabled.

```text
session.style = style
THEN -> STYLE-11
```

### STYLE-11: Training experiment requested?

Transparent preferences do not require fine-tuning. F-23 specifies reviewed exports and compatible adapter use; ZI does not train weights.

```text
IF explicit_dataset_export_request
ON yes -> STYLE-12
ON no -> STYLE-14
```

### STYLE-12: Review a declared training dataset

Confirmed guided export/import with a separately launched self-hosted trainer. LEARN separates preferences, facts, reviewed examples and adapter evaluation; actual trainer formats/licenses remain unverified. KARL is untouched.

```text
CALL learningWorkbench_for_explicit_dataset_intent
THEN -> STYLE-14
```

Detailed flow: 59 Guided Learning Workbench.

### STYLE-13: Explain the fixed boundary

Personality settings cannot switch ZI into autonomous execution.

```text
show_non_overridable_policy()
THEN -> STYLE-14
```

### STYLE-14: Return the chosen style

Calm support, accurate uncertainty, respect for user agency, bystander privacy, and the surrounding environment.

```text
RETURN style_profile
END FLOW
```

## 23 Passive Link Review

ZI can flag suspicious evidence, not certify a URL as safe or fake. Static review does not visit, resolve, follow redirects, or submit a URL to a third party.

### LINK-01: Read a user-selected link

A browser adapter may read the actual destination only if exposed and authorized. Display text alone is not the destination.

```text
link = permitted_visible_link_or_paste()
THEN -> LINK-02
```

### LINK-02: Actual destination available?

An image of link text may hide a different target. State this uncertainty explicitly.

```text
IF link.has_destination
ON yes -> LINK-03
ON no -> LINK-11
```

### LINK-03: Parse the URL structurally

Do not infer hostnames through ad hoc substring matching.

```text
url = standard_url_parser(link.destination)
ON valid -> LINK-04
ON invalid -> LINK-12
```

### LINK-04: Normalize the hostname

Display both human-readable and encoded forms when relevant; Unicode confusables are a signal, not proof of fraud.

```text
host = canonical_idna_hostname(url)
THEN -> LINK-05
```

### LINK-05: Classify the URL scheme

Scripts, local-file handlers, and custom launch schemes are not ordinary HTTPS links. Never execute them to inspect behavior.

```text
scheme_risk = known_scheme_policy(url.scheme)
THEN -> LINK-06
```

### LINK-06: Compare visible text to destination

Use the registrable domain via a maintained public-suffix library/list. A legitimate subdomain can look unfamiliar too.

```text
mismatch = compare_claimed_and_actual_destination(link, url)
THEN -> LINK-07
```

### LINK-07: Collect static risk signals

Examples: deceptive userinfo, lookalike host, misleading subdomains, an IP address, or unexpected scheme. HTTPS alone proves no trustworthiness.

```text
signals = local_checks(url, mismatch)
THEN -> LINK-08
```

### LINK-08: Compare to trusted local references

Do not invent the official domain from model memory or treat an old cached result as current reputation.

```text
reference = user_approved_official_domain_record()
THEN -> LINK-09
```

### LINK-09: Record verification limits

Offline analysis cannot know current site behavior, newly compromised domains, or the final target of a shortened URL.

```text
limits = no_live_reputation_no_redirect_resolution()
THEN -> LINK-10
```

### LINK-10: Explain the risk evidence

Avoid a green 'safe' guarantee. Offer non-clicking verification steps and cite the exact observed destination.

```text
RETURN suspicious_or_no_obvious_signal_or_unknown
END FLOW
```

### LINK-11: Report the hidden destination

Ask for a copied destination as plain text or an approved browser inspection. Do not click the link.

```text
RETURN insufficient_destination_evidence
END FLOW
```

### LINK-12: Report the malformed URL

Do not repair and navigate a suspicious link automatically.

```text
RETURN malformed_link_with_uncertainty
END FLOW
```

## 24 Antivirus Guidance

In ZI, running a scan is an external command and is therefore unavailable to EA. The user can run an existing scanner; EA can interpret permitted reports.

### AV-01: Accept a scan-help question

Wanting antivirus support does not silently turn on execution mode.

```text
question = user_requests_scan_help()
THEN -> AV-02
```

### AV-02: State the ZI action boundary

No launching scanners, updating signatures, quarantining files, deleting files, or invoking shell commands.

```text
explain_user_runs_scan()
THEN -> AV-03
```

### AV-03: Scanner identified?

Do not scan installed software merely to infer a scanner when inventory permission is absent.

```text
IF user_names_scanner_or_permitted_inventory
ON yes -> AV-05
ON no -> AV-04
```

### AV-04: Ask which scanner is available

If none is installed, provide verified installation guidance for the user; EA does not install it.

```text
scanner = user_selects_existing_scanner()
ON identified -> AV-05
ON none -> AV-10
```

### AV-05: Read permitted scanner documentation

Prefer current official documentation and verified app/version controls over invented scan buttons.

```text
docs = scoped_local_docs_or_user_supplied_reference()
THEN -> AV-06
```

### AV-06: Explain user-run scan steps

Keep scan scope, performance cost, and quarantine options visible. The user initiates the scanner.

```text
show_exact_verified_steps(docs)
THEN -> AV-07
```

### AV-07: Report available for inspection?

EA does not poll every process to discover when an unapproved scan finishes.

```text
IF user_supplies_report_or_scan_window
ON yes -> AV-08
ON no -> AV-10
```

### AV-08: Read the permitted scan result

Apply normal protected-path, temporary-use, parser, and policy controls.

```text
evidence = CALL files_or_ui(report)
THEN -> AV-09
```

Detailed flow: 07 File Reading.

### AV-09: Explain reported findings

No detections is not proof of a clean system; alerts can include false positives. Never rewrite a scanner's verdict as certainty.

```text
explain_scanner_status_and_limits(evidence)
THEN -> AV-10
```

### AV-10: Return guidance to the user

A future execution edition may propose scanner integration under a distinct action grant.

```text
RETURN no_external_action
END FLOW
```

## 25 Read, Find & Assemble

ZI may assemble references, comparisons, checklists, and proposed work inside its own panel. It cannot apply them to another app or complete external tasks.

### PLAN-01: Accept a research or organization goal

Example: find all relevant settings and assemble a troubleshooting sequence with supporting references.

```text
goal = user_request()
THEN -> PLAN-02
```

### PLAN-02: Choose the inspection scope

Seeing content on a screen does not imply permission to store it, read hidden tabs, or inspect every monitor.

```text
scope = user_approved_visible_apps_or_files()
THEN -> PLAN-03
```

### PLAN-03: Choose desired coverage

A quick pass prioritizes accessible labels; a thorough pass can stream authorized content in bounded chunks.

```text
coverage = quick_pass_or_thorough_review()
THEN -> PLAN-04
```

### PLAN-04: Authorize each source

Permission is evaluated per source type. Secrets, excluded apps, and private/bystander content remain protected.

```text
permit = CALL policy(scope)
ON allowed -> PLAN-05
ON denied -> PLAN-11
```

Detailed flow: 03 Authorization.

### PLAN-05: Read the next bounded chunk

Respect CPU, RAM, time, and byte limits while allowing explicit continuation toward full coverage.

```text
chunk = bounded_read(next_source)
THEN -> PLAN-06
```

### PLAN-06: Extract relevant references

Keep location and version information. Do not indiscriminately retain everything read.

```text
references.add(cited_matches(chunk))
THEN -> PLAN-07
```

### PLAN-07: Authorized content remains?

Complete reading means every permitted chunk was inspected, not that a small model saw the entire file at once.

```text
IF coverage.has_unread_content
ON yes -> PLAN-08
ON no -> PLAN-12
```

### PLAN-08: Current work budget exhausted?

Avoid locking the desktop or consuming unlimited energy just because the user asked for broad understanding.

```text
IF deadline_or_cpu_budget_reached()
ON yes -> PLAN-09
ON no -> PLAN-05
```

### PLAN-09: Ask whether to continue reading

Report amount read, sources remaining, and any gaps. A bounded continuation is still reading, not autonomous task execution.

```text
choice = user_reviews_progress_and_scope()
ON continue -> PLAN-10
ON stop here -> PLAN-12
ON cancel -> PLAN-14
```

### PLAN-10: Start an explicit continuation task

Close the old ledger; do not reset its counters or deadline. Revalidate owner, scope, revisions and cursor expiry. Existing evidence keeps its original expiry and sticky retention eligibility; changed snapshots cannot become fake complete coverage.

```text
task = new_explicit_continuation_with_revalidated_cursor()
THEN -> PLAN-04
```

### PLAN-11: Record an excluded source

The final assembly lists omissions instead of implying omniscient coverage.

```text
gaps.add(source, reason)
THEN -> PLAN-12
```

### PLAN-12: Assemble a cited work outline

Draft a checklist, comparison, or explanation in EA's own panel; each proposed step links back to evidence.

```text
outline = organize_references_by_goal(references)
THEN -> PLAN-13
```

### PLAN-13: Preview the proposed work

Preview is inert text or safely decoded content with scripts/macros and remote fetching disabled.

```text
panel.show(outline, coverage, gaps)
THEN -> PLAN-14
```

### PLAN-14: Return without applying changes

No typing into apps, file modifications, downloads, submissions, or command invocation.

```text
RETURN proposed_work_only
END FLOW
```

## 26 ZII Execution Boundary

ZII, not ZI. A separate execution edition may support delegated actions and long-running loops. ZI ships without an execution backend; no hidden toggle grants it.

### ZII-01: ZII execution backend installed?

ZI always takes the no path. This is an architecture reservation, not an implemented capability.

```text
IF ZII_execution_backend_available
ON yes -> ZII-02
ON no -> ZII-17
```

### ZII-02: Accept an explicit task delegation

A future task includes a clear goal, scoped apps/files, permitted operations, and completion criteria.

```text
delegation = user_authorizes_goal()
THEN -> ZII-03
```

### ZII-03: Define an autonomy budget

Hours of work require finite limits, visible progress, checkpoints, and stop conditions.

```text
budget = user_sets_time_steps_cpu_memory_cost()
THEN -> ZII-04
```

### ZII-04: Create a least-privilege lease

Do not expose unrestricted shell access simply because a model asked for it. Network and credentials are separate permissions.

```text
lease = broker.issue_typed_capabilities()
THEN -> ZII-05
```

### ZII-05: Propose the next action

The planner cannot execute. External content and prompt injection cannot create or expand a capability lease.

```text
proposal = planner.next_step(evidence, goal)
THEN -> ZII-06
```

### ZII-06: Authorize the proposed action

Check identity, scope, risk, cancellation, confirmation, expiry and every finite budget before the first action as well as later actions. Recheck at execution. The common finally path revokes the lease on every exit, including success.

```text
decision = broker.check_live_scope_and_remaining_budgets(proposal, lease)
ON allowed -> ZII-07
ON denied -> ZII-14
```

### ZII-07: Fresh approval required?

High-impact, irreversible, security-sensitive, external-send, purchase, or permission-escalation actions require deliberate review.

```text
IF action.requires_confirmation
ON yes -> ZII-08
ON no -> ZII-09
```

### ZII-08: Request action approval

Approval is for this action and scope, not every future command in the loop.

```text
choice = user_reviews_exact_effects(proposal)
ON approve -> ZII-09
ON decline -> ZII-14
```

### ZII-09: Execute through the isolated broker

Separate OS process, scoped adapters, resource limits, timeouts, and a revocable lease. Never an LLM-owned raw execution channel.

```text
result = broker.perform(proposal)
THEN -> ZII-10
```

### ZII-10: Observe the action outcome

A successful process exit is not proof that the user's goal was accomplished.

```text
outcome = independent_state_check(result)
THEN -> ZII-11
```

### ZII-11: Write a minimal task checkpoint

Logs and task state follow retention rules. Temporary-only sessions cannot silently create durable multi-day task history.

```text
checkpoint = retained_progress_under_policy(outcome)
THEN -> ZII-12
```

### ZII-12: User goal achieved?

Do not invent success or continue modifying things after the goal is met.

```text
IF evidence_satisfies_acceptance_criteria
ON yes -> ZII-16
ON no -> ZII-13
```

### ZII-13: Execution lease still valid?

Stop on user cancellation, expired permission, repeated failure, no progress, changed target, or exceeded resources.

```text
IF lease.live
ON yes -> ZII-18
ON no -> ZII-15
```

### ZII-14: Report the blocked action

Offer a narrower proposal or user action. The planner cannot approve its own denied request.

```text
show_blocker_without_bypass()
THEN -> ZII-15
```

### ZII-15: Revoke the execution lease

Interrupt running processes where safe, disclose partial effects, and require explicit approval before any resume.

```text
broker.cancel_and_release(lease)
THEN -> ZII-16
```

### ZII-16: Report verified progress

Make effects and limitations inspectable. Compensation/rollback can itself need approval and is never assumed universally possible.

```text
RETURN outcome_and_remaining_work
END FLOW
```

### ZII-17: Return ZI guidance only

No execution adapter is registered in the ZI capability table.

```text
RETURN read_and_guide_mode
END FLOW
```

### ZII-18: Work budget remaining?

Time, steps, CPU, RAM, and any explicit spending caps have hard stopping conditions.

```text
IF budget.remaining
ON yes -> ZII-19
ON no -> ZII-15
```

### ZII-19: Useful progress detected?

Repeated errors or cycling plans stop the loop instead of running indefinitely.

```text
IF progress_detected
ON yes -> ZII-05
ON no -> ZII-15
```

## 27 ZI Control Events

User-controlled startup, policy, memory, and personality operations. These manage EA's own state, not other applications.

### CTRL-01: Startup event?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == STARTUP
ON yes -> CTRL-02
ON no -> CTRL-03
```

### CTRL-02: Initialize the companion

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL presence
THEN -> CTRL-18
```

Detailed flow: 01 Presence.

### CTRL-03: Policy change?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == POLICY
ON yes -> CTRL-04
ON no -> CTRL-05
```

### CTRL-04: Apply a policy change

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL rules
THEN -> CTRL-18
```

Detailed flow: 15 Policy Changes.

### CTRL-05: Usage event?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == USAGE
ON yes -> CTRL-06
ON no -> CTRL-19
```

### CTRL-06: Observe allowed app usage

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL catalog
THEN -> CTRL-18
```

Detailed flow: 04 Software Catalog.

### CTRL-07: Forget request?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == FORGET
ON yes -> CTRL-08
ON no -> CTRL-09
```

### CTRL-08: Forget selected knowledge

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL forget
THEN -> CTRL-18
```

Detailed flow: 16 Forget & Expire.

### CTRL-09: Correction request?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == CORRECT
ON yes -> CTRL-10
ON no -> CTRL-11
```

### CTRL-10: Correct a memory record

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL correction
THEN -> CTRL-18
```

Detailed flow: 17 Memory Correction.

### CTRL-11: Compaction request?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == COMPACT
ON yes -> CTRL-12
ON no -> CTRL-13
```

### CTRL-12: Compact eligible knowledge

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL compaction
THEN -> CTRL-18
```

Detailed flow: 18 Knowledge Compaction.

### CTRL-13: Export request?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == EXPORT
ON yes -> CTRL-14
ON no -> CTRL-15
```

### CTRL-14: Dispatch the requested export

Selected Knowledge Export handles ordinary eligible records without training consent. Only an explicit training-dataset request enters the linked DATA flow. Neither route launches training; shared owner, revision, destination and retention checks apply.

```text
CALL selected_export_under_explicit_purpose
THEN -> CTRL-18
```

Detailed flow: 19 Training Data Export.

### CTRL-15: Personality change?

An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.

```text
IF event.type == STYLE
ON yes -> CTRL-16
ON no -> CTRL-17
```

### CTRL-16: Apply personality preferences

Use the dedicated flow, including its permissions, failure paths, and retention rules.

```text
CALL personality
THEN -> CTRL-18
```

Detailed flow: 22 Personality & Presence.

### CTRL-17: Report an unsupported event

Never route an unknown event to shell execution or a generic application action.

```text
show_unsupported_event()
THEN -> CTRL-18
```

### CTRL-18: Return to event wait

No ZI external task execution follows a control-plane operation.

```text
RETURN idle
END FLOW
```

### CTRL-19: Background content event?

Observer events are not user questions. Source grants, activation, collection, and interruption permission remain independent.

```text
IF event.type == BACKGROUND_CONTENT
ON yes -> CTRL-20
ON no -> CTRL-07
```

### CTRL-20: Observe permitted background content

Apply the dedicated passive-observation flow with revocation, bounded RAM cache, retention, and quiet failure behavior.

```text
CALL background
THEN -> CTRL-18
```

Detailed flow: 34 Background Observation.

## 28 Intent & Capabilities

EA-ACT-01/02, EA-ZI-01, EA-HELP-02. Interpret an explicit request before choosing source inspection or an internal tool. Broad grants do not imply background activity.

### CAP-01: Receive explicit intent

Typed and predeclared local-voice input create the same permission-bound request. Reentry with acquired evidence reuses the existing owner, intent and shrinking ledger; voice never implies source access.

```text
request = explicit_request_or_existing_parent_request()
THEN -> CAP-02
```

### CAP-02: Interpret the requested outcome

Identify what the user refers to using supplied context; do not silently read unrelated windows to guess. Reentry from MAP evidence does not repeat classification.

```text
intent = existing_resolved_intent_or_bounded_classification(request)
THEN -> CAP-03
```

### CAP-03: Intent sufficiently clear?

Ambiguity must remain visible rather than becoming an invented target or equation.

```text
IF intent.has_supported_interpretation
ON yes -> CAP-05
ON no -> CAP-04
```

### CAP-04: Ask a focused question

TALK details choice/free-text questions, explicit submission, bounded rounds and follow-up context. This link expands the clarification phase; it does not start another task or grant source access.

```text
RETURN clarification_needed
END FLOW
```

Detailed flow: 55 Clarify And Continue.

### CAP-05: Mathematical input supplied?

Typed mathematics can run directly. Screen equations first need authorized extraction, then confirmation of any uncertain expression. Supplied evidence is not trusted executable input.

```text
IF intent.kind == MATH AND (intent.input_is_self_contained OR validated_evidence_attached)
ON yes -> CAP-06
ON no -> CAP-07
```

### CAP-06: Open the mathematics workflow

Use a specialist engine. Typed math does not activate screen/file adapters.

```text
result = CALL calculator(request)
THEN -> CAP-12
```

Detailed flow: 29 Mathematics Session.

### CAP-07: External context still needed?

Software and document questions need scoped evidence once. A validated evidence bundle returns to the requested internal tool without recursive acquisition; missing detail becomes a bounded clarification.

```text
IF intent.needs_external_context AND NOT validated_evidence_attached
ON yes -> CAP-08
ON no -> CAP-09
```

### CAP-08: Return a scoped-help intent

The caller now runs Request & Scope, Authorization, and evidence gathering. This node itself does not read.

```text
RETURN needs_context(intent)
END FLOW
```

Detailed flow: 02 Request & Scope.

### CAP-09: Internal service available?

Only included enabled tools and registered own-data/settings controls. An explicit typed or confirmed voice control intent uses CTRL with separate operation-specific review. Disabled modules do no work; never route unknown intent to a shell.

```text
IF approved_enabled_registry.supports(intent.kind)
ON yes -> CAP-10
ON no -> CAP-13
```

### CAP-10: Bind the internal task

Carry cancellation, privacy, provenance and the existing parent ledger; no application command lease. TOOL details F-15..18 only; other registered kinds use their dedicated flows.

```text
task = reuse_or_tighten_existing_parent(request)
THEN -> CAP-11
```

Detailed flow: 42 Internal Assistant Tools.

### CAP-11: Invoke the internal service

Route charts to CHART, artifacts to MAKE, annotations to INK, own-data/settings intents to reviewed CTRL and other tools to their typed handlers. Transcript confirmation is not deletion/export/permission approval. Source-derived data keeps original retention eligibility.

```text
result = internal_registry.call_typed(task, validated_evidence)
ON success -> CAP-12
ON failed -> CAP-14
```

### CAP-12: Return the internal result

Return a typed status, eligible payload and optional owned presentation handle. The caller retains only eligible data and transfers live result resources before releasing untransferred state; no new expiry or source read.

```text
RETURN internal_result_with_provenance
END FLOW
```

### CAP-13: Explain the unavailable capability

External commands belong to ZII. Planned internal features must not be advertised as already implemented.

```text
RETURN unavailable_or_ZI_boundary
END FLOW
```

### CAP-14: Report the bounded failure

Timeout, cancellation, and unsupported input remain different outcomes. Shared finally cleanup applies.

```text
RETURN error_without_claiming_completion
END FLOW
```

## 29 Mathematics Session

EA-MATH-01..05, EA-ACT-02, EA-WORK-01. Full calculator direction; exact feature inventory in CAPABILITIES.md. The LLM explains; a validated specialist engine calculates.

### CAL-01: Receive mathematical input

Explicit typed input needs no external observation. Extracted input must already carry a permitted source and provenance.

```text
input = request.math_payload
THEN -> CAL-02
```

### CAL-02: Form an expression proposal

Preserve the original input. A natural-language translation is a proposal, not mathematical proof.

```text
proposal = typed_expression_or_bounded_translation(input)
THEN -> CAL-03
```

### CAL-03: Translation ambiguous?

Examples: implied parentheses, missing variable, a percentage base, or uncertain OCR characters.

```text
IF proposal.has_unresolved_meaning
ON yes -> CAL-04
ON no -> CAL-05
```

### CAL-04: Request expression confirmation

Show the proposed expression and ask for the missing information before evaluation.

```text
RETURN expression_clarification
END FLOW
```

### CAL-05: Parse the restricted grammar

No eval, imports, arbitrary callbacks, file operations, network use, or user-defined executable code.

```text
ast = safe_math_parser(proposal.expression)
ON valid -> CAL-06
ON invalid -> CAL-19
```

### CAL-06: Resolve the mathematical domain

Do not silently assume positivity or discard domain exclusions.

```text
domain = explicit_real_or_complex_assumptions()
THEN -> CAL-07
```

### CAL-07: Resolve the angle mode

The active mode is visible and included in saved workbooks and the engine request.

```text
angle_mode = explicit_radians_or_degrees()
THEN -> CAL-08
```

### CAL-08: Validate dimensions

Reject incompatible unit operations; offline constants are not live exchange rates.

```text
unit_result = dimension_library.check(ast)
ON compatible -> CAL-09
ON incompatible -> CAL-19
```

### CAL-09: Choose the mathematical operation

Examples include exact evaluation, solve, differentiate, integrate, matrix operations, statistics, and plotting.

```text
operation = supported_math_operation(request)
THEN -> CAL-10
```

### CAL-10: Graph output requested?

A plot needs its own viewport, domain sampling, and stale-result contract.

```text
IF operation.is_plot
ON yes -> CAL-11
ON no -> CAL-12
```

### CAL-11: Run the graph workflow

Return the first typed plot result and bounded session handle without waiting for closure. Sampling and rendering use proven engines; user events stay in EA under original task limits.

```text
result = CALL plotting(ast, domain, angle_mode, task)
THEN -> CAL-16
```

Detailed flow: 30 Graphing Workflow.

### CAL-12: Estimate computation cost

Bound expression depth, matrix dimensions, solve domains, output size, and work time.

```text
estimate = estimate_expression_cost(ast, operation)
THEN -> CAL-13
```

### CAL-13: Computation admitted?

Do not keep a model, OCR engine, and heavy math worker resident simultaneously by default on the low-RAM profile.

```text
IF resource_guard.admits(estimate)
ON yes -> CAL-14
ON no -> CAL-20
```

### CAL-14: Calculate with the engine

The engine result, assumptions, tolerances, and termination status are authoritative; no LLM replacement on failure.

```text
result = specialist_engine.compute(ast, operation, domain)
ON success -> CAL-15
ON failure -> CAL-20
```

### CAL-15: Validate the result envelope

Reject a result from an older expression or a worker that exceeded its budget. An unevaluated result stays explicitly unevaluated.

```text
validated = verify_result_type_domain_revision(result)
ON valid -> CAL-16
ON invalid -> CAL-20
```

### CAL-16: Present the mathematical result

Display assumptions, units, provenance, and unsupported/incomplete cases. Text/table alternatives accompany visual results.

```text
show_exact_or_approximate_result(result)
THEN -> CAL-17
```

### CAL-17: Workbook save requested?

Computing a result does not automatically save observed input or create training data.

```text
IF user.explicitly_requests_workbook_save
ON yes -> CAL-18
ON no -> CAL-21
```

### CAL-18: Save permitted workbook state

Include expression revisions and modes. Disallowed observed content cannot be persisted by relabelling it as a worksheet.

```text
save_EA_workbook_under_source_policy()
THEN -> CAL-21
```

### CAL-19: Explain the invalid input

Give a bounded diagnostic and retain the editable expression; do not alter another app.

```text
show_math_input_error_without_execution()
THEN -> CAL-21
```

### CAL-20: Explain the computation limit

A resource cap or missing method is not an excuse to fabricate a numeric answer.

```text
show_unsolved_cancelled_or_resource_limited()
THEN -> CAL-21
```

### CAL-21: Release calculation resources

Preserve only an eligible returned payload or plot-session handle under original owner/source/expiry bounds. Cancellation and errors release all untransferred resources through the common finally contract.

```text
RETURN typed_result_after_math_worker_cleanup
END FLOW
```

## 30 Graphing Workflow

EA-GRAPH-01..04, EA-MATH-06 and EA-PERF/RAM. Proposed 2D modes plus bounded 3D surfaces/parametric curves under F-13. Approve exact domains before freeze; all included modes need positive 4 GB tests.

### PLOT-01: Create a plot revision

A parameter change supersedes the previous computation. Never publish late output over a newer plot.

```text
revision = next_plot_revision()
THEN -> PLOT-02
```

### PLOT-02: Stop superseded sampling

Cancel only EA-owned work, reclaim its actual residency and preserve the last valid display until the new revision is ready.

```text
cancel_and_join(previous_plot_worker)
THEN -> PLOT-03
```

### PLOT-03: Select the graph mode

Each advertised mode has a separate conformance pack; one sine curve does not prove complete support.

```text
mode = explicit_supported_plot_mode()
THEN -> PLOT-04
```

### PLOT-04: Validate plot bounds

Reject reversed, degenerate, or unbounded ranges; preserve the current viewport on validation failure.

```text
bounds = finite_ordered_user_bounds()
ON valid -> PLOT-05
ON invalid -> PLOT-19
```

### PLOT-05: Apply validated plot inputs

Replace the AST, assumptions, angle mode and parameters for an accepted edit; preserve undo under source lifetime. Restricted grammar, units and ambiguity checks recur. Invalid edits retain the previous inputs with an error.

```text
inputs = validate_and_apply_user_revision_or_initial_inputs()
THEN -> PLOT-06
```

### PLOT-06: Resolve domain boundaries

Admit domain work under GUARD before computation and release its worker before sampling. Known poles, holes, piecewise boundaries and non-real regions inform plotting; limits return honestly.

```text
domains = supervised_domain_stage(inputs, parent.ledger)
THEN -> PLOT-07
```

### PLOT-07: Allocate a sampling budget

Use the resource guard before heavy work; refinement cannot grow without a cap.

```text
budget = bounded_samples_and_time(mode, viewport)
ON admitted -> PLOT-08
ON denied -> PLOT-19
```

### PLOT-08: Compute plot data

Use established numerical/implicit plotting machinery under the same parent ledger; join/release the worker before returning. Record unresolved regions and sampling limits.

```text
series = supervised_plot_stage(inputs, domains, bounds, budget)
ON success -> PLOT-09
ON failed -> PLOT-19
```

### PLOT-09: Separate discontinuous regions

Never bridge a known asymptote with a misleading line; numerical sampling alone cannot prove arbitrary continuity.

```text
segments = split_invalid_and_known_discontinuous_intervals(series)
THEN -> PLOT-10
```

### PLOT-10: Plot revision still current?

A cancelled or older worker cannot redraw the live graph.

```text
IF revision == latest_plot_revision
ON yes -> PLOT-11
ON no -> PLOT-18
```

### PLOT-11: Render the graph

Use labelled axes and units; preserve independent curve styles, viewport, and supported inequality regions.

```text
plot_surface.render(segments, viewport)
THEN -> PLOT-12
```

### PLOT-12: Expose a textual alternative

The first result returns to the caller here; the remaining graph is an event-state lifecycle. Meaning and errors remain available without relying solely on color, animation or vision.

```text
publish_plot_result_table_notes_and_owned_session_handle(series)
THEN -> PLOT-13
```

### PLOT-13: Receive a graph interaction

Only explicit interaction updates inputs or requests export. No expensive worker is held while waiting, and edits do not renew the parent task limits. This is not desktop observation.

```text
event = await graph_user_event_without_owned_heavy_worker()
ON parameter or expression -> PLOT-01
ON inspect -> PLOT-14
ON viewport -> PLOT-16
ON export -> PLOT-17
ON close or cancel -> PLOT-20
```

### PLOT-14: Evaluate a graph query

Admit then join/release query work before waiting. Check source/policy/input revision before showing the method, interval and tolerance. A finite search is not proof of all roots.

```text
result = supervised_query_stage(current_inputs, event, parent.ledger)
THEN -> PLOT-15
```

### PLOT-15: Display the inspection result

Cross-check known-answer fixtures independently; do not call an unresolved query exact.

```text
show_query_result_and_limits(result)
THEN -> PLOT-13
```

### PLOT-16: Update the viewport

Changing display bounds is independent of changing the mathematical expression.

```text
viewport = validated_pan_zoom_or_reset(event)
THEN -> PLOT-01
```

### PLOT-17: Prepare the selected graph export

Only an explicit export action writes a selected artifact. Respect any source-derived retention restriction.

```text
preview_user_selected_image_or_table_export()
THEN -> PLOT-13
```

### PLOT-18: Discard stale plot output

Release only buffers owned by this obsolete job. Preserve the current plot, current worker, and live session; no historical curve is silently substituted.

```text
RETURN STALE_REVISION
END FLOW
```

### PLOT-19: Present a graph limitation

Keep expressions editable and disclose incomplete coverage.

```text
show_domain_or_budget_or_engine_error()
THEN -> PLOT-20
```

### PLOT-20: Release graph-session resources

Stop subscriptions and workers when the session closes or is cancelled.

```text
RETURN after_plot_cleanup
END FLOW
```

## 31 Precise Screen Circles

EA-POINT-01..05. Correct target identity comes before correct coordinates. Resolution alone is insufficient. An unsupported or stale mapping produces no authoritative marker.

### POINT-01: Receive a pointing request

Carry evidence identity and an active help lease. INK expands richer annotation layers; its geometry-only call reuses the following validation stages without recursively drawing another layer. A circle never activates the target.

```text
target_ref = user_requested_target(evidence)
THEN -> POINT-02
```

Detailed flow: 57 Screen Annotation Layers.

### POINT-02: Pointing grant still valid?

Reading and overlays remain separately revocable even with broad read scope.

```text
IF source_and_overlay_grants_are_live()
ON yes -> POINT-03
ON no -> POINT-19
```

### POINT-03: Resolve the target identity

Use app, window, control path, literal label, and current source revision; icon resemblance alone is insufficient.

```text
target = adapter.resolve_current_identity(target_ref)
THEN -> POINT-04
```

### POINT-04: Target uniquely identified?

Multiple similar controls require clarification instead of arbitrary ranking presented as certainty.

```text
IF target.has_one_verified_match
ON yes -> POINT-05
ON no -> POINT-19
```

### POINT-05: Target currently visible?

Do not point through a covering window, closed menu, offscreen region, or protected desktop.

```text
IF target.visible_and_not_occluded
ON yes -> POINT-06
ON no -> POINT-19
```

### POINT-06: Acquire current target bounds

Bounds must identify whether they are screen/window logical units or captured raster pixels.

```text
bounds = adapter.bounds_with_coordinate_space(target)
THEN -> POINT-07
```

### POINT-07: Read the monitor layout

Include each monitor origin, identity, rotation, and supported scale. Negative origins and layout gaps are valid.

```text
layout = approved_display_layout_snapshot()
THEN -> POINT-08
```

### POINT-08: Read the window transform

Account for current window/client origin and scroll/layout revisions; adapters declare which transforms are already reflected.

```text
window_map = adapter.current_client_to_desktop_transform()
THEN -> POINT-09
```

### POINT-09: Resolve the source transform

Preserve crop origin and raster scaling. Never guess a screenshot desktop position from image width alone.

```text
source_map = capture_or_accessibility_coordinate_transform()
THEN -> POINT-10
```

### POINT-10: Resolve the overlay transform

Use tested compositor support. Device-pixel conversion is applied exactly once.

```text
overlay_map = compositor.desktop_to_overlay_transform()
THEN -> POINT-11
```

### POINT-11: Mapping calibrated and supported?

Missing or contradictory metadata invalidates the overlay path, even if the assistant is confident in the answer.

```text
IF transforms.have_valid_calibration_and_revision
ON yes -> POINT-12
ON no -> POINT-19
```

### POINT-12: Transform target geometry

Transform the declared coordinate space, not a hard-coded universal DPI multiplier.

```text
geometry = transform_all_corners(bounds, source_map, window_map, overlay_map)
THEN -> POINT-13
```

### POINT-13: Clip to visible target space

Use a circle/ellipse or rounded outline appropriate to the target. Do not cover its label or a neighboring control.

```text
outline = clipped_outline_with_tested_padding(geometry)
THEN -> POINT-14
```

### POINT-14: Source revisions still match?

A last check precedes rendering; any revision change requires fresh evidence.

```text
IF policy_layout_window_and_target_revisions_match()
ON yes -> POINT-15
ON no -> POINT-17
```

### POINT-15: Draw the click-through circle

Initial verified draw makes an owned handle available to the help caller without blocking speech. No focus or input interception. Geometry target: within 4 physical pixels in calibrated fixtures.

```text
EA_overlay.draw_noninteractive(outline)
THEN -> POINT-16
```

### POINT-16: Wait for a marker event

This is an event-state lifecycle, not a blocking help call. Transfer only requested listeners and buffers within original owner/source/expiry limits. Geometry changes hide first; cancellation, lock, revocation, expiry or dismissal ends the session. No heavy worker or screenshot polling while idle.

```text
event = bounded_owned_marker_session_event()
ON changed -> POINT-17
ON ended -> POINT-20
ON dismissed -> POINT-20
```

### POINT-17: Hide the stale marker

Hide first, then consider reacquisition. Proposed removal target: 100 ms from delivered invalidation.

```text
EA_overlay.hide()
THEN -> POINT-18
```

### POINT-18: Active help lease remains?

Only an ongoing explicitly requested task can reacquire bounds. An ended task cannot revive observation.

```text
IF help_lease.live_and_not_cancelled
ON yes -> POINT-02
ON no -> POINT-21
```

### POINT-19: Explain why pointing is unavailable

Offer a literal path or a permitted labelled crop. Do not request root access or bypass compositor protection.

```text
show_ambiguity_or_mapping_limit()
THEN -> POINT-20
```

### POINT-20: Remove the marker

This cleanup is idempotent, including after a worker failure.

```text
EA_overlay.hide()
THEN -> POINT-21
```

### POINT-21: Release pointing subscriptions

Cancel geometry listeners and release temporary screenshots under the normal retention policy.

```text
RETURN after_overlay_cleanup
END FLOW
```

## 32 Optional Module Boundaries

EA-EXT-01, EA-CFG-01/02. All optional capability providers use the versioned module contract; CFG adds composition and profiles. No post-freeze feature additions, inherited permissions, executable themes or ZII executor.

### EXT-01: Receive a module-enable request

An installation or app update does not silently enable microphone access, observation, or retention.

```text
module = user_selected_optional_module()
THEN -> EXT-02
```

### EXT-02: Validate the module contract

The module belongs to an approved feature ID and declares supported request/result/presentation types and a 4 GB resource budget.

```text
contract = verify_frozen_feature_and_versioned_contract(module)
ON valid -> EXT-03
ON invalid -> EXT-13
```

### EXT-03: Inspect requested capabilities

No arbitrary tool strings or implicit privilege inheritance from the host process.

```text
requested = module.declared_capabilities
THEN -> EXT-04
```

### EXT-04: Capabilities remain inside ZI?

A voice or character plugin cannot introduce application execution; ZII is separately controlled.

```text
IF requested.subset_of_ZI_registry
ON yes -> EXT-05
ON no -> EXT-13
```

### EXT-05: Review the new permissions

A microphone grant, raw-audio retention, screen access, and training consent are separate choices.

```text
grant = user_reviews_module_specific_permissions()
ON granted -> EXT-06
ON declined -> EXT-13
```

### EXT-06: Reserve a module budget

Extras do not consume the RAM/CPU reserve required to keep typed help and the desktop responsive.

```text
lease = resource_guard.admit_module(module)
ON admitted -> EXT-07
ON denied -> EXT-13
```

### EXT-07: Register typed module adapters

Input adapters emit RequestEnvelope values; output adapters consume ResultEnvelope or presentation events.

```text
registry.attach(contract, lease)
THEN -> EXT-08
```

### EXT-08: Process a permitted module event

Voice does not infer approval from background conversation. Animation needs semantic UI events, not raw screen contents.

```text
result = isolated_module.handle(typed_event)
ON success -> EXT-09
ON failure -> EXT-11
```

### EXT-09: Revalidate event permissions

Host policy is authoritative even if a module emits an apparently valid payload.

```text
IF event.within_live_scope_and_lifetime
ON yes -> EXT-10
ON no -> EXT-11
```

### EXT-10: Deliver the permitted result

Personality may change tone; it cannot change computed results, evidence, uncertainty, or ZI boundaries.

```text
present_without_changing_facts_or_permissions(result)
THEN -> EXT-14
```

### EXT-11: Detach the failed module

Revoke subscriptions and stop its workers. Typed interaction must remain available.

```text
registry.detach(module)
THEN -> EXT-12
```

### EXT-12: Release module resources

Apply data-lifetime rules to any buffered audio or derived observations; no hidden fallback upload.

```text
release(lease)
THEN -> EXT-14
```

### EXT-13: Report the unavailable extension

The core assistant still works with the entire optional-module set absent.

```text
show_denied_or_incompatible_module()
THEN -> EXT-14
```

### EXT-14: Return to typed-core operation

Every included optional module needs a positive baseline test before release. Disabled modules preserve the core.

```text
RETURN core_available
END FLOW
```

## 33 Acceptance & Evidence

Analysis workflow for ACCEPTANCE.md. Proposed numeric targets are not measured results. Archi tests do not establish EA correctness.

### AC-01: Choose one user outcome

Replace umbrella terms such as full assistance with a concrete workflow and capability inventory.

```text
outcome = named_user_workflow()
THEN -> AC-02
```

### AC-02: Assign a requirement ID

Link this identifier to scope, pseudocode, flowchart nodes, and later tests.

```text
id = stable_requirement_identifier(outcome)
THEN -> AC-03
```

### AC-03: Define the starting conditions

Name the supported app/version, desktop, hardware profile, source fixtures, and permission settings.

```text
given = platform_app_data_grants_and_state()
THEN -> AC-04
```

### AC-04: Define the triggering event

Use a repeatable action, not a vague phrase such as works well.

```text
when = specific_user_or_system_event()
THEN -> AC-05
```

### AC-05: Define the observable result

Correctness includes what must not happen, including external commands and unintended retention.

```text
then = expected_output_and_forbidden_side_effects()
THEN -> AC-06
```

### AC-06: Define the measurement

State numeric targets as proposed until benchmarked. Record sample counts and denominators.

```text
metric = units_tolerance_percentile_and_deadline()
THEN -> AC-07
```

### AC-07: Choose an independent oracle

An LLM cannot certify its own answer or target identity.

```text
oracle = analytic_fixture_or_instrumented_reference()
THEN -> AC-08
```

### AC-08: Define failure cases

High-risk paths need explicit coverage, not just a successful demonstration.

```text
cases = ambiguous_denied_stale_cancelled_and_resource_limited()
THEN -> AC-09
```

### AC-09: Review the criterion

Discuss practical thresholds, tradeoffs, feature coverage, and supported environments.

```text
approved = user_and_engineering_review(requirement)
ON approved -> AC-10
ON revise -> AC-03
```

### AC-10: Testable implementation exists?

Analysis documents alone cannot satisfy runtime acceptance.

```text
IF prototype_or_implementation_available
ON yes -> AC-12
ON no -> AC-11
```

### AC-11: Record the unverified status

Keep the requirement in the implementation backlog without pretending the assistant already exists.

```text
RETURN approved_but_not_verified
END FLOW
```

### AC-12: Run the defined test

This is a future engineering validation workflow, not a ZI assistant capability.

```text
evidence = execute_versioned_fixture_suite()
THEN -> AC-13
```

### AC-13: Acceptance threshold met?

Do not hide low coverage behind selective abstention or silently lower a safety invariant.

```text
IF independent_evidence_satisfies_criterion
ON yes -> AC-15
ON no -> AC-14
```

### AC-14: Record the unmet requirement

Revise implementation or explicitly renegotiate a proposed requirement; keep the failure visible.

```text
RETURN failed_with_evidence_and_owner
END FLOW
```

### AC-15: Record verified evidence

Preserve measurements, screenshots/traces, known limits and the tested configuration. The linked flow compares configurations with accuracy and 4 GB gates before latency.

```text
RETURN verified_for_named_versions_and_profile
END FLOW
```

Detailed flow: 39 Quality Before Speed.

## 34 Background Observation

EA-BG-01..06. Confirmed optional capability, off by default as a proposal. Explicit observation scope is separate from retention and unsolicited assistance. No external execution; no observer is implemented here.

### BG-01: Receive an observer event

Install subscriptions only after reviewed consent and setup. Startup/policy reconciliation checks scope, types, purpose, lifetime, and actual adapter state; never widen a grant after restart.

```text
event = scoped_subscription_event()
THEN -> BG-02
```

### BG-02: Observation enabled?

Broad read permission and collection on do not enable background observation. Recheck queued events against current policy.

```text
IF policy.background.enabled AND consent_lifetime_live
ON yes -> BG-03
ON no -> BG-16
```

### BG-03: Acquisition paused?

Pause all reading stops foreground and background acquisition; disabling background alone preserves explicit help.

```text
IF policy.pause_acquisition
ON yes -> BG-16
ON no -> BG-04
```

### BG-04: Desktop unlocked?

Lock cancels affected subscriptions and buffers. Resume only with a still-valid consent lifetime and new source checks.

```text
IF desktop_unlocked
ON yes -> BG-05
ON no -> BG-16
```

### BG-05: Source eligible?

Check exclusions before content acquisition. Uncertain identity or unenforceable protected-region exclusion means skip the read/capture.

```text
IF scope_types_purpose_and_protection_checks_pass(event)
ON yes -> BG-06
ON no -> BG-16
```

### BG-06: Event admitted?

Bound event rate, queue size, time, CPU, RAM, and optional OCR. Requested help has priority; discard stale backlog.

```text
IF bounded_coalescer_and_resource_guard_admit(event)
ON yes -> BG-07
ON no -> BG-16
```

### BG-07: Authorize a passive read

A live scoped lease is required. No permission popups, menu reveal, generic clicks, or capture fallback in this background path.

```text
lease = CALL policy(event, BACKGROUND)
ON allowed -> BG-08
ON denied -> BG-16
```

Detailed flow: 03 Authorization.

### BG-08: Capture retention eligibility

Capture before the asynchronous read. A false eligibility value stays false even if collection later turns on.

```text
persist_eligible = collect AND retention_rule_allows(source)
THEN -> BG-09
```

### BG-09: Read permitted changed content

Only approved source types and changed content; no whole-disk crawl, keystroke logger, or implicit screen recording. Background capture/OCR requires a separate grant.

```text
source = passive_adapter.read_changed_content(lease)
ON success -> BG-10
ON failed -> BG-16
```

### BG-10: Observation lease still valid?

After every await and before cache/write publication, reject revoked, expired, cancelled, locked, or stale results.

```text
IF policy_lease_and_source_revisions_match()
ON yes -> BG-11
ON no -> BG-16
```

### BG-11: Refresh bounded RAM context

Collection-off context is temporary-only. A fresh permitted read has its own evidence lifetime; hits/reinsertions cannot renew old content. Bound global and per-task usage including metadata/live handles; disable/revoke/expiry/delete/pressure invalidates affected buffers.

```text
cache.add_under_original_expiry_and_aggregate_reservations(source)
THEN -> BG-12
```

### BG-12: Persistence eligible?

Observation, software-history retention, raw-image retention, and training consent remain separate choices.

```text
IF persist_eligible
ON yes -> BG-13
ON no -> BG-14
```

### BG-13: Store permitted facts

Use current-policy transaction checks and source provenance. Software-use facts additionally need the history toggle; no automatic training.

```text
CALL retain(context)
THEN -> BG-14
```

Detailed flow: 14 Durable Memory.

### BG-14: Release event resources

Cleanup also runs on failures and cancellation. An eligible rolling RAM cache follows its own byte/expiry policy.

```text
close_read_handles_and_release_raw_event_buffers()
THEN -> BG-15
```

### BG-15: Return without interrupting

Visible observation status is allowed; unsolicited advice, voice, screen circles, focus changes, and application commands are not granted by observation.

```text
RETURN passive_observation_result
END FLOW
```

### BG-16: Discard the rejected event

No content logs, delayed replay, or stale writes. Turning observation off stops subscriptions and clears its temporary context, not saved knowledge.

```text
drop_event_and_cancel_related_pending_work()
THEN -> BG-14
```

## 35 Desktop To Website

SC-01/03; EA-JOURNEY-01/02. A bounded user-led journey across applications. Every source transition rechecks authority; the assistant never navigates for the user.

### JRN-01: Accept the scoped goal

Record the actual desired outcome and task lifetime. Example: understand how to pause requisitions and assemble a checklist.

```text
goal = authorized_task.goal
THEN -> JRN-02
```

### JRN-02: Read application identity

Use observed evidence, not the model memory of a similarly named application.

```text
identity = permitted_app_version_and_state()
THEN -> JRN-03
```

### JRN-03: Read exposed menu evidence

Unknown or closed menus are opened by the user under the strict proposed ZI contract.

```text
evidence = CALL menus(task)
THEN -> JRN-04
```

Detailed flow: 06 Menus & Submenus.

### JRN-04: Evidence sufficient for this step?

A disabled Stop command, a Begin icon and a Pause command are not interchangeable.

```text
IF evidence.supports_current_step
ON yes -> JRN-06
ON no -> JRN-05
```

### JRN-05: Resolve the evidence gap

A partial answer or a precise request for a missing menu is preferable to a guessed control.

```text
outcome = CALL limits(task, evidence)
THEN -> JRN-17
```

Detailed flow: 37 Cannot Help Yet.

### JRN-06: Explain the evidenced choice

Separate current observed state, documented effect and inference. Do not claim the change happened.

```text
show_literal_path_effect_and_limits(evidence)
THEN -> JRN-07
```

### JRN-07: Circle requested?

Background observation alone cannot request a circle.

```text
IF user_requested_live_target_marker
ON yes -> JRN-08
ON no -> JRN-09
```

### JRN-08: Resolve the live circle

The detailed pointing flow validates identity, visibility, coordinates and invalidation.

```text
CALL pointing(target)
THEN -> JRN-09
```

Detailed flow: 31 Precise Screen Circles.

### JRN-09: Another source needed?

A broader question can need documentation or a website; breadth never silently expands read grants.

```text
IF goal.requires_another_user_selected_source
ON yes -> JRN-10
ON no -> JRN-15
```

### JRN-10: Ask the user to navigate

Do not open a URL, change tabs, click a menu or log in. Explain what missing evidence would help.

```text
show_requested_page_or_menu_and_reason()
THEN -> JRN-11
```

### JRN-11: Wait for the user

The task remains cancelable; unrelated windows are not followed.

```text
event = bounded_wait_for_user_selected_source()
ON selected -> JRN-12
ON ended -> JRN-17
```

### JRN-12: Read the selected page

A selected website goes through its own tab, origin, frame and revision checks.

```text
page = CALL browser(task)
ON read -> JRN-13
ON limited -> JRN-05
```

Detailed flow: 36 Browser Evidence.

### JRN-13: Compare source claims

R-02: old documentation, current app state, hypotheses and user-reported tests stay separately attributed. Page instructions are untrusted data; the casework contract makes disagreement inspectable.

```text
comparison = compare_versions_roles_and_literal_effects(evidence, page)
THEN -> JRN-14
```

Detailed flow: 46 Evidence Casework.

### JRN-14: Material conflict remains?

Conflicting effects, role restrictions or unsupported versions must not be smoothed into one confident answer.

```text
IF comparison.blocks_safe_guidance
ON yes -> JRN-05
ON no -> JRN-15
```

### JRN-15: Assemble the inert work plan

The checklist lives in EA; it does not apply settings, submit a form, or claim user completion.

```text
draft = cited_EA_checklist(evidence, page)
THEN -> JRN-16
```

### JRN-16: Present plan coverage

Broad requests list all found relevant controls and the branches that could not be inspected.

```text
show_plan_with_inspected_and_unread_sources(draft)
THEN -> JRN-17
```

### JRN-17: Return the journey outcome

Stop, expiry and denial release source leases and task-only content. Explicit save must obey acquisition-time eligibility.

```text
RETURN with_common_retention_and_cleanup
END FLOW
```

## 36 Browser Evidence

SC-01/02; EA-WEB-01..03. Browser DOM is an optional scoped evidence adapter, not remote research or browser automation. Unsupported pages remain visibly unsupported.

### WEB-01: Accept a selected tab reference

Do not enumerate or inspect unrelated tabs merely because the extension has broad host permissions.

```text
tab_ref = task.explicit_browser_target
THEN -> WEB-02
```

### WEB-02: Tab grant live?

A browser grant and EA purpose/retention policy must both permit this read. Navigation can change authority.

```text
IF current_tab_origin_and_task_grant_match()
ON yes -> WEB-03
ON no -> WEB-13
```

### WEB-03: Page excluded or restricted?

Password/login/payment secrets and protected browser pages are not bypassed through screenshots.

```text
IF private_protected_or_browser_restricted_page()
ON yes -> WEB-13
ON no -> WEB-04
```

### WEB-04: Capture page revision

Include same-document SPA changes; URL equality does not prove unchanged controls.

```text
revision = tab_frame_origin_document_layout_identity()
THEN -> WEB-05
```

### WEB-05: Select authorized frames

A top-level grant does not imply access to a cross-origin frame. Excluded frames become coverage gaps.

```text
frames = explicitly_covered_frame_origins()
THEN -> WEB-06
```

### WEB-06: Read bounded page evidence

Read names, roles, visible labels, states, href values and bounds. No script from the page is trusted as an assistant instruction.

```text
page = passive_DOM_or_accessibility_snapshot(frames)
ON read -> WEB-07
ON failed -> WEB-13
```

### WEB-07: Read still authorized and current?

Late content from a logged-out, navigated or revoked page cannot be published or retained.

```text
IF policy_and_document_revisions_match(revision)
ON yes -> WEB-08
ON no -> WEB-13
```

### WEB-08: Resolve matching controls

A broad goal gets grouped alternatives with frame/section labels. Model similarity is not target identity.

```text
matches = literal_and_contextual_matches(page, goal)
THEN -> WEB-09
```

### WEB-09: Pointing target unique?

Two Cancel labels in separate dialogs need disambiguation before any authoritative marker.

```text
IF one_visible_evidenced_target
ON yes -> WEB-11
ON no -> WEB-10
```

### WEB-10: Return evidenced alternatives

No fabricated inaccessible-frame content. The user may clarify the target or supply a permitted crop.

```text
RETURN PARTIAL_with_candidates_and_frame_gaps
END FLOW
```

### WEB-11: Build page evidence envelope

Bounds declare coordinate space and zoom transforms already applied; pointing performs independent calibration.

```text
result = source_refs_bounds_revision_and_retention(page)
THEN -> WEB-12
```

### WEB-12: Return current page evidence

Navigation/login/form submission remain user actions. Common cleanup runs even after a partial read.

```text
RETURN read_only_page_result
END FLOW
```

### WEB-13: Return a browser limitation

Do not upgrade permission, reuse a stale grant or switch to a wider capture automatically.

```text
RETURN denied_stale_or_unsupported_with_no_marker
END FLOW
```

## 37 Cannot Help Yet

SC-01..21; EA-JOURNEY-02, EA-QUALITY-01. Separate useful partial output, clarification, unsupported capability, cancellation and internal failure. Safety abstention does not establish feature support.

### LIMIT-01: Classify the blocking reason

Use explicit error types, not the model guessing why a tool failed.

```text
reason = typed_failure_from_adapter_engine_or_policy()
THEN -> LIMIT-02
```

### LIMIT-02: Task ended or authority lost?

Revoked content is not a permissible partial answer. Stop cannot trigger a retry.

```text
IF cancelled_expired_locked_or_revoked
ON yes -> LIMIT-03
ON no -> LIMIT-04
```

### LIMIT-03: Return the ended outcome

Remove markers, discard in-flight content and run common cleanup. Do not ask repeatedly for the same permission.

```text
RETURN CANCELLED_if_user_stop_else_UNAVAILABLE(AUTHORITY_ENDED)
END FLOW
```

### LIMIT-04: Requested capability outside ZI?

An antivirus launch or autonomous browser action is not converted into a hidden internal tool.

```text
IF external_execution_or_unapproved_feature
ON yes -> LIMIT-13
ON no -> LIMIT-05
```

### LIMIT-05: A safe bounded retry exists?

Retry only a passive read/computation; no new authority, unbounded loop or private screenshot fallback.

```text
IF transient_failure AND same_live_scope AND retry_budget_remaining
ON yes -> LIMIT-06
ON no -> LIMIT-08
```

### LIMIT-06: Retry the permitted operation

A request tracks a shared retry count; recursion cannot reset it.

```text
result = one_bounded_same_scope_attempt()
ON success -> LIMIT-07
ON failed -> LIMIT-08
```

### LIMIT-07: Return the verified result

Verified means evidence satisfies the supported result contract, not that the model self-certified its prose.

```text
RETURN VERIFIED_with_provenance_and_coverage
END FLOW
```

### LIMIT-08: Useful permitted evidence remains?

If only some branches are unreadable, preserve correct facts without implying full coverage.

```text
IF independently_supported_facts_remain
ON yes -> LIMIT-09
ON no -> LIMIT-10
```

### LIMIT-09: Present the supported subset

Do not invent the missing portion; distinguish facts, inferences and proposed next steps.

```text
show_verified_facts_with_specific_gaps()
THEN -> LIMIT-10
```

### LIMIT-10: User input could resolve the gap?

Examples: app version, one open menu, an unambiguous equation, or an approved smaller input.

```text
IF one_clear_missing_item_can_unlock_progress
ON yes -> LIMIT-11
ON no -> LIMIT-12
```

### LIMIT-11: Ask one focused question

Explain the exact missing evidence and least-invasive way to provide it. Waiting is bounded and cancelable.

```text
RETURN NEEDS_INPUT_with_existing_partial_facts
END FLOW
```

### LIMIT-12: Capability or budget unavailable?

Resource pressure can cause a temporary limitation. Baseline tests still require positive feature completion.

```text
IF unsupported_input_or_resource_limit
ON yes -> LIMIT-13
ON no -> LIMIT-14
```

### LIMIT-13: Explain the capability limit

Offer user-run steps only when supported by evidence. No fake completion or suggestion to disable privacy controls.

```text
RETURN UNAVAILABLE_or_PARTIAL_with_reason
END FLOW
```

### LIMIT-14: Report the internal failure

Do not blame the user, expose secrets in logs or call an engine crash a valid mathematical result.

```text
RETURN FAILED_with_content_free_diagnostic
END FLOW
```

## 38 Settings & Rich Help

SC-16/17/34/39; EA-SET-01..04. SETTINGS.md lists 72 setting groups. Every constituent option gets accessible help; opening help never mutates policy.

### OPT-01: Receive a settings event

The same definitions drive first-run setup and revisitable settings.

```text
event = settings_user_event()
ON help -> OPT-02
ON change -> OPT-07
```

### OPT-02: Load the option help contract

Purpose, default/effective value, data effects, scope/lifetime, CPU/RAM, dependencies, risk and example must be present.

```text
help = setting_schema.help(option_id)
THEN -> OPT-03
```

### OPT-03: Pinned details requested?

Hover and keyboard focus expose a concise explanation. Click/tap opens persistent details.

```text
IF click_tap_or_explicit_open
ON yes -> OPT-04
ON no -> OPT-05
```

### OPT-04: Show rich option details

Provide keyboard navigation and an accessible name without obscuring the related control.

```text
show_focusable_dismissible_help(help)
THEN -> OPT-06
```

### OPT-05: Show the option tooltip

It remains while hovered/focused and is dismissible; pointer-only help is insufficient.

```text
show_hoverable_focus_visible_tooltip(help)
THEN -> OPT-06
```

### OPT-06: Handle help dismissal

Restore meaningful focus. Help reads settings but never enables observation, collection or microphone access.

```text
dismiss_on_Escape_or_explicit_close()
THEN -> OPT-16
```

### OPT-07: Create a settings proposal

Presets and imported settings are not grants. CFG expands module dependencies, explicit profile switching and declarative configuration; this link is detail, not a second settings transaction. Restore defaults does not erase work.

```text
proposal = typed_change_preset_reset_or_import()
THEN -> OPT-08
```

Detailed flow: 56 Module Profiles.

### OPT-08: Validate values and dependencies

Reject unknown fields, invalid budgets, executable expressions and unsupported feature additions.

```text
result = validate_against_approved_schema(proposal)
ON valid -> OPT-09
ON invalid -> OPT-15
```

### OPT-09: Calculate effective policy

Show conflicts between chosen values and stronger rules instead of pretending a switch took effect.

```text
effective = deny_precedence_and_scope_intersection(proposal)
THEN -> OPT-10
```

### OPT-10: Preview the settings changes

Explain source access, retention, lifetime, resource consequences and whether work will be canceled.

```text
show_diff_data_effects_and_grants(effective)
THEN -> OPT-11
```

### OPT-11: User confirms affected grants?

Grant scope and lifetime must be reviewed; a saved file cannot silently restore consent.

```text
IF explicit_review_accepts_required_new_permissions
ON yes -> OPT-12
ON no -> OPT-16
```

### OPT-12: Apply immediate restrictions

Turning reading off takes effect now even if the disk is full. Permissive changes wait for successful persistence and activation.

```text
revoke_affected_live_leases_before_commit()
THEN -> OPT-13
```

### OPT-13: Commit settings atomically

A concurrent settings change invalidates the preview and must be reviewed again.

```text
result = compare_and_commit_current_policy_revision()
ON saved -> OPT-14
ON failed -> OPT-15
```

### OPT-14: Activate confirmed settings

Show actual grant state. Startup/autostart is not blanket authority to observe.

```text
reconcile_capabilities_against_saved_live_policy()
THEN -> OPT-16
```

### OPT-15: Explain unapplied settings

Keep confirmed restrictive changes active. A failed save is never reported as persistent success.

```text
show_error_with_actual_restrictive_state()
THEN -> OPT-16
```

### OPT-16: Return to settings

Cancel/close preserves the previous values except explicit immediate safety restrictions already applied.

```text
RETURN actual_effective_settings
END FLOW
```

## 39 Quality Before Speed

SC-10/19; EA-RAM-03, EA-QUALITY-01. Engineering feasibility/release workflow, not a ZI tool. No candidate has been benchmarked for EA.

### QUAL-01: Define the baseline machine

Record bytes of RAM, CPU, OS/compositor, foreground workload, storage and swap policy. A 4GB process limit on a 16GB host is not the whole baseline.

```text
profile = named_4GB_total_RAM_CPU_only_environment()
THEN -> QUAL-02
```

### QUAL-02: Version the evaluation fixtures

Use independent target identities, analytic math answers, privacy canaries and expected unsupported cases.

```text
suite = positive_and_negative_cases_for_every_included_ZI_feature()
THEN -> QUAL-03
```

### QUAL-03: Select a candidate configuration

Document hashes, licenses and exact artifacts. P-17 compares one optimization at a time on development fixtures, then evaluates finalists on untouched held-out cases. WORK specifies staged residency; weights-on-disk are not runtime memory.

```text
candidate = model_runtime_quantization_context_and_modules()
THEN -> QUAL-04
```

### QUAL-04: Free offline distribution allowed?

All runtime/model/tokenizer/voice/data artifacts require a compatible release manifest.

```text
IF reviewed_distribution_manifest_passes
ON yes -> QUAL-05
ON no -> QUAL-12
```

### QUAL-05: Measure correctness and precision

Record positive coverage, wrong claims, wrong targets, math errors and correct abstentions separately.

```text
quality = independent_fixture_evaluation(candidate)
THEN -> QUAL-06
```

### QUAL-06: Accuracy and privacy gates pass?

A faster candidate cannot buy acceptance by guessing targets or loosening numerical tolerance.

```text
IF all_approved_quality_and_boundary_gates_pass
ON yes -> QUAL-07
ON no -> QUAL-12
```

### QUAL-07: Measure whole-system resources

Include OCR, math, ASR, TTS, embeddings, renderer, KV cache, mapped weights and startup peaks. P-17 instruments cross-stage copies and worker handoffs; nominal serialization is not evidence that old weights were released.

```text
resources = complete_process_tree_and_OS_trace(profile)
THEN -> QUAL-08
```

### QUAL-08: Every ZI feature works on 4 GB?

Serial workers and disclosed lower rendering detail are allowed. Refusal-only tests and required cloud/GPU/higher RAM fail.

```text
IF all_positive_feature_cases_complete_within_approved_bounds
ON yes -> QUAL-09
ON no -> QUAL-12
```

### QUAL-09: Measure end-to-end latency

Record sample counts, median, p95 and worst cases; llama-bench alone excludes application overhead.

```text
timings = cold_warm_progress_completion_and_stop_trials()
THEN -> QUAL-10
```

### QUAL-10: Compare passing configurations

Keep quality gating separate from speed ranking. Do not summarize all outcomes into a score that hides safety regressions.

```text
ranking = latency_energy_tradeoffs_within_quality_gates()
THEN -> QUAL-11
```

### QUAL-11: Another candidate remains?

Bound the engineering experiment and preserve all failed runs, not only the best result.

```text
IF unevaluated_approved_candidate_exists
ON yes -> QUAL-03
ON no -> QUAL-13
```

### QUAL-12: Record the rejected candidate

Failure is useful evidence. No silent higher-RAM tier or lower accuracy target.

```text
record_failed_gate_and_evidence_without_private_payloads()
THEN -> QUAL-11
```

### QUAL-13: A complete candidate passed?

An attractive demo is not enough if a required feature family fails the baseline.

```text
IF at_least_one_candidate_meets_all_contracts
ON yes -> QUAL-14
ON no -> QUAL-15
```

### QUAL-14: Record a supported configuration

A recommendation applies only to the tested versions and workload. It is not universal crash prevention.

```text
RETURN measured_profile_with_limits_and_reproduction_steps
END FLOW
```

### QUAL-15: Report the feasibility blocker

Keep analysis open if a binding requirement cannot be supported; do not quietly omit the feature.

```text
RETURN unresolved_requirement_for_analysis_review
END FLOW
```

## 40 Analysis Sign-Off

EA-FREEZE-01; END-STATE.md G-01..08. No new features after user sign-off. This project is still open analysis, not an approved baseline.

### BASE-01: Review the complete inventory

All 35 families require a decision. Optional means disableable, not unspecified. F-31 is ZII only; F-33..35 are explicit pre-freeze customization, artifact and annotation additions.

```text
inventory = explicit_include_exclude_decisions(F_01_to_F_35)
THEN -> BASE-02
```

### BASE-02: Resolve supported boundaries

No unnamed other tools, vague all apps claim or hidden later feature extension.

```text
resolve_formats_languages_platforms_math_and_permission_limits()
THEN -> BASE-03
```

### BASE-03: Check requirement traceability

ALIGNMENT.json covers each feature, flow, pseudocode section, individual acceptance ID, setting, evidence entry and experiment. Every criterion needs a scenario citation and every scenario names detailed flows. REFINEMENTS.json retains R-01..08 node links. Structural coverage is not semantic approval or runtime evidence.

```text
trace = validate_whole_inventory_and_refinement_links()
THEN -> BASE-04
```

Detailed flow: 52 Traceability And Drills.

### BASE-04: Critical feasibility demonstrated?

Focused analysis experiments are required; a finished production application is not required to enter design.

```text
IF G_04_four_GB_spikes_have_evidence
ON yes -> BASE-05
ON no -> BASE-13
```

### BASE-05: Review all analysis exit gates

G-01..08 must each have an explicit status and unresolved issues cannot disappear into a diagram.

```text
gates = privacy_licenses_oracles_risks_and_document_sync()
THEN -> BASE-06
```

### BASE-06: All sign-off prerequisites met?

Draft targets and unsigned documents are not a frozen contract.

```text
IF every_gate_ready_for_user_review
ON yes -> BASE-07
ON no -> BASE-13
```

### BASE-07: Request explicit user sign-off

No automatic phase transition because documentation grew or a tool test passed.

```text
decision = user_approves_complete_baseline()
ON approved -> BASE-08
ON revise -> BASE-13
```

### BASE-08: Record the approved baseline

The live diagram and notes must be reconciled; preserve the approved snapshot separately.

```text
baseline = versions_hashes_feature_IDs_exclusions_and_test_plan()
THEN -> BASE-09
```

### BASE-09: Review a proposed later change

Implementation sequencing is permitted only for already approved capabilities.

```text
change = classified_design_or_implementation_change()
THEN -> BASE-10
```

### BASE-10: Change adds a capability?

An arbitrary module/plugin cannot evade the feature freeze.

```text
IF new_outcome_permission_format_platform_or_behavior
ON yes -> BASE-12
ON no -> BASE-11
```

### BASE-11: Verify within-scope change

Retest affected criteria; preserve approved behavior. Infeasibility is a blocker, not silent scope reduction.

```text
RETURN traced_design_bugfix_or_security_repair
END FLOW
```

### BASE-12: Reject the feature addition

Do not implement the new feature under the existing baseline.

```text
RETURN outside_frozen_scope
END FLOW
```

### BASE-13: Keep analysis open

No baseline signature or semantic sync approval is fabricated.

```text
RETURN unresolved_decisions_with_owner_and_evidence_needed
END FLOW
```

## 41 Local Voice Session

F-20; SC-14; EA-VOICE-01. Push-to-talk and spoken replies are independent. Typed requests reuse the reply stages without entering microphone stages. One owner-bound task spans capture, confirmation, help and speech; positive local voice tests remain mandatory on 4 GB.

### VOICE-01: Receive push-to-talk

A trusted microphone-button event binds one owner/session and finite ledger before acquisition. No always-listening microphone or speech inferred from background observation.

```text
task = create_explicit_voice_task_before_capture(event)
THEN -> VOICE-02
```

### VOICE-02: Microphone grant live?

OS permission, source scope and EA user choice must all agree.

```text
IF input_enabled AND microphone_consent_live
ON yes -> VOICE-03
ON no -> VOICE-13
```

### VOICE-03: Reserve voice resources

Capture, recognition, confirmation, classification and reply use the same shrinking parent. Unload incompatible workers before this stage; no upload or replacement ledger.

```text
lease = resource_guard.admit_serial_voice_stage(task.ledger)
ON admitted -> VOICE-04
ON denied -> VOICE-13
```

### VOICE-04: Capture bounded utterance

Close the device at release/Stop/deadline before transcription or confirmation. Visible recording status reflects the actual device, not an open handle through the answer wait.

```text
audio = bounded_capture_and_close_microphone(task)
ON captured -> VOICE-05
ON ended -> VOICE-14
```

### VOICE-05: Transcribe locally

Record selected language and ambiguity. Separate transcript lifetime from raw-audio lifetime.

```text
transcript = approved_ASR.decode(audio)
ON decoded -> VOICE-06
ON failed -> VOICE-13
```

### VOICE-06: Release recognition resources

The next inference or math stage must fit the same complete-process resource budget.

```text
release_ASR_worker_and_ineligible_audio()
THEN -> VOICE-07
```

### VOICE-07: Clarification required?

Misheard delete my history cannot be treated as an approved deletion. Memory manager confirmation still applies.

```text
IF transcript.ambiguous OR intent.has_consequential_effect
ON yes -> VOICE-08
ON no -> VOICE-09
```

### VOICE-08: Request transcript confirmation

Keep uncertainty visible; use the existing question/time/owner limits. Decline/cancel/expiry performs no operation and cannot renew the task. Consequential own-data/settings actions still require their separate exact confirmation.

```text
transcript = bounded_confirmation_under_existing_task(task)
ON accepted -> VOICE-09
ON cancelled -> VOICE-14
```

### VOICE-09: Dispatch the ordinary request

The common deliver_requested_help path expands into dispatch and reply stages once. Preserve the original task through ASR/help; invalid or expired tasks fail closed. Voice grants no desktop access, retention or external execution.

```text
result = on_help_request(transcript, existing_task = task)
THEN -> VOICE-10
```

Detailed flow: 28 Intent & Capabilities.

### VOICE-10: Spoken reply enabled?

Shared reply stage for typed and voice help; typed output needs no mic permission. Recheck owner, source, expiry and mute policy. Failed/needs-input results are not completed answers; TTS uses the original shrinking ledger.

```text
IF output_enabled AND result.has_live_speakable_payload AND current_result_may_be_spoken
ON yes -> VOICE-11
ON no -> VOICE-14
```

### VOICE-11: Synthesize a local reply

Text is already available; selected voice artifacts need license and 4GB evaluation.

```text
audio_reply = resource_guarded_local_TTS(result)
ON ready -> VOICE-12
ON failed -> VOICE-13
```

### VOICE-12: Play the permitted reply

Cancel output on Stop, source revocation or session termination; no unsolicited background speech.

```text
play_with_immediate_mute_and_stop(audio_reply)
THEN -> VOICE-14
```

### VOICE-13: Explain voice unavailability

A speech failure preserves the existing text/marks without rerunning help, repeating a memory/settings operation or starting another ledger. Fallback is not a positive voice conformance pass.

```text
show_typed_fallback_and_specific_reason()
THEN -> VOICE-14
```

### VOICE-14: Release voice-session resources

Common finally applies on all failures, including recognizer crashes and canceled synthesis.

```text
RETURN after_audio_device_worker_and_buffer_cleanup
END FLOW
```

## 42 Internal Assistant Tools

F-15..18, F-32; SC-11/12/18/21; EA-TOOLS-01, EA-CHART-01..05. Notes, calendar, conversions, logic and embedded Archi diagrams operate only inside EA. Finite domains and budgets require pre-freeze approval.

### TOOL-01: Accept an internal-tool request

Carry cancellation, resource budget and source provenance from supplied or authorized content.

```text
task = explicit_typed_internal_request()
THEN -> TOOL-02
```

### TOOL-02: Tool belongs to approved scope?

No fallback from an unsupported intention to shell code or arbitrary plugins.

```text
IF typed_registry.supports(task.kind)
ON yes -> TOOL-03
ON no -> TOOL-13
```

### TOOL-03: Input sources still permitted?

A draft that quotes an observed file inherits its retention restrictions.

```text
IF provenance_policy_and_revisions_match()
ON yes -> TOOL-04
ON no -> TOOL-13
```

### TOOL-04: Select the internal service

Each service validates a typed schema. Writing in EA is distinct from editing a target app.

```text
service = task.kind
ON draft -> TOOL-05
ON schedule -> TOOL-06
ON logic -> TOOL-07
ON convert -> TOOL-08
ON chart -> TOOL-15
```

### TOOL-05: Assemble an inert artifact

MAKE expands formatting, bounded generation, preview and explicit transfer for EA-owned artifacts. Source facts remain attributed; code/tests/configurations/patches are never executed or applied.

```text
result = code_text_or_checklist_under_explicit_output_contract()
THEN -> TOOL-09
```

Detailed flow: 58 Code And Text Artifacts.

### TOOL-06: Validate the schedule

Ask about ambiguous/nonexistent times. Attachments/links stay inert; no external invites or calendar writes.

```text
result = calendar_engine.validate_recurrence_zone_and_DST()
ON valid -> TOOL-09
ON ambiguous -> TOOL-13
```

### TOOL-07: Check the bounded plan

R-04: user-reviewed finite-domain guards, gaps/overlaps, counterexamples and bounded path coverage. UNKNOWN/TIMEOUT are incomplete. No action execution, automatic chart generation or universal proof.

```text
result = check_declared_branches_under_shared_limits(task)
THEN -> TOOL-09
```

Detailed flow: 48 Bounded Branch Checks.

### TOOL-08: Calculate the conversion

Use dated offline rules; user-supplied rates are not verified current exchange rates.

```text
result = units_duration_or_timezone_library(task)
THEN -> TOOL-09
```

### TOOL-09: Present result and limitations

Calculations and schedule previews are not automatically durable work.

```text
show_typed_result_with_oracle_and_coverage(result)
THEN -> TOOL-10
```

### TOOL-10: Durable save explicitly requested?

A reminder across restart requires a permitted saved schedule; otherwise offer an explicit session-only timer.

```text
IF user_requests_save_or_scheduled_reminder
ON yes -> TOOL-11
ON no -> TOOL-14
```

### TOOL-11: Result eligible for persistence?

Collection-off observations cannot be saved by copying them into notes or a reminder description.

```text
IF acquisition_and_current_data_rules_allow(result)
ON yes -> TOOL-12
ON no -> TOOL-13
```

### TOOL-12: Save the EA-owned artifact

Atomic save, revision checks, and explicit export destinations. No background write to another application.

```text
commit_with_current_data_generation(result)
ON saved -> TOOL-14
ON failed -> TOOL-13
```

### TOOL-13: Explain the internal-tool limit

Return clarification/partial/unavailable/error accurately; do not invent an exact date, calculation or successful save.

```text
CALL limits(task, current_evidence)
THEN -> TOOL-14
```

Detailed flow: 37 Cannot Help Yet.

### TOOL-14: Release tool resources

Saved reminders use occurrence IDs, bounded scheduling and persistent pending status across sleep/restart. After a crash, uncertain OS-toast delivery stays uncertain; no universal exactly-once delivery guarantee.

```text
RETURN result_with_lifetime_and_completion_status
END FLOW
```

### TOOL-15: Draft an embedded methodology chart

The requested Archi workspace is inside EA. Shared finite limits prevent runaway generation; the graph never executes its depicted workflow.

```text
result = CALL methodology(task)
THEN -> TOOL-14
```

Detailed flow: 44 Embedded Archi.

## 43 Dataset & Adapter Lifecycle

F-23; SC-19/37; EA-ADAPTER-01. User confirmed guided export/import with actual training in a separately launched self-hosted tool. LEARN makes review accessible; this flow owns compatible inference-time activation. KARL remains untouched.

### ADAPT-01: Accept a lifecycle request

No automatic training, generic GGUF injection or background dataset collection.

```text
request = explicit_export_or_adapter_selection()
ON export -> ADAPT-02
ON adapter -> ADAPT-04
```

### ADAPT-02: Review eligible dataset records

The export flow checks purpose consent, provenance, redaction, retention and final preview.

```text
dataset = CALL export(user_selection)
THEN -> ADAPT-03
```

Detailed flow: 19 Training Data Export.

### ADAPT-03: Report export status

A dataset file is not a trained model. No training process is launched by this flow.

```text
RETURN actual_export_result_and_external_copy_limits
END FLOW
```

### ADAPT-04: Read the adapter manifest

Identify base model, tokenizer, format, quantization/runtime requirements, license, origin and data lineage.

```text
manifest = bounded_safe_artifact_metadata()
THEN -> ADAPT-05
```

### ADAPT-05: Exact compatibility established?

An arbitrary file extension or matching parameter count is insufficient.

```text
IF base_tokenizer_format_and_runtime_contract_match
ON yes -> ADAPT-06
ON no -> ADAPT-13
```

### ADAPT-06: Artifact provenance still eligible?

Unknown ownership or another user's private training data blocks activation; renaming merged weights as a base model does not remove their lineage. Forgotten training data cannot be proven removed by deleting a database row. Block affected adapters until rebuilt or replaced.

```text
IF lineage_is_current_AND_public_or_exclusively_authorized_for_current_owner
ON yes -> ADAPT-07
ON no -> ADAPT-13
```

### ADAPT-07: Evaluate the candidate adapter

Use independent expected answers and measured 4 GB resource limits. The linked quality flow describes engineering validation, not an exposed external-command tool. No KARL invocation or self-certified model grading.

```text
evidence = bounded_internal_inference_fixtures(base_plus_adapter)
ON pass -> ADAPT-08
ON fail -> ADAPT-13
```

Detailed flow: 39 Quality Before Speed.

### ADAPT-08: Review activation evidence

Show differences from the last accepted model; personality is not allowed to alter target truth or math.

```text
show_compatibility_quality_RAM_license_and_data_limits(evidence)
THEN -> ADAPT-09
```

### ADAPT-09: User approves activation?

Loading an adapter does not broaden any read, retention, network or execution grant.

```text
IF explicit_adapter_activation_confirmed
ON yes -> ADAPT-10
ON no -> ADAPT-14
```

### ADAPT-10: Activate the compatible adapter

Recheck owner/session and provenance at activation. Record only that owner's previous eligible configuration, without keeping forbidden prompt caches or loading another private adapter.

```text
inference_registry.activate_for_live_owner_epoch_under_resource_guard()
ON active -> ADAPT-11
ON failed -> ADAPT-12
```

### ADAPT-11: Runtime contract still holds?

Revocation or a regression invalidates the activation; no hidden fallback upload.

```text
IF quality_resource_and_provenance_checks_remain_valid
ON yes -> ADAPT-14
ON no -> ADAPT-12
```

### ADAPT-12: Restore the permitted configuration

Do not restore an older adapter containing forgotten data; if none qualifies, disclose that inference is unavailable.

```text
restore_last_good_still_eligible_model_or_base()
THEN -> ADAPT-14
```

### ADAPT-13: Explain the rejected adapter

Preserve typed tools and evidence. Do not report machine unlearning or compatibility without proof.

```text
show_incompatibility_or_quality_or_lineage_failure()
THEN -> ADAPT-14
```

### ADAPT-14: Return the active configuration

Late candidate output is discarded after rollback. Explicit dataset/adapter actions have their own data receipts.

```text
RETURN actual_model_state_and_limits
END FLOW
```

## 44 Embedded Archi

F-32; SC-21; EA-CHART-01..05. Confirmed built-in workspace direction, not implemented. Explicit requests only; finite shared generation/repair budgets; no external control or workflow execution. Numeric caps remain proposals.

### CHART-01: Receive a chart request

A new chart or a selected-chart revision has a goal, inputs, completion conditions and a desired level of detail.

```text
request = typed_methodology_request()
THEN -> CHART-02
```

### CHART-02: Request explicitly user-originated?

EA-generated content, diagram changes, observer events, autosave and sync flags cannot start or renew generation.

```text
IF request.origin == USER_REQUEST
ON yes -> CHART-03
ON no -> CHART-25
```

### CHART-03: Use the shared request budget

Proposals: 3 total model passes, 90 active seconds, 200 nodes, 400 edges, 8 subflows, depth 3. Tighten the existing request ledger; only a new explicit top-level task creates one. Include classification, children and repairs; never replenish counters. An independent supervisor owns the deadline.

```text
ledger = existing_parent_with_tighter_chart_limits(request)
THEN -> CHART-04
```

### CHART-04: Inputs permitted and sufficient?

Use the user request and authorized selected evidence; no unrelated project crawl. Preserve source provenance and acquisition-time persistence eligibility.

```text
IF chart_generation_enabled AND scoped_inputs_and_goal_are_available
ON yes -> CHART-05
ON no -> CHART-24
```

### CHART-05: Snapshot the selected EA canvas

New charts start in an EA-owned draft. Imported original files are not overwrite targets; preserve unrelated user nodes and layout.

```text
baseline = canvas_revision_and_selected_content()
THEN -> CHART-06
```

### CHART-06: Generation still admitted?

Check shared passes, active deadline, bytes/depth/size, cancellation and current permissions before every stage. A child cannot allocate a fresh parent budget.

```text
IF ledger.remaining AND task.live AND resource_guard.admits()
ON yes -> CHART-07
ON no -> CHART-24
```

### CHART-07: Consume one generation pass

The first draft and all repair or child-generation calls consume the same monotonic count. No model-controlled counter reset.

```text
ledger.debit_pass_before_model_call()
THEN -> CHART-08
```

### CHART-08: Generate a typed graph proposal

Only nodes, edges, descriptions, inert pseudocode and evidence references. No shell, application clicks, executable chart instructions or automatic follow-up requests.

```text
proposal = bounded_local_graph_draft_or_repair(request, ledger)
ON draft -> CHART-09
ON failed -> CHART-22
```

### CHART-09: Decode the bounded graph schema

R-01/R-03: validate locally bundled schema, stable IDs, exact selected scope and source references independently of grammar output. Parse errors consume existing repair budget; the linked contract never starts a second generation call.

```text
graph = independently_validate_graph_or_typed_patch(proposal, baseline, ledger)
ON valid -> CHART-10
ON invalid -> CHART-22
```

Detailed flow: 45 Typed Output Contract.

### CHART-10: Compare semantic progress

Stable node identity and typed content matter; moving nodes or paraphrasing a label is not a repaired missing branch. Keep the bounded history in request RAM.

```text
progress = compare_with_seen_graphs_and_previous_issues(graph)
THEN -> CHART-11
```

### CHART-11: Repeated or stalled revision?

Stop early instead of redrafting forever. Hard budgets still stop novelty-producing loops that evade semantic comparison.

```text
IF repeated_fingerprint_OR_A_B_A_OR_no_measurable_progress
ON yes -> CHART-24
ON no -> CHART-12
```

### CHART-12: Check graph structure

Check IDs, endpoints, branch labels, reachability, atomic concepts and source references. A deliberate cycle gets an exit-condition warning, not automatic deletion or a claim of formal proof.

```text
issues = structural_checks_and_evidence_validation(graph)
THEN -> CHART-13
```

### CHART-13: Blocking graph errors resolved?

Uncertain methodology is labeled as an assumption or unresolved item. Known false evidence or broken graph structure is not published as complete.

```text
IF no_blocking_schema_structure_or_evidence_errors
ON yes -> CHART-14
ON no -> CHART-22
```

### CHART-14: Lay out the bounded diagram

R-03: preserve unrelated/pinned geometry, routes, colors and manual text; layout only new or explicitly selected unpinned elements. Rendering/navigating a recursive subflow never recursively generates more charts. Preserve the last valid draft. PATCH details this same preview/commit sequence, not a second edit.

```text
draft = bounded_selected_layout_with_protected_geometry_checks(graph, baseline, ledger)
ON ready -> CHART-15
ON failed -> CHART-22
```

Detailed flow: 47 Selected Chart Changes.

### CHART-15: Show the editable chart proposal

The workspace is inside EA. A preview is task RAM, not an autosaved file. The user can inspect the method without running it.

```text
show_embedded_Archi_preview_with_changes_and_unknowns(draft)
THEN -> CHART-16
```

### CHART-16: User accepts this revision?

Accept permits an EA-owned canvas edit, not a save or source-retention override. A new refinement requires another deliberate user request after this job ends.

```text
IF user_accepts_exact_current_proposal
ON yes -> CHART-17
ON no -> CHART-26
```

### CHART-17: Canvas and policy still current?

Recheck after user review and immediately before atomic application. Cancellation or expired temporary evidence cannot be overridden by an old approval.

```text
IF task.live AND preview_revision_and_source_policy_still_match()
ON yes -> CHART-18
ON no -> CHART-23
```

### CHART-18: Apply an undoable EA canvas edit

Preserve unrelated edits and use revision checks at commit, not only before it. Draft/undo buffers inherit source lifetime and deletion rules.

```text
canvas.compare_and_apply_in_memory(draft, baseline)
ON applied -> CHART-19
ON conflict -> CHART-23
```

### CHART-19: Explicit chart save requested?

Creation and acceptance do not silently enable disk history, autosave, exports or training.

```text
IF user_requests_EA_chart_save
ON yes -> CHART-20
ON no -> CHART-26
```

### CHART-20: Chart eligible for persistence?

Collection-off observations cannot be laundered through graph labels, pseudocode, thumbnails, undo history or backups.

```text
IF original_and_current_data_policy_allow_all_sources
ON yes -> CHART-21
ON no -> CHART-24
```

### CHART-21: Save the permitted EA chart

Explicit selected export can use the approved Archi schema. Failed saves leave valid RAM work intact and are reported accurately.

```text
commit_owned_chart_with_policy_and_revision_checks()
ON saved -> CHART-26
ON failed -> CHART-24
```

### CHART-22: Another bounded repair allowed?

A repair is never an unbounded validation loop. Preserve the same request ID, counters, timeout and source scope.

```text
IF same_parent_budget_remains_AND_error_is_repairable
ON yes -> CHART-06
ON no -> CHART-24
```

### CHART-23: Preserve the current user chart

Show what changed and require a fresh user review; never silently overwrite manual edits or automatically regenerate because the canvas changed.

```text
return_conflict_without_applying_stale_changes()
THEN -> CHART-26
```

### CHART-24: Report the stopping condition

Stop workers; do not fabricate missing steps. Cancellation/revocation discards ineligible late data. Further work needs a new explicit user request, not self-renewal.

```text
show_last_valid_permitted_draft_and_specific_limit()
THEN -> CHART-26
```

### CHART-25: Ignore automatic generation triggers

The diagram may be observed under a separate policy, but generated nodes and sync events are never user requests.

```text
RETURN no_chart_job_started
END FLOW
```

### CHART-26: Release chart-generation resources

An independent watchdog handles hung model/parser/layout work. Completed charts stay editable under their permitted lifetime; the depicted workflow is never executed.

```text
RETURN actual_outcome_after_common_cleanup
END FLOW
```

## 45 Typed Output Contract

R-01; SC-22; EA-OUT-01/02; E-20/21. Syntax, references and factual support are separate checks. The controller owns authority; source/model text is inert data.

### OUT-01: Accept the task envelope

Origin, scope, source IDs, policy generation and remaining budget are supplied by trusted code, never parsed from source instructions.

```text
envelope = controller_owned_task_snapshot()
THEN -> OUT-02
```

### OUT-02: Select a local schema

Use a pinned, compatibility-tested schema with bounded strings/arrays and no remote references or user-supplied schema extensions.

```text
schema = bundled_schema_for_allowed_result_kind()
THEN -> OUT-03
```

### OUT-03: Acquire a bounded worker lease

Every model, parser and renderer stage consumes the same live parent deadline. Admission failure returns unavailable. GUARD details this ongoing worker lifecycle, not a second job execution.

```text
lease = resource_guard.admit(task)
ON ready -> OUT-04
ON denied -> OUT-13
```

Detailed flow: 49 Resource Supervisor.

### OUT-04: Request constrained output

This call consumes an already-debited model pass. Grammar support is tested; grammar success is not semantic correctness.

```text
raw = bounded_grammar_guided_draft(envelope, schema)
THEN -> OUT-05
```

### OUT-05: Parse bounded result data

Reject malformed nesting, duplicate keys, excess bytes and unexpected fields before constructing UI objects.

```text
parsed = strict_parse_with_duplicate_key_and_size_checks(raw)
THEN -> OUT-06
```

### OUT-06: Schema valid?

This independent check must enforce constraints the runtime grammar converter might omit.

```text
IF independent_schema_validator_accepts(parsed)
ON yes -> OUT-07
ON no -> OUT-13
```

### OUT-07: Resolve evidence references

The model cannot invent a live UI target, source revision, permission, completed action or user request.

```text
refs = resolve_only_supplied_source_and_target_IDs(parsed)
THEN -> OUT-08
```

### OUT-08: References current and permitted?

Unknown, revoked, expired or cross-task references block dependent claims and pointing.

```text
IF references_match_scope_revision_and_policy(refs)
ON yes -> OUT-09
ON no -> OUT-13
```

### OUT-09: Assess claim support

Use exact-label checks and established math engines where applicable. Other claims remain attributed inference or unknown; no claim of universal semantic verification.

```text
assessment = check_literals_calculations_and_attribution(parsed, refs)
THEN -> OUT-10
```

### OUT-10: Assign visible claim status

Conflicts and coverage gaps remain visible. An unsupported current-control instruction is withheld, not upgraded by fluent wording.

```text
result = mark_observed_documented_inferred_unknown(assessment)
THEN -> OUT-11
```

### OUT-11: Render inert content

No remote images, active HTML, script, command links or automatic URL requests. A malicious citation cannot create network traffic.

```text
view = render_escaped_text_and_typed_internal_results(result)
THEN -> OUT-12
```

### OUT-12: Publish if task still live

Last-moment cancellation or revocation discards output. Cleanup is mandatory on every return.

```text
RETURN compare_policy_generation_then_publish(view)
END FLOW
```

### OUT-13: Return a bounded failure

The caller may repair only within its existing debited parent ledger. This subflow never renews budgets or retries itself.

```text
RETURN INVALID_or_UNAVAILABLE_without_publication
END FLOW
```

## 46 Evidence Casework

R-02; SC-23; EA-CASE-01; E-22. Proposed inspectable case representation within existing notes/evidence capabilities. User actions and observed results remain distinct.

### CASE-01: Record the requested outcome

Keep the desired outcome separate from an inferred diagnosis. The current question establishes no unlimited investigation.

```text
case.goal = explicit_user_goal
THEN -> CASE-02
```

### CASE-02: Record the reported symptom

A report of failure is evidence of the report; it is not proof of a particular cause.

```text
case.symptom = attributed_user_report()
THEN -> CASE-03
```

### CASE-03: Acquire scoped evidence

Use app/version/role/revision filters and exact labels/errors first. Optional semantic retrieval must obey the same scope.

```text
sources = bounded_read_and_recall_under_current_policy()
THEN -> CASE-04
```

### CASE-04: Attach claim provenance

Separate observed, documented, inferred, user-reported and unknown claims; original retention eligibility follows every derivative.

```text
claims = source_revision_locator_and_status(sources)
THEN -> CASE-05
```

### CASE-05: List competing explanations

Do not invent calibrated probabilities. The current role, app version and disabled control may support different explanations.

```text
case.hypotheses = bounded_attributed_alternatives(claims)
THEN -> CASE-06
```

### CASE-06: Evidence conflicts?

New UI state does not silently erase older documentation or the user report.

```text
IF material_claims_disagree
ON yes -> CASE-07
ON no -> CASE-08
```

### CASE-07: Show the disagreement

Identify exactly what conflicts and which conclusion is withheld.

```text
show_source_specific_conflict()
THEN -> CASE-08
```

### CASE-08: Another observation necessary?

Request the minimum useful evidence; avoid repeatedly asking equivalent questions.

```text
IF one_missing_fact_could_change_guidance
ON yes -> CASE-09
ON no -> CASE-12
```

### CASE-09: Suggest one user test

For example, ask the user to open a menu and report whether Pause is disabled. EA never performs the test.

```text
show_manual_test_reason_and_expected_distinguishing_result()
THEN -> CASE-10
```

### CASE-10: Wait within the task lifetime

No automatic scraping, polling or chart generation while waiting.

```text
event = wait_for_explicit_user_result_or_expiry()
ON result -> CASE-11
ON ended -> CASE-14
```

### CASE-11: Attribute the actual result

Record whether a result is reported or directly observed. Do not label a suggested test completed merely because time elapsed.

```text
case.result = user_report_or_new_authorized_observation(event)
THEN -> CASE-12
```

### CASE-12: Explain the supported conclusion

Unresolved cause is a legitimate result. No automatic claim of repair, complete coverage or malware safety.

```text
answer = conclusion_with_alternatives_and_coverage(case)
THEN -> CASE-13
```

### CASE-13: Present the case

Saved notes/case history require acquisition-time and current source eligibility; default task-only state expires.

```text
RETURN policy_checked_case_in_EA()
END FLOW
```

### CASE-14: Return the unresolved case

Preserve only currently permitted evidence; another investigative pass requires explicit user continuation.

```text
RETURN PARTIAL_with_missing_fact
END FLOW
```

## 47 Selected Chart Changes

R-03; SC-24; EA-PATCH-01/02; E-23/24. This is the chart revision subflow inside CHART, not a second generation loop. Preserve user-owned content and layout.

### PATCH-01: Capture the selected edit scope

Editing a label does not authorize deleting its neighbors, changing settings or rearranging the entire project.

```text
scope = explicit_node_edge_and_operation_selection()
THEN -> PATCH-02
```

### PATCH-02: Snapshot the base revision

Include source-policy/data generations and user-pinned geometry in the preview preconditions.

```text
base = immutable_canvas_snapshot_with_stable_IDs()
THEN -> PATCH-03
```

### PATCH-03: Accept typed operations

Allow declared add/remove/update node/edge operations only. No arbitrary JSON paths, file paths, URLs to fetch or application commands.

```text
ops = bounded_allowed_graph_operations(proposal)
THEN -> PATCH-04
```

### PATCH-04: All targets within edit scope?

Deleting a node must explicitly account for its incident edges. An unknown/stale stable ID rejects the whole proposal.

```text
IF operation_targets_and_incident_edges_are_authorized(ops, scope)
ON yes -> PATCH-05
ON no -> PATCH-15
```

### PATCH-05: Build a private candidate

The live canvas is untouched during validation. New IDs are assigned by the host and cannot collide.

```text
candidate = apply_to_copy(base, ops)
THEN -> PATCH-06
```

### PATCH-06: Validate the complete candidate

Verify every edge endpoint, declared entry/exit, node operation and source lineage. Drawing cycles does not execute them.

```text
issues = structural_reference_and_source_checks(candidate)
THEN -> PATCH-07
```

### PATCH-07: Candidate valid?

A repair is returned to CHART and consumes its original remaining passes; this subflow does not start a repair job.

```text
IF not issues.blocking
ON yes -> PATCH-08
ON no -> PATCH-15
```

### PATCH-08: Lay out permitted elements

Manual/unrelated positions and routes stay fixed. A full re-layout is allowed only by a separate explicit scope selection.

```text
candidate = bounded_layout_of_new_or_selected_unpinned_elements(candidate)
THEN -> PATCH-09
```

### PATCH-09: Protected geometry unchanged?

The host verifies actual output, even if the chosen layout library claims interactive or fixed-position support.

```text
IF untouched_text_colors_positions_and_routes_match(base)
ON yes -> PATCH-10
ON no -> PATCH-15
```

### PATCH-10: Show the exact change preview

Preview additions, deletions, changed assumptions and unresolved evidence, not an unrelated regenerated chart.

```text
approval = review_diff_and_candidate_revision(candidate)
ON accepted -> PATCH-11
ON rejected -> PATCH-15
```

### PATCH-11: Commit preconditions current?

Edits during preview and source revocation invalidate approval. Do not silently rebase or overwrite.

```text
IF task_policy_data_and_canvas_revisions_still_match(base, approval)
ON yes -> PATCH-12
ON no -> PATCH-14
```

### PATCH-12: Commit one in-memory change

The commit rechecks all preconditions under one lock and records one policy-aware undo step. A late mismatch returns conflict with zero partial writes.

```text
canvas.compare_and_apply_in_memory(candidate, expected = base)
ON applied -> PATCH-13
ON conflict -> PATCH-14
```

### PATCH-13: Return the applied revision

RAM commit is not a disk save. Persistence follows CHART retention checks, including undo/history/backups.

```text
RETURN APPLIED_revision_and_save_eligibility
END FLOW
```

### PATCH-14: Preserve current user work

Show that the base changed and request a new deliberate revision request. Never trigger another chart automatically.

```text
RETURN CONFLICT_without_automatic_retry
END FLOW
```

### PATCH-15: Discard the private candidate

Keep the existing canvas intact and release temporary allocations; no code from the diagram executes.

```text
RETURN REJECTED_with_bounded_issues
END FLOW
```

## 48 Bounded Branch Checks

R-04; SC-25; EA-LOGIC-01/02; E-25/26. Proposed refinement of bounded logic checks, not a workflow runner or universal termination proof. User-reviewed formal assumptions determine meaning.

### CHECK-01: Accept an explicit check request

Checking a chart cannot generate more charts. Automatic edits/autosave cannot invoke this operation.

```text
request = selected_chart_check_with_shared_parent_ledger()
THEN -> CHECK-02
```

### CHECK-02: Parse the guard language

Allow literals, finite-domain variables, comparisons and Boolean connectives. No eval, calls, assignments, imports or source pseudocode execution.

```text
ast = restricted_Boolean_enum_bounded_integer_guard_parser()
THEN -> CHECK-03
```

### CHECK-03: Guards supported?

Natural-language conditions require user-confirmed formalization. Uninterpreted actions remain inert labeled nodes.

```text
IF every_selected_guard_is_in_the_declared_grammar
ON yes -> CHECK-04
ON no -> CHECK-13
```

### CHECK-04: Review variable domains

Initial proposal: 16 variables, at most 16 values per variable, 200 predicates; these are unmeasured limits, not promises.

```text
assumptions = user_confirmed_domains_and_invariants()
THEN -> CHECK-05
```

### CHECK-05: Admit the solver

One check request has at most 5 active seconds, 32 path edges and 32 reported witnesses proposed. All queries share that deadline; no per-query renewal. GUARD details the same ongoing solver lifecycle, not another solve.

```text
lease = resource_guard.admit(check_task)
ON ready -> CHECK-06
ON denied -> CHECK-13
```

Detailed flow: 49 Resource Supervisor.

### CHECK-06: Build bounded queries

Check assumptions first. Then use A AND gi AND gj for overlap and A AND NOT(OR guards) for a gap. Paths accumulate guards; no state-changing action semantics are inferred.

```text
queries = consistency_overlap_gap_and_path_formulas(ast, assumptions)
THEN -> CHECK-07
```

### CHECK-07: Run the bounded solver

Disable traces to disk. The independent watchdog may stop a hung call; expose UNKNOWN/TIMEOUT rather than a passing result.

```text
result = established_solver_with_finite_timeout_and_resource_limit(queries)
THEN -> CHECK-08
```

### CHECK-08: Definitive result available?

A controller timeout may be classified separately from solver UNKNOWN. Both are incomplete, never UNSAT.

```text
IF result.is_SAT_or_UNSAT
ON yes -> CHECK-09
ON no -> CHECK-13
```

### CHECK-09: Witness found?

A SAT gap/overlap query identifies a counterexample within the declared domain; SAT assumptions merely mean the assumptions are consistent.

```text
IF result == SAT
ON yes -> CHECK-10
ON no -> CHECK-11
```

### CHECK-10: Validate the witness

Check a returned assignment against the restricted expression evaluator. An invalid witness is an engine failure, not user evidence.

```text
witness = independently_evaluate_guard_AST(result.assignment)
ON valid -> CHECK-12
ON invalid -> CHECK-13
```

### CHECK-11: Describe the bounded result

UNSAT assumptions mean inconsistent inputs, not a correct workflow. UNSAT path queries only exclude paths within the reviewed bound and formalization.

```text
report = classify_UNSAT_for_the_specific_query()
THEN -> CHECK-12
```

### CHECK-12: Show coverage and assumptions

Identify checks completed, paths not explored, formal inputs and engine/version. No guarantee of real-world success or termination.

```text
RETURN source_checked_report_without_canvas_changes
END FLOW
```

### CHECK-13: Return incomplete analysis

No automatic budget increase, chart revision, action execution or recursive self-check. The user can submit a smaller/new request.

```text
RETURN UNKNOWN_or_TIMEOUT_or_UNSUPPORTED_with_coverage
END FLOW
```

## 49 Resource Supervisor

R-05; SC-26; EA-GUARD-01/02; E-27. Conceptual worker lifecycle used by model/OCR/parser/layout/solver/voice. Resource controls are not an access-control sandbox.

### GUARD-01: Accept a bounded job

A child references its parent limits. No model text can reset counters, expand permission or select an arbitrary executable.

```text
job = typed_job_with_parent_ledger_and_resource_profile()
THEN -> GUARD-02
```

### GUARD-02: Probe enforcement availability

On Linux assess actual delegated cgroup controls; never assume a documented interface is usable by this user.

```text
controls = tested_OS_capability_probe_without_escalation()
THEN -> GUARD-03
```

### GUARD-03: Required protection available?

Memory controls alone do not block network or files. An unavailable required protection blocks this worker; no root prompt or unsandboxed fallback.

```text
IF tested_resource_and_access_isolation_contracts_available
ON yes -> GUARD-04
ON no -> GUARD-15
```

### GUARD-04: Measure live headroom

Track resident UI/supervisor and all buffers against the EA ceiling separately. Already-resident EA is reflected in available RAM and is not subtracted twice. WORK details incremental demand and whole-system accounting.

```text
headroom = current_available_RAM_minus_system_reserve()
THEN -> GUARD-05
```

### GUARD-05: Measured job profile fits?

Unknown profiles require feasibility evidence, not speculative admission. Include loader/handoff peaks and retained pages. Limits can temporarily overshoot, so retain a measured margin.

```text
IF incremental_peak_plus_margin_fits_headroom_AND_total_EA_peak_fits_ceiling(job)
ON yes -> GUARD-06
ON no -> GUARD-15
```

### GUARD-06: Reserve the heavy-worker slot

Foreground help preempts optional background work. Recheck headroom after acquiring the slot; queued work cannot exceed a bounded queue.

```text
lease = atomic_single_heavy_worker_admission(parent_ledger)
THEN -> GUARD-07
```

### GUARD-07: Install enforceable limits

The try/finally lifecycle begins before configuration and launch. Keep UI/supervisor outside the owned launch group while counting their memory. No target app is launched or controlled.

```text
configure_worker_RAM_CPU_deadline_and_access_boundaries(lease)
THEN -> GUARD-08
```

### GUARD-08: Launch the internal worker

The lease tracks partial launch children even if launch throws before returning a handle. Cleanup reaps only that owned group. Pass only scoped data/handles; no ZI external executor.

```text
worker = start_allowlisted_internal_service(lease)
THEN -> GUARD-09
```

### GUARD-09: Observe supervisor events

A monotonic deadline and process supervision remain live if the worker is hung. Pressure admission is advisory; enforced caps remain independent.

```text
event = bounded_wait_for_completion_pressure_cancel_or_deadline()
ON complete -> GUARD-10
ON stop -> GUARD-11
```

### GUARD-10: Result generation still current?

Before reaping, detach a bounded successful payload into parent-owned storage with copy peaks accounted. Late/canceled/revoked output is rejected; publication rechecks again after cleanup.

```text
IF result_matches_live_task_policy_and_source_revisions
ON yes -> GUARD-13
ON no -> GUARD-11
```

### GUARD-11: Invalidate worker output

This must happen before waiting for shutdown; cached data from another task cannot be reused.

```text
invalidate_task_result_generation()
THEN -> GUARD-12
```

### GUARD-12: Terminate remaining worker work

Stop the owned internal worker, never arbitrary user applications. Preserve the last permitted UI draft.

```text
supervisor_stop_children_with_finite_escalation()
THEN -> GUARD-13
```

### GUARD-13: Release the worker lease

The returned payload is parent-owned and stays charged; do not free borrowed memory beneath the caller. Quarantine the slot if children/residency remain unresolved. Account permitted warm pages and scoped caches; slot release is not proof of reclaimed RAM.

```text
reap_owned_group_and_release_only_untransferred_buffers()
THEN -> GUARD-14
```

### GUARD-14: Report the actual outcome

Recheck owner/source/policy/expiry after cleanup. Pending cleanup cannot be called COMPLETE or permit another heavy worker. No crash-proof claim; positive completed cases remain required.

```text
RETURN guarded_payload_or_actual_cleanup_failure_status
END FLOW
```

### GUARD-15: Return unavailable protection or RAM

Offer bounded exact evidence or a smaller requested scope where possible; required feature feasibility remains a blocker.

```text
RETURN UNAVAILABLE_without_launch
END FLOW
```

## 50 Verify Forgetting

R-06; SC-27; EA-ERASE-01/02; E-22/28. Logical exclusion is immediate; physical cleanup is a separately verified resumable operation. No universal forensic-erasure promise.

### ERASE-01: Accept the forget selection

Preview affected owned copies and trained/external limits without widening the selected scope.

```text
selection = explicit_owned_data_selection()
THEN -> ERASE-02
```

### ERASE-02: Preview derivative lineage

Preview claims, chunks, indexes, summaries, charts, undo/history, caches, datasets and owned backups. This is not the authoritative cleanup inventory; that closure is recomputed inside the deletion transaction.

```text
preview = selected_sources_and_derived_record_IDs()
THEN -> ERASE-03
```

### ERASE-03: Commit the deletion barrier

Within the shared lock recheck owner/confirmed scope, resolve current descendants, mark tombstones, advance data generation and persist cleanup inventory before commit. When expanding DEL, reuse its committed transaction receipt instead of starting a second deletion.

```text
affected = transaction_current_closure_tombstones_and_cleanup_inventory(selection)
THEN -> ERASE-04
```

### ERASE-04: Cancel affected work

No late save can resurrect a deleted source. User-authored unrelated work is not removed.

```text
invalidate_readers_workers_previews_and_caches(affected)
THEN -> ERASE-05
```

### ERASE-05: Load committed cleanup stores

Inventory was persisted with tombstones, before cancellation or filesystem work. Resume that exact opaque-ID job after interruption; do not rebuild it from already-deleted lineage.

```text
job = load_committed_content_free_cleanup_inventory(affected)
THEN -> ERASE-06
```

### ERASE-06: Storage deletion mode supported?

FTS5 secure-delete and core secure_delete are distinct. Migration/downgrade must not silently disable the supported deletion contract.

```text
IF audited_SQLite_FTS_and_store_versions_are_compatible
ON yes -> ERASE-07
ON no -> ERASE-11
```

### ERASE-07: Remove owned derivatives

Use tested deletion paths for base/FTS/vector data, temporary files, caches, journals/WAL and backups. Respect locks and quotas.

```text
purge_or_rewrite_each_owned_store(job)
THEN -> ERASE-08
```

### ERASE-08: Verify each store result

Production receipts report actual store status. Synthetic acceptance additionally searches shadow/index/page/backup canaries; a search returning zero is insufficient.

```text
results = check_owned_cleanup_inventory(job)
THEN -> ERASE-09
```

### ERASE-09: All owned cleanup verified?

A locked backup, offline device or failed checkpoint remains pending. Never relabel it complete because lookup is blocked.

```text
IF every_owned_store_result_is_complete
ON yes -> ERASE-10
ON no -> ERASE-11
```

### ERASE-10: Report bounded cleanup evidence

Distinguish EA-owned cleanup from SSD/swap/OS copies, external exports and trained weights. Retain only minimal nonpayload tombstones as needed.

```text
RETURN owned_cleanup_complete_with_external_limits
END FLOW
```

### ERASE-11: Retain the incomplete job

Retry only through bounded storage maintenance, with no observation, model or chart generation. Tombstones remain authoritative.

```text
persist_pending_store_status_without_payload()
THEN -> ERASE-12
```

### ERASE-12: Report pending cleanup honestly

The user sees what is inaccessible, what is still pending and why. Restore must filter tombstones before exposing old data.

```text
RETURN EXCLUDED_BUT_CLEANUP_PENDING
END FLOW
```

## 51 Artifact Trust

R-07; SC-28; EA-TRUST-01/02; E-29. Explicit installer/settings maintenance, not an assistant action or automatic remote research. Existing offline operation is separate from accepting a new update.

### TRUST-01: Accept a maintenance request

This privileged maintenance path is outside the model tool registry. Consent names artifact, source, size and destination.

```text
request = explicit_setup_or_update_or_local_import()
THEN -> TRUST-02
```

### TRUST-02: Publisher or user-managed artifact?

Local user adapters may lack publisher signatures; that does not make them publisher-authenticated.

```text
IF artifact_has_publisher_trust_channel
ON publisher -> TRUST-03
ON local -> TRUST-04
```

### TRUST-03: Verify trusted metadata

Check signature thresholds, declared hashes/lengths, versions, expiry and rollback/freeze rules. Bounded offline bundles or explicitly approved installer fetch only.

```text
metadata = maintained_verifier_from_pinned_trust_root()
ON valid -> TRUST-05
ON invalid -> TRUST-13
```

### TRUST-04: Review user-managed provenance

Keep a distinct trust label; require safe tensor/data-only formats, no executable model code, license/compatibility review and explicit local import.

```text
approval = review_unverified_local_artifact_origin_and_risk()
ON approved -> TRUST-05
ON declined -> TRUST-13
```

### TRUST-05: Stage the selected bytes

Do not overwrite the active artifact. A digest identifies bytes but cannot authenticate a publisher without trusted metadata.

```text
staged = bounded_temporary_artifact_copy()
THEN -> TRUST-06
```

### TRUST-06: Verify identity and length

Mismatch, truncation, excess size or substituted content rejects the candidate.

```text
check_expected_hash_length_and_complete_bytes(staged)
ON valid -> TRUST-07
ON invalid -> TRUST-13
```

### TRUST-07: Check runtime compatibility

For adapters, exact compatible base/tokenizer matters. A successful parse is not quality or memory acceptance.

```text
check_license_format_tokenizer_base_and_schema_versions(staged)
ON valid -> TRUST-08
ON invalid -> TRUST-13
```

### TRUST-08: Evaluate the candidate profile

Use published/synthetic fixed fixtures; do not benchmark with private user observations by default. Keep the current artifact active.

```text
result = existing_quality_privacy_and_4GB_acceptance_protocol(staged)
THEN -> TRUST-09
```

### TRUST-09: Candidate gates pass?

No faster-but-wrong swap or larger-RAM exception. New unsupported models remain unvalidated candidates.

```text
IF required_quality_resource_and_compatibility_gates_pass
ON yes -> TRUST-10
ON no -> TRUST-13
```

### TRUST-10: Confirm artifact activation

Show memory/disk needs, trust label, current metadata freshness, settings changes and rollback limits.

```text
approval = explicit_artifact_change_preview()
ON approved -> TRUST-11
ON declined -> TRUST-13
```

### TRUST-11: Activate the verified candidate

Recheck bytes, consent, lineage and current trust/metadata authorization at activation. Preserve last-working trusted bytes and trust/version floors; no private-data restoration on rollback.

```text
atomic_revision_checked_active_artifact_switch()
THEN -> TRUST-12
```

### TRUST-12: Report actual artifact status

Offline use cannot prove latest revocation/latest release. Expired metadata blocks a new publisher update, not an automatic disabling of already installed offline functionality.

```text
RETURN active_hash_version_trust_and_freshness
END FLOW
```

### TRUST-13: Reject the staged candidate

No disabling verification, auto-root or automatic retries. Report blocked updates and clock/metadata uncertainty separately from existing offline availability.

```text
RETURN previous_active_artifact_unchanged
END FLOW
```

## 52 Traceability And Drills

R-08; SC-29; EA-TRACE-01/02; E-30. Engineering analysis/test procedure, not a runtime ZI agent capability. Structural checks never fabricate semantic approval.

### TRACE-01: Identify the specification change

Record whether it refines an existing contract or adds a user outcome. Frozen-scope additions remain rejected.

```text
change = explicit_analysis_revision()
THEN -> TRACE-02
```

### TRACE-02: Resolve all analysis references

The full inventory index covers every current sector; the refinement index adds R-01..08 node-level links. Check reciprocal feature/scenario references and coverage of settings, requirements, pseudocode, evidence and experiments.

```text
refs = parse_ALIGNMENT_and_REFINEMENTS_indexes()
THEN -> TRACE-03
```

### TRACE-03: Every reference resolves?

A missing acceptance criterion or deleted linked node is a visible failure, not a silently dropped link.

```text
IF all_referenced_definitions_and_node_IDs_exist
ON yes -> TRACE-04
ON no -> TRACE-13
```

### TRACE-04: Compare board semantics

Compare labels, pseudocode, descriptions and transitions; preserve user layout and flag conflicting edits rather than overwrite.

```text
check_source_saved_board_and_reference_content()
THEN -> TRACE-05
```

### TRACE-05: Structural checks pass?

Matching structure is necessary, not sufficient for semantic agreement.

```text
IF no_missing_or_conflicting_artifact_content
ON yes -> TRACE-06
ON no -> TRACE-13
```

### TRACE-06: Define independent fixtures

Include revoke/save, cancel/late output, collection-off/undo, deleted-data/restore and repeated-child-budget sequences.

```text
oracles = synthetic_scenarios_and_expected_invariants()
THEN -> TRACE-07
```

### TRACE-07: Runtime exists to test?

Documentation tests cannot demonstrate the not-yet-built model, solver, screen overlay or resource supervisor.

```text
IF EA_implementation_is_available
ON yes -> TRACE-08
ON no -> TRACE-09
```

### TRACE-08: Run bounded stateful drills

Use fixed reproducible seeds/failure traces without real private data. Assert invariants after each transition, not only the happy-path ending.

```text
results = established_property_test_engine(oracles)
THEN -> TRACE-10
```

### TRACE-09: Record tests as planned

Keep unmeasured 4 GB/latency/privacy/model claims open. Do not convert a well-written criterion into a pass.

```text
record_PLANNED_NOT_VERIFIED()
THEN -> TRACE-10
```

### TRACE-10: Record actual evidence

If no runtime exists, record only artifact-test evidence plus planned drills. Avoid private source payloads in records.

```text
attach_build_profile_fixture_and_result_metadata()
THEN -> TRACE-11
```

### TRACE-11: Request semantic review

Review exact revisions and meaning. Content hashes detect drift, not agreement; never automatically mark reviewed.

```text
mark_linked_docs_for_human_sync_review()
THEN -> TRACE-12
```

### TRACE-12: Return the analysis state

The next phase is design only after the approved analysis baseline. No feature is silently added after freeze.

```text
RETURN OPEN_until_all_exit_gates_and_user_signoff
END FLOW
```

### TRACE-13: Keep the discrepancy visible

Repair the linked specification and rerun checks. No autonomous EA loop regenerates documents or diagrams.

```text
RETURN ARTIFACT_MISMATCH_with_affected_IDs
END FLOW
```

## 53 Computer-Wide Search

F-02/05/07/09; SC-30/31; EA-SEEK-01..03. Requested computer-wide discovery means permitted sources, supported decoding and visible coverage, never unrestricted access or an instantaneous whole-disk promise.

### SEEK-01: Define the information sought

Resolve a document, rule, statistic, comparison or other requested fact. Discovery and extraction do not modify source files.

```text
goal = explicit_search_question_and_expected_output()
THEN -> SEEK-02
```

### SEEK-02: Select search locations

A broad computer-search preset needs explicit review. No default whole-home scan, protected directories, network mounts or automatic disk inventory.

```text
roots = reviewed_local_roots_and_exclusions()
THEN -> SEEK-03
```

### SEEK-03: Discovery grant current?

Filename enumeration is a read too. New drives, mounts and links do not inherit grants. Denied source names are not exposed as suggestions.

```text
IF task.live AND discovery_scope_and_purpose_are_authorized
ON yes -> SEEK-05
ON no -> SEEK-04
```

### SEEK-04: Request missing scope or intent

Use the focused clarification contract. Choosing a suggested answer is not consent until the user explicitly submits a scoped grant.

```text
RETURN NEEDS_INPUT_without_discovery
END FLOW
```

Detailed flow: 55 Clarify And Continue.

### SEEK-05: Allocate the search budget

Proposed ceilings: 60 active seconds, 10000 visited entries and 64 MiB total source bytes per pass. Queues, dedup sets and results share the existing RAM cache cap. No unlimited or automatic renewed pass.

```text
ledger = finite_search_pass_under_parent_task()
THEN -> SEEK-06
```

### SEEK-06: Create a bounded source iterator

Use incremental traversal, not a whole-disk list in RAM or a disk-spooled index with collection off. Existing permitted indexes may prioritize candidates but cannot certify coverage.

```text
walker = permission_filtered_local_walker(roots, ledger)
THEN -> SEEK-07
```

### SEEK-07: Another entry admitted?

Every traversal, decoder, ranking and extraction stage shares parent time/bytes/RAM limits. Cancellation invalidates queued output.

```text
IF task_policy_live AND ledger.remaining
ON yes -> SEEK-08
ON no -> SEEK-21
```

### SEEK-08: Visit the next bounded entry

Debit directory traversal as well as files; an iterator cannot hide unbounded work inside next(). Preserve an honest traversal frontier.

```text
entry = walker.next_with_entry_debit()
ON entry -> SEEK-09
ON end -> SEEK-18
```

### SEEK-09: Entry within current scope?

Apply exclusions before inspecting protected content. No secret filenames, arbitrary ungranted directory expansion or privilege escalation.

```text
IF current_entry_metadata_and_content_permissions_allow()
ON yes -> SEEK-10
ON no -> SEEK-22
```

### SEEK-10: Resolve a safe file identity

Reject special/device files, symbolic-link escapes and unapproved mounts. Read handles must still match granted identity at use.

```text
identity = verified_regular_local_file_without_link_escape(entry)
ON valid -> SEEK-11
ON invalid -> SEEK-22
```

### SEEK-11: File already visited?

Avoid hardlink duplicates and traversal cycles without unbounded memory. Exhausted identity bookkeeping stops the pass rather than silently dropping the guard.

```text
IF stable_file_identity_in_bounded_seen_set
ON yes -> SEEK-22
ON no -> SEEK-12
```

### SEEK-12: Record the visited identity

Debit bounded bookkeeping before reading content. A full identity set ends the pass; it cannot silently forget duplicates and continue indefinitely.

```text
bounded_seen_set.add_with_capacity_check(identity)
ON recorded -> SEEK-13
ON full -> SEEK-21
```

### SEEK-13: Read supported file content

FILE supplies read-only handle and revision checks. Unsupported/encrypted/corrupt files are gaps, not secretly decoded through scripts or another application.

```text
chunks = bounded_supported_file_read_under_shared_ledger(identity)
ON read -> SEEK-14
ON unreadable -> SEEK-22
```

Detailed flow: 07 File Reading.

### SEEK-14: Match the requested evidence

Fast mode may prioritize names/indexes. Thorough mode must examine admitted supported content even when a filename looks irrelevant; every unvisited byte remains a gap.

```text
matches = exact_terms_sections_and_optional_scoped_semantics(chunks)
THEN -> SEEK-15
```

### SEEK-15: Rank and deduplicate results

Keep exact identifiers, edition/date, source locations and match types. Semantic guesses cannot replace a literal requested rule.

```text
results = bounded_provenance_rank(matches)
THEN -> SEEK-16
```

### SEEK-16: Record inspected coverage

Track complete, partial, denied, unreadable, changed and unvisited categories without retaining protected path details.

```text
coverage.add_actual_revisions_ranges_and_match_counts()
THEN -> SEEK-17
```

### SEEK-17: Continue this search pass?

Finding one match does not end thorough mode. Fast-mode early stop is visibly partial coverage, never proof that no other matches exist.

```text
IF thorough_mode_OR_fast_goal_not_yet_satisfied
ON yes -> SEEK-07
ON no -> SEEK-18
```

### SEEK-18: Finalize the coverage report

All inspected means the named finite snapshot only, never all possible files or future changes. A quiet error must not turn incomplete search into complete search.

```text
coverage = finalize_actual_scope_and_unread_frontier()
THEN -> SEEK-23
```

### SEEK-19: Extract readable evidence

Present sourced excerpts, tables or comparisons. Matching file paths alone do not answer the question.

```text
result = CALL extraction(results, goal, coverage)
THEN -> SEEK-20
```

Detailed flow: 54 Extract And Cite.

### SEEK-20: Return search outcome

Filter current permissions even on partial output. The user can request a new bounded continuation; revalidate remaining scope and source revisions. Never automatically renew expired passes.

```text
RETURN result_or_verified_partial_evidence_with_common_cleanup
END FLOW
```

### SEEK-21: Record the stopping condition

Return only still-permitted partial evidence. A paused traversal cursor is temporary metadata and cannot become a hidden saved inventory.

```text
coverage.stop_reason = deadline_bytes_entries_RAM_or_revocation()
THEN -> SEEK-18
```

### SEEK-22: Record a bounded coverage gap

Do not name protected paths. Mark eligible visited identities and advance; no retry of the same failed entry in this pass.

```text
coverage.add_safe_skip_category(entry)
THEN -> SEEK-07
```

### SEEK-23: Further extraction still admitted?

An exhausted search cannot launch unbudgeted extraction or another model. Otherwise return already-verified permitted evidence and the stopping reason.

```text
IF shared_ledger_remaining_AND_task_and_source_policy_live
ON yes -> SEEK-19
ON no -> SEEK-20
```

## 54 Extract And Cite

F-05/07/15; SC-31; EA-EXTRACT-01/02. Extract relevant information into readable EA-owned results while preserving source meaning, exact identifiers, provenance and privacy.

### EXTRACT-01: Accept candidate evidence

Only supplied scoped references may be used. Results from old conversation summaries are leads, not freshly verified facts.

```text
candidates = currently_permitted_search_or_selected_source_refs()
THEN -> EXTRACT-02
```

### EXTRACT-02: Resolve the requested selector

For rule 432 of 1113, determine whether 1113 is a document ID, a section or a count; distinguish printed page numbers from viewer pages.

```text
selector = document_edition_section_rule_or_table_reference()
THEN -> EXTRACT-03
```

### EXTRACT-03: Selector sufficiently clear?

Do not guess among different leagues, seasons, revisions, documents or similarly numbered rules.

```text
IF document_edition_and_target_meaning_are_unambiguous
ON yes -> EXTRACT-05
ON no -> EXTRACT-04
```

### EXTRACT-04: Ask a targeted question

Offer short evidenced choices plus free text and Skip/Cancel. Refer to TALK for the bounded question lifecycle, not an extra automatic question loop.

```text
RETURN NEEDS_INPUT_with_permitted_choices()
END FLOW
```

Detailed flow: 55 Clarify And Continue.

### EXTRACT-05: Read the relevant source range

Carry the same search/task ledger. Preserve headings, neighboring qualifications, footnotes and table units when needed; report any omitted context.

```text
range = bounded_read_of_exact_target_and_needed_context()
THEN -> EXTRACT-06
```

### EXTRACT-06: Exact target found?

Rule 432 is not rule 4320. OCR ambiguity and missing sections cannot be filled from model memory.

```text
IF literal_identifier_and_source_context_match(selector)
ON yes -> EXTRACT-07
ON no -> EXTRACT-13
```

### EXTRACT-07: Preserve content structure

Keep numbers, units, row/column relationships, dates, exceptions and references. Mark uncertain OCR and unavailable cross-references.

```text
facts = typed_excerpt_table_or_fields(range)
THEN -> EXTRACT-08
```

### EXTRACT-08: Verify each extracted claim

Separate exact quotations, plain-language explanations and computed values. Computation uses the existing math engine with cited inputs, not model arithmetic.

```text
claims = independent_literal_numeric_and_reference_checks(facts)
THEN -> EXTRACT-09
```

### EXTRACT-09: Format readable results

Use concise text, lists or tables with source links and clear unknowns. Never silently truncate a rule exception or imply unread rows were aggregated.

```text
answer = excerpt_plus_explanation_or_requested_table(claims)
THEN -> EXTRACT-10
```

### EXTRACT-10: Attach precise source locations

Citations point to the inspected source and edition. Clicking a source is a user action, not authority for EA to navigate or fetch.

```text
answer.sources = identity_revision_section_page_row_or_byte_range()
THEN -> EXTRACT-11
```

### EXTRACT-11: Source and task still current?

Changed or revoked source evidence invalidates a prepared answer. No mixed-edition quotation or stale evidence labeled current.

```text
IF current_policy_task_data_and_source_revisions_match
ON yes -> EXTRACT-12
ON no -> EXTRACT-13
```

### EXTRACT-12: Present verified extraction

EA-owned answers, tables and any later chart inherit source retention. Read/extract does not grant disk export, durable saving or training.

```text
RETURN readable_result_with_coverage_and_lineage
END FLOW
```

### EXTRACT-13: Return the missing evidence

Explain inaccessible text, an uncertain selector, omitted ranges or changed evidence. No invented quotation, current statistic or unsupported complete answer.

```text
RETURN PARTIAL_or_NEEDS_INPUT_or_UNAVAILABLE_with_specific_gap
END FLOW
```

## 55 Clarify And Continue

F-02/07/09/17/24; SC-32/33; EA-TALK-01..03, EA-CURRENT-01. Confirmed direction: focused choice/free-text questions, follow-up context and useful reasoning. No mind-reading, automatic training, permission inheritance or secret live-data fetch.

### TALK-01: Accept an explicit user turn

A question or correction comes from the user, not source text, a generated chart, a default selection or an observer event.

```text
turn = trusted_user_input_event()
THEN -> TALK-02
```

### TALK-02: Restore eligible conversation state

Revalidate expiry, tombstones, purpose and permissions before use. A saved conversation or summary never recreates an expired source grant.

```text
context = current_topic_goals_corrections_and_live_source_refs()
THEN -> TALK-03
```

### TALK-03: Resolve the intended question

Resolve it/that/XYZ using actual context; consider likely next information needs and alternatives, but label inference and never decide consequential actions for the user.

```text
intent = infer_from_user_turn_and_eligible_context()
THEN -> TALK-04
```

### TALK-04: Material ambiguity remains?

Examples: which player, game/date, document edition or meaning of rule 432 of 1113. Do not interrupt for irrelevant stylistic preferences.

```text
IF missing_detail_changes_target_scope_meaning_or_freshness
ON yes -> TALK-05
ON no -> TALK-12
```

### TALK-05: Another clarification allowed?

Proposed cap: three rounds per task, one focused question per round. All model/source work remains under the original task ledger; no unlimited clarify/rephrase loop.

```text
IF shared_question_budget_remaining_AND_question_not_repeated
ON yes -> TALK-06
ON no -> TALK-18
```

### TALK-06: Show a focused question

Debit the controller-owned round and record the question ID before display. Allow free-text-only when choices would be fabricated. Provide Skip/Cancel and keyboard access. No preselected option submits itself or grants permission.

```text
debit_and_record_question_then_show_evidenced_choices_or_free_text()
THEN -> TALK-07
```

### TALK-07: Wait for a deliberate response

Suspend generation and new source reads while waiting. Task/source expiry still applies; retain no hidden source payload in question history.

```text
event = bounded_wait_without_holding_heavy_workers()
ON answer -> TALK-08
ON skip -> TALK-18
ON end -> TALK-17
```

### TALK-08: Response belongs to this question?

Late answers cannot alter another task. A data-selection answer is not a source grant; widening scope needs a separate explicit permission review.

```text
IF response_question_task_and_policy_revisions_match
ON yes -> TALK-09
ON no -> TALK-18
```

### TALK-09: Apply the user clarification

The question round was debited before display. Keep corrections distinct from source facts; do not overwrite original files or silently promote a user report to verified evidence.

```text
update_intent_with_attributed_answer_without_renewing_limits()
THEN -> TALK-03
```

### TALK-10: Current facts required?

After the permitted read, distinguish a live match, an old recording, a season comparison and a fixed historical rule. A model or cached memory cannot supply current facts by itself.

```text
IF request_needs_current_game_state_statistics_or_rule_edition
ON yes -> TALK-11
ON no -> TALK-13
```

### TALK-11: Fresh eligible source available?

Confirmed: approved local files and visible apps/pages only, with identity, observed timestamp and coverage limit. No runtime web lookup, page refresh, navigation or external feed.

```text
IF requested_identity_time_and_source_freshness_are_supported
ON yes -> TALK-13
ON no -> TALK-18
```

### TALK-12: Route the resolved task intent

Route to permitted search/extraction, visible-context evidence, math or planning before checking freshness. Needs-input results use the same bounded clarification controller. This is internal/read assistance, never external execution; each child shares parent limits.

```text
result = existing_read_or_internal_assistance_route_under_parent_limits()
THEN -> TALK-10
```

### TALK-13: Explain the sourced result

Help the user think through choices, comparisons and next steps. Never claim to know their unspoken goal, perform the action or predict a certain sports outcome.

```text
show_result_assumptions_alternatives_and_known_gaps(result)
THEN -> TALK-14
```

### TALK-14: Conversation save eligible?

Saved chat is separate from model training. Collection-off observations cannot be laundered through a recap, preference, transcript or chart.

```text
IF explicit_thread_save_policy_AND_all_source_retention_rules_allow
ON yes -> TALK-15
ON no -> TALK-16
```

### TALK-15: Save the eligible conversation state

Honor edited/deleted facts and source eligibility. Failed saves remain visibly unsaved; no durable hidden history.

```text
save_selected_EA_thread_with_source_lineage_and_revision_guard()
THEN -> TALK-16
```

### TALK-16: Maintain bounded active context

Carry useful follow-up context within current lifetimes and RAM limits. Compaction preserves important qualifiers and gaps; if it cannot, ask rather than guess.

```text
retain_only_live_goal_entities_corrections_refs_and_open_questions()
THEN -> TALK-17
```

### TALK-17: Release task resources

User can clear the topic, correct facts or forget saved history. Revoke/expiry clears affected context; another turn is user-triggered, not a background thinking loop.

```text
RETURN actual_outcome_without_automatic_followup
END FLOW
```

### TALK-18: Ask for evidence or disclose the gap

If clarification is skipped, use a plainly labeled assumption only for low-risk nonessential ambiguity. Missing target/permission/current evidence remains unresolved; offer an explicit smaller request.

```text
RETURN NEEDS_INPUT_or_PARTIAL_without_unapproved_acquisition
END FLOW
```

## 56 Module Profiles

F-33; SC-34; EA-CFG-01..03. Useful defaults plus individually selectable capabilities and inspectable declarative profiles. A profile is never consent, executable code or a new post-freeze feature.

### CFG-01: Accept a configuration request

Use the same schema for wizard, settings and advanced configuration. No silent switch because the foreground app changed.

```text
request = explicit_settings_or_profile_event()
THEN -> CFG-02
```

### CFG-02: Snapshot the active configuration

Keep the last valid profile and actual enforced restrictions. Exclude source payloads, credentials and grants from portable profiles.

```text
base = current_profile_and_policy_revision()
THEN -> CFG-03
```

### CFG-03: Parse declarative settings

No eval, shell hooks, remote references or executable theme content. Unknown fields and unsupported schema versions are errors.

```text
proposal = bounded_versioned_config_parser(request)
ON valid -> CFG-04
ON invalid -> CFG-14
```

### CFG-04: Resolve the module dependency graph

Only the declared feature catalogue and verified installed providers. Detect missing dependencies, conflicts and cycles; do not download or recursively install.

```text
dependencies = bounded_catalog_dependency_resolution(proposal)
THEN -> CFG-05
```

### CFG-05: Profile supported?

Minimal mode still retains Stop, Hide All, permission enforcement, data controls and diagnostics. No unlimited budgets or hidden ZII provider.

```text
IF dependencies_valid_AND_ZI_boundary_preserved
ON yes -> CFG-06
ON no -> CFG-14
```

### CFG-06: Compute effective settings

Preferences may override presentation; source grants intersect independently, denial wins and task/resource caps only tighten. A selected model/provider gains no new tools.

```text
effective = defaults_then_profile_then_explicit_task_preferences()
THEN -> CFG-07
```

### CFG-07: Preview configuration effects

Show chosen versus effective values and why. Disabling a module stops its activity without deleting its saved work.

```text
show_diff_dependencies_data_cost_and_restart_effects(effective)
THEN -> CFG-08
```

### CFG-08: User accepts this exact revision?

New read/retention/microphone permissions require their separate scoped review. Imported settings never restore another machine's consent.

```text
IF explicit_confirmation_AND_base_revision_current
ON yes -> CFG-09
ON no -> CFG-15
```

### CFG-09: Apply immediate restrictions

Disable takes effect even if saving later fails. Preserve access to Forget, Stop and actual-state reporting.

```text
revoke_disabled_capabilities_and_cancel_affected_jobs()
THEN -> CFG-10
```

### CFG-10: Save the reviewed configuration

Persist only eligible configuration metadata. A failed save is not a successful durable profile switch.

```text
result = atomic_revision_checked_profile_commit()
ON saved -> CFG-11
ON failed -> CFG-14
```

### CFG-11: Activate admitted modules

Lazy loading, one heavy worker and measured 4 GB limits. Disabled providers have no subscriptions, timers, capture or model residency.

```text
result = attach_verified_providers_under_live_resource_policy()
ON ready -> CFG-12
ON failed -> CFG-13
```

### CFG-12: Required controls still reachable?

Check keyboard access, reflow, Stop/Hide All, data controls and enabled feature availability without reading personal content.

```text
IF synthetic_core_and_module_health_checks_pass
ON missing -> CFG-13
ON ready -> CFG-15
```

### CFG-13: Restore a valid restrictive profile

If no compatible provider remains, keep the minimal host and report affected features unavailable. Never restore an unsafe activation or deleted adapter.

```text
restore_last_valid_config_without_restoring_revoked_grants()
THEN -> CFG-15
```

### CFG-14: Report the configuration conflict

Keep a readable local error, supported correction and last valid settings. No retry loop, data deletion, automatic install or fabricated success.

```text
show_actual_state_and_specific_unapplied_fields()
THEN -> CFG-15
```

### CFG-15: Return actual profile state

Complete customization means understandable supported choices, portable user content and replaceable approved providers, not a runtime permission bypass.

```text
RETURN applied_partial_or_unchanged_configuration
END FLOW
```

## 57 Screen Annotation Layers

F-35 extends F-06; SC-35; EA-INK-01..03. Requested EA-owned circles, arrows, boxes, freehand strokes and text callouts. Never paint into another app, inject input or create an authoritative guessed target.

### INK-01: Accept an annotation request

A requested annotation may be composed by EA without per-stroke questions. Observation, a generated note or a template cannot start it.

```text
request = explicit_user_annotation_intent()
THEN -> INK-02
```

### INK-02: Define annotation scope

Record the purpose, editable layer revision and permitted sources. Drawing supplied text does not itself authorize a screenshot.

```text
scope = chosen_display_region_objects_and_task_lifetime()
THEN -> INK-03
```

### INK-03: Annotation authority live?

Background observation alone is insufficient. Protected screens, lock, revoke and unsupported surfaces stop the request.

```text
IF overlay_grant_AND_task_AND_required_source_grants_live
ON yes -> INK-04
ON no -> INK-15
```

### INK-04: Annotation follows a real control?

Object-linked annotations need current identity and visibility. User-positioned notes are not claims about an application control.

```text
IF request.anchors_to_evidenced_app_object
ON yes -> INK-05
ON no -> INK-06
```

### INK-05: Resolve verified target geometry

Reuse POINT's geometry checks, not its drawing/event loop or another generation job. Ambiguity returns NEEDS_INPUT; do not guess.

```text
geometry = validated_POINT_identity_and_transform_stage()
ON valid -> INK-07
ON unavailable -> INK-15
```

Detailed flow: 31 Precise Screen Circles.

### INK-06: Resolve user-positioned geometry

Map the chosen display/region including scale, origin and rotation. On layout change hide the layer rather than silently moving it to another monitor.

```text
geometry = selected_region_coordinates_with_display_revision()
THEN -> INK-07
```

### INK-07: Validate annotation objects

Allow ellipse, rectangle, arrow, polyline and plain text. No HTML, remote assets, action links or arbitrary render scripts.

```text
objects = bounded_typed_shapes_and_escaped_text(request, geometry)
ON valid -> INK-08
ON invalid -> INK-15
```

### INK-08: Admit annotation resources

Proposed caps: 50 objects, 10000 stroke points and 16 KiB caption text, within the shared RAM cap. Every edit shares these limits.

```text
lease = existing_parent_ledger_and_overlay_object_budget()
ON admitted -> INK-09
ON denied -> INK-15
```

### INK-09: Compose the requested layer

Keep important target labels, system permission prompts and EA emergency controls uncovered. Expose text/list alternatives; do not claim overlay correctness from resolution alone.

```text
layer = typed_overlay_layout_with_non_occluding_labels()
THEN -> INK-10
```

### INK-10: Geometry and policy still current?

Recheck immediately before showing or applying an edit. A stale layer may not be reused as current guidance.

```text
IF layer_task_source_and_display_revisions_match
ON yes -> INK-11
ON no -> INK-14
```

### INK-11: Show the click-through layer

The application below retains focus/input. Editing uses EA-owned controls; never silently capture clicks intended for another app.

```text
EA_overlay.present_noninteractive(layer)
THEN -> INK-12
```

### INK-12: Wait for a layer event

No polling captures or model work while waiting. A Hide All panel command and supported keyboard alternative stay reachable regardless of theme.

```text
event = bounded_owned_layer_event()
ON edit -> INK-13
ON changed -> INK-14
ON ended -> INK-14
```

### INK-13: Apply a requested layer edit

Move, resize, change style, delete, undo or redo only EA objects. Retain source lifetime; undo cannot resurrect revoked data. Any source reacquisition is separately admitted.

```text
layer = bounded_revision_checked_EA_annotation_edit(event)
ON valid -> INK-10
ON invalid -> INK-15
```

### INK-14: Hide the affected layer

Lock, changed target/layout, cancel, expiry or Hide All removes stale guidance first. No automatic regeneration; a fresh annotation request is explicit.

```text
EA_overlay.hide_idempotently()
THEN -> INK-16
```

### INK-15: Explain the annotation limit

No root request, input grab or fabricated marker. A crop requires its own read/retention grant; unavailable means unavailable.

```text
show_reason_and_permitted_text_or_crop_alternative()
THEN -> INK-14
```

### INK-16: Release annotation resources

Task-only layers never silently enter screenshots, history or backups. Explicit annotation export goes through the artifact transfer and source-policy contract.

```text
RETURN after_layer_and_listener_cleanup
END FLOW
```

## 58 Code And Text Artifacts

F-34; SC-36; EA-MAKE-01..03. Requested code, text, configuration, structured data and inert patch previews inside EA. Generating code is not executing, installing, applying or proving it correct.

### MAKE-01: Accept the artifact request

Examples: a Python function, JSON object, Markdown checklist, CSV table or unified diff. Templates supply user content, never tools or authority.

```text
request = explicit_generation_or_selected_revision()
THEN -> MAKE-02
```

### MAKE-02: Resolve the output contract

Specify filenames, indentation, exact-only output versus explanation, inputs, acceptance example and source references. Proposed output formats must be listed before freeze.

```text
contract = language_version_format_encoding_newlines_schema_and_scope()
THEN -> MAKE-03
```

### MAKE-03: Required details sufficiently clear?

Ask about consequential ambiguity such as JSON versus JavaScript, a target schema or which source revision the patch addresses.

```text
IF material_output_contract_is_unambiguous
ON yes -> MAKE-05
ON no -> MAKE-04
```

### MAKE-04: Return a focused question

Do not invent a format or restart the parent request budget. Explicit free-text/choice submission is required.

```text
RETURN NEEDS_INPUT_under_existing_TALK_controller
END FLOW
```

Detailed flow: 55 Clarify And Continue.

### MAKE-05: Allocate the artifact ledger

Proposed caps: 3 total model passes, 60 active seconds, 256 KiB combined output and 8 file previews. Repairs share all counters; no self-triggering recipe chain.

```text
ledger = finite_parent_generation_limits()
THEN -> MAKE-06
```

### MAKE-06: Inputs currently eligible?

No project crawl, clipboard monitoring or secret file read. User-authored instructions and observed content keep distinct retention lineage.

```text
IF selected_inputs_and_source_revisions_are_permitted
ON yes -> MAKE-07
ON no -> MAKE-21
```

### MAKE-07: Another generation pass admitted?

Preserve current drafts, use one heavy worker and reject late output after cancel/revoke. Required safeguards are not theme/profile options.

```text
IF ledger_remaining_AND_task_policy_and_resource_guard_live
ON yes -> MAKE-08
ON no -> MAKE-21
```

### MAKE-08: Debit the shared pass counter

The model cannot reset a counter or create its own user request. All child snippets and repair attempts consume this ledger.

```text
ledger.consume_before_generation()
THEN -> MAKE-09
```

### MAKE-09: Generate the bounded draft

Only selected EA drafts may change. Preserve unrelated text and show assumptions, placeholders and unresolved references outside exact-only payloads.

```text
draft = local_typed_artifact_generation_or_requested_revision()
ON result -> MAKE-10
ON failed -> MAKE-12
```

### MAKE-10: Check the output contract

Use maintained parsers with no hooks, external references or project imports. Parsing is not execution or proof; no compiler, interpreter, generated tests or shell is launched.

```text
report = bounded_inert_parser_schema_and_literal_checks(draft)
THEN -> MAKE-11
```

### MAKE-11: Required format checks pass?

JSON-only means no Markdown fence or stray prose. Unknown runtime behavior is explicitly untested, even when syntax is verified.

```text
IF report.satisfies_requested_syntax_structure_and_revision_contract
ON yes -> MAKE-13
ON no -> MAKE-12
```

### MAKE-12: A bounded useful repair remains?

Track repeated drafts and no-progress/A-B-A; format validation cannot trigger endless redrafting.

```text
IF repairable_AND_parent_budget_remaining_AND_semantic_progress
ON yes -> MAKE-07
ON no -> MAKE-21
```

### MAKE-13: Present an editable inert preview

HTML/code stays escaped text. Tests and patches are drafts for the user, not performed work. Edits supersede validation receipts until rechecked.

```text
show_payload_diff_diagnostics_and_untested_status()
THEN -> MAKE-14
```

### MAKE-14: Receive the explicit delivery choice

No automatic clipboard update or disk write merely because generation finished. Copy/export share transfer authorization, then route by the preserved explicit choice. Cancel preserves only still-eligible current work.

```text
choice = user_preview_copy_or_export_event()
ON keep -> MAKE-22
ON transfer -> MAKE-15
```

### MAKE-15: Selected transfer permitted?

Preview only selected content and provenance. Clipboard managers and external files can retain copies outside EA; temporary-only observations cannot silently become durable transfers.

```text
IF explicit_destination_AND_current_source_transfer_rules_allow
ON yes -> MAKE-16
ON no -> MAKE-21
```

### MAKE-16: Selected payload still matches?

A later edit, forgotten source or expired task invalidates an older Copy/Export approval. Validate the exact bytes selected for delivery.

```text
IF payload_policy_data_and_preview_revisions_match
ON yes -> MAKE-17
ON no -> MAKE-21
```

### MAKE-17: Copy or create an export file?

A path inside model text is not authority. Export uses a user-selected destination for a new EA artifact, never arbitrary project-file overwrite.

```text
choice = reviewed_destination_kind
ON copy -> MAKE-18
ON file -> MAKE-19
```

### MAKE-18: Copy the selected payload

No automatic paste into another app. Best-effort clearing touches only a still-owned clipboard selection; external history cannot be recalled or guaranteed erased.

```text
clipboard.write_only_on_explicit_copy(payload)
ON done -> MAKE-20
ON failed -> MAKE-21
```

### MAKE-19: Create the selected new artifact

No executable permission bit, automatic opening, path traversal, symlink escape or overwrite of existing source files. Multi-file exports report each result; no false cross-file atomicity claim.

```text
write_new_export_with_safe_path_and_revision_checks(payload)
ON done -> MAKE-20
ON failed -> MAKE-21
```

### MAKE-20: Report actual delivery status

Only a successful write is exported. Preserve format/encoding/newline choices; report external-copy deletion limits without content logs.

```text
show_copied_exported_partial_or_failed_receipt()
THEN -> MAKE-22
```

### MAKE-21: Return the precise artifact limit

Unverified code remains a labeled draft, not a successful format guarantee. No infinite repair, background test execution or silent fallback upload.

```text
show_permitted_draft_with_contract_errors_or_missing_input()
THEN -> MAKE-22
```

### MAKE-22: Release artifact workers

Explicit new edits or generation requests may continue work; publishing a draft, annotation, chart or sync event never starts another job.

```text
RETURN actual_outcome_with_source_lifetimes
END FLOW
```

## 59 Guided Learning Workbench

F-09/22/23; SC-37; EA-LEARN-01..03. Confirmed: guided dataset export and trained-adapter import/evaluation; actual training runs in a separately launched self-hosted tool. Preferences, knowledge and weights remain distinct.

### LEARN-01: Choose what should improve

Separate remembering a fact, changing style and altering model weights. Do not call retrieval, compression or a settings change fine-tuning.

```text
goal = explicit_learning_goal()
THEN -> LEARN-02
```

### LEARN-02: Choose the learning method

Each available tab describes data, compute and deletion consequences. An explicit request to train inside ZI is explained as unavailable, not offered as an enabled training control.

```text
method = explicit_learning_intent()
ON preference -> LEARN-03
ON knowledge -> LEARN-04
ON examples -> LEARN-05
ON adapter -> LEARN-15
ON train here -> LEARN-16
```

### LEARN-03: Edit a transparent preference

Tone, detail and format defaults are editable and resettable. This cannot change facts, consent, resource caps or introduce sensitive-trait profiling.

```text
apply_explicit_style_or_workflow_preference_under_policy()
THEN -> LEARN-18
```

### LEARN-04: Correct an eligible knowledge record

A user report stays attributed. Correction/Forget reaches summaries and indexes; no automatic dataset export or model training follows.

```text
edit_fact_with_attribution_provenance_and_derivative_invalidation()
THEN -> LEARN-18
```

### LEARN-05: Select candidate examples

Inspect prompt, desired answer, source and purpose. No wholesale harvesting of desktop activity or other people's private content.

```text
selection = bounded_user_authored_or_permitted_examples()
THEN -> LEARN-06
```

### LEARN-06: Training-purpose eligibility current?

Ordinary collection is not training consent. Temporary-only observations, revoked records and protected third-party data are excluded.

```text
IF every_selected_source_allows_this_dataset_purpose_and_lifetime
ON yes -> LEARN-07
ON no -> LEARN-17
```

### LEARN-07: Build a bounded candidate dataset

Proposed caps: 1000 examples and 16 MiB per export pass. Every transformation shares parent time/RAM limits; no automatic generation of more examples.

```text
dataset = examples_with_source_and_transformation_manifest()
THEN -> LEARN-08
```

### LEARN-08: Review and edit the examples

Search/filter examples and show provenance. Preserve negative cases; redaction is not proof that every secret was detected.

```text
reviewed = user_corrects_redacts_and_excludes_examples(dataset)
THEN -> LEARN-09
```

### LEARN-09: Validate the chosen trainer schema

The selected trainer format must be named before freeze. Record base/tokenizer, licenses, lineage and split policy; never guess arbitrary GGUF compatibility.

```text
report = bounded_local_example_schema_and_duplicate_checks(reviewed)
ON valid -> LEARN-10
ON invalid -> LEARN-17
```

### LEARN-10: Separate training and evaluation data

Avoid duplicated/source-related examples leaking into held-out evaluation. Proposed 20 percent held out; insufficient independent data is an explicit limitation, not a fabricated score.

```text
split = source_grouped_train_and_heldout_partition(reviewed)
THEN -> LEARN-11
```

### LEARN-11: Preview the learning handoff

Choose a new local destination; show exact bytes, examples, manifest, split, deletion limits and external compute requirements. Approval binds this destination and payload; export does not train weights.

```text
preview = reviewed_new_destination_and_exact_dataset(split)
THEN -> LEARN-12
```

### LEARN-12: User approves this export revision?

Recheck immediately before transfer. A dataset permission never authorizes desktop execution, uploading or loading an adapter.

```text
IF explicit_export_AND_current_lineage_policy_matches
ON yes -> LEARN-13
ON no -> LEARN-18
```

### LEARN-13: Export the reviewed training bundle

DATA expands this same transfer. Recheck exact preview, owner epoch, source/policy revisions and new-file/no-symlink constraints at commit after all waits. A partial/failed export is not a completed training dataset.

```text
result = commit_reviewed_new_dataset_with_final_guards(preview)
ON saved -> LEARN-14
ON failed -> LEARN-17
```

### LEARN-14: Explain the separate training step

Existing boundary: the user separately runs the trainer; ZI launches nothing. The trainer's resources are disclosed, not hidden in a high-RAM ZI feature.

```text
show_user_run_self_hosted_trainer_handoff_and_import_requirements()
THEN -> LEARN-18
```

### LEARN-15: Evaluate a supplied adapter

Run only bounded local inference evaluation under the existing ADAPT contract, never training. Compare independent held-out results and baseline before explicit activation/rollback.

```text
result = CALL adapterLifecycle_selected_candidate()
THEN -> LEARN-18
```

Detailed flow: 43 Dataset & Adapter Lifecycle.

### LEARN-16: Explain the training boundary

User confirmed guided export/import with a separately launched self-hosted trainer. No actual weight training inside ZI, hidden trainer job or weakening of the 4 GB requirement.

```text
RETURN EXTERNAL_TRAINER_REQUIRED_NO_LAUNCH
END FLOW
```

### LEARN-17: Explain the learning limitation

Do not replace missing evaluations with model self-scores, revive forgotten examples, claim unlearning or start background retries.

```text
show_schema_consent_data_quality_or_resource_gap()
THEN -> LEARN-18
```

### LEARN-18: Return the actual learning outcome

Clearly distinguish edited preference, corrected fact, exported examples and activated adapter. None alone proves model improvement or training completion.

```text
RETURN preference_knowledge_export_or_adapter_status
END FLOW
```

## 60 Peaceful Support

F-01/07/22/33; SC-15/38/39; EA-CARE-01/02, EA-PERSONA-02..05. Funny practical companionship is requested, not social check-ins. Preserve evidence and each user's identity; peace/respect allow warmth and wit without fake intimacy.

### CARE-01: Accept a grounded result

This is a presentation contract inside the existing task, not another observation or reasoning job.

```text
result = current_validated_answer_and_known_limits()
THEN -> CARE-02
```

### CARE-02: Read explicit communication preferences

Allow direct, concise, playful or encouraging presentation. Current no-jokes/serious requests override saved humor; profanity is separately chosen. Task-scoped commands update style revision immediately at input, without learning review or a new model pass. Never merge users, infer sensitive traits, diagnose emotions or claim human feelings to create attachment.

```text
style = current_owner_eligible_tone_humor_language_and_accessibility_choices()
THEN -> CARE-03
```

### CARE-03: Help still requested?

Consent and interruption preferences outrank engagement. No guilt prompts, forced cheerfulness, streaks or repeated unsolicited advice.

```text
IF task_live_AND_user_has_not_dismissed_or_muted
ON yes -> CARE-04
ON no -> CARE-10
```

### CARE-04: Apply the supportive presentation

Respond to stated frustration with useful next steps and optional fitting wit. Humor is not a quota; do not mock the user, delay help or add slang inside exact code/text payloads. Preserve warnings and respectful technical learning without unrelated moral lectures. No extra joke-generation pass.

```text
candidate = bounded_style_render_with_immutable_evidence_fields(result, style)
THEN -> CARE-05
```

### CARE-05: Evidence meaning preserved?

A friendlier answer must not soften a real warning, overstate certainty or pretend a failed task succeeded. Independent checks are limited, not a universal semantic proof.

```text
IF literals_units_qualifiers_uncertainty_and_references_unchanged
ON yes -> CARE-06
ON no -> CARE-07
```

### CARE-06: Review against the support rubric

Check no shaming, manipulation, hidden data demand, attention theft or exclusion of accessibility controls. Human scenario review remains necessary.

```text
report = tested_noncoercive_accessible_support_contract(candidate)
ON pass -> CARE-08
ON fail -> CARE-07
```

### CARE-07: Use a direct factual presentation

Preserve facts and actionable limitations without another model retry. Neutral concise wording is valid support.

```text
candidate = deterministic_grounded_result_template(result)
THEN -> CARE-08
```

### CARE-08: Offer the useful result

Explain options and leave decisions with the user. Recheck identity and style revision before showing text or speaking; a switch or no-jokes correction invalidates late output. Requested screen objects and code remain EA-owned inert assistance; ZII execution is separate.

```text
show_only_if_owner_session_style_and_source_revisions_are_current(candidate)
THEN -> CARE-09
```

### CARE-09: Expose optional correction controls

Feedback is optional; no request to surrender privacy for help. Saving preferences or training examples requires a separate explicit action.

```text
offer_correct_less_detail_more_detail_and_dismiss()
THEN -> CARE-10
```

### CARE-10: Return attention to the user

No generic social check-ins, concern pings or messages asking where the user went. Separately opted-in technical hints and user-requested reminders are distinct. Release idle workers, honor reduced motion and conserve energy; no invented environmental savings or human attachment.

```text
RETURN idle_without_engagement_loop
END FLOW
```

## 61 Bounded Working Set

SC-10/26; EA-OPT-01..04; P-17; E-11/13/27/31/32. Refines the existing 4 GB requirement, not a new feature family. A small controller stages approved work; GUARD owns each worker lifecycle once. Budgets and allocations are proposals, not measurements.

### WORK-01: Accept scoped work

Only the owning capability can admit this work. Background observation keeps its separate lease and cannot create a help, artifact or chart job.

```text
task = existing_task_with_live_scope_and_parent_ledger()
THEN -> WORK-02
```

### WORK-02: Record the required result

Keep the exact question, required cross-references, numeric tolerance and target identity. A broad request is not satisfied by its first convenient match.

```text
contract = required_claims_sources_coverage_and_precision(task)
THEN -> WORK-03
```

### WORK-03: Bound the stage plan

Prefer structured text and exact search, specialist math or parsing, cropped OCR for actual gaps, then model interpretation when needed. Ambiguous routing asks the user. Children and repairs share the original stage, byte, pass and time limits; no model-generated recursive plan.

```text
plan = finite_typed_plan_with_reserved_parent_limits(contract)
THEN -> WORK-04
```

### WORK-04: Another stage fits?

Stage visits have a reviewed finite cap. Cursor progress and the original deadline bound the loop; exhausted work is returned with explicit gaps, not renewed automatically.

```text
IF unvisited_stage_exists_within_remaining_parent_limits
ON yes -> WORK-05
ON no -> WORK-20
```

### WORK-05: Task still current?

Recheck permission, source identity, expiry and cancellation before each stage. A changed menu can invalidate a cached label or screen location.

```text
IF task_policy_data_and_source_revisions_still_match
ON yes -> WORK-06
ON no -> WORK-24
```

### WORK-06: Debit the stage visit

Every visit costs the shared budget, including a cache hit. Provider launches additionally debit the owning feature pass allowance; chunk reads consume its byte/time ledger.

```text
parent.consume_stage_visit_before_cache_or_worker()
THEN -> WORK-07
```

### WORK-07: Current cache hit?

The key includes the exact operation, parameters, provider/model/schema revision and input identity, not just similar wording. Source, purpose, data generation, permissions and expiry must match. No disk prompt cache in temporary-only mode.

```text
IF scoped_cache_matches_operation_inputs_versions_and_live_policy
ON hit -> WORK-08
ON miss -> WORK-09
```

### WORK-08: Reuse the bounded result

Reuse evidence, not authority or automatic actions. Cached summaries cannot replace an exact clause; cached positions still need current geometry. Cache bytes share the task/global caps.

```text
result = eligible_cached_stage_result()
THEN -> WORK-16
```

### WORK-09: Select one tested profile

Use measured stage profiles, including loader peaks. Consider smaller prefill batches, bounded chunks and serial passes without dropping required evidence. Do not benchmark alternatives on private user content or repeatedly load candidates to see which crashes.

```text
profile = least_cost_quality_passing_fit_from_finite_catalog(stage)
THEN -> WORK-10
```

### WORK-10: A known profile fits?

Both the EA process-tree ceiling and live OS/app reserve must fit. Unknown estimates cannot pass. Evict eligible idle resources before measuring; no automatic swap tuning or external app termination.

```text
IF selected_profile_preserves_contract_and_fits_live_headroom
ON yes -> WORK-11
ON no -> WORK-23
```

### WORK-11: Pack bounded inputs

Account for tokenizer, IPC copies, decoded images, parser scratch and retained results. A crop does not make a full-frame decoder free. Preserve negatives, units, clause boundaries and citations; any packing failure records a gap.

```text
inputs = contract_preserving_bounded_stage_inputs()
THEN -> WORK-12
```

### WORK-12: Acquire the worker lease

Recheck live headroom and protections under the one-heavy-worker lock. This link describes the same lifecycle as run/release, not another execution. Cancellation or denied admission never falls through to launch.

```text
lease = GUARD.admit_selected_stage_or_denied()
ON ready -> WORK-13
ON denied -> WORK-23
```

Detailed flow: 49 Resource Supervisor.

### WORK-13: Run one internal stage

Load only this provider. Parser, OCR, model, math and speech stages do not overlap their heavy residency. The independent watchdog enforces deadline, pressure and cancellation; no external command backend.

```text
result = supervised_allowlisted_stage(inputs, parent_ledger)
THEN -> WORK-14
```

### WORK-14: Release stage residency

This also runs on errors, pressure and cancellation. Keep only bounded eligible results; release decoder frames and private prompt/KV state. Proposed warm lifetime is zero. Retained weight pages must be charged or evicted before another stage.

```text
finally_stop_reap_and_release_worker_scratch_and_lease()
THEN -> WORK-15
```

### WORK-15: Stage completed?

An interrupted or killed worker is not a successful feature result. Late output cannot escape cancellation through the next stage.

```text
IF stage_status == COMPLETE
ON yes -> WORK-16
ON no -> WORK-23
```

### WORK-16: Validate the stage result

Validate schema, source references, current permissions and the specialist result contract. Syntax alone does not prove truth; unsupported claims stay unverified. Validation work is bounded and charged, never an untracked second model.

```text
checked = independent_typed_result_and_live_evidence_checks(result)
THEN -> WORK-17
```

### WORK-17: Result admissible?

Reject unsupported facts, stale targets, omitted qualifications and silent numerical tolerance changes even if the result arrived faster.

```text
IF checked.meets_stage_contract
ON yes -> WORK-18
ON no -> WORK-23
```

### WORK-18: Merge bounded evidence

Queues, dedup IDs, source offsets, output previews and cross-stage evidence share bounded storage. Source edits, revocation and forgetting invalidate derived results. No hidden disk spill when collection is off.

```text
working_set.merge_with_lineage_and_explicit_coverage(checked)
THEN -> WORK-19
```

### WORK-19: Advance the stage cursor

Record actual completed ranges, not claimed full coverage. A repeated or cyclic cursor is a no-progress stop. This never refills a budget or starts a new chart, scan or answer.

```text
mark_stage_visited_once_and_advance_finite_frontier()
THEN -> WORK-04
```

### WORK-20: Assess requested coverage

Otherwise retain PARTIAL, NEEDS_INPUT or UNAVAILABLE with the actual gap. Progressive verified evidence is useful, but is not falsely labelled a complete broad answer.

```text
status = COMPLETE_only_if_required_result_and_coverage_are_verified()
THEN -> WORK-21
```

### WORK-21: Result still current?

A revoke, source change or expiry after validation must still prevent returned content. Cancellation takes precedence over a partial or complete result.

```text
IF result_policy_data_and_source_generations_are_current
ON yes -> WORK-22
ON no -> WORK-24
```

### WORK-22: Return evidence and gaps

The caller still owns final publication, pointing, retention and explicit continuation, with another current-generation check before visible output. No automatic next job.

```text
RETURN currently_eligible_bounded_result_to_owning_capability
END FLOW
```

### WORK-23: Record the bounded gap

Stop scheduling this attempt. Preserve only still-permitted verified work and identify the next user choice. Failure does not weaken the feature acceptance contract or trigger a different model automatically.

```text
record_actual_limit_or_validation_failure_without_inventing_evidence()
THEN -> WORK-20
```

### WORK-24: Invalidate the task output

Stop further reuse/publication before waiting for the worker. No unrelated user application is stopped.

```text
invalidate_generation_and_cancel_owned_stage_work()
THEN -> WORK-25
```

### WORK-25: Discard affected transient data

Apply permission and deletion lineage to every intermediate, cached result and pending answer. Cleanup never auto-saves temporary content.

```text
release_affected_buffers_and_worker_resources()
THEN -> WORK-26
```

### WORK-26: Return cancelled or stale

A new explicit user request is needed to start another task.

```text
RETURN CANCELLED_or_STALE_without_new_work
END FLOW
```

## 62 Learned Mannerisms

F-22/23/33; SC-15/38/39; EA-PERSONA-02..05. User-confirmed: funny, practical, responsive companionship and separate profiles only. Learning is editable presentation data first, not automatic weight training or shared personality blending.

### TONE-01: Receive a style input

Use the existing bounded task. Quoted documents, other speakers, tool output and screen content are not evidence of the current user's mannerisms. No new observation or model job.

```text
input = explicit_style_feedback_or_existing_permitted_exchange()
THEN -> TONE-02
```

### TONE-02: Read the active identity

OWNER details identity-switch handling, not a switch on every message. Never identify a person from their slang, voice, face or writing style.

```text
identity = current_trusted_principal_and_session_generation()
THEN -> TONE-03
```

Detailed flow: 63 User Session Boundary.

### TONE-03: Owner verified?

Unknown identity gets only guest/session behavior through ordinary explicit settings, not another person's learned style or private adapter.

```text
IF owner_boundary_is_verified_AND_identity_is_current
ON yes -> TONE-04
ON no -> TONE-17
```

### TONE-04: Learning permitted?

S-39 controls learned proposals independently of observation and training. A direct setting such as no jokes now works without observation or collection.

```text
IF explicit_setting_input_OR_owner_preference_learning_opt_in
ON yes -> TONE-05
ON no -> TONE-17
```

### TONE-05: Select eligible style evidence

Carry provenance, purpose and capture-time retention eligibility. A frustrated sentence can guide this reply; it is not a permanent temperament label, diagnosis or permission to enable profanity.

```text
evidence = bounded_first_party_owner_scoped_input()
THEN -> TONE-06
```

### TONE-06: Build a bounded proposal

Proposed active style cap: 16 fields and 4 KiB including examples, inside existing memory/context limits. Reuse allowed current-task output or explicit choices; no background fine-tuning. Opinions remain attributed knowledge, not style rules or universal truth.

```text
proposal = typed_style_fields_with_source_lineage(evidence)
THEN -> TONE-07
```

### TONE-07: Presentation fields only?

Tone, detail, humor, language and approved phrasing cannot modify facts, code payloads, source grants, safety warnings or the execution boundary. No shared personality or merged private examples.

```text
IF proposal_has_only_allowed_style_fields_AND_no_private_third_party_content
ON yes -> TONE-08
ON no -> TONE-17
```

### TONE-08: Offer optional style review

Show what changes, why, for whom and for how long. No pop-up social check-in or repeated request to review. Pending proposals expire under existing task/source limits; help does not wait for acceptance.

```text
show_editable_proposal_in_user_opened_learning_review()
THEN -> TONE-09
```

### TONE-09: User approves this revision?

Edit, decline, reset or leave. No automatic submission, personality score, inferred sensitive identity or requirement to sound like EA. No work while waiting.

```text
IF explicit_current_review_approval
ON yes -> TONE-10
ON no -> TONE-17
```

### TONE-10: Owner and evidence current?

Reject a late review after logout, switch, revoke, expiry or edit. Returning to the same account does not revive an earlier session generation.

```text
IF owner_epoch_proposal_revision_and_source_permissions_match
ON yes -> TONE-11
ON no -> TONE-17
```

### TONE-11: Saved preference requested?

Session adaptation is the proposed default. Explicit manually chosen settings differ from an observed behavioral proposal; approval alone cannot change capture-time data eligibility.

```text
IF explicit_requested_lifetime == SAVED
ON session -> TONE-14
ON saved -> TONE-12
```

### TONE-12: Persistence eligible?

Collection-off observations cannot be laundered into a saved profile by accepting a proposal. Offer a temporary preference or an independently supplied setting; do not auto-convert its origin.

```text
IF manual_setting_OR_observed_sources_allow_collection_and_retention
ON yes -> TONE-13
ON no -> TONE-16
```

### TONE-13: Commit owner-scoped settings

Recheck owner and policy at commit, report write failure honestly, retain lineage and provide edit/delete/reset. No other user's profile, dataset or model weights are changed.

```text
atomic_compare_and_save_style(owner, epoch, revision, proposal)
ON saved -> TONE-15
ON failed -> TONE-16
```

### TONE-14: Apply temporary style

Check the live owner/session again. Keep temporary-only lineage and expiry; no transcript autosave or retrospective retention.

```text
compare_and_set_current_owner_session_style(proposal)
THEN -> TONE-15
```

### TONE-15: Invalidate old style outputs

A request for no jokes takes effect immediately for pending presentation. Facts remain unchanged; no automatic regeneration, speech or new chart job.

```text
increment_style_revision_and_reject_stale_presentation_outputs()
THEN -> TONE-17
```

### TONE-16: Explain the saving limitation

Keep the previous valid preference. The user can explicitly choose a session setting; no retry loop, collection pressure or fabricated save.

```text
show_actual_eligibility_or_write_gap_without_private_payloads()
THEN -> TONE-17
```

### TONE-17: Return to requested help

Useful, humorous help on request; no generic social check-ins, guilt, fake intimacy or engagement loops. Actual training remains a separate user-run export/import workflow.

```text
RETURN actual_preference_status_without_extra_work
END FLOW
```

## 63 User Session Boundary

SC-39; EA-PERSONA-04/05. Separate profiles only is confirmed. User identity is distinct from the workspace/configuration profile. Authentication and storage isolation need a tested platform contract before sign-off; a name selector alone is not security.

### OWNER-01: Receive an identity event

Use tested OS/app identity signals, not model output, a page instruction or guessed mannerisms. Any unrecognized event leaves private access closed.

```text
event = trusted_lock_logout_or_explicit_account_switch()
THEN -> OWNER-02
```

### OWNER-02: Close private publication

Do this before awaiting worker shutdown. Every output, cache result, style update, queued write and adapter lease carries the owner and generation.

```text
increment_session_generation_and_close_publish_gate()
THEN -> OWNER-03
```

### OWNER-03: Hide outgoing private surfaces

No previous-user text or circles remain exposed in EA. Release only EA's still-owned clipboard selection under the existing clipboard contract; external clipboard histories/copies cannot be recalled.

```text
hide_owner_bound_conversation_overlays_and_previews()
THEN -> OWNER-04
```

### OWNER-04: Stop outgoing worker activity

No late tokens, TTS, source reads, autosave or style-learning commit may enter the incoming session. Cancel only EA-owned work, never another application.

```text
cancel_and_bounded_stop_owned_generation_capture_and_speech()
THEN -> OWNER-05
```

### OWNER-05: Release outgoing private context

Do not pass outgoing chat, retrieved facts, learned phrases, undo previews or mutable inference state to the next person. Saved data stays in its original protected owner namespace.

```text
release_prompt_KV_queues_handles_and_private_adapter_state()
THEN -> OWNER-06
```

### OWNER-06: Old session closed?

Failed shutdown or uncertain isolation cannot be treated as a clean switch. Keep private publication closed until the boundary is established.

```text
IF required_cleanup_and_isolation_checks_pass
ON yes -> OWNER-07
ON no -> OWNER-16
```

### OWNER-07: Resolve target identity

No blanket access from an entered name. Same-OS-account sharing needs an explicitly reviewed authentication/storage solution; otherwise only guest access is supported there.

```text
target = platform_authenticated_principal_or_ephemeral_guest()
THEN -> OWNER-08
```

### OWNER-08: Authenticated owner available?

Different accounts cannot obtain each other's private profiles or grants. This is an enforcement contract, not a promise against a compromised OS or administrator.

```text
IF tested_identity_AND_store_boundary_authorizes(target)
ON yes -> OWNER-09
ON no -> OWNER-11
```

### OWNER-09: Open the owner namespace

Apply owner checks to knowledge, preferences, conversation, caches, datasets, backups and exports, including query filters and file access. No shared personality pool.

```text
store = open_only_authorized_owner_records(target)
THEN -> OWNER-10
```

### OWNER-10: Restore eligible preferences

Load only permitted style/settings. Do not automatically open private conversations or resume prior tasks, source capture, generation or observation from a profile switch.

```text
settings = bounded_owner_style_with_current_retention_and_recall_rules()
THEN -> OWNER-12
```

### OWNER-11: Create a temporary guest context

Use the common baseline humor and explicit session preferences only. No learned style, history or private adapter from an identified owner; no automatic saving.

```text
settings = fresh_guest_defaults_without_private_retrieval()
THEN -> OWNER-12
```

### OWNER-12: Select eligible model artifacts

Selection is not worker launch. Never pool private training data or activate another user's adapter. One immutable base artifact may be reused; contexts and mutable state are separate. Weight training remains outside ZI.

```text
inference_config = common_read_only_base_plus_owner_eligible_adapter_or_none()
THEN -> OWNER-13
```

### OWNER-13: Identity still current?

An A-to-B-to-A switch must reject old A-session output too. Lock, expiry or a new switch during setup keeps the gate closed.

```text
IF desktop_unlocked_AND_target_epoch_and_authentication_state_still_match
ON yes -> OWNER-14
ON no -> OWNER-16
```

### OWNER-14: Open the new session gate

All later read, recall, cache, response and save boundaries still validate the binding. Private session selection does not union permissions or refill an old task budget.

```text
publish_gate.bind_only_current_owner_and_generation()
THEN -> OWNER-15
```

### OWNER-15: Wait for this user

No social check-in, generic concern message or automatic new model job. One active heavy stage still applies on the 4 GB baseline.

```text
RETURN idle_without_check_in_or_resumed_task
END FLOW
```

### OWNER-16: Keep private access closed

Show a content-free explanation and let the user choose a verified sign-in or later retry. Do not invent an identity, expose an old profile or silently relax isolation.

```text
RETURN IDENTITY_BOUNDARY_UNAVAILABLE_without_private_output
END FLOW
```
