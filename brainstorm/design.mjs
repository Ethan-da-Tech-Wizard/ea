// Analysis data, not an EA implementation. Regeneration never overwrites the live board.
import { capabilityFlows } from './capability-flows.mjs';
import { endStateFlows } from './end-state-flows.mjs';
import { strengtheningFlows } from './strengthening-flows.mjs';
import { conversationFlows } from './conversation-flows.mjs';
import { customizationFlows } from './customization-flows.mjs';
import { optimizationFlows } from './optimization-flows.mjs';
import { personalityFlows } from './personality-flows.mjs';
export const flows = [
  {
    "id": "overview",
    "prefix": "MAP",
    "title": "00 ZI System Map",
    "notes": "EA ZI (Roman numeral one, honoring Konrad Zuse). Read, find, assemble, preview, and guide. No external task execution. All capabilities are analysis proposals until implemented and tested.",
    "nodes": [
      [
        "event",
        "Receive an event",
        "event = await user_or_policy_event()",
        "Events are user questions, explicit memory operations, policy changes, or permitted observation events.",
        [
          [
            "question",
            "intent"
          ],
          [
            "control event",
            "control"
          ]
        ]
      ],
      [
        "help",
        "Handle a question",
        "CALL request",
        "Own one bounded troubleshooting request. Stop and cancellation remain available throughout.",
        [
          [
            "",
            "auth"
          ]
        ],
        "request"
      ],
      [
        "auth",
        "Authorize the request",
        "CALL policy",
        "Resolve acquisition separately from retention and recall. Collection off allows explicit temporary help.",
        [
          [
            "allowed",
            "inspect"
          ],
          [
            "denied",
            "done"
          ]
        ],
        "policy"
      ],
      [
        "inspect",
        "Inspect permitted sources",
        "CALL ui",
        "The UI flow delegates menus, selected files, and optional captures to bounded adapters.",
        [
          [
            "",
            "recall"
          ]
        ],
        "ui"
      ],
      [
        "recall",
        "Retrieve allowed memory",
        "CALL recall",
        "Use only current-policy, non-deleted evidence. Retrieval must not secretly expand acquisition.",
        [
          [
            "",
            "evidence"
          ]
        ],
        "recall"
      ],
      [
        "evidence",
        "Build an evidence set",
        "CALL evidence",
        "Keep exact labels, source paths, versions, timestamps, and coverage gaps.",
        [
          [
            "",
            "contextMathCheck"
          ]
        ],
        "evidence"
      ],
      [
        "resource",
        "Check resource headroom",
        "CALL resources",
        "No required GPU. A 4 GB computer means 4 GB for the entire desktop, not for EA alone.",
        [
          [
            "",
            "inference"
          ]
        ],
        "resources"
      ],
      [
        "inference",
        "Draft an answer",
        "CALL inference",
        "Use a bounded local model only when the admission guard allows it; otherwise use evidence templates.",
        [
          [
            "",
            "answer"
          ]
        ],
        "inference"
      ],
      [
        "answer",
        "Present grounded help",
        "CALL answer",
        "The user activates commands. EA explains and can highlight a freshly verified control.",
        [
          [
            "",
            "retain"
          ]
        ],
        "answer"
      ],
      [
        "retain",
        "Evaluate persistence",
        "CALL retain",
        "Only eligible, policy-authorized records enter the database. Off-captured data stays ineligible.",
        [
          [
            "",
            "cleanup"
          ]
        ],
        "retain"
      ],
      [
        "done",
        "Return to idle",
        "RETURN idle",
        "No autonomous command execution follows any path.",
        []
      ],
      [
        "cleanup",
        "Release task buffers",
        "release_only_untransferred_task_resources()",
        "Return a guarded typed result to the common typed/voice delivery path. Transfer only requested live presentation resources under original limits; output-only speech needs no microphone grant. Finally releases everything else; Stop, expiry, owner/source changes and deletion still invalidate results.",
        [
          [
            "",
            "done"
          ]
        ]
      ],
      [
        "control",
        "Handle a control event",
        "CALL controls",
        "Startup, permissions, memory operations, and personality changes are separated from the help pipeline.",
        [
          [
            "",
            "done"
          ]
        ],
        "controls"
      ],
      [
        "intent",
        "Identify the requested capability",
        "CALL capabilities",
        "Interpret the explicit request first. Typed mathematics and other internal tools do not acquire desktop context. The common cleanup contract applies to every exit.",
        [
          ["context required", "help"],
          ["internal result", "retain"],
          ["clarification or unavailable", "done"]
        ],
        "capabilities"
      ],
      [
        "contextMathCheck",
        "Internal tool needs this evidence?",
        "IF intent.has_registered_internal_result_kind",
        "Source-based mathematics, charts, code/text and requested annotations return to their typed internal handler after authorized extraction. Ordinary guidance continues to grounded explanation.",
        [["yes", "contextMath"], ["no", "resource"]]
      ],
      [
        "contextMath",
        "Use the requested evidence tool",
        "CALL capabilities(request, validated_evidence = bundle)",
        "Reuse resolved intent, owner and parent ledger; no repeated classification or recursive context acquisition. Preserve evidence revisions and sticky retention eligibility. CAP dispatches to CAL, CHART, MAKE or INK as applicable; ambiguous extracted input needs confirmation.",
        [["", "retain"]],
        "capabilities"
      ]
    ]
  },
  {
    "id": "presence",
    "prefix": "LIFE",
    "title": "01 Presence",
    "notes": "A visible companion is not permission to observe. Stay available without stealing focus. Help on request and explicitly enabled background observation are confirmed directions; operating defaults remain proposals.",
    "nodes": [
      [
        "launch",
        "Start EA",
        "session = new_session()",
        "Create a local session identifier, not a content-bearing analytics event.",
        [
          [
            "",
            "settings"
          ]
        ]
      ],
      [
        "settings",
        "Load local settings",
        "settings = read_settings()",
        "Use restrictive defaults when settings are absent. A corrupt policy cannot become allow-all.",
        [
          [
            "",
            "setupCheck"
          ]
        ]
      ],
      [
        "valid",
        "Settings valid?",
        "IF validate(settings)",
        "Validate types, permission values, paths, and resource limits before using them.",
        [
          [
            "yes",
            "platform"
          ],
          [
            "no",
            "restricted"
          ]
        ]
      ],
      [
        "restricted",
        "Use restrictive defaults",
        "settings = restrictive_defaults()",
        "Acquisition and retention begin disabled; user can repair settings explicitly.",
        [
          [
            "",
            "platform"
          ]
        ]
      ],
      [
        "platform",
        "Detect platform capabilities",
        "capabilities = CALL platforms",
        "Detect display server, accessibility interfaces, and compositor limitations.",
        [
          [
            "",
            "panel"
          ]
        ],
        "platforms"
      ],
      [
        "panel",
        "Create the companion panel",
        "panel = create_panel()",
        "Movable, resizable, reflowing, keyboard-accessible UI. No permanent focus grab.",
        [
          [
            "",
            "placement"
          ]
        ]
      ],
      [
        "placement",
        "Restore panel placement",
        "restore_clamped_geometry(panel)",
        "Keep it reachable after monitor removal or display-scale changes.",
        [
          [
            "",
            "foreground"
          ]
        ]
      ],
      [
        "foreground",
        "Foreground mode supported?",
        "IF capabilities.overlay",
        "Wayland compositors decide stacking and overlay protocols. Do not promise unconditional supremacy.",
        [
          [
            "yes",
            "overlay"
          ],
          [
            "no",
            "ordinary"
          ]
        ]
      ],
      [
        "overlay",
        "Request approved overlay mode",
        "request_overlay(panel)",
        "Use compositor-supported behavior while respecting locks, fullscreen policy, and user focus.",
        [
          [
            "",
            "idle"
          ]
        ]
      ],
      [
        "ordinary",
        "Use an ordinary window",
        "set_window_mode(panel)",
        "A pinned or normal accessible window is a valid fallback when overlay capability is absent.",
        [
          [
            "",
            "idle"
          ]
        ]
      ],
      [
        "idle",
        "Wait for an authorized event",
        "event = await event_queue.next()",
        "Serve explicit questions and events from a separately enabled bounded observer. Startup and policy reconciliation install only live scoped subscriptions; no screen polling follows merely from being visible.",
        [
          [
            "question",
            "question"
          ],
          [
            "pause",
            "pause"
          ],
          [
            "stop",
            "stop"
          ],
          [
            "exit",
            "exit"
          ],
          [
            "background",
            "background"
          ]
        ]
      ],
      [
        "question",
        "Start a help request",
        "CALL overview(question)",
        "Run the full request orchestrator, starting with intent classification. Typed mathematics does not read desktop sources. Do not start a second expensive worker while one is active; offer cancel or queue.",
        [
          [
            "",
            "idle"
          ]
        ],
        "overview"
      ],
      [
        "pause",
        "Pause acquisition",
        "CALL rules(pause = true)",
        "Pause differs from collection off: stop acquiring new source data, including active reads.",
        [
          [
            "",
            "idle"
          ]
        ],
        "rules"
      ],
      [
        "stop",
        "Cancel the active request",
        "cancel(active_request)",
        "Cancel pending reads and model output; no partial persistence after cancellation.",
        [
          [
            "",
            "idle"
          ]
        ]
      ],
      [
        "exit",
        "Release session resources",
        "release_session()",
        "Unload model, close handles, invalidate temporary context. Memory-only does not promise forensic erasure from swap.",
        []
      ],
      [
        "setupCheck",
        "Setup already completed?",
        "IF settings.setup_complete",
        "A new installation begins with explicit choices rather than silent observation.",
        [
          [
            "yes",
            "valid"
          ],
          [
            "no",
            "setup"
          ]
        ]
      ],
      [
        "setup",
        "Run the user-driven setup wizard",
        "CALL setup",
        "Configure EA itself; this does not enable external application execution.",
        [
          [
            "",
            "valid"
          ]
        ],
        "setup"
      ],
      [
        "background",
        "Dispatch an observer event",
        "CALL overview(event)",
        "The central event router selects Background Observation or separately authorized software-use history. This is not a user request and cannot borrow foreground privileges.",
        [["", "idle"]],
        "overview"
      ]
    ]
  },
  {
    "id": "request",
    "prefix": "ASK",
    "title": "02 Request & Scope",
    "notes": "Bound one question before reading. A broad question expands coverage within limits; it never grants whole-computer access.",
    "nodes": [
      [
        "receive",
        "Accept the question",
        "request = accept_user_text()",
        "Keep question text ephemeral until a separate retention policy permits storing it.",
        [
          [
            "",
            "busy"
          ]
        ]
      ],
      [
        "busy",
        "Another request active?",
        "IF worker.busy",
        "A single-worker design avoids accidental concurrent model loading on small machines.",
        [
          [
            "yes",
            "choose"
          ],
          [
            "no",
            "token"
          ]
        ]
      ],
      [
        "choose",
        "Ask for queue or cancel",
        "choice = ask_user()",
        "Never silently discard an active investigation or launch another heavy worker.",
        [
          [
            "queue",
            "queue"
          ],
          [
            "cancel old",
            "cancel"
          ],
          [
            "dismiss",
            "end"
          ]
        ]
      ],
      [
        "queue",
        "Queue a bounded request",
        "queue_one(request)",
        "Keep at most one pending question in temporary memory; additional input replaces only with consent.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "cancel",
        "Cancel the previous request",
        "cancel(active_request)",
        "Wait for cancellation acknowledgement before admitting another worker.",
        [
          [
            "",
            "token"
          ]
        ]
      ],
      [
        "token",
        "Create a cancellation token",
        "token = reuse_live_task_token_or_create_once()",
        "Every blocking operation honors this token and the existing deadline. Resuming a clarification reuses the controller-owned task lifecycle; it cannot renew limits.",
        [
          [
            "",
            "target"
          ]
        ]
      ],
      [
        "target",
        "Resolve the requested sources",
        "target = explicit_app_file_or_reviewed_search_roots()",
        "Resolve the selected app, document or approved search roots. Eligible conversation context can clarify the question but never grants new source access.",
        [
          [
            "",
            "known"
          ]
        ]
      ],
      [
        "known",
        "Target unambiguous?",
        "IF unique(target)",
        "Two similar windows or an unidentified remote desktop are not interchangeable.",
        [
          [
            "yes",
            "intent"
          ],
          [
            "no",
            "clarify"
          ]
        ]
      ],
      [
        "clarify",
        "Ask for the target",
        "target = bounded_clarification_under_existing_question_budget()",
        "Use TALK's explicit live response and nonrepeating round limit. Waiting acquires no new source content; choosing an answer does not grant broader access.",
        [
          [
            "chosen",
            "intent"
          ],
          [
            "cancel",
            "end"
          ]
        ]
      ],
      [
        "intent",
        "Classify question breadth",
        "breadth = narrow_or_broad(request)",
        "Specific goals need precise candidate controls; broad goals need discovered categories and coverage reporting.",
        [
          [
            "",
            "scope"
          ]
        ]
      ],
      [
        "scope",
        "Build a proposed scope",
        "scope = selected_app_files_or_reviewed_discovery_roots(target)",
        "Do not include unrelated windows, private tabs, home directories or the whole screen by default. SEEK details explicitly granted broad file discovery; this scope node itself performs no scan.",
        [
          [
            "",
            "limits"
          ]
        ],
        "computerSearch"
      ],
      [
        "limits",
        "Set inspection limits",
        "limits = tighten_existing_task_limits_with_defaults()",
        "Proposed menu limits: depth 4, 80 controls, 10 seconds per adapter. SEEK supplies separate search-pass caps. Existing parent deadlines/counters only shrink, including after clarification; calibrate through tests.",
        [
          [
            "",
            "authorize"
          ]
        ]
      ],
      [
        "authorize",
        "Request authorization",
        "permit = CALL policy(request, scope)",
        "Permissions are typed capabilities, not unrestricted tool access.",
        [
          [
            "allowed",
            "session"
          ],
          [
            "denied",
            "denied"
          ]
        ],
        "policy"
      ],
      [
        "session",
        "Create temporary task storage",
        "task = attach_ephemeral_context_to_existing_lifecycle(permit)",
        "Capture current policy and acquisition eligibility without renewing the task. Previously temporary-only source content stays ineligible; collection changes cannot upgrade it.",
        [
          [
            "",
            "dispatch"
          ]
        ]
      ],
      [
        "dispatch",
        "Choose the guidance workflow",
        "kind = classify_request_kind(request)",
        "Caller inspects evidence, retrieves approved memory, drafts, verifies, and cleans up.",
        [
          [
            "scan guidance",
            "scan"
          ],
          [
            "assemble references",
            "assembly"
          ],
          [
            "general help",
            "ready"
          ]
        ]
      ],
      [
        "denied",
        "Explain the denied scope",
        "show_denial(permit.reason)",
        "Offer user-provided text or a narrower permitted source; never bypass denial.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "End the request attempt",
        "RETURN no_task",
        "No observed content is retained by this path.",
        []
      ],
      [
        "scan",
        "Prepare scan guidance",
        "CALL scan",
        "The user runs any scanner. EA only reads permitted reports and explains documented controls.",
        [
          [
            "",
            "ready"
          ]
        ],
        "scan"
      ],
      [
        "assembly",
        "Assemble proposed work",
        "CALL assembly",
        "Bounded thorough reading can be continued explicitly; no external work is performed.",
        [
          [
            "",
            "ready"
          ]
        ],
        "assembly"
      ],
      [
        "ready",
        "Return the scoped guidance task",
        "RETURN task",
        "The common help pipeline validates evidence, answers, evaluates persistence and releases buffers. Linked details expand a desktop-to-website journey without granting navigation authority.",
        [],
        "journey"
      ]
    ]
  },
  {
    "id": "policy",
    "prefix": "AUTH",
    "title": "03 Authorization",
    "notes": "Deny wins. Acquisition, retention, recall, and export are separate decisions. Revalidate at each I/O boundary and before commit, not just at request start.",
    "nodes": [
      [
        "operation",
        "Identify the operation",
        "op = typed_capability(request)",
        "Only typed read/internal capabilities exist: UI, proposed verified reveal, selected files or reviewed local discovery, selected capture and own-memory operations. Metadata enumeration needs a grant; discovery does not add external execution.",
        [
          [
            "",
            "execute"
          ]
        ]
      ],
      [
        "execute",
        "Operation outside ZI registry?",
        "IF op NOT_IN approved_enabled_ZI_registry",
        "Deny unknown capabilities as well as external commands. The unresolved menu-reveal exception is absent in strict ZI. Every path also applies the Shared Operation Contract, including trusted owner/session checks.",
        [
          [
            "yes",
            "deny"
          ],
          [
            "no",
            "pause"
          ]
        ]
      ],
      [
        "pause",
        "Acquisition paused?",
        "IF op.acquires_source AND settings.pause_acquisition",
        "Pause stops new source reads; displaying already supplied chat text is not a new acquisition.",
        [
          [
            "yes",
            "deny"
          ],
          [
            "no",
            "denyRule"
          ]
        ]
      ],
      [
        "denyRule",
        "Deny rule matched?",
        "IF match_deny(scope)",
        "Protected fields, excluded apps, paths, and private contexts override all allow rules.",
        [
          [
            "yes",
            "deny"
          ],
          [
            "no",
            "approved"
          ]
        ]
      ],
      [
        "approved",
        "Source permission exists?",
        "IF source_grant_covers(scope)",
        "A request is not automatically permission for files or windows outside its stated scope.",
        [
          [
            "yes",
            "activation"
          ],
          [
            "no",
            "consent"
          ]
        ]
      ],
      [
        "consent",
        "Request scoped permission",
        "grant = foreground_permission_prompt_or_background_denial(scope)",
        "Foreground help can ask for a scoped grant. A background event with no grant is rejected quietly; no unsolicited permission prompt or prechecked broad access.",
        [
          [
            "granted",
            "activation"
          ],
          [
            "declined",
            "deny"
          ]
        ]
      ],
      [
        "mode",
        "Collection enabled?",
        "IF settings.collect",
        "Collection controls durable new observations. Background observation has its own independent opt-in; collection on alone cannot authorize acquisition.",
        [
          [
            "yes",
            "eligible"
          ],
          [
            "no",
            "explicit"
          ]
        ]
      ],
      [
        "explicit",
        "Temporary access authorized?",
        "IF request.user_initiated OR request.background_lease.live",
        "Collection off permits explicit help and separately opted-in bounded background context in RAM only. Live source and activation grants are still required.",
        [
          [
            "yes",
            "temporary"
          ],
          [
            "no",
            "deny"
          ]
        ]
      ],
      [
        "temporary",
        "Mark task temporary-only",
        "task.persist_eligible = false",
        "This flag cannot turn true later, even if collection is enabled before the answer finishes.",
        [
          [
            "",
            "generation"
          ]
        ]
      ],
      [
        "eligible",
        "Evaluate retention eligibility",
        "task.persist_eligible = sticky_capture_eligibility_intersect_current_retention(scope)",
        "Initialize eligibility only for a fresh acquisition. Reauthorization never upgrades collection-off observations; collection on alone does not permit every source type or raw screenshot.",
        [
          [
            "",
            "generation"
          ]
        ]
      ],
      [
        "generation",
        "Capture policy generation",
        "task.policy_generation = policy.generation",
        "Readers and writers compare this generation after awaits and under the persistence transaction lock.",
        [
          [
            "",
            "recall"
          ]
        ]
      ],
      [
        "recall",
        "Evaluate recall permission",
        "task.recall_allowed = recall_rule(scope)",
        "Collection off does not erase existing knowledge, but recall remains independently disableable.",
        [
          [
            "",
            "reveal"
          ]
        ]
      ],
      [
        "reveal",
        "Menu reveal requested?",
        "IF op == REVEAL_VERIFIED_MENU_CONTAINER",
        "This branch is unreachable in strict ZI. Only an explicitly approved pre-freeze exception and a live reveal grant can enable it; a verified adapter alone is not consent.",
        [
          [
            "yes",
            "contract"
          ],
          [
            "no",
            "allow"
          ]
        ]
      ],
      [
        "contract",
        "Reveal contract verified?",
        "IF live_reveal_grant_AND_adapter_matches_app_version_state()",
        "A role or action named open is insufficient. Verify adapter identity, target role, app version, and expected state.",
        [
          [
            "yes",
            "allow"
          ],
          [
            "no",
            "manual"
          ]
        ]
      ],
      [
        "manual",
        "Request manual menu opening",
        "RETURN user_must_reveal",
        "EA can continue reading after the user opens the menu; no exploratory unknown invocation.",
        []
      ],
      [
        "allow",
        "Return a bounded permit",
        "RETURN permit(task, scope, limits)",
        "The permit carries scope, capabilities, expiry, generation, and cancellation token.",
        []
      ],
      [
        "deny",
        "Return a denial",
        "RETURN denied(reason)",
        "No source acquisition or persistent observation occurs after denial.",
        []
      ],
      [
        "activation",
        "Acquisition trigger authorized?",
        "IF request.user_initiated OR live_background_lease_covers(op, scope)",
        "Check independently of collection, including when collection is on. Background leases require enabled scope, source types, purpose, lifetime, unlocked state, and passive-only operations.",
        [["yes", "mode"], ["no", "deny"]]
      ]
    ]
  },
  {
    "id": "catalog",
    "prefix": "APP",
    "title": "04 Software Catalog",
    "notes": "Remember software actually observed under consent. Installed inventory, inferred usage, and recorded usage are different facts.",
    "nodes": [
      [
        "event",
        "Receive an app event",
        "event = authorized_app_event()",
        "Only an enabled, bounded observer produces background usage events.",
        [
          [
            "",
            "enabled"
          ]
        ]
      ],
      [
        "enabled",
        "Usage history authorized?",
        "IF policy.background.enabled AND policy.collect AND policy.remember_software_usage",
        "Usage history needs all three controls plus a live scoped observation lease. Recheck queued events; no background subscription exists when observation is off.",
        [
          [
            "yes",
            "paused"
          ],
          [
            "no",
            "discard"
          ]
        ]
      ],
      [
        "paused",
        "Acquisition paused?",
        "IF policy.pause_acquisition",
        "Pausing cancels subscriptions and drains queued acquisition events.",
        [
          [
            "yes",
            "discard"
          ],
          [
            "no",
            "allowed"
          ]
        ]
      ],
      [
        "allowed",
        "App allowed?",
        "IF policy.permits(event.app)",
        "App IDs can be excluded; private browser contexts cannot be recorded through a generic browser exception.",
        [
          [
            "yes",
            "identify"
          ],
          [
            "no",
            "discard"
          ]
        ]
      ],
      [
        "identify",
        "Resolve a stable app ID",
        "app_id = adapter.application_identity(event)",
        "Prefer verified package/app identifiers over titles that may contain document names or secrets.",
        [
          [
            "",
            "version"
          ]
        ]
      ],
      [
        "version",
        "Read the app version",
        "version = allowed_version_source(app_id)",
        "Do not run arbitrary binaries to discover versions. Unknown is a valid value.",
        [
          [
            "",
            "minimal"
          ]
        ]
      ],
      [
        "minimal",
        "Create a minimal usage fact",
        "fact = {app_id, version, observed_at}",
        "No window title, document name, keystroke, or screenshot is required for usage history.",
        [
          [
            "",
            "dedup"
          ]
        ]
      ],
      [
        "dedup",
        "Duplicate recent event?",
        "IF recent_same_app_version(fact)",
        "Coalesce repeated focus changes in a bounded time window.",
        [
          [
            "yes",
            "discard"
          ],
          [
            "no",
            "retain"
          ]
        ]
      ],
      [
        "retain",
        "Request durable storage",
        "CALL retain(fact)",
        "Storage uses the same policy transaction gate as other knowledge, including revocation checks.",
        [
          [
            "",
            "end"
          ]
        ],
        "retain"
      ],
      [
        "discard",
        "Discard the event",
        "drop(event)",
        "No telemetry log or content-bearing diagnostic may secretly retain the rejected event.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return to event wait",
        "RETURN",
        "History starts when permitted; EA cannot truthfully reconstruct all past software use.",
        []
      ]
    ]
  },
  {
    "id": "ui",
    "prefix": "UI",
    "title": "05 Interface Reading",
    "notes": "Prefer structured accessibility evidence. Reading does not require activation. Unsupported or hidden controls are gaps, not invitations to guess.",
    "nodes": [
      [
        "start",
        "Validate the permit",
        "check_live_permit(task)",
        "All adapter calls share cancellation, deadline, policy generation, and scope checks.",
        [
          [
            "",
            "bind"
          ]
        ]
      ],
      [
        "bind",
        "Bind to the selected window",
        "window = adapter.bind(task.target)",
        "Keep process/window identity stable; focus changes must not redirect inspection to another app.",
        [
          [
            "",
            "same"
          ]
        ]
      ],
      [
        "same",
        "Window identity unchanged?",
        "IF window.matches(task.target)",
        "Detect closed windows, recycled handles, and a different foreground app.",
        [
          [
            "yes",
            "tree"
          ],
          [
            "no",
            "abort"
          ]
        ]
      ],
      [
        "tree",
        "Read the accessibility tree",
        "tree = protection_filtered_bounded_atspi_read(window)",
        "Enforce protected-source exclusions before acquiring fields. If the adapter cannot enforce them, return a gap. Read names, roles, states, bounds and hierarchy without invoking actions; later filtering is defense in depth.",
        [
          [
            "",
            "available"
          ]
        ]
      ],
      [
        "available",
        "Readable controls found?",
        "IF tree.has_evidence",
        "An empty tree can mean unsupported rendering, not an absence of controls.",
        [
          [
            "yes",
            "filter"
          ],
          [
            "no",
            "fallback"
          ]
        ]
      ],
      [
        "filter",
        "Exclude protected fields",
        "tree = remove_protected_nodes(tree)",
        "Drop password fields and denied source regions before they enter caches or prompts.",
        [
          [
            "",
            "normalize"
          ]
        ]
      ],
      [
        "normalize",
        "Normalize control paths",
        "controls = normalize_paths(tree)",
        "Attach app/version/window identity, accessible role, exact label, bounds, and observation time.",
        [
          [
            "",
            "labels"
          ]
        ]
      ],
      [
        "labels",
        "Collect permitted tooltips",
        "tooltips = passive_tooltip_evidence(controls)",
        "Only already available tooltip text or a tested reveal behavior is allowed; hover itself may have effects.",
        [
          [
            "",
            "menus"
          ]
        ]
      ],
      [
        "menus",
        "More menu evidence needed?",
        "IF request.needs_menu_coverage",
        "Broad questions explore relevant branches within limits; narrow questions still verify the control's action meaning.",
        [
          [
            "yes",
            "explore"
          ],
          [
            "no",
            "files"
          ]
        ]
      ],
      [
        "explore",
        "Inspect menu branches",
        "menu_evidence = CALL menus",
        "Submenu exploration has separate reveal, cycle detection, depth, time, and interruption checks.",
        [
          [
            "",
            "files"
          ]
        ],
        "menus"
      ],
      [
        "files",
        "Selected file available?",
        "IF task.selected_file",
        "A user-selected log or documentation file is additional evidence, not permission to crawl its siblings.",
        [
          [
            "yes",
            "readFile"
          ],
          [
            "no",
            "return"
          ]
        ]
      ],
      [
        "readFile",
        "Read the selected file",
        "file_evidence = CALL files",
        "Bound bytes and parsing; report truncation or changed content.",
        [
          [
            "",
            "return"
          ]
        ],
        "files"
      ],
      [
        "fallback",
        "Capture explicitly permitted?",
        "IF task.capture_grant",
        "No silent full-screen screenshot fallback when accessibility is unavailable.",
        [
          [
            "yes",
            "capture"
          ],
          [
            "no",
            "gap"
          ]
        ]
      ],
      [
        "capture",
        "Read a selected visual region",
        "visual_evidence = CALL capture",
        "OCR is a fallible evidence source. Keep raw visual data temporary by default.",
        [
          [
            "",
            "files"
          ]
        ],
        "capture"
      ],
      [
        "gap",
        "Record an unreadable source",
        "gaps.add(window, reason)",
        "Coverage reporting must distinguish unreadable, not inspected, denied, and not found.",
        [
          [
            "",
            "files"
          ]
        ]
      ],
      [
        "return",
        "Package interface evidence",
        "result = evidence_with_gaps",
        "All sources remain untrusted data; their text cannot issue tool instructions.",
        [
          [
            "",
            "linkCheck"
          ]
        ]
      ],
      [
        "abort",
        "Cancel stale inspection",
        "RETURN target_changed",
        "Ask the user to select the intended target again.",
        []
      ],
      [
        "linkCheck",
        "Link review requested?",
        "IF request.is_link_review",
        "No browsing or reputation upload is implied by displaying a URL.",
        [
          [
            "yes",
            "linkReview"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "linkReview",
        "Review the observed link",
        "CALL links",
        "Only static, local analysis in ZI; unknown remains a valid verdict.",
        [
          [
            "",
            "end"
          ]
        ],
        "links"
      ],
      [
        "end",
        "Return current evidence",
        "RETURN result",
        "Sources are untrusted input and cannot grant new capabilities.",
        []
      ]
    ]
  },
  {
    "id": "menus",
    "prefix": "MENU",
    "title": "06 Menus & Submenus",
    "notes": "Strict ZI reads exposed menus; the user opens hidden ones. The reveal branch is an unresolved, off-by-default pre-freeze exception requiring registry approval, separate consent and a tested adapter. Never activate a discovered command.",
    "nodes": [
      [
        "roots",
        "Queue relevant menu roots",
        "queue = bounded_menu_frontier(relevant_roots(task.breadth), parent.ledger)",
        "Use the actual permitted UI. Root enumeration, queue, seen identities and gaps share parent node/byte/time/depth limits. Broad questions cover discovered relevant roots within those limits; truncation remains explicit.",
        [
          [
            "",
            "remaining"
          ]
        ]
      ],
      [
        "remaining",
        "Branches remaining?",
        "IF queue.not_empty()",
        "The queue is bounded and contains only the selected app's permitted containers.",
        [
          [
            "yes",
            "budget"
          ],
          [
            "no",
            "return"
          ]
        ]
      ],
      [
        "budget",
        "Inspection budget exhausted?",
        "IF limits.exhausted()",
        "Stop on time, node count, or depth budget. Report remaining branches explicitly.",
        [
          [
            "yes",
            "limit"
          ],
          [
            "no",
            "next"
          ]
        ]
      ],
      [
        "next",
        "Take the next branch",
        "branch = debit_menu_visit_before_pop(queue, parent.ledger)",
        "Charge a visit even for duplicate, malformed or subsequently denied branches. Breadth-first traversal gives broad questions useful coverage before deep specialization.",
        [
          [
            "",
            "seen"
          ]
        ]
      ],
      [
        "seen",
        "Branch already visited?",
        "IF visited.contains(branch.stable_path)",
        "Track stable app/window/path identities to break loops and repeated submenus.",
        [
          [
            "yes",
            "remaining"
          ],
          [
            "no",
            "mark"
          ]
        ]
      ],
      [
        "mark",
        "Mark the branch visited",
        "bounded_menu_seen_set.add(branch.stable_path)",
        "Charge bounded temporary bytes and mark before reads or reveal authorization. Exhaustion returns a coverage limit, never unbounded bookkeeping.",
        [
          [
            "",
            "open"
          ]
        ]
      ],
      [
        "open",
        "Container already open?",
        "IF branch.state.expanded",
        "Passive reading of an already-open container requires no reveal action.",
        [
          [
            "yes",
            "read"
          ],
          [
            "no",
            "contract"
          ]
        ]
      ],
      [
        "contract",
        "Reveal contract matches?",
        "IF adapter.verified_reveal(branch)",
        "Require known app, version, role, state, and a tested container-only operation. Generic click is never the fallback.",
        [
          [
            "yes",
            "permit"
          ],
          [
            "no",
            "ask"
          ]
        ]
      ],
      [
        "ask",
        "Ask the user to open it",
        "response = request_manual_reveal(branch)",
        "Keep the exact observed label/path in the request. A declined reveal is a coverage gap.",
        [
          [
            "opened",
            "read"
          ],
          [
            "skip",
            "gap"
          ],
          [
            "cancel",
            "cancel"
          ]
        ]
      ],
      [
        "permit",
        "Revalidate reveal permission",
        "permit = authorize(REVEAL_VERIFIED_MENU_CONTAINER, branch)",
        "Policy, target identity, and cancellation can change while a menu is queued.",
        [
          [
            "allowed",
            "reveal"
          ],
          [
            "denied",
            "gap"
          ]
        ]
      ],
      [
        "reveal",
        "Reveal the container",
        "adapter.reveal_only(branch, permit)",
        "Only the tested operation is exposed. It cannot select an action item or fall back to arbitrary coordinates.",
        [
          [
            "",
            "wait"
          ]
        ]
      ],
      [
        "wait",
        "Await the expansion event",
        "result = await bounded_expansion(branch)",
        "Use an event or short bounded wait, not unbounded polling.",
        [
          [
            "expanded",
            "read"
          ],
          [
            "timeout",
            "gap"
          ],
          [
            "target changed",
            "cancel"
          ]
        ]
      ],
      [
        "read",
        "Read exposed children",
        "children = bounded_read(branch)",
        "Read labels, roles, checked/enabled states, tooltips, bounds, and parent paths without invoking children.",
        [
          [
            "",
            "filter"
          ]
        ]
      ],
      [
        "filter",
        "Filter denied children",
        "children = policy.filter(children)",
        "Private/protected data remains excluded even within an allowed menu.",
        [
          [
            "",
            "record"
          ]
        ]
      ],
      [
        "record",
        "Record control evidence",
        "evidence.add(children)",
        "Record exact text and provenance. A label identifies a control; documentation establishes its semantics.",
        [
          [
            "",
            "enqueue"
          ]
        ]
      ],
      [
        "enqueue",
        "Queue child containers",
        "queue.append_within_remaining_queue_and_byte_caps(children)",
        "Filter relevant unvisited containers, then apply depth, total-node and byte caps before enqueue. Omitted branches remain bounded policy-filtered gaps; never enqueue command activation.",
        [
          [
            "",
            "remaining"
          ]
        ]
      ],
      [
        "gap",
        "Record a skipped branch",
        "gaps.add(branch, reason)",
        "Differentiate denied, unknown reveal, unsupported, declined, and timeout.",
        [
          [
            "",
            "remaining"
          ]
        ]
      ],
      [
        "limit",
        "Record unfinished branches",
        "gaps.add(queue, 'budget reached')",
        "A bounded search cannot be advertised as complete.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "return",
        "Return the menu map",
        "RETURN {evidence, gaps, visited}",
        "Paths such as File > Export are evidence for explanation. The user performs any actual command.",
        []
      ],
      [
        "cancel",
        "Abort menu exploration",
        "RETURN cancelled",
        "Do not issue cleanup clicks or Escape to an unrelated/stale window. Release EA-owned overlays only.",
        []
      ]
    ]
  },
  {
    "id": "files",
    "prefix": "FILE",
    "title": "07 File Reading",
    "notes": "Read selected files or admitted discovery candidates without executing content. A thorough caller may advance bounded chunks under one shared ledger. User files are never modified; parser isolation and resource limits are future implementation contracts.",
    "nodes": [
      [
        "selected",
        "Accept a selected path",
        "path = user_selected_or_authorized_search_candidate_path()",
        "Accept an individually selected file or a candidate from a live scoped computer-search pass. A directory grant still requires traversal, source-byte and deadline bounds.",
        [
          [
            "",
            "resolve"
          ]
        ]
      ],
      [
        "resolve",
        "Resolve the path identity",
        "identity = canonical_file_identity(path)",
        "Resolve symlinks and record device/inode or platform-equivalent identity before evaluating scope.",
        [
          [
            "",
            "allowed"
          ]
        ]
      ],
      [
        "allowed",
        "Resolved path allowed?",
        "IF policy.path_allowed(identity)",
        "Reject escapes outside an approved root, excluded files, protected paths, and unknown grants.",
        [
          [
            "yes",
            "regular"
          ],
          [
            "no",
            "deny"
          ]
        ]
      ],
      [
        "regular",
        "Regular file?",
        "IF identity.is_regular_file",
        "Do not read devices, sockets, FIFOs, or process-memory pseudo-files through a generic file reader.",
        [
          [
            "yes",
            "open"
          ],
          [
            "no",
            "unsupported"
          ]
        ]
      ],
      [
        "open",
        "Open a read-only handle",
        "handle = safe_open_readonly(identity)",
        "Use no-follow/handle-based validation where supported; do not rely only on a string prefix check.",
        [
          [
            "",
            "recheck"
          ]
        ]
      ],
      [
        "recheck",
        "Handle identity matches?",
        "IF fstat(handle).matches(identity)",
        "Mitigate symlink and replacement races before reading.",
        [
          [
            "yes",
            "type"
          ],
          [
            "no",
            "changed"
          ]
        ]
      ],
      [
        "type",
        "Supported content type?",
        "IF bounded_type_probe(handle)",
        "Initial text/log/docs support excludes executable macros, scripts, active document content, and automatic archive expansion.",
        [
          [
            "yes",
            "read"
          ],
          [
            "no",
            "unsupported"
          ]
        ]
      ],
      [
        "read",
        "Read a bounded chunk",
        "chunk = read_at_most(handle, min(256_KiB, caller.remaining_bytes), caller.offset)",
        "256 KiB is the proposed chunk and ordinary first-pass cap. An explicitly thorough caller may advance the offset under the same finite search/task ledger; unvisited ranges stay gaps. Chunks never renew time, byte or RAM limits.",
        [
          [
            "",
            "redact"
          ]
        ]
      ],
      [
        "redact",
        "Remove identified secrets",
        "chunk = redact_protected_patterns(chunk)",
        "Redaction is defense in depth, not proof that every secret is detectable. Exclusion rules remain primary.",
        [
          [
            "",
            "decode"
          ]
        ]
      ],
      [
        "decode",
        "Decode text safely",
        "text = bounded_decode(chunk)",
        "Decode errors become uncertainty. No eval, shell interpolation, macro execution, or external resource fetching.",
        [
          [
            "",
            "unchanged"
          ]
        ]
      ],
      [
        "unchanged",
        "File unchanged during read?",
        "IF same_metadata(handle)",
        "Check handle identity/size/mtime where useful; hash the read bytes for provenance, not the entire disk.",
        [
          [
            "yes",
            "cite"
          ],
          [
            "no",
            "changed"
          ]
        ]
      ],
      [
        "cite",
        "Attach file provenance",
        "source = {identity, byte_range, digest, observed_at}",
        "Citations identify exactly what was read. A truncated file must not be described as fully inspected.",
        [
          [
            "",
            "close"
          ]
        ]
      ],
      [
        "changed",
        "Record a changed source",
        "result = stale_source()",
        "Offer a fresh bounded read under current permissions; never silently mix versions.",
        [
          [
            "",
            "close"
          ]
        ]
      ],
      [
        "unsupported",
        "Record an unsupported source",
        "result = unsupported_type()",
        "User can supply a safe text extract. Do not install a converter or invoke an external application automatically.",
        [
          [
            "",
            "close"
          ]
        ]
      ],
      [
        "deny",
        "Return a denied source",
        "RETURN denied_path",
        "No content read occurs.",
        []
      ],
      [
        "close",
        "Close the file handle",
        "close_if_open(handle)",
        "Also executed on cancellation, parser error, permission revocation, and timeout by the common finally contract.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "return",
        "Return file evidence",
        "RETURN result_or_source",
        "Retention is evaluated separately; collection-off reads remain temporary.",
        []
      ]
    ]
  },
  {
    "id": "capture",
    "prefix": "VIS",
    "title": "08 Capture & OCR",
    "notes": "Requested bounded capture/OCR under separate consent, not continuous surveillance. Missing protection, permission or resources yields an honest gap. Every included visual capability still needs positive 4 GB tests; a transcription fallback does not establish feature support.",
    "nodes": [
      [
        "consent",
        "Request a selected capture",
        "grant = ask_capture_region()",
        "Prefer one chosen window or crop through the platform permission mechanism.",
        [
          [
            "granted",
            "protected"
          ],
          [
            "declined",
            "denied"
          ]
        ]
      ],
      [
        "protected",
        "Capture exclusion unavailable?",
        "IF protected_region_OR_exclusions_cannot_be_enforced_before_capture(grant)",
        "Skip protected or uncertain-isolation captures before reading pixels. Post-capture redaction and imperfect classifiers are not substitutes for enforcing the selected source boundary.",
        [
          [
            "yes",
            "denied"
          ],
          [
            "no",
            "budget"
          ]
        ]
      ],
      [
        "budget",
        "Capture headroom available?",
        "IF resource_guard.allows_capture()",
        "Full-resolution buffers can be expensive. Enforce image dimensions and bytes independently of model size.",
        [
          [
            "yes",
            "capture"
          ],
          [
            "no",
            "manual"
          ]
        ]
      ],
      [
        "capture",
        "Acquire one image",
        "image = portal.capture_once(grant)",
        "No periodic screenshots. Check policy before and after acquisition; reject out-of-scope capture results.",
        [
          [
            "",
            "crop"
          ]
        ]
      ],
      [
        "crop",
        "Bound image dimensions",
        "image = bounded_crop(image, grant)",
        "Keep only the requested region; release the original buffer immediately after successful cropping.",
        [
          [
            "",
            "ocr"
          ]
        ]
      ],
      [
        "ocr",
        "Run bounded OCR",
        "tokens = local_ocr(image)",
        "A local OCR engine is a separate optional worker; never co-load it with a vision model by default.",
        [
          [
            "",
            "confidence"
          ]
        ]
      ],
      [
        "confidence",
        "OCR confidence sufficient?",
        "IF tokens.pass_threshold",
        "The threshold must be measured on real menus/fonts; confidence does not guarantee semantic correctness.",
        [
          [
            "yes",
            "anchor"
          ],
          [
            "no",
            "manual"
          ]
        ]
      ],
      [
        "anchor",
        "Attach pixel provenance",
        "evidence = token_boxes_with_capture_id(tokens)",
        "Preserve crop origin, scale, timestamp, and window identity so highlights can later be revalidated.",
        [
          [
            "",
            "unknown"
          ]
        ]
      ],
      [
        "unknown",
        "Unlabeled icon unresolved?",
        "IF relevant_icon_has_no_label",
        "Color and shape alone cannot establish the command's purpose.",
        [
          [
            "yes",
            "uncertain"
          ],
          [
            "no",
            "release"
          ]
        ]
      ],
      [
        "uncertain",
        "Mark icon meaning unknown",
        "evidence.add_unknown_icon()",
        "For two red slashes, report appearance only until an accessible name, tooltip, or documentation supplies meaning.",
        [
          [
            "",
            "release"
          ]
        ]
      ],
      [
        "manual",
        "Request user-supplied text",
        "result = ask_for_label_or_smaller_crop()",
        "Do not hallucinate unreadable text when resources or OCR quality are insufficient.",
        [
          [
            "",
            "release"
          ]
        ]
      ],
      [
        "release",
        "Release image buffers",
        "release(image)",
        "Raw screenshots are temporary unless a separate explicit raw-image retention rule permits storage.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "denied",
        "Return without capture",
        "RETURN denied",
        "No fallback full-screen image is taken.",
        []
      ],
      [
        "return",
        "Return visual evidence",
        "RETURN evidence_or_gap",
        "OCR evidence carries uncertainty and can be rejected during answer validation.",
        []
      ]
    ]
  },
  {
    "id": "recall",
    "prefix": "FIND",
    "title": "09 Knowledge Retrieval",
    "notes": "Start with SQLite metadata and full-text search. A vector index is optional, derived, deletable, and justified by measured retrieval failures.",
    "nodes": [
      [
        "policy",
        "Recall enabled?",
        "IF task.recall_allowed",
        "This is independent of collection. Turning collection off need not delete existing memory.",
        [
          [
            "yes",
            "query"
          ],
          [
            "no",
            "empty"
          ]
        ]
      ],
      [
        "query",
        "Build a scoped query",
        "query = terms(request, app_id, version)",
        "Use the current question and app context. Do not search unrelated private app histories by default.",
        [
          [
            "",
            "cache"
          ]
        ]
      ],
      [
        "cache",
        "Valid temporary cache hit?",
        "IF scoped_cache_matches_full_key_and_current_authority(query)",
        "Use the Temporary Cache contract: owner/session, operation/inputs/provider/schema, source identity/revision, scope, policy/data generations and expiry. Never access another owner's entry before filtering.",
        [
          [
            "yes",
            "cached"
          ],
          [
            "no",
            "search"
          ]
        ]
      ],
      [
        "cached",
        "Load the temporary result",
        "candidates = cache.get(query)",
        "Use an owner-bound live handle. Cache reads/reinsertions cannot extend original evidence/source expiry; global and aggregate task byte reservations include metadata and live consumers. Eviction frees only unreferenced bytes. No disk prompt cache or content logs.",
        [
          [
            "",
            "filter"
          ]
        ]
      ],
      [
        "search",
        "Search local full text",
        "candidates = authorized_owner_scoped_sqlite_fts(query)",
        "Search only the authenticated owner's eligible namespace, filtering tombstones and source rules inside the query boundary. A later result filter is defense in depth, not access isolation.",
        [
          [
            "",
            "enough"
          ]
        ]
      ],
      [
        "enough",
        "Recall coverage sufficient?",
        "IF candidates.coverage_sufficient",
        "Broad queries require category coverage; a single top match does not establish completeness.",
        [
          [
            "yes",
            "filter"
          ],
          [
            "no",
            "semantic"
          ]
        ]
      ],
      [
        "semantic",
        "Semantic retrieval enabled?",
        "IF settings.semantic_retrieval",
        "Predeclared F-30, off by default. Decide inclusion before freeze; require measured retrieval benefit and positive 4 GB tests.",
        [
          [
            "yes",
            "budget"
          ],
          [
            "no",
            "filter"
          ]
        ]
      ],
      [
        "budget",
        "Embedding headroom available?",
        "IF resource_guard.allows_embedding()",
        "Avoid concurrent embedding and answer models on small systems.",
        [
          [
            "yes",
            "vector"
          ],
          [
            "no",
            "filter"
          ]
        ]
      ],
      [
        "vector",
        "Search a scoped vector index",
        "candidates += vector_search(query)",
        "Vectors refer to durable record IDs; they do not replace provenance or deletion rules.",
        [
          [
            "",
            "filter"
          ]
        ]
      ],
      [
        "filter",
        "Filter inaccessible records",
        "candidates = current_policy_filter(candidates)",
        "Exclude tombstones, expiry, denied apps/paths, deleted sources, and obsolete policy eligibility.",
        [
          [
            "",
            "stale"
          ]
        ]
      ],
      [
        "stale",
        "Check source freshness",
        "candidates = annotate_staleness(candidates)",
        "Version mismatch downgrades or excludes a fact; historical memory cannot assert the current UI label.",
        [
          [
            "",
            "rank"
          ]
        ]
      ],
      [
        "rank",
        "Rank matching evidence",
        "ranked = provenance_aware_rank(candidates)",
        "Prefer fresh direct evidence and user-verified facts over generated summaries or uncertain OCR.",
        [
          [
            "",
            "dedup"
          ]
        ]
      ],
      [
        "dedup",
        "Deduplicate source claims",
        "ranked = deduplicate_by_provenance(ranked)",
        "Repeated copies of the same claim are not independent corroboration.",
        [
          [
            "",
            "pack"
          ]
        ]
      ],
      [
        "pack",
        "Bound retrieved context",
        "context = token_budgeted_selection(ranked)",
        "Reserve room for the question, system rules, and answer. Report omitted categories for broad questions.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "empty",
        "Return no recalled memory",
        "RETURN []",
        "Continue using explicitly supplied or permitted current evidence.",
        []
      ],
      [
        "return",
        "Return cited memories",
        "RETURN context",
        "Recheck record validity before answer publication to catch concurrent deletion or policy revocation.",
        []
      ]
    ]
  },
  {
    "id": "evidence",
    "prefix": "FACT",
    "title": "10 Evidence & Meaning",
    "notes": "Observed text is data, never an instruction. Labels, visual appearance, and action semantics are separate evidence types.",
    "nodes": [
      [
        "collect",
        "Collect source records",
        "records = current_evidence + permitted_memories",
        "Keep origin IDs intact rather than flattening everything into an uncited paragraph.",
        [
          [
            "",
            "policy"
          ]
        ]
      ],
      [
        "policy",
        "Apply current source policy",
        "records = filter_currently_allowed(records)",
        "Revocation and deletion can occur after retrieval. Drop affected records from prompts and pending answers.",
        [
          [
            "",
            "normalize"
          ]
        ]
      ],
      [
        "normalize",
        "Normalize evidence fields",
        "records = normalize_schema(records)",
        "Each record has source kind, app/version, observed time, literal content, confidence, and optional bounds.",
        [
          [
            "",
            "trust"
          ]
        ]
      ],
      [
        "trust",
        "Mark external content untrusted",
        "records = mark_as_data(records)",
        "A log saying ignore instructions or run this command cannot grant a capability or alter policy.",
        [
          [
            "",
            "intent"
          ]
        ]
      ],
      [
        "intent",
        "Resolve the requested action",
        "goal = normalize_user_goal(request)",
        "Distinguish stop, pause, cancel, resume, and start. Ask when the user's intended effect is ambiguous.",
        [
          [
            "",
            "match"
          ]
        ]
      ],
      [
        "match",
        "Match candidate controls",
        "candidates = exact_matches_plus_enabled_admitted_semantic_matches(goal, records)",
        "A visual icon match is only a candidate, not proof of behavior.",
        [
          [
            "",
            "semantics"
          ]
        ]
      ],
      [
        "semantics",
        "Action meaning supported?",
        "IF relevant_semantics_have_sources(candidates)",
        "For Begin requisition flow, the word Begin does not support a claim that it stops the flow.",
        [
          [
            "yes",
            "conflict"
          ],
          [
            "no",
            "unknown"
          ]
        ]
      ],
      [
        "unknown",
        "Record semantic uncertainty",
        "gaps.add('action meaning unverified')",
        "Use documentation or user-visible tooltips already in scope; otherwise say the meaning is unknown.",
        [
          [
            "",
            "coverage"
          ]
        ]
      ],
      [
        "conflict",
        "Sources conflict?",
        "IF contradictory_claims(candidates)",
        "Current UI, versioned docs, and older memories may disagree.",
        [
          [
            "yes",
            "separate"
          ],
          [
            "no",
            "coverage"
          ]
        ]
      ],
      [
        "separate",
        "Keep conflicting claims distinct",
        "claims = preserve_alternatives_with_sources()",
        "Do not blend contradictions into a confident fabricated answer.",
        [
          [
            "",
            "coverage"
          ]
        ]
      ],
      [
        "coverage",
        "Build a coverage ledger",
        "coverage = inspected_denied_unreadable_unfinished()",
        "Track which app branches and source types were actually examined. R-02 links each claim, hypothesis and reported result to a source revision; no invented completion or confidence percentage.",
        [
          [
            "",
            "broad"
          ]
        ],
        "casework"
      ],
      [
        "broad",
        "Broad question?",
        "IF task.breadth == BROAD",
        "The output contract changes, not the permission boundary.",
        [
          [
            "yes",
            "categories"
          ],
          [
            "no",
            "specific"
          ]
        ]
      ],
      [
        "categories",
        "Group discovered capabilities",
        "claims = group_by_supported_operation()",
        "List every discovered relevant category within budget; flag truncated or unreadable categories.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "specific",
        "Select supported goal matches",
        "claims = goal_matches_with_evidence()",
        "A specific answer can contain multiple relevant controls when they have different effects.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "return",
        "Return the evidence bundle",
        "RETURN {claims, sources, conflicts, coverage}",
        "The model can summarize this bundle; it cannot invent controls missing from it.",
        []
      ]
    ]
  },
  {
    "id": "resources",
    "prefix": "RAM",
    "title": "11 Resource Admission",
    "notes": "Every included ZI feature must work on 4 GB total system RAM. WORK details contract-preserving staged work before admission. Admission numbers are unbenchmarked proposals. Transient pressure may yield useful partial help, but refusal cannot replace positive feature tests.",
    "nodes": [
      [
        "measure",
        "Measure available memory",
        "available = os.available_memory()",
        "Use a platform adapter and current headroom, not total installed RAM or model file size.",
        [
          [
            "",
            "worker"
          ]
        ]
      ],
      [
        "worker",
        "Heavy worker active?",
        "IF heavy_worker.active",
        "One heavy inference, OCR, embedding, math, ASR or TTS stage at a time by default. Count renderer and coordinator overhead too.",
        [
          [
            "yes",
            "wait"
          ],
          [
            "no",
            "estimate"
          ]
        ]
      ],
      [
        "wait",
        "Wait for worker release",
        "result = bounded_wait_or_cancel()",
        "The UI stays responsive while queued. Do not block the desktop thread.",
        [
          [
            "ready",
            "measure"
          ],
          [
            "cancel",
            "fallback"
          ]
        ]
      ],
      [
        "estimate",
        "Estimate peak working memory",
        "estimate = measured_incremental_peak_and_total_EA_peak(job)",
        "WORK details selection of a contract-preserving stage profile before admission, not a second invocation. Include prompt processing, KV/context/output, OCR/math/voice, renderer, mapped pages, loader peaks and cross-stage buffers. Serial stages must actually release residency.",
        [
          [
            "",
            "reserve"
          ]
        ],
        "workingSet"
      ],
      [
        "reserve",
        "Reserve desktop headroom",
        "reserve = max(reviewed_reserve, os_safety_margin)",
        "Initial proposal is 512 MiB, subject to whole-system measurement and workload approval. A busy desktop may need more. Do not claim universal OOM prevention.",
        [
          [
            "",
            "fits"
          ]
        ]
      ],
      [
        "fits",
        "Estimated peak fits?",
        "IF total_EA_peak_plus_margin <= ceiling AND incremental_peak_plus_margin <= available - reserve",
        "Check the EA ceiling and incremental system demand separately. Available RAM already accounts for resident EA; do not subtract it twice. Quantized file size is not sufficient to pass this check.",
        [
          [
            "yes",
            "limits"
          ],
          [
            "no",
            "fallback"
          ]
        ]
      ],
      [
        "limits",
        "Configure explicit runtime limits",
        "config = tested_supervisor_enforcement_config_or_unavailable()",
        "R-05: protection availability is a precondition for launch. Proposed trial: 2048 context tokens, 512 output tokens, one heavy stage, no disk prompt cache. Needed evidence cannot be silently truncated. The detailed supervisor contract governs every internal worker.",
        [
          [
            "",
            "spawn"
          ]
        ],
        "resourceGuard"
      ],
      [
        "spawn",
        "Start an isolated local worker",
        "worker = spawn_local_worker(config)",
        "A supervised subprocess can be stopped without crashing the panel. No network endpoint is exposed by default.",
        [
          [
            "",
            "monitor"
          ]
        ]
      ],
      [
        "monitor",
        "Monitor actual worker usage",
        "sample = memory_pressure_and_rss(worker)",
        "RSS alone misses system pressure. Track both worker use and OS available memory during prefill and generation.",
        [
          [
            "",
            "pressure"
          ]
        ]
      ],
      [
        "pressure",
        "Memory pressure excessive?",
        "IF pressure_threshold_exceeded(sample)",
        "Use configurable bounded thresholds measured on target hardware; include a timeout.",
        [
          [
            "yes",
            "terminate"
          ],
          [
            "no",
            "grant"
          ]
        ]
      ],
      [
        "grant",
        "Return an admitted worker",
        "RETURN worker_lease",
        "The monitor remains active while the caller uses the worker; release the lease after the request.",
        []
      ],
      [
        "terminate",
        "Terminate the heavy worker",
        "terminate_worker(worker)",
        "Cancel pending outputs first. A cgroup limit, where available, confines failure to the worker.",
        [
          [
            "",
            "fallback"
          ]
        ]
      ],
      [
        "fallback",
        "Use evidence-only help",
        "RETURN template_mode",
        "Show exact observed controls, source excerpts, and gaps without pretending a local model ran.",
        []
      ]
    ]
  },
  {
    "id": "inference",
    "prefix": "LLM",
    "title": "12 Local Inference",
    "notes": "Candidate, not commitment: a small local model via llama.cpp with measured reasoning modes. R-01 requires independent output/reference checks; grammar validity does not prove truth. Select only after quality-first tests on a 4 GB machine.",
    "nodes": [
      [
        "bundle",
        "Accept an evidence bundle",
        "bundle = validated_evidence()",
        "The model is an explanation component, not an authority over permissions or actions.",
        [
          [
            "",
            "enough"
          ]
        ]
      ],
      [
        "enough",
        "Evidence sufficient to answer?",
        "IF bundle.supports_goal",
        "A larger model cannot fix an unobserved menu label or missing semantics.",
        [
          [
            "yes",
            "mode"
          ],
          [
            "no",
            "clarify"
          ]
        ]
      ],
      [
        "clarify",
        "Ask a grounded clarification",
        "RETURN missing_evidence_question(bundle.gaps)",
        "Name the missing source or ambiguous goal without making up a control.",
        []
      ],
      [
        "mode",
        "Model worker available?",
        "IF resource_lease.is_model",
        "The resource flow may intentionally return template mode.",
        [
          [
            "yes",
            "pack"
          ],
          [
            "no",
            "template"
          ]
        ]
      ],
      [
        "pack",
        "Build a bounded prompt",
        "prompt = pack_untrusted_evidence(bundle)",
        "Separate system rules from source text. Include source IDs and prohibit unsupported claims.",
        [
          [
            "",
            "count"
          ]
        ]
      ],
      [
        "count",
        "Count prompt tokens",
        "tokens = model_tokenizer.count(prompt)",
        "Use the actual tokenizer. Character counts alone cannot reliably enforce context limits.",
        [
          [
            "",
            "fits"
          ]
        ]
      ],
      [
        "fits",
        "Prompt fits context budget?",
        "IF tokens + output_reserve <= context_limit",
        "Never silently drop governing rules or provenance to make evidence fit.",
        [
          [
            "yes",
            "generate"
          ],
          [
            "no",
            "reduce"
          ]
        ]
      ],
      [
        "reduce",
        "Pack without losing required evidence",
        "bundle = contract_preserving_bounded_repacking(bundle)",
        "Drop only optional/redundant context, never required matches, exceptions or qualifiers. Debit the original finite stage budget and require shrinking input; if it cannot fit, return an explicit gap or already-budgeted staged result, not a falsely complete answer.",
        [
          [
            "reduced",
            "pack"
          ],
          [
            "cannot reduce",
            "template"
          ]
        ]
      ],
      [
        "generate",
        "Generate a local draft",
        "draft = worker.generate(prompt, output_limit)",
        "Compare supported reasoning modes under accuracy-first gates and a bounded deadline. Do not disable useful reasoning only for speed; no tool-execution interface.",
        [
          [
            "complete",
            "parse"
          ],
          [
            "failure",
            "template"
          ],
          [
            "cancel",
            "cancel"
          ]
        ]
      ],
      [
        "parse",
        "Parse a structured answer",
        "answer = independently_validate_bounded_schema_and_supplied_reference_IDs(draft)",
        "R-01: trusted local schema, no remote references, duplicate-key/size checks and inert rendering. Grammar constraints may be incomplete. The linked output contract refines this pipeline; do not generate a second answer when opening its details.",
        [
          [
            "valid",
            "validate"
          ],
          [
            "invalid",
            "template"
          ]
        ],
        "outputContract"
      ],
      [
        "validate",
        "Validate every claimed control",
        "valid = literal_controls_exist(answer, bundle)",
        "Reject invented names, paths, citations, and claims that a Begin control stops a process.",
        [
          [
            "yes",
            "return"
          ],
          [
            "no",
            "template"
          ]
        ]
      ],
      [
        "template",
        "Build a source-based answer",
        "answer = evidence_template(bundle)",
        "An exact label, path, and honest unknown can be more useful than a fluent unsupported paragraph.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "return",
        "Return the grounded draft",
        "RETURN answer",
        "Publication still revalidates policy, evidence freshness, and any highlight target.",
        []
      ],
      [
        "cancel",
        "Discard cancelled generation",
        "RETURN cancelled",
        "Do not publish partial output after cancellation or persist its input context.",
        []
      ]
    ]
  },
  {
    "id": "answer",
    "prefix": "SHOW",
    "title": "13 Answers & Highlights",
    "notes": "EA explains, locates, and supports troubleshooting. The user performs fixes. Thorough means all discovered relevant evidence within a declared scope, not omniscience.",
    "nodes": [
      [
        "draft",
        "Accept the validated draft",
        "answer = validated_draft()",
        "Only grounded claims enter this flow.",
        [
          [
            "",
            "revoked"
          ]
        ]
      ],
      [
        "revoked",
        "Source access revoked?",
        "IF answer.references_revoked_sources()",
        "Recheck concurrent deletion and policy updates before publication.",
        [
          [
            "yes",
            "discard"
          ],
          [
            "no",
            "broad"
          ]
        ]
      ],
      [
        "broad",
        "Broad answer requested?",
        "IF task.breadth == BROAD",
        "A broad answer lists categories and alternative controls, not just the highest-ranked hit.",
        [
          [
            "yes",
            "group"
          ],
          [
            "no",
            "goal"
          ]
        ]
      ],
      [
        "group",
        "Present discovered categories",
        "body = supported_capability_groups(answer)",
        "Include all discovered relevant references that fit the output budget and flag omissions.",
        [
          [
            "",
            "paths"
          ]
        ]
      ],
      [
        "goal",
        "Present goal-specific choices",
        "body = supported_goal_choices(answer)",
        "Distinguish alternatives such as pause versus cancel when their effects differ.",
        [
          [
            "",
            "paths"
          ]
        ]
      ],
      [
        "paths",
        "Attach precise source locations",
        "body = cite_exact_control_paths_or_document_locations(body)",
        "Use literal control paths or exact document/edition/section/page/table references, with readable excerpts and qualifications. EXTRACT details source-backed presentation; no original file is modified.",
        [
          [
            "",
            "gaps"
          ]
        ],
        "extraction"
      ],
      [
        "gaps",
        "Attach coverage gaps",
        "body.coverage = bundle.coverage",
        "Report uninspected, denied, unreadable, stale, conflicting, or unfinished sources.",
        [
          [
            "",
            "show"
          ]
        ]
      ],
      [
        "show",
        "Display the answer",
        "panel.show(supportive_grounded_presentation(body))",
        "CARE expands peace-and-respect presentation inside this task: patient, accessible, noncoercive, no forced cheerfulness or changes to facts. Use readable reflow; no focus theft or command activation.",
        [
          [
            "",
            "highlight"
          ]
        ],
        "peacefulSupport"
      ],
      [
        "highlight",
        "Highlight requested?",
        "IF user.requests_highlight",
        "Highlighting is a separate user action, not a click on the target application.",
        [
          [
            "yes",
            "locate"
          ],
          [
            "no",
            "feedback"
          ]
        ]
      ],
      [
        "locate",
        "Resolve the live control",
        "control = adapter.find_current_path(answer.path)",
        "Bounds may be stale after scrolling, moving, resizing, or a menu closing.",
        [
          [
            "",
            "same"
          ]
        ]
      ],
      [
        "same",
        "Control identity still matches?",
        "IF control.same_window_and_path",
        "Revalidate app/window/path/label and current visibility under the live permit.",
        [
          [
            "yes",
            "label"
          ],
          [
            "no",
            "stale"
          ]
        ]
      ],
      [
        "overlay",
        "Draw a noninteractive highlight",
        "CALL pointing",
        "Resolve fresh target identity and calibrated source-to-overlay geometry. Monitor origin, scale, rotation, crop, and source revisions must agree; hide a stale marker before reacquisition. See EA-POINT-01..05.",
        [
          [
            "",
            "feedback"
          ]
        ],
        "pointing"
      ],
      [
        "stale",
        "Report a changed interface",
        "panel.show_target_changed()",
        "Offer a fresh scoped read. Do not point to stale coordinates. The linked limitation flow distinguishes partial, clarification, unavailable, canceled and failed outcomes.",
        [
          [
            "",
            "feedback"
          ]
        ],
        "limits"
      ],
      [
        "feedback",
        "Accept optional user feedback",
        "feedback = user_marks_helpful_or_corrects()",
        "Carry eligible corrections and unresolved questions into follow-up context, without implying a fix succeeded or training the model. TALK details the user-turn lifecycle; feedback never self-triggers another task.",
        [
          [
            "",
            "end"
          ]
        ],
        "conversation"
      ],
      [
        "cleanup",
        "Release temporary task context",
        "release_task_buffers()",
        "Persistence of eligible records is a separate reviewed operation; cleanup always runs on cancel/error too.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "discard",
        "Discard revoked content",
        "drop(answer)",
        "Do not leak deleted or newly denied knowledge through a pending response.",
        [
          [
            "",
            "cleanup"
          ]
        ]
      ],
      [
        "end",
        "Return control to the user",
        "RETURN answer_and_feedback",
        "The orchestrator next evaluates eligible persistence, then releases temporary context in finally. EA does not press the suggested command.",
        []
      ],
      [
        "label",
        "Literal label still matches?",
        "IF control.label == evidence.literal_label",
        "A reused control path with changed text cannot receive the old answer's highlight.",
        [
          [
            "yes",
            "overlay"
          ],
          [
            "no",
            "stale"
          ]
        ]
      ]
    ]
  },
  {
    "id": "retain",
    "prefix": "SAVE",
    "title": "14 Durable Memory",
    "notes": "SQLite is the initial knowledge store. FTS and optional vectors are derived indexes. Every record retains provenance, policy eligibility, and deletion lineage.",
    "nodes": [
      [
        "candidate",
        "Accept a candidate record",
        "candidate = proposed_memory_record()",
        "Observation-derived candidates include app facts, versioned controls and verified outcomes. Explicit user-authored notes/settings use their separate own-data controls; this collection gate cannot forbid those writes.",
        [
          [
            "",
            "eligible"
          ]
        ]
      ],
      [
        "eligible",
        "Capture eligible for persistence?",
        "IF candidate.persist_eligible",
        "This bit is false for collection-off reads and never becomes true later.",
        [
          [
            "yes",
            "collect"
          ],
          [
            "no",
            "drop"
          ]
        ]
      ],
      [
        "collect",
        "Collection still enabled?",
        "IF current_policy.collect",
        "Queued writes cannot slip through after the user disables collection.",
        [
          [
            "yes",
            "scope"
          ],
          [
            "no",
            "drop"
          ]
        ]
      ],
      [
        "scope",
        "Retention rule allows this source?",
        "IF retain_rule(candidate.source)",
        "Per-app, per-path, and source-type exclusions apply independently of acquisition grants.",
        [
          [
            "yes",
            "redact"
          ],
          [
            "no",
            "drop"
          ]
        ]
      ],
      [
        "redact",
        "Redact disallowed fields",
        "candidate = minimize_and_redact(candidate)",
        "Raw screenshots, full logs, and document bodies are excluded unless explicitly permitted.",
        [
          [
            "",
            "review"
          ]
        ]
      ],
      [
        "review",
        "User review required?",
        "IF policy.requires_review(candidate.kind)",
        "Suggested baseline: review sensitive facts, corrections, and training/export eligibility.",
        [
          [
            "yes",
            "ask"
          ],
          [
            "no",
            "provenance"
          ]
        ]
      ],
      [
        "ask",
        "Request memory approval",
        "choice = user_reviews(candidate)",
        "Show the actual retained content, source, category, and retention duration.",
        [
          [
            "approved",
            "provenance"
          ],
          [
            "declined",
            "drop"
          ]
        ]
      ],
      [
        "provenance",
        "Attach provenance",
        "candidate.provenance = source_record_ids()",
        "Derived claims must retain parent links so later source deletion reaches summaries and indexes.",
        [
          [
            "",
            "expiry"
          ]
        ]
      ],
      [
        "expiry",
        "Compute record expiry",
        "candidate.expires_at = earliest_authorized_retention_deadline(candidate)",
        "Use the shortest applicable saved-data/source-lineage retention bound, never extend it by summarizing or recaching. Commit must occur while the candidate is still available. An authorized saved copy has its reviewed retention clock; it does not extend the RAM cache or the source read grant.",
        [
          [
            "",
            "quota"
          ]
        ]
      ],
      [
        "quota",
        "Storage quota available?",
        "IF quota.permits(candidate)",
        "Do not evict protected user notes silently. Offer expiry cleanup or a user-approved quota change.",
        [
          [
            "yes",
            "transaction"
          ],
          [
            "no",
            "drop"
          ]
        ]
      ],
      [
        "transaction",
        "Begin a policy-locked transaction",
        "tx = begin_serialized_memory_write()",
        "Policy updates, tombstones, and commits share a serialization boundary.",
        [
          [
            "",
            "live"
          ]
        ]
      ],
      [
        "live",
        "Generation still valid?",
        "IF tx.policy_matches(candidate.capture_generation)",
        "A policy-generation mismatch requires fresh authorization, never optimistic persistence.",
        [
          [
            "yes",
            "insert"
          ],
          [
            "no",
            "rollback"
          ]
        ]
      ],
      [
        "insert",
        "Insert the knowledge record",
        "tx.insert(candidate)",
        "Store raw claim text, record category, confidence, app/version scope, source IDs, and expiry.",
        [
          [
            "",
            "index"
          ]
        ]
      ],
      [
        "index",
        "Update the full-text index",
        "tx.update_fts(candidate)",
        "Predeclared optional vector indexing must use a revocation-aware queue keyed by record ID. Inclusion is decided before freeze, not introduced afterward.",
        [
          [
            "",
            "commit"
          ]
        ]
      ],
      [
        "commit",
        "Commit the transaction",
        "tx.commit()",
        "Return success only after durable storage succeeds. On error, roll back and report failure.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "rollback",
        "Roll back the transaction",
        "tx.rollback()",
        "No partial record/index updates remain.",
        [
          [
            "",
            "drop"
          ]
        ]
      ],
      [
        "drop",
        "Discard the candidate",
        "release(candidate)",
        "Do not retain a rejected candidate in logs, recovery files, or an automatic training queue.",
        [
          [
            "",
            "return"
          ]
        ]
      ],
      [
        "return",
        "Return the storage outcome",
        "RETURN saved_or_not_saved",
        "A no-save result is expected for temporary help, not an error.",
        []
      ]
    ]
  },
  {
    "id": "rules",
    "prefix": "RULE",
    "title": "15 Policy Changes",
    "notes": "Proposed advanced rules use structured conditions, not scripts. Global deny and protected-source rules win. The user can inspect effective permissions before applying them.",
    "nodes": [
      [
        "edit",
        "Accept a settings edit",
        "proposal = user_settings_change()",
        "Separate controls: observation scope/types/purpose/lifetime, collection, pause, recall, menu reveal, file/capture scope, retention, export and training. Proposed proactive hints F-29 need pre-freeze approval and independent consent.",
        [
          [
            "",
            "validate"
          ]
        ]
      ],
      [
        "validate",
        "Rule structure valid?",
        "IF validate_typed_rules(proposal)",
        "Allow app IDs, path identities, source types, time/size limits, and booleans; never eval arbitrary expressions.",
        [
          [
            "yes",
            "preview"
          ],
          [
            "no",
            "invalid"
          ]
        ]
      ],
      [
        "preview",
        "Compute effective permissions",
        "preview = evaluate_precedence(proposal)",
        "Deny first, then narrow explicit grants. Acquisition allowed does not imply retention or export allowed.",
        [
          [
            "",
            "approve"
          ]
        ]
      ],
      [
        "approve",
        "User confirms the change?",
        "IF user_confirms(preview)",
        "Show consequential effects such as pausing active reads or shortening retention.",
        [
          [
            "yes",
            "lock"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "lock",
        "Acquire the policy write lock",
        "lock = policy_transaction_lock()",
        "Serialize changes against durable memory commits and indexing jobs.",
        [
          [
            "",
            "generation"
          ]
        ]
      ],
      [
        "generation",
        "Close the previous policy epoch",
        "transition = close_old_policy_epoch_under_restrictive_proposal(proposal)",
        "Atomically invalidate the previous generation and apply restrictions before disk I/O. Stale reads, writes and publication are blocked immediately; permissive changes wait for successful commit. Failure never restores revoked authority.",
        [
          [
            "",
            "persist"
          ]
        ]
      ],
      [
        "persist",
        "Persist the policy document",
        "atomic_write_policy(proposal)",
        "If persistence fails, keep runtime access restrictive and report that settings did not save.",
        [
          [
            "success",
            "publish"
          ],
          [
            "failure",
            "fail"
          ]
        ]
      ],
      [
        "publish",
        "Publish effective permissions",
        "policy = compile_rules(proposal)",
        "Workers observe a single consistent version, not partially edited settings. Reconcile observer subscriptions against the effective scope and lifetime; display the actual active, paused, blocked, or off state.",
        [
          [
            "",
            "cancel"
          ]
        ]
      ],
      [
        "cancel",
        "Cancel affected source readers",
        "cancel_readers_outside(policy)",
        "Pause stops all acquisition. Background off cancels background subscriptions, queued reads, and late results; explicit help still works. Collection off blocks persistence, while separately authorized reads remain temporary-only.",
        [
          [
            "",
            "queue"
          ]
        ]
      ],
      [
        "queue",
        "Reject affected pending writes",
        "reject_ineligible_write_queue()",
        "Tasks captured while off stay temporary when collection is re-enabled.",
        [
          [
            "",
            "cache"
          ]
        ]
      ],
      [
        "cache",
        "Invalidate affected caches",
        "invalidate_by_policy_generation()",
        "Prompt contexts, retrieval results, embeddings in flight, and pending answers must drop newly disallowed data.",
        [
          [
            "",
            "existing"
          ]
        ]
      ],
      [
        "existing",
        "Existing retention shortened?",
        "IF change.shortens_existing_retention",
        "Turning collection off alone does not erase existing memories. Forget and retention changes are separate actions.",
        [
          [
            "yes",
            "expire"
          ],
          [
            "no",
            "release"
          ]
        ]
      ],
      [
        "expire",
        "Queue affected record expiry",
        "enqueue_cleanup_after_unlock(expired_record_ids)",
        "Persist a cleanup job under the lock; run the Forget flow only after this transaction releases its lock.",
        [
          [
            "",
            "release"
          ]
        ],
        "forget"
      ],
      [
        "release",
        "Release the policy lock",
        "unlock(lock)",
        "Do not wait for user input while holding this lock. Cascaded cleanup runs from a committed job after release.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "fail",
        "Keep access restrictive",
        "runtime_policy = restrictive_failure_policy()",
        "Abort affected tasks and surface the save failure instead of falsely showing a successful toggle.",
        [
          [
            "",
            "release"
          ]
        ]
      ],
      [
        "invalid",
        "Explain the invalid rule",
        "show_validation_errors()",
        "No partially valid rule is applied.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return the effective policy",
        "RETURN policy_status",
        "The UI should show the actual enforced state, not just the user's requested switch position.",
        []
      ]
    ]
  },
  {
    "id": "forget",
    "prefix": "DEL",
    "title": "16 Forget & Expire",
    "notes": "Logical deletion is immediate. Physical cleanup is tracked and retried. No claim of forensic SSD erasure or automatic unlearning from trained weights.",
    "nodes": [
      [
        "scope",
        "Select the deletion scope",
        "scope = selected_records_or_app_or_all()",
        "Allow per-record, app, source, time range, and everything. Expiry invokes the same mechanism without a second user prompt.",
        [
          [
            "",
            "impact"
          ]
        ]
      ],
      [
        "impact",
        "Preview dependent records",
        "preview = lineage_closure(scope)",
        "Preview summaries, chunks, indexes, caches, pending exports and owned backups. Authorization covers the selected records and their descendants; this unlocked preview is not the final deletion inventory.",
        [
          [
            "",
            "confirm"
          ]
        ]
      ],
      [
        "confirm",
        "Deletion authorized?",
        "IF explicit_confirm_or_expiry_rule(scope)",
        "Show impact before destructive manual deletion. Cancellation leaves data unchanged.",
        [
          [
            "yes",
            "lock"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "lock",
        "Acquire the memory write lock",
        "tx = begin_serialized_delete_transaction(scope)",
        "Acquire the shared policy/memory lock and recheck owner and confirmed selection or expiry rule. Closure and commit below occur under this same transaction.",
        [
          [
            "",
            "tombstone"
          ]
        ]
      ],
      [
        "tombstone",
        "Publish deletion tombstones",
        "impact = tx.mark_deleted(tx.current_derivation_closure(scope))",
        "Recompute authoritative descendants after acquiring the lock, including concurrent commits since preview. Readers honor committed tombstones; later writes reject deleted parents. Physical cleanup can remain pending.",
        [
          [
            "",
            "generation"
          ]
        ]
      ],
      [
        "generation",
        "Advance data generation",
        "data_generation += 1",
        "Invalidate cache keys and active answer contexts that depended on removed records.",
        [
          [
            "",
            "commit"
          ]
        ]
      ],
      [
        "commit",
        "Commit the deletion barrier",
        "receipt = tx.commit_tombstones_and_cleanup_job(impact)",
        "Persist the exact opaque-ID cleanup inventory with the tombstones before releasing the lock. ERASE expands this same receipt, not another deletion or a later lineage snapshot.",
        [
          [
            "",
            "cancel"
          ]
        ]
      ],
      [
        "cancel",
        "Cancel dependent workers",
        "cancel_jobs_referencing(impact)",
        "Late embedding/model outputs cannot resurrect deleted knowledge.",
        [
          [
            "",
            "cache"
          ]
        ]
      ],
      [
        "cache",
        "Evict dependent temporary data",
        "evict_contexts(impact)",
        "Drop current prompts, retrieval results, screenshots, and prepared answer text that reference deleted sources.",
        [
          [
            "",
            "rows"
          ]
        ]
      ],
      [
        "rows",
        "Delete owned database rows",
        "delete_rows_and_indexes(impact)",
        "Delete primary records, FTS entries and vectors by stable record ID using audited deletion modes. Preserve nonpayload cleanup IDs/tombstones until dependent cleanup is verified; deleting lineage too early loses the cleanup inventory.",
        [
          [
            "",
            "files"
          ]
        ]
      ],
      [
        "files",
        "Remove owned derived files",
        "remove_owned_files(impact)",
        "Limit cleanup to EA-owned files listed in the manifest; never delete original user software or documents.",
        [
          [
            "",
            "backups"
          ]
        ]
      ],
      [
        "backups",
        "Reconcile owned backups",
        "purge_or_rewrite_owned_backups(impact)",
        "A backup that retains the deleted content is still a retained copy. Restore must reapply tombstones.",
        [
          [
            "",
            "journal"
          ]
        ]
      ],
      [
        "journal",
        "Request database cleanup",
        "checkpoint_and_compact_when_safe()",
        "WAL checkpointing and vacuuming can reduce retained pages but do not guarantee forensic erasure on storage hardware.",
        [
          [
            "",
            "external"
          ]
        ]
      ],
      [
        "external",
        "External copies exist?",
        "IF exports_or_trained_adapters_reference(impact)",
        "User-managed exports, third-party backups, and trained weights may be outside EA's deletion control.",
        [
          [
            "yes",
            "limitations"
          ],
          [
            "no",
            "verify"
          ]
        ]
      ],
      [
        "limitations",
        "Report unremoved copies",
        "report_external_copy_manifest(impact)",
        "Deletion from the DB does not untrain a model. A separately trained adapter may need removal or rebuilding.",
        [
          [
            "",
            "verify"
          ]
        ]
      ],
      [
        "verify",
        "Owned cleanup complete?",
        "IF verify_absence(impact)",
        "R-06: verify each owned store, FTS shadow entries, database/journal cleanup, chart history and owned backups. Search absence alone is insufficient; pending cleanup stays visible. Detailed flow separates immediate exclusion from physical cleanup.",
        [
          [
            "yes",
            "receipt"
          ],
          [
            "no",
            "retry"
          ]
        ],
        "forgetProof"
      ],
      [
        "retry",
        "Persist a cleanup retry",
        "cleanup_queue.retry_with_error(impact)",
        "Keep tombstones enforced. Tell the user deletion is logically effective but cleanup is incomplete.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "receipt",
        "Record a content-free receipt",
        "record_cleanup_counts_and_status()",
        "No deleted text, paths, hashes of sensitive low-entropy data, or embeddings in the receipt.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return deletion status",
        "RETURN cleanup_status",
        "Honest statuses: cancelled, blocked from recall, cleanup pending, owned copies removed, external copies remain.",
        []
      ]
    ]
  },
  {
    "id": "correction",
    "prefix": "EDIT",
    "title": "17 Memory Correction",
    "notes": "A user must be able to see and change what EA remembers. Correction is not rewriting source evidence to pretend it originally said something else.",
    "nodes": [
      [
        "select",
        "Select a knowledge record",
        "record = user_selected_record()",
        "Expose the stored claim, provenance, category, app/version, confidence, and expiry.",
        [
          [
            "",
            "exists"
          ]
        ]
      ],
      [
        "exists",
        "Record still exists?",
        "IF record.is_live",
        "Concurrent deletion can invalidate an open editor.",
        [
          [
            "yes",
            "edit"
          ],
          [
            "no",
            "missing"
          ]
        ]
      ],
      [
        "edit",
        "Accept replacement content",
        "replacement = user_edit(record.claim)",
        "Allow edited text and metadata within typed fields, not executable policy code.",
        [
          [
            "",
            "validate"
          ]
        ]
      ],
      [
        "validate",
        "Replacement valid?",
        "IF validate_memory_edit(replacement)",
        "Check size, source references, version scope, and sensitivity. Do not auto-approve training export.",
        [
          [
            "yes",
            "review"
          ],
          [
            "no",
            "invalid"
          ]
        ]
      ],
      [
        "review",
        "Review the correction",
        "choice = show_before_after(record, replacement)",
        "Deleting the original text is a separate choice from keeping revision history.",
        [
          [
            "apply",
            "lock"
          ],
          [
            "cancel",
            "end"
          ]
        ]
      ],
      [
        "lock",
        "Begin a correction transaction",
        "tx = begin_memory_transaction()",
        "Recheck record revision and current modification authorization under the lock.",
        [
          [
            "",
            "same"
          ]
        ]
      ],
      [
        "same",
        "Record revision unchanged?",
        "IF tx.expected_revision_matches(record)",
        "Avoid overwriting another user's edit or a concurrent delete.",
        [
          [
            "yes",
            "supersede"
          ],
          [
            "no",
            "conflict"
          ]
        ]
      ],
      [
        "supersede",
        "Store the corrected claim",
        "tx.supersede(record, replacement, author='user')",
        "Keep source provenance distinct. Revision text retention follows the user's history policy, not an assumed forever log.",
        [
          [
            "",
            "invalidate"
          ]
        ]
      ],
      [
        "invalidate",
        "Invalidate dependent summaries",
        "tx.mark_derived_stale(record.id)",
        "Generated summaries and embeddings must not continue serving the old meaning.",
        [
          [
            "",
            "index"
          ]
        ]
      ],
      [
        "index",
        "Refresh derived search entries",
        "tx.reindex_live_claim(record.id)",
        "An optional asynchronous vector index must verify the new record revision before publishing.",
        [
          [
            "",
            "commit"
          ]
        ]
      ],
      [
        "commit",
        "Commit the correction",
        "tx.commit()",
        "On failure roll back; return no false success. Later retrieval prefers the corrected live claim.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "conflict",
        "Roll back the stale edit",
        "tx.rollback()",
        "Offer reload or a new explicit edit; no silent last-writer-wins overwrite.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "missing",
        "Report the missing record",
        "show_record_deleted()",
        "Do not resurrect deleted knowledge from the editor's cached copy.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "invalid",
        "Explain validation failures",
        "show_edit_errors()",
        "Leave the durable record unchanged.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return the correction status",
        "RETURN edit_status",
        "A correction updates memory, not model weights or the source application.",
        []
      ]
    ]
  },
  {
    "id": "compaction",
    "prefix": "PACK",
    "title": "18 Knowledge Compaction",
    "notes": "Deduplication and summaries can reduce storage/context, but a summary can lose details or introduce mistakes. Compression, retrieval, and training are separate features.",
    "nodes": [
      [
        "select",
        "Select eligible records",
        "records = live_retained_records(scope)",
        "Temporary-only content is never eligible, even if collection later turns on.",
        [
          [
            "",
            "duplicates"
          ]
        ]
      ],
      [
        "duplicates",
        "Find exact duplicates",
        "groups = group_by_content_and_provenance(records)",
        "Do not collapse records with different versions, scopes, or provenance just because their labels look alike.",
        [
          [
            "",
            "dedup"
          ]
        ]
      ],
      [
        "dedup",
        "Deduplicate redundant copies",
        "records = retain_canonical_records(groups)",
        "Preserve all valid source references and deletion lineage while avoiding duplicate payload storage.",
        [
          [
            "",
            "method"
          ]
        ]
      ],
      [
        "method",
        "Lossy summary requested?",
        "IF user_requests_summary_compaction",
        "Lossless deduplication and lossy summaries have different risk and review requirements.",
        [
          [
            "yes",
            "budget"
          ],
          [
            "no",
            "manifest"
          ]
        ]
      ],
      [
        "budget",
        "Summary worker admissible?",
        "IF CALL resources permits_model",
        "Do not load another model beside the answer worker. Maintenance must yield to interactive tasks.",
        [
          [
            "yes",
            "summarize"
          ],
          [
            "no",
            "defer"
          ]
        ],
        "resources"
      ],
      [
        "summarize",
        "Draft a bounded summary",
        "draft = summarize_with_source_ids(records)",
        "Keep exact control labels and action semantics literal; generated prose is a derived claim.",
        [
          [
            "",
            "check"
          ]
        ]
      ],
      [
        "check",
        "Summary supported by sources?",
        "IF validate_summary_claims(draft, records)",
        "Reject invented steps, lost negation, merged versions, or contradictions.",
        [
          [
            "yes",
            "review"
          ],
          [
            "no",
            "reject"
          ]
        ]
      ],
      [
        "review",
        "User approves the summary?",
        "IF user_reviews(draft, originals)",
        "Show what would change and whether originals would remain. Approval is not training consent.",
        [
          [
            "yes",
            "store"
          ],
          [
            "no",
            "reject"
          ]
        ]
      ],
      [
        "store",
        "Store summary lineage",
        "CALL retain(summary_with_parent_ids)",
        "Summary inherits the most restrictive source policy and expiry. It cannot outlive deleted parent evidence by accident.",
        [
          [
            "",
            "manifest"
          ]
        ],
        "retain"
      ],
      [
        "manifest",
        "Compute compaction results",
        "report = compare_bytes_and_record_counts()",
        "Measure storage and retrieval quality; do not claim compression is automatically an accuracy improvement.",
        [
          [
            "",
            "remove"
          ]
        ]
      ],
      [
        "remove",
        "Original removal approved?",
        "IF explicit_original_removal_consent",
        "Do not delete originals merely because a summary exists. Removing a parent requires a reviewed lineage-transfer policy or summary deletion.",
        [
          [
            "yes",
            "forget"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "forget",
        "Delete selected originals",
        "CALL forget(approved_scope)",
        "The deletion impact preview includes dependent summaries; retained summaries cannot secretly carry forgotten content.",
        [
          [
            "",
            "end"
          ]
        ],
        "forget"
      ],
      [
        "reject",
        "Discard the summary draft",
        "release(draft)",
        "Keep the original retained records unchanged.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "defer",
        "Defer costly compaction",
        "offer_new_explicit_compaction_request_without_scheduling()",
        "No automatic retry or model work. Only another deliberate user request may start a new finite budget; existing eligible data remains under its original lifetime.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return compaction results",
        "RETURN report",
        "The model weights remain unchanged.",
        []
      ]
    ]
  },
  {
    "id": "export",
    "prefix": "DATA",
    "title": "19 Training Data Export",
    "notes": "Predeclared F-23 reviewed export and adapter contract. Export is not training. Actual weight training is outside ZI, not a hidden high-RAM feature tier. No KARL integration or external API authority is implied.",
    "nodes": [
      [
        "request",
        "Accept an export request",
        "request = explicit_user_export()",
        "Never create a training dataset automatically from everything the assistant sees.",
        [
          [
            "",
            "scope"
          ]
        ]
      ],
      [
        "scope",
        "Select training-eligible records",
        "records = live_records_with_training_consent()",
        "Training eligibility is a separate opt-in bit. Temporary records, deleted data, and denied sources are excluded.",
        [
          [
            "",
            "lineage"
          ]
        ]
      ],
      [
        "lineage",
        "Resolve source lineage",
        "sources = provenance_closure(records)",
        "A summary cannot bypass the restrictions of its source records.",
        [
          [
            "",
            "rights"
          ]
        ]
      ],
      [
        "rights",
        "Source permissions sufficient?",
        "IF rights_and_consent_allow_export(sources)",
        "User-controlled data can still contain third-party confidential or licensed content; uncertain items require exclusion or review.",
        [
          [
            "yes",
            "redact"
          ],
          [
            "no",
            "exclude"
          ]
        ]
      ],
      [
        "exclude",
        "Exclude unapproved items",
        "records = remove_ineligible(records)",
        "Report counts and categories without leaking excluded content into the export manifest.",
        [
          [
            "",
            "redact"
          ]
        ]
      ],
      [
        "redact",
        "Redact sensitive content",
        "records = export_redaction(records)",
        "Use user review as well as automated detection. A regex cannot prove a dataset is secret-free.",
        [
          [
            "",
            "structure"
          ]
        ]
      ],
      [
        "structure",
        "Build structured examples",
        "examples = curated_question_evidence_answer(records)",
        "Keep task instructions separate from observed hostile text; include evidence and uncertainty labels.",
        [
          [
            "",
            "split"
          ]
        ]
      ],
      [
        "split",
        "Separate evaluation examples",
        "splits = source_grouped_train_eval_split(examples)",
        "Split by source/app session to reduce leakage from near-identical examples into both sets.",
        [
          [
            "",
            "preview"
          ]
        ]
      ],
      [
        "preview",
        "Review dataset content",
        "choice = user_reviews_dataset(splits)",
        "Review actual rows, source counts and consent limits. This content review alone cannot authorize a write; the destination stage binds a final exact-byte preview to a new path.",
        [
          [
            "approved",
            "recheck"
          ],
          [
            "cancel",
            "cancel"
          ]
        ]
      ],
      [
        "recheck",
        "Records still exportable?",
        "IF live_policy_and_revisions_match(splits)",
        "Catch deletions, corrections, and revoked training consent that occurred during review.",
        [
          [
            "yes",
            "destination"
          ],
          [
            "no",
            "cancel"
          ]
        ]
      ],
      [
        "destination",
        "Approve the destination preview",
        "preview = reviewed_new_destination_and_exact_dataset(splits)",
        "User selects a new local path and approves exact payload, destination and lineage. Cancel or stale data returns cancelled; no network upload, project overwrite or automatically inferred path.",
        [
          [
            "",
            "write"
          ]
        ]
      ],
      [
        "write",
        "Write the dataset atomically",
        "result = commit_reviewed_new_dataset_with_final_guards(preview)",
        "The narrow committer rechecks exact preview, owner epoch, source revisions, permissions, no-overwrite and no-symlink-escape at commit. Gate against concurrent revocation/deletion; atomic new-file delivery where supported. Any failure returns actual status without following success nodes.",
        [
          [
            "",
            "manifest"
          ]
        ]
      ],
      [
        "manifest",
        "Store an export manifest",
        "record_export_ids_and_policy_versions()",
        "Track the owned export destination and originating record IDs for future deletion impact reports.",
        [
          [
            "",
            "notice"
          ]
        ]
      ],
      [
        "notice",
        "Explain the training boundary",
        "show_export_complete_not_trained()",
        "Future training runs on suitable hardware under separate consent. DB deletion alone does not unlearn exported or trained content.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "cancel",
        "Discard export buffers",
        "release_export_buffers()",
        "No partial dataset or automatic retry after consent withdrawal.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return export status",
        "RETURN dataset_or_cancelled",
        "No training process or external API call starts here.",
        []
      ]
    ]
  },
  {
    "id": "platforms",
    "prefix": "PORT",
    "title": "20 Platforms & Release Gates",
    "notes": "Linux first, with a small declared compatibility matrix. A shared core cannot erase OS permission and window-manager differences.",
    "nodes": [
      [
        "os",
        "Identify the operating system",
        "os = platform_id()",
        "Do not claim cross-platform support solely because the language or UI toolkit runs there.",
        [
          [
            "Linux",
            "linux"
          ],
          [
            "macOS",
            "mac"
          ],
          [
            "Windows",
            "windows"
          ],
          [
            "unknown",
            "unsupported"
          ]
        ]
      ],
      [
        "linux",
        "Detect Linux display capabilities",
        "display = wayland_or_x11_capabilities()",
        "AT-SPI handles structured UI where apps expose it; screenshot/overlay permissions vary by desktop and compositor.",
        [
          [
            "",
            "adapter"
          ]
        ]
      ],
      [
        "mac",
        "Select the declared macOS adapter",
        "adapter_plan = accessibility_and_capture_permissions()",
        "Future scope only. Requires platform-specific accessibility and screen-capture permission testing.",
        [
          [
            "",
            "later"
          ]
        ]
      ],
      [
        "windows",
        "Select the declared Windows adapter",
        "adapter_plan = ui_automation_and_capture_permissions()",
        "Future scope only. Test privilege boundaries, application toolkits, and secure desktops explicitly.",
        [
          [
            "",
            "later"
          ]
        ]
      ],
      [
        "adapter",
        "Load the Linux adapter manifest",
        "manifest = tested_app_version_contracts()",
        "Adapters expose typed read/reveal/highlight operations; no arbitrary execution hook is handed to the model.",
        [
          [
            "",
            "known"
          ]
        ]
      ],
      [
        "known",
        "App/version tested?",
        "IF manifest.matches(target)",
        "Generic passive accessibility reads can be partially useful, but an untested reveal contract stays disabled.",
        [
          [
            "yes",
            "contracts"
          ],
          [
            "no",
            "partial"
          ]
        ]
      ],
      [
        "contracts",
        "Run adapter contract checks",
        "result = validate_available_interfaces()",
        "Check roles, object identity, permission state, and expected control structures before enabling reveal.",
        [
          [
            "",
            "passed"
          ]
        ]
      ],
      [
        "passed",
        "Contract checks pass?",
        "IF result.valid",
        "Missing or changed controls invalidate the capability, not just the test report.",
        [
          [
            "yes",
            "matrix"
          ],
          [
            "no",
            "partial"
          ]
        ]
      ],
      [
        "partial",
        "Declare partial support",
        "capabilities = passive_read_only_subset()",
        "User-opened menus, supplied text, or selected crops are honest fallbacks.",
        [
          [
            "",
            "matrix"
          ]
        ]
      ],
      [
        "matrix",
        "Publish capability status",
        "matrix = per_feature_supported_partial_denied()",
        "Support is granular: accessible labels, menus, capture, overlay, file reads, and memory are separate.",
        [
          [
            "",
            "tests"
          ]
        ]
      ],
      [
        "tests",
        "Read compatibility evidence",
        "results = load_versioned_compatibility_receipts()",
        "Startup checks available adapters against reviewed receipts; it does not run the full acceptance suite or probe personal content. Missing or obsolete evidence remains a compatibility gap. AC and QUAL are separate engineering procedures.",
        [
          [
            "",
            "pass"
          ]
        ]
      ],
      [
        "pass",
        "Acceptance gates pass?",
        "IF results.meet_measured_targets",
        "Evaluate narrow and broad questions on both Qt and GTK apps and a real 4 GB machine, including high memory pressure.",
        [
          [
            "yes",
            "ready"
          ],
          [
            "no",
            "blocked"
          ]
        ]
      ],
      [
        "ready",
        "Mark the capability releasable",
        "RETURN verified_capability_matrix",
        "Only tested versions/features are advertised. Regressions revoke support until fixed.",
        []
      ],
      [
        "blocked",
        "Keep the capability experimental",
        "RETURN failing_tests_and_gaps",
        "A model leaderboard score cannot replace end-to-end desktop safety and usefulness tests.",
        []
      ],
      [
        "later",
        "Record the unimplemented adapter",
        "RETURN predeclared_platform_gap",
        "No macOS or Windows support is implemented by this board. F-27 must be resolved before freeze, and missing platform support remains an explicit gap.",
        [],
        "freeze"
      ],
      [
        "unsupported",
        "Return an unsupported platform",
        "RETURN no_adapter",
        "Offer manual text input without implying desktop inspection capability.",
        []
      ]
    ]
  },
  {
    "id": "setup",
    "prefix": "SET",
    "title": "21 ZI Setup Wizard",
    "notes": "A user-driven installer configures EA itself outside the assistant tool registry. Free local use needs no vendor/cloud account or paid API. Private user profiles still require a tested local identity/storage boundary; guest use does not unlock private data.",
    "nodes": [
      [
        "welcome",
        "Open the ZI setup wizard",
        "wizard = user_launched_setup()",
        "Explain the read-and-guide scope in the installer consent screen. Do not start observing while setup is incomplete.",
        [
          [
            "",
            "license"
          ]
        ]
      ],
      [
        "license",
        "Review dependency licenses",
        "manifest = approved_license_manifest()",
        "Verify app code, runtime, model weights, OCR, icons, and bundled datasets can be distributed under the chosen free-software terms.",
        [
          [
            "",
            "free"
          ]
        ]
      ],
      [
        "free",
        "Free-use requirements satisfied?",
        "IF no_mandatory_paid_service(manifest)",
        "Free to use does not mean zero electricity or download costs. Never require a subscription, account, advertising, or data sale.",
        [
          [
            "yes",
            "hardware"
          ],
          [
            "no",
            "blocked"
          ]
        ]
      ],
      [
        "hardware",
        "Measure host resources",
        "profile = local_hardware_probe()",
        "Read only necessary hardware information after installer consent; no personal file inventory.",
        [
          [
            "",
            "mode"
          ]
        ]
      ],
      [
        "mode",
        "Choose a resource preset",
        "preset = user_selects_low_ram_profile()",
        "Every included ZI feature must have positive 4 GB tests. Text-first and no-model modes preserve assistance under transient pressure, not excuse missing features.",
        [
          [
            "",
            "model"
          ]
        ]
      ],
      [
        "model",
        "Choose the local model source",
        "source = user_selects_local_file_or_download()",
        "Model downloads are explicit installer actions, not permission for runtime web access.",
        [
          [
            "local file",
            "verify"
          ],
          [
            "download approved",
            "download"
          ],
          [
            "no model",
            "storage"
          ]
        ]
      ],
      [
        "download",
        "Download an approved artifact",
        "artifact = installer_download(source)",
        "Show publisher, size, license, destination, and network use before downloading. No arbitrary post-install scripts.",
        [
          [
            "",
            "verify"
          ]
        ]
      ],
      [
        "verify",
        "Verify artifact integrity",
        "result = verify_trusted_manifest(artifact)",
        "R-07: trusted metadata and artifact identity checks precede activation; user-managed imports carry a separate trust label. A hash from the same untrusted source does not authenticate it. Offline cannot prove latest revocation; stale metadata blocks new updates, not existing offline use.",
        [
          [
            "verified",
            "storage"
          ],
          [
            "failed",
            "blocked"
          ]
        ],
        "artifactTrust"
      ],
      [
        "storage",
        "Choose local storage",
        "location = user_selects_data_directory()",
        "Show expected disk use and ownership. Keep EA data private to the OS user where supported.",
        [
          [
            "",
            "permissions"
          ]
        ]
      ],
      [
        "permissions",
        "Choose source permissions",
        "grants = explicit_app_file_capture_choices()",
        "Do not grant the whole screen or home directory by default. Availability on screen does not waive others' privacy.",
        [
          [
            "",
            "observation"
          ]
        ]
      ],
      [
        "collection",
        "Choose collection behavior",
        "collect = user_toggle(default=false)",
        "Collection off allows permitted help or opted-in background observation in bounded temporary memory, without durable retention. Pause and background observation remain separate controls.",
        [
          [
            "",
            "retention"
          ]
        ]
      ],
      [
        "retention",
        "Choose retention limits",
        "retention = user_selects_lifetimes_and_quota()",
        "Prefer task-only until the user deliberately chooses lasting memory.",
        [
          [
            "",
            "persona"
          ]
        ]
      ],
      [
        "persona",
        "Choose companion preferences",
        "preferences = CALL personality",
        "Cyborg-inspired visual identity and conversational style remain user-adjustable.",
        [
          [
            "",
            "review"
          ]
        ],
        "personality"
      ],
      [
        "review",
        "Review effective settings",
        "choice = user_reviews_actual_permissions()",
        "Present actual read, recall, retention, network, startup and resource choices. Each option has rich hover/focus/pinned help; linked details expand the settings contract.",
        [
          [
            "apply",
            "save"
          ],
          [
            "cancel",
            "cancel"
          ]
        ],
        "settingsHelp"
      ],
      [
        "save",
        "Save EA settings atomically",
        "installer.write_settings(grants, preset, retention)",
        "Only EA-owned installation/settings files are written by this consent-driven setup process.",
        [
          [
            "",
            "test"
          ]
        ]
      ],
      [
        "test",
        "Run a synthetic self-test",
        "results = test_with_fixture_data()",
        "Use bundled dummy menus and sample text, not a sweep of the user's real desktop.",
        [
          [
            "pass",
            "finish"
          ],
          [
            "fail",
            "blocked"
          ]
        ]
      ],
      [
        "finish",
        "Finish setup",
        "RETURN configured_read_only_ZI",
        "Offer a normal user-controlled startup option and an uninstall path that separately asks whether to remove personal data.",
        []
      ],
      [
        "blocked",
        "Report the setup blocker",
        "RETURN failed_requirement",
        "Keep acquisition disabled. Do not hide incompatible licenses, failed integrity checks, or inadequate resources.",
        []
      ],
      [
        "cancel",
        "Cancel setup changes",
        "RETURN cancelled_setup",
        "Remove only installer-owned temporary downloads after user-approved cleanup; leave user files intact.",
        []
      ],
      [
        "observation",
        "Choose observation mode",
        "background = reviewed_scope_types_purpose_lifetime(default=OFF)",
        "Optional background observation is confirmed. Its initial off state, visible status, consent lifetime, source exclusions, capture grant, and rate/cache limits are proposed for review; no permission to interrupt or execute follows.",
        [["", "collection"]]
      ]
    ]
  },
  {
    "id": "personality",
    "prefix": "STYLE",
    "title": "22 Personality & Presence",
    "notes": "User-confirmed: funny practical companionship, learned mannerisms and separate per-user profiles only. No generic social check-ins or blended private personalities. TONE/OWNER detail reviewed adaptation and identity isolation; lightweight preferences first, with no automatic weight training.",
    "nodes": [
      [
        "input",
        "Accept a style preference",
        "choice = explicit_user_preference()",
        "Examples: concise or detailed, formal or casual, dry/playful/off humor, approved slang, optional profanity, reduced motion and visibility. No jokes now overrides the usual style immediately; anger is not permanent profanity consent.",
        [
          [
            "",
            "scope"
          ]
        ]
      ],
      [
        "scope",
        "Choose preference lifetime",
        "scope = this_session_or_saved_profile()",
        "A saved preference is an explicit EA settings write, not background observation of the user's behavior.",
        [
          [
            "",
            "validate"
          ]
        ]
      ],
      [
        "validate",
        "Preference within safety boundaries?",
        "IF style_preserves_privacy_and_truthfulness(choice)",
        "Tone cannot authorize secret collection, execution, deceptive certainty, or pressure to keep the companion enabled.",
        [
          [
            "yes",
            "apply"
          ],
          [
            "no",
            "explain"
          ]
        ]
      ],
      [
        "apply",
        "Apply conversational style",
        "style = bounded_current_owner_style_profile(choice)",
        "Change phrasing, not factual claims, evidence or permissions. TONE details optional reviewed learning from eligible first-party input, not another invocation of this settings write. Never blend different users' mannerisms or attributed opinions.",
        [
          [
            "",
            "visual"
          ]
        ],
        "mannerisms"
      ],
      [
        "visual",
        "Apply accessible visual preferences",
        "appearance = cyborg_theme_with_user_controls()",
        "Use a recognizable companion without blocking menus or readable content. Respect reduced motion and adjustable size.",
        [
          [
            "",
            "preview"
          ]
        ]
      ],
      [
        "preview",
        "Preview the personality",
        "preview = synthetic_dialogue(style)",
        "Use a fictional example instead of mining private conversations to demonstrate adaptation.",
        [
          [
            "",
            "approve"
          ]
        ]
      ],
      [
        "approve",
        "User accepts the preview?",
        "IF user_accepts(preview)",
        "The user can reset the profile without deleting unrelated knowledge.",
        [
          [
            "yes",
            "lifetime"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "lifetime",
        "Persistent profile requested?",
        "IF scope == SAVED_PROFILE",
        "Saving selected settings is explicit consent. Inferred behavioral preferences still need collection/retention permission.",
        [
          [
            "yes",
            "save"
          ],
          [
            "no",
            "temporary"
          ]
        ]
      ],
      [
        "save",
        "Save the selected preferences",
        "compare_and_write_current_owner_settings(style, appearance)",
        "Provide inspect, edit, export, reset and delete. Recheck trusted owner/session/revision at commit; no secret sensitive-trait inference or hidden personality score. Configuration profile names are not authentication.",
        [
          [
            "",
            "training"
          ]
        ]
      ],
      [
        "temporary",
        "Keep preferences in session memory",
        "session.style = style",
        "Discard on session end. No retrospective persistence after collection is enabled.",
        [
          [
            "",
            "training"
          ]
        ]
      ],
      [
        "training",
        "Training experiment requested?",
        "IF explicit_dataset_export_request",
        "Transparent preferences do not require fine-tuning. F-23 specifies reviewed exports and compatible adapter use; ZI does not train weights.",
        [
          [
            "yes",
            "export"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "export",
        "Review a declared training dataset",
        "CALL learningWorkbench_for_explicit_dataset_intent",
        "Confirmed guided export/import with a separately launched self-hosted trainer. LEARN separates preferences, facts, reviewed examples and adapter evaluation; actual trainer formats/licenses remain unverified. KARL is untouched.",
        [
          [
            "",
            "end"
          ]
        ],
        "learningWorkbench"
      ],
      [
        "explain",
        "Explain the fixed boundary",
        "show_non_overridable_policy()",
        "Personality settings cannot switch ZI into autonomous execution.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return the chosen style",
        "RETURN style_profile",
        "Calm support, accurate uncertainty, respect for user agency, bystander privacy, and the surrounding environment.",
        []
      ]
    ]
  },
  {
    "id": "links",
    "prefix": "LINK",
    "title": "23 Passive Link Review",
    "notes": "ZI can flag suspicious evidence, not certify a URL as safe or fake. Static review does not visit, resolve, follow redirects, or submit a URL to a third party.",
    "nodes": [
      [
        "source",
        "Read a user-selected link",
        "link = permitted_visible_link_or_paste()",
        "A browser adapter may read the actual destination only if exposed and authorized. Display text alone is not the destination.",
        [
          [
            "",
            "available"
          ]
        ]
      ],
      [
        "available",
        "Actual destination available?",
        "IF link.has_destination",
        "An image of link text may hide a different target. State this uncertainty explicitly.",
        [
          [
            "yes",
            "parse"
          ],
          [
            "no",
            "unknown"
          ]
        ]
      ],
      [
        "parse",
        "Parse the URL structurally",
        "url = standard_url_parser(link.destination)",
        "Do not infer hostnames through ad hoc substring matching.",
        [
          [
            "valid",
            "normalize"
          ],
          [
            "invalid",
            "malformed"
          ]
        ]
      ],
      [
        "normalize",
        "Normalize the hostname",
        "host = canonical_idna_hostname(url)",
        "Display both human-readable and encoded forms when relevant; Unicode confusables are a signal, not proof of fraud.",
        [
          [
            "",
            "scheme"
          ]
        ]
      ],
      [
        "scheme",
        "Classify the URL scheme",
        "scheme_risk = known_scheme_policy(url.scheme)",
        "Scripts, local-file handlers, and custom launch schemes are not ordinary HTTPS links. Never execute them to inspect behavior.",
        [
          [
            "",
            "compare"
          ]
        ]
      ],
      [
        "compare",
        "Compare visible text to destination",
        "mismatch = compare_claimed_and_actual_destination(link, url)",
        "Use the registrable domain via a maintained public-suffix library/list. A legitimate subdomain can look unfamiliar too.",
        [
          [
            "",
            "signals"
          ]
        ]
      ],
      [
        "signals",
        "Collect static risk signals",
        "signals = local_checks(url, mismatch)",
        "Examples: deceptive userinfo, lookalike host, misleading subdomains, an IP address, or unexpected scheme. HTTPS alone proves no trustworthiness.",
        [
          [
            "",
            "context"
          ]
        ]
      ],
      [
        "context",
        "Compare to trusted local references",
        "reference = user_approved_official_domain_record()",
        "Do not invent the official domain from model memory or treat an old cached result as current reputation.",
        [
          [
            "",
            "limits"
          ]
        ]
      ],
      [
        "limits",
        "Record verification limits",
        "limits = no_live_reputation_no_redirect_resolution()",
        "Offline analysis cannot know current site behavior, newly compromised domains, or the final target of a shortened URL.",
        [
          [
            "",
            "report"
          ]
        ]
      ],
      [
        "report",
        "Explain the risk evidence",
        "RETURN suspicious_or_no_obvious_signal_or_unknown",
        "Avoid a green 'safe' guarantee. Offer non-clicking verification steps and cite the exact observed destination.",
        []
      ],
      [
        "unknown",
        "Report the hidden destination",
        "RETURN insufficient_destination_evidence",
        "Ask for a copied destination as plain text or an approved browser inspection. Do not click the link.",
        []
      ],
      [
        "malformed",
        "Report the malformed URL",
        "RETURN malformed_link_with_uncertainty",
        "Do not repair and navigate a suspicious link automatically.",
        []
      ]
    ]
  },
  {
    "id": "scan",
    "prefix": "AV",
    "title": "24 Antivirus Guidance",
    "notes": "In ZI, running a scan is an external command and is therefore unavailable to EA. The user can run an existing scanner; EA can interpret permitted reports.",
    "nodes": [
      [
        "request",
        "Accept a scan-help question",
        "question = user_requests_scan_help()",
        "Wanting antivirus support does not silently turn on execution mode.",
        [
          [
            "",
            "boundary"
          ]
        ]
      ],
      [
        "boundary",
        "State the ZI action boundary",
        "explain_user_runs_scan()",
        "No launching scanners, updating signatures, quarantining files, deleting files, or invoking shell commands.",
        [
          [
            "",
            "known"
          ]
        ]
      ],
      [
        "known",
        "Scanner identified?",
        "IF user_names_scanner_or_permitted_inventory",
        "Do not scan installed software merely to infer a scanner when inventory permission is absent.",
        [
          [
            "yes",
            "docs"
          ],
          [
            "no",
            "ask"
          ]
        ]
      ],
      [
        "ask",
        "Ask which scanner is available",
        "scanner = user_selects_existing_scanner()",
        "If none is installed, provide verified installation guidance for the user; EA does not install it.",
        [
          [
            "identified",
            "docs"
          ],
          [
            "none",
            "end"
          ]
        ]
      ],
      [
        "docs",
        "Read permitted scanner documentation",
        "docs = scoped_local_docs_or_user_supplied_reference()",
        "Prefer current official documentation and verified app/version controls over invented scan buttons.",
        [
          [
            "",
            "guide"
          ]
        ]
      ],
      [
        "guide",
        "Explain user-run scan steps",
        "show_exact_verified_steps(docs)",
        "Keep scan scope, performance cost, and quarantine options visible. The user initiates the scanner.",
        [
          [
            "",
            "report"
          ]
        ]
      ],
      [
        "report",
        "Report available for inspection?",
        "IF user_supplies_report_or_scan_window",
        "EA does not poll every process to discover when an unapproved scan finishes.",
        [
          [
            "yes",
            "read"
          ],
          [
            "no",
            "end"
          ]
        ]
      ],
      [
        "read",
        "Read the permitted scan result",
        "evidence = CALL files_or_ui(report)",
        "Apply normal protected-path, temporary-use, parser, and policy controls.",
        [
          [
            "",
            "interpret"
          ]
        ],
        "files"
      ],
      [
        "interpret",
        "Explain reported findings",
        "explain_scanner_status_and_limits(evidence)",
        "No detections is not proof of a clean system; alerts can include false positives. Never rewrite a scanner's verdict as certainty.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return guidance to the user",
        "RETURN no_external_action",
        "A future execution edition may propose scanner integration under a distinct action grant.",
        []
      ]
    ]
  },
  {
    "id": "assembly",
    "prefix": "PLAN",
    "title": "25 Read, Find & Assemble",
    "notes": "ZI may assemble references, comparisons, checklists, and proposed work inside its own panel. It cannot apply them to another app or complete external tasks.",
    "nodes": [
      [
        "goal",
        "Accept a research or organization goal",
        "goal = user_request()",
        "Example: find all relevant settings and assemble a troubleshooting sequence with supporting references.",
        [
          [
            "",
            "scope"
          ]
        ]
      ],
      [
        "scope",
        "Choose the inspection scope",
        "scope = user_approved_visible_apps_or_files()",
        "Seeing content on a screen does not imply permission to store it, read hidden tabs, or inspect every monitor.",
        [
          [
            "",
            "coverage"
          ]
        ]
      ],
      [
        "coverage",
        "Choose desired coverage",
        "coverage = quick_pass_or_thorough_review()",
        "A quick pass prioritizes accessible labels; a thorough pass can stream authorized content in bounded chunks.",
        [
          [
            "",
            "permit"
          ]
        ]
      ],
      [
        "permit",
        "Authorize each source",
        "permit = CALL policy(scope)",
        "Permission is evaluated per source type. Secrets, excluded apps, and private/bystander content remain protected.",
        [
          [
            "allowed",
            "read"
          ],
          [
            "denied",
            "gap"
          ]
        ],
        "policy"
      ],
      [
        "read",
        "Read the next bounded chunk",
        "chunk = bounded_read(next_source)",
        "Respect CPU, RAM, time, and byte limits while allowing explicit continuation toward full coverage.",
        [
          [
            "",
            "extract"
          ]
        ]
      ],
      [
        "extract",
        "Extract relevant references",
        "references.add(cited_matches(chunk))",
        "Keep location and version information. Do not indiscriminately retain everything read.",
        [
          [
            "",
            "remaining"
          ]
        ]
      ],
      [
        "remaining",
        "Authorized content remains?",
        "IF coverage.has_unread_content",
        "Complete reading means every permitted chunk was inspected, not that a small model saw the entire file at once.",
        [
          [
            "yes",
            "budget"
          ],
          [
            "no",
            "assemble"
          ]
        ]
      ],
      [
        "budget",
        "Current work budget exhausted?",
        "IF deadline_or_cpu_budget_reached()",
        "Avoid locking the desktop or consuming unlimited energy just because the user asked for broad understanding.",
        [
          [
            "yes",
            "continue"
          ],
          [
            "no",
            "read"
          ]
        ]
      ],
      [
        "continue",
        "Ask whether to continue reading",
        "choice = user_reviews_progress_and_scope()",
        "Report amount read, sources remaining, and any gaps. A bounded continuation is still reading, not autonomous task execution.",
        [
          [
            "continue",
            "renew"
          ],
          [
            "stop here",
            "assemble"
          ],
          [
            "cancel",
            "end"
          ]
        ]
      ],
      [
        "renew",
        "Start an explicit continuation task",
        "task = new_explicit_continuation_with_revalidated_cursor()",
        "Close the old ledger; do not reset its counters or deadline. Revalidate owner, scope, revisions and cursor expiry. Existing evidence keeps its original expiry and sticky retention eligibility; changed snapshots cannot become fake complete coverage.",
        [
          [
            "",
            "permit"
          ]
        ]
      ],
      [
        "gap",
        "Record an excluded source",
        "gaps.add(source, reason)",
        "The final assembly lists omissions instead of implying omniscient coverage.",
        [
          [
            "",
            "assemble"
          ]
        ]
      ],
      [
        "assemble",
        "Assemble a cited work outline",
        "outline = organize_references_by_goal(references)",
        "Draft a checklist, comparison, or explanation in EA's own panel; each proposed step links back to evidence.",
        [
          [
            "",
            "display"
          ]
        ]
      ],
      [
        "display",
        "Preview the proposed work",
        "panel.show(outline, coverage, gaps)",
        "Preview is inert text or safely decoded content with scripts/macros and remote fetching disabled.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return without applying changes",
        "RETURN proposed_work_only",
        "No typing into apps, file modifications, downloads, submissions, or command invocation.",
        []
      ]
    ]
  },
  {
    "id": "future",
    "prefix": "ZII",
    "title": "26 ZII Execution Boundary",
    "notes": "ZII, not ZI. A separate execution edition may support delegated actions and long-running loops. ZI ships without an execution backend; no hidden toggle grants it.",
    "nodes": [
      [
        "edition",
        "ZII execution backend installed?",
        "IF ZII_execution_backend_available",
        "ZI always takes the no path. This is an architecture reservation, not an implemented capability.",
        [
          [
            "yes",
            "request"
          ],
          [
            "no",
            "unavailable"
          ]
        ]
      ],
      [
        "request",
        "Accept an explicit task delegation",
        "delegation = user_authorizes_goal()",
        "A future task includes a clear goal, scoped apps/files, permitted operations, and completion criteria.",
        [
          [
            "",
            "budget"
          ]
        ]
      ],
      [
        "budget",
        "Define an autonomy budget",
        "budget = user_sets_time_steps_cpu_memory_cost()",
        "Hours of work require finite limits, visible progress, checkpoints, and stop conditions.",
        [
          [
            "",
            "scope"
          ]
        ]
      ],
      [
        "scope",
        "Create a least-privilege lease",
        "lease = broker.issue_typed_capabilities()",
        "Do not expose unrestricted shell access simply because a model asked for it. Network and credentials are separate permissions.",
        [
          [
            "",
            "plan"
          ]
        ]
      ],
      [
        "plan",
        "Propose the next action",
        "proposal = planner.next_step(evidence, goal)",
        "The planner cannot execute. External content and prompt injection cannot create or expand a capability lease.",
        [
          [
            "",
            "authorize"
          ]
        ]
      ],
      [
        "authorize",
        "Authorize the proposed action",
        "decision = broker.check_live_scope_and_remaining_budgets(proposal, lease)",
        "Check identity, scope, risk, cancellation, confirmation, expiry and every finite budget before the first action as well as later actions. Recheck at execution. The common finally path revokes the lease on every exit, including success.",
        [
          [
            "allowed",
            "review"
          ],
          [
            "denied",
            "blocked"
          ]
        ]
      ],
      [
        "review",
        "Fresh approval required?",
        "IF action.requires_confirmation",
        "High-impact, irreversible, security-sensitive, external-send, purchase, or permission-escalation actions require deliberate review.",
        [
          [
            "yes",
            "confirm"
          ],
          [
            "no",
            "execute"
          ]
        ]
      ],
      [
        "confirm",
        "Request action approval",
        "choice = user_reviews_exact_effects(proposal)",
        "Approval is for this action and scope, not every future command in the loop.",
        [
          [
            "approve",
            "execute"
          ],
          [
            "decline",
            "blocked"
          ]
        ]
      ],
      [
        "execute",
        "Execute through the isolated broker",
        "result = broker.perform(proposal)",
        "Separate OS process, scoped adapters, resource limits, timeouts, and a revocable lease. Never an LLM-owned raw execution channel.",
        [
          [
            "",
            "verify"
          ]
        ]
      ],
      [
        "verify",
        "Observe the action outcome",
        "outcome = independent_state_check(result)",
        "A successful process exit is not proof that the user's goal was accomplished.",
        [
          [
            "",
            "checkpoint"
          ]
        ]
      ],
      [
        "checkpoint",
        "Write a minimal task checkpoint",
        "checkpoint = retained_progress_under_policy(outcome)",
        "Logs and task state follow retention rules. Temporary-only sessions cannot silently create durable multi-day task history.",
        [
          [
            "",
            "complete"
          ]
        ]
      ],
      [
        "complete",
        "User goal achieved?",
        "IF evidence_satisfies_acceptance_criteria",
        "Do not invent success or continue modifying things after the goal is met.",
        [
          [
            "yes",
            "finish"
          ],
          [
            "no",
            "continue"
          ]
        ]
      ],
      [
        "continue",
        "Execution lease still valid?",
        "IF lease.live",
        "Stop on user cancellation, expired permission, repeated failure, no progress, changed target, or exceeded resources.",
        [
          [
            "yes",
            "budgetLeft"
          ],
          [
            "no",
            "stop"
          ]
        ]
      ],
      [
        "blocked",
        "Report the blocked action",
        "show_blocker_without_bypass()",
        "Offer a narrower proposal or user action. The planner cannot approve its own denied request.",
        [
          [
            "",
            "stop"
          ]
        ]
      ],
      [
        "stop",
        "Revoke the execution lease",
        "broker.cancel_and_release(lease)",
        "Interrupt running processes where safe, disclose partial effects, and require explicit approval before any resume.",
        [
          [
            "",
            "finish"
          ]
        ]
      ],
      [
        "finish",
        "Report verified progress",
        "RETURN outcome_and_remaining_work",
        "Make effects and limitations inspectable. Compensation/rollback can itself need approval and is never assumed universally possible.",
        []
      ],
      [
        "unavailable",
        "Return ZI guidance only",
        "RETURN read_and_guide_mode",
        "No execution adapter is registered in the ZI capability table.",
        []
      ],
      [
        "budgetLeft",
        "Work budget remaining?",
        "IF budget.remaining",
        "Time, steps, CPU, RAM, and any explicit spending caps have hard stopping conditions.",
        [
          [
            "yes",
            "progress"
          ],
          [
            "no",
            "stop"
          ]
        ]
      ],
      [
        "progress",
        "Useful progress detected?",
        "IF progress_detected",
        "Repeated errors or cycling plans stop the loop instead of running indefinitely.",
        [
          [
            "yes",
            "plan"
          ],
          [
            "no",
            "stop"
          ]
        ]
      ]
    ]
  },
  {
    "id": "controls",
    "prefix": "CTRL",
    "title": "27 ZI Control Events",
    "notes": "User-controlled startup, policy, memory, and personality operations. These manage EA's own state, not other applications.",
    "nodes": [
      [
        "startup",
        "Startup event?",
        "IF event.type == STARTUP",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "startupCall"
          ],
          [
            "no",
            "policy"
          ]
        ]
      ],
      [
        "startupCall",
        "Initialize the companion",
        "CALL presence",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "presence"
      ],
      [
        "policy",
        "Policy change?",
        "IF event.type == POLICY",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "policyCall"
          ],
          [
            "no",
            "usage"
          ]
        ]
      ],
      [
        "policyCall",
        "Apply a policy change",
        "CALL rules",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "rules"
      ],
      [
        "usage",
        "Usage event?",
        "IF event.type == USAGE",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "usageCall"
          ],
          [
            "no",
            "backgroundCheck"
          ]
        ]
      ],
      [
        "usageCall",
        "Observe allowed app usage",
        "CALL catalog",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "catalog"
      ],
      [
        "forget",
        "Forget request?",
        "IF event.type == FORGET",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "forgetCall"
          ],
          [
            "no",
            "correct"
          ]
        ]
      ],
      [
        "forgetCall",
        "Forget selected knowledge",
        "CALL forget",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "forget"
      ],
      [
        "correct",
        "Correction request?",
        "IF event.type == CORRECT",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "correctCall"
          ],
          [
            "no",
            "compact"
          ]
        ]
      ],
      [
        "correctCall",
        "Correct a memory record",
        "CALL correction",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "correction"
      ],
      [
        "compact",
        "Compaction request?",
        "IF event.type == COMPACT",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "compactCall"
          ],
          [
            "no",
            "export"
          ]
        ]
      ],
      [
        "compactCall",
        "Compact eligible knowledge",
        "CALL compaction",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "compaction"
      ],
      [
        "export",
        "Export request?",
        "IF event.type == EXPORT",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "exportCall"
          ],
          [
            "no",
            "style"
          ]
        ]
      ],
      [
        "exportCall",
        "Dispatch the requested export",
        "CALL selected_export_under_explicit_purpose",
        "Selected Knowledge Export handles ordinary eligible records without training consent. Only an explicit training-dataset request enters the linked DATA flow. Neither route launches training; shared owner, revision, destination and retention checks apply.",
        [
          [
            "",
            "end"
          ]
        ],
        "export"
      ],
      [
        "style",
        "Personality change?",
        "IF event.type == STYLE",
        "An event selects one bounded control-plane workflow; it does not grant extra source or execution permissions.",
        [
          [
            "yes",
            "styleCall"
          ],
          [
            "no",
            "unknown"
          ]
        ]
      ],
      [
        "styleCall",
        "Apply personality preferences",
        "CALL personality",
        "Use the dedicated flow, including its permissions, failure paths, and retention rules.",
        [
          [
            "",
            "end"
          ]
        ],
        "personality"
      ],
      [
        "unknown",
        "Report an unsupported event",
        "show_unsupported_event()",
        "Never route an unknown event to shell execution or a generic application action.",
        [
          [
            "",
            "end"
          ]
        ]
      ],
      [
        "end",
        "Return to event wait",
        "RETURN idle",
        "No ZI external task execution follows a control-plane operation.",
        []
      ],
      [
        "backgroundCheck",
        "Background content event?",
        "IF event.type == BACKGROUND_CONTENT",
        "Observer events are not user questions. Source grants, activation, collection, and interruption permission remain independent.",
        [["yes", "backgroundCall"], ["no", "forget"]]
      ],
      [
        "backgroundCall",
        "Observe permitted background content",
        "CALL background",
        "Apply the dedicated passive-observation flow with revocation, bounded RAM cache, retention, and quiet failure behavior.",
        [["", "end"]],
        "background"
      ]
    ]
  },
  ...capabilityFlows,
  ...endStateFlows,
  ...strengtheningFlows,
  ...conversationFlows,
  ...customizationFlows,
  ...optimizationFlows,
  ...personalityFlows
];
