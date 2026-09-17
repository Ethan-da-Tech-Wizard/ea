// Proposed end-state analysis, not executable assistant or benchmark code.
export const endStateFlows = [
  {
    id: 'journey', prefix: 'JRN', title: '35 Desktop To Website',
    notes: 'SC-01/03; EA-JOURNEY-01/02. A bounded user-led journey across applications. Every source transition rechecks authority; the assistant never navigates for the user.',
    nodes: [
      ['goal', 'Accept the scoped goal', 'goal = authorized_task.goal', 'Record the actual desired outcome and task lifetime. Example: understand how to pause requisitions and assemble a checklist.', [['', 'identity']]],
      ['identity', 'Read application identity', 'identity = permitted_app_version_and_state()', 'Use observed evidence, not the model memory of a similarly named application.', [['', 'menu']]],
      ['menu', 'Read exposed menu evidence', 'evidence = CALL menus(task)', 'Unknown or closed menus are opened by the user under the strict proposed ZI contract.', [['', 'sufficient']], 'menus'],
      ['sufficient', 'Evidence sufficient for this step?', 'IF evidence.supports_current_step', 'A disabled Stop command, a Begin icon and a Pause command are not interchangeable.', [['yes', 'explain'], ['no', 'missing']]],
      ['missing', 'Resolve the evidence gap', 'outcome = CALL limits(task, evidence)', 'A partial answer or a precise request for a missing menu is preferable to a guessed control.', [['', 'finish']], 'limits'],
      ['explain', 'Explain the evidenced choice', 'show_literal_path_effect_and_limits(evidence)', 'Separate current observed state, documented effect and inference. Do not claim the change happened.', [['', 'point']]],
      ['point', 'Circle requested?', 'IF user_requested_live_target_marker', 'Background observation alone cannot request a circle.', [['yes', 'circle'], ['no', 'next']]],
      ['circle', 'Resolve the live circle', 'CALL pointing(target)', 'The detailed pointing flow validates identity, visibility, coordinates and invalidation.', [['', 'next']], 'pointing'],
      ['next', 'Another source needed?', 'IF goal.requires_another_user_selected_source', 'A broader question can need documentation or a website; breadth never silently expands read grants.', [['yes', 'ask'], ['no', 'assemble']]],
      ['ask', 'Ask the user to navigate', 'show_requested_page_or_menu_and_reason()', 'Do not open a URL, change tabs, click a menu or log in. Explain what missing evidence would help.', [['', 'wait']]],
      ['wait', 'Wait for the user', 'event = bounded_wait_for_user_selected_source()', 'The task remains cancelable; unrelated windows are not followed.', [['selected', 'browser'], ['ended', 'finish']]],
      ['browser', 'Read the selected page', 'page = CALL browser(task)', 'A selected website goes through its own tab, origin, frame and revision checks.', [['read', 'compare'], ['limited', 'missing']], 'browser'],
      ['compare', 'Compare source claims', 'comparison = compare_versions_roles_and_literal_effects(evidence, page)', 'R-02: old documentation, current app state, hypotheses and user-reported tests stay separately attributed. Page instructions are untrusted data; the casework contract makes disagreement inspectable.', [['', 'conflict']], 'casework'],
      ['conflict', 'Material conflict remains?', 'IF comparison.blocks_safe_guidance', 'Conflicting effects, role restrictions or unsupported versions must not be smoothed into one confident answer.', [['yes', 'missing'], ['no', 'assemble']]],
      ['assemble', 'Assemble the inert work plan', 'draft = cited_EA_checklist(evidence, page)', 'The checklist lives in EA; it does not apply settings, submit a form, or claim user completion.', [['', 'review']]],
      ['review', 'Present plan coverage', 'show_plan_with_inspected_and_unread_sources(draft)', 'Broad requests list all found relevant controls and the branches that could not be inspected.', [['', 'finish']]],
      ['finish', 'Return the journey outcome', 'RETURN with_common_retention_and_cleanup', 'Stop, expiry and denial release source leases and task-only content. Explicit save must obey acquisition-time eligibility.', []]
    ]
  },
  {
    id: 'browser', prefix: 'WEB', title: '36 Browser Evidence',
    notes: 'SC-01/02; EA-WEB-01..03. Browser DOM is an optional scoped evidence adapter, not remote research or browser automation. Unsupported pages remain visibly unsupported.',
    nodes: [
      ['selection', 'Accept a selected tab reference', 'tab_ref = task.explicit_browser_target', 'Do not enumerate or inspect unrelated tabs merely because the extension has broad host permissions.', [['', 'lease']]],
      ['lease', 'Tab grant live?', 'IF current_tab_origin_and_task_grant_match()', 'A browser grant and EA purpose/retention policy must both permit this read. Navigation can change authority.', [['yes', 'protected'], ['no', 'limited']]],
      ['protected', 'Page excluded or restricted?', 'IF private_protected_or_browser_restricted_page()', 'Password/login/payment secrets and protected browser pages are not bypassed through screenshots.', [['yes', 'limited'], ['no', 'revision']]],
      ['revision', 'Capture page revision', 'revision = tab_frame_origin_document_layout_identity()', 'Include same-document SPA changes; URL equality does not prove unchanged controls.', [['', 'frames']]],
      ['frames', 'Select authorized frames', 'frames = explicitly_covered_frame_origins()', 'A top-level grant does not imply access to a cross-origin frame. Excluded frames become coverage gaps.', [['', 'read']]],
      ['read', 'Read bounded page evidence', 'page = passive_DOM_or_accessibility_snapshot(frames)', 'Read names, roles, visible labels, states, href values and bounds. No script from the page is trusted as an assistant instruction.', [['read', 'fresh'], ['failed', 'limited']]],
      ['fresh', 'Read still authorized and current?', 'IF policy_and_document_revisions_match(revision)', 'Late content from a logged-out, navigated or revoked page cannot be published or retained.', [['yes', 'matches'], ['no', 'limited']]],
      ['matches', 'Resolve matching controls', 'matches = literal_and_contextual_matches(page, goal)', 'A broad goal gets grouped alternatives with frame/section labels. Model similarity is not target identity.', [['', 'unique']]],
      ['unique', 'Pointing target unique?', 'IF one_visible_evidenced_target', 'Two Cancel labels in separate dialogs need disambiguation before any authoritative marker.', [['yes', 'envelope'], ['no', 'candidates']]],
      ['candidates', 'Return evidenced alternatives', 'RETURN PARTIAL_with_candidates_and_frame_gaps', 'No fabricated inaccessible-frame content. The user may clarify the target or supply a permitted crop.', []],
      ['envelope', 'Build page evidence envelope', 'result = source_refs_bounds_revision_and_retention(page)', 'Bounds declare coordinate space and zoom transforms already applied; pointing performs independent calibration.', [['', 'finish']]],
      ['finish', 'Return current page evidence', 'RETURN read_only_page_result', 'Navigation/login/form submission remain user actions. Common cleanup runs even after a partial read.', []],
      ['limited', 'Return a browser limitation', 'RETURN denied_stale_or_unsupported_with_no_marker', 'Do not upgrade permission, reuse a stale grant or switch to a wider capture automatically.', []]
    ]
  },
  {
    id: 'limits', prefix: 'LIMIT', title: '37 Cannot Help Yet',
    notes: 'SC-01..21; EA-JOURNEY-02, EA-QUALITY-01. Separate useful partial output, clarification, unsupported capability, cancellation and internal failure. Safety abstention does not establish feature support.',
    nodes: [
      ['reason', 'Classify the blocking reason', 'reason = typed_failure_from_adapter_engine_or_policy()', 'Use explicit error types, not the model guessing why a tool failed.', [['', 'stop']]],
      ['stop', 'Task ended or authority lost?', 'IF cancelled_expired_locked_or_revoked', 'Revoked content is not a permissible partial answer. Stop cannot trigger a retry.', [['yes', 'cancel'], ['no', 'boundary']]],
      ['cancel', 'Return the ended outcome', 'RETURN CANCELLED_if_user_stop_else_UNAVAILABLE(AUTHORITY_ENDED)', 'Remove markers, discard in-flight content and run common cleanup. Do not ask repeatedly for the same permission.', []],
      ['boundary', 'Requested capability outside ZI?', 'IF external_execution_or_unapproved_feature', 'An antivirus launch or autonomous browser action is not converted into a hidden internal tool.', [['yes', 'unavailable'], ['no', 'retry']]],
      ['retry', 'A safe bounded retry exists?', 'IF transient_failure AND same_live_scope AND retry_budget_remaining', 'Retry only a passive read/computation; no new authority, unbounded loop or private screenshot fallback.', [['yes', 'attempt'], ['no', 'facts']]],
      ['attempt', 'Retry the permitted operation', 'result = one_bounded_same_scope_attempt()', 'A request tracks a shared retry count; recursion cannot reset it.', [['success', 'verified'], ['failed', 'facts']]],
      ['verified', 'Return the verified result', 'RETURN VERIFIED_with_provenance_and_coverage', 'Verified means evidence satisfies the supported result contract, not that the model self-certified its prose.', []],
      ['facts', 'Useful permitted evidence remains?', 'IF independently_supported_facts_remain', 'If only some branches are unreadable, preserve correct facts without implying full coverage.', [['yes', 'partial'], ['no', 'input']]],
      ['partial', 'Present the supported subset', 'show_verified_facts_with_specific_gaps()', 'Do not invent the missing portion; distinguish facts, inferences and proposed next steps.', [['', 'input']]],
      ['input', 'User input could resolve the gap?', 'IF one_clear_missing_item_can_unlock_progress', 'Examples: app version, one open menu, an unambiguous equation, or an approved smaller input.', [['yes', 'ask'], ['no', 'unsupported']]],
      ['ask', 'Ask one focused question', 'RETURN NEEDS_INPUT_with_existing_partial_facts', 'Explain the exact missing evidence and least-invasive way to provide it. Waiting is bounded and cancelable.', []],
      ['unsupported', 'Capability or budget unavailable?', 'IF unsupported_input_or_resource_limit', 'Resource pressure can cause a temporary limitation. Baseline tests still require positive feature completion.', [['yes', 'unavailable'], ['no', 'failed']]],
      ['unavailable', 'Explain the capability limit', 'RETURN UNAVAILABLE_or_PARTIAL_with_reason', 'Offer user-run steps only when supported by evidence. No fake completion or suggestion to disable privacy controls.', []],
      ['failed', 'Report the internal failure', 'RETURN FAILED_with_content_free_diagnostic', 'Do not blame the user, expose secrets in logs or call an engine crash a valid mathematical result.', []]
    ]
  },
  {
    id: 'settingsHelp', prefix: 'OPT', title: '38 Settings & Rich Help',
    notes: 'SC-16/17/34/39; EA-SET-01..04. SETTINGS.md lists 72 setting groups. Every constituent option gets accessible help; opening help never mutates policy.',
    nodes: [
      ['event', 'Receive a settings event', 'event = settings_user_event()', 'The same definitions drive first-run setup and revisitable settings.', [['help', 'definition'], ['change', 'proposal']]],
      ['definition', 'Load the option help contract', 'help = setting_schema.help(option_id)', 'Purpose, default/effective value, data effects, scope/lifetime, CPU/RAM, dependencies, risk and example must be present.', [['', 'mode']]],
      ['mode', 'Pinned details requested?', 'IF click_tap_or_explicit_open', 'Hover and keyboard focus expose a concise explanation. Click/tap opens persistent details.', [['yes', 'pin'], ['no', 'tooltip']]],
      ['pin', 'Show rich option details', 'show_focusable_dismissible_help(help)', 'Provide keyboard navigation and an accessible name without obscuring the related control.', [['', 'dismiss']]],
      ['tooltip', 'Show the option tooltip', 'show_hoverable_focus_visible_tooltip(help)', 'It remains while hovered/focused and is dismissible; pointer-only help is insufficient.', [['', 'dismiss']]],
      ['dismiss', 'Handle help dismissal', 'dismiss_on_Escape_or_explicit_close()', 'Restore meaningful focus. Help reads settings but never enables observation, collection or microphone access.', [['', 'done']]],
      ['proposal', 'Create a settings proposal', 'proposal = typed_change_preset_reset_or_import()', 'Presets and imported settings are not grants. CFG expands module dependencies, explicit profile switching and declarative configuration; this link is detail, not a second settings transaction. Restore defaults does not erase work.', [['', 'validate']], 'moduleProfiles'],
      ['validate', 'Validate values and dependencies', 'result = validate_against_approved_schema(proposal)', 'Reject unknown fields, invalid budgets, executable expressions and unsupported feature additions.', [['valid', 'effective'], ['invalid', 'error']]],
      ['effective', 'Calculate effective policy', 'effective = deny_precedence_and_scope_intersection(proposal)', 'Show conflicts between chosen values and stronger rules instead of pretending a switch took effect.', [['', 'preview']]],
      ['preview', 'Preview the settings changes', 'show_diff_data_effects_and_grants(effective)', 'Explain source access, retention, lifetime, resource consequences and whether work will be canceled.', [['', 'consent']]],
      ['consent', 'User confirms affected grants?', 'IF explicit_review_accepts_required_new_permissions', 'Grant scope and lifetime must be reviewed; a saved file cannot silently restore consent.', [['yes', 'restrict'], ['no', 'done']]],
      ['restrict', 'Apply immediate restrictions', 'revoke_affected_live_leases_before_commit()', 'Turning reading off takes effect now even if the disk is full. Permissive changes wait for successful persistence and activation.', [['', 'commit']]],
      ['commit', 'Commit settings atomically', 'result = compare_and_commit_current_policy_revision()', 'A concurrent settings change invalidates the preview and must be reviewed again.', [['saved', 'activate'], ['failed', 'error']]],
      ['activate', 'Activate confirmed settings', 'reconcile_capabilities_against_saved_live_policy()', 'Show actual grant state. Startup/autostart is not blanket authority to observe.', [['', 'done']]],
      ['error', 'Explain unapplied settings', 'show_error_with_actual_restrictive_state()', 'Keep confirmed restrictive changes active. A failed save is never reported as persistent success.', [['', 'done']]],
      ['done', 'Return to settings', 'RETURN actual_effective_settings', 'Cancel/close preserves the previous values except explicit immediate safety restrictions already applied.', []]
    ]
  },
  {
    id: 'quality', prefix: 'QUAL', title: '39 Quality Before Speed',
    notes: 'SC-10/19; EA-RAM-03, EA-QUALITY-01. Engineering feasibility/release workflow, not a ZI tool. No candidate has been benchmarked for EA.',
    nodes: [
      ['profile', 'Define the baseline machine', 'profile = named_4GB_total_RAM_CPU_only_environment()', 'Record bytes of RAM, CPU, OS/compositor, foreground workload, storage and swap policy. A 4GB process limit on a 16GB host is not the whole baseline.', [['', 'fixtures']]],
      ['fixtures', 'Version the evaluation fixtures', 'suite = positive_and_negative_cases_for_every_included_ZI_feature()', 'Use independent target identities, analytic math answers, privacy canaries and expected unsupported cases.', [['', 'candidate']]],
      ['candidate', 'Select a candidate configuration', 'candidate = model_runtime_quantization_context_and_modules()', 'Document hashes, licenses and exact artifacts. P-17 compares one optimization at a time on development fixtures, then evaluates finalists on untouched held-out cases. WORK specifies staged residency; weights-on-disk are not runtime memory.', [['', 'license']]],
      ['license', 'Free offline distribution allowed?', 'IF reviewed_distribution_manifest_passes', 'All runtime/model/tokenizer/voice/data artifacts require a compatible release manifest.', [['yes', 'correctness'], ['no', 'reject']]],
      ['correctness', 'Measure correctness and precision', 'quality = independent_fixture_evaluation(candidate)', 'Record positive coverage, wrong claims, wrong targets, math errors and correct abstentions separately.', [['', 'qualityGate']]],
      ['qualityGate', 'Accuracy and privacy gates pass?', 'IF all_approved_quality_and_boundary_gates_pass', 'A faster candidate cannot buy acceptance by guessing targets or loosening numerical tolerance.', [['yes', 'resources'], ['no', 'reject']]],
      ['resources', 'Measure whole-system resources', 'resources = complete_process_tree_and_OS_trace(profile)', 'Include OCR, math, ASR, TTS, embeddings, renderer, KV cache, mapped weights and startup peaks. P-17 instruments cross-stage copies and worker handoffs; nominal serialization is not evidence that old weights were released.', [['', 'ramGate']]],
      ['ramGate', 'Every ZI feature works on 4 GB?', 'IF all_positive_feature_cases_complete_within_approved_bounds', 'Serial workers and disclosed lower rendering detail are allowed. Refusal-only tests and required cloud/GPU/higher RAM fail.', [['yes', 'latency'], ['no', 'reject']]],
      ['latency', 'Measure end-to-end latency', 'timings = cold_warm_progress_completion_and_stop_trials()', 'Record sample counts, median, p95 and worst cases; llama-bench alone excludes application overhead.', [['', 'pareto']]],
      ['pareto', 'Compare passing configurations', 'ranking = latency_energy_tradeoffs_within_quality_gates()', 'Keep quality gating separate from speed ranking. Do not summarize all outcomes into a score that hides safety regressions.', [['', 'more']]],
      ['more', 'Another candidate remains?', 'IF unevaluated_approved_candidate_exists', 'Bound the engineering experiment and preserve all failed runs, not only the best result.', [['yes', 'candidate'], ['no', 'any']]],
      ['reject', 'Record the rejected candidate', 'record_failed_gate_and_evidence_without_private_payloads()', 'Failure is useful evidence. No silent higher-RAM tier or lower accuracy target.', [['', 'more']]],
      ['any', 'A complete candidate passed?', 'IF at_least_one_candidate_meets_all_contracts', 'An attractive demo is not enough if a required feature family fails the baseline.', [['yes', 'record'], ['no', 'blocked']]],
      ['record', 'Record a supported configuration', 'RETURN measured_profile_with_limits_and_reproduction_steps', 'A recommendation applies only to the tested versions and workload. It is not universal crash prevention.', []],
      ['blocked', 'Report the feasibility blocker', 'RETURN unresolved_requirement_for_analysis_review', 'Keep analysis open if a binding requirement cannot be supported; do not quietly omit the feature.', []]
    ]
  },
  {
    id: 'freeze', prefix: 'BASE', title: '40 Analysis Sign-Off',
    notes: 'EA-FREEZE-01; END-STATE.md G-01..08. No new features after user sign-off. This project is still open analysis, not an approved baseline.',
    nodes: [
    ['inventory', 'Review the complete inventory', 'inventory = explicit_include_exclude_decisions(F_01_to_F_35)', 'All 35 families require a decision. Optional means disableable, not unspecified. F-31 is ZII only; F-33..35 are explicit pre-freeze customization, artifact and annotation additions.', [['', 'bounds']]],
      ['bounds', 'Resolve supported boundaries', 'resolve_formats_languages_platforms_math_and_permission_limits()', 'No unnamed other tools, vague all apps claim or hidden later feature extension.', [['', 'trace']]],
    ['trace', 'Check requirement traceability', 'trace = validate_whole_inventory_and_refinement_links()', 'ALIGNMENT.json covers each feature, flow, pseudocode section, individual acceptance ID, setting, evidence entry and experiment. Every criterion needs a scenario citation and every scenario names detailed flows. REFINEMENTS.json retains R-01..08 node links. Structural coverage is not semantic approval or runtime evidence.', [['', 'feasible']], 'assurance'],
      ['feasible', 'Critical feasibility demonstrated?', 'IF G_04_four_GB_spikes_have_evidence', 'Focused analysis experiments are required; a finished production application is not required to enter design.', [['yes', 'review'], ['no', 'open']]],
      ['review', 'Review all analysis exit gates', 'gates = privacy_licenses_oracles_risks_and_document_sync()', 'G-01..08 must each have an explicit status and unresolved issues cannot disappear into a diagram.', [['', 'ready']]],
      ['ready', 'All sign-off prerequisites met?', 'IF every_gate_ready_for_user_review', 'Draft targets and unsigned documents are not a frozen contract.', [['yes', 'sign'], ['no', 'open']]],
      ['sign', 'Request explicit user sign-off', 'decision = user_approves_complete_baseline()', 'No automatic phase transition because documentation grew or a tool test passed.', [['approved', 'snapshot'], ['revise', 'open']]],
      ['snapshot', 'Record the approved baseline', 'baseline = versions_hashes_feature_IDs_exclusions_and_test_plan()', 'The live diagram and notes must be reconciled; preserve the approved snapshot separately.', [['', 'change']]],
      ['change', 'Review a proposed later change', 'change = classified_design_or_implementation_change()', 'Implementation sequencing is permitted only for already approved capabilities.', [['', 'new']]],
      ['new', 'Change adds a capability?', 'IF new_outcome_permission_format_platform_or_behavior', 'An arbitrary module/plugin cannot evade the feature freeze.', [['yes', 'reject'], ['no', 'repair']]],
      ['repair', 'Verify within-scope change', 'RETURN traced_design_bugfix_or_security_repair', 'Retest affected criteria; preserve approved behavior. Infeasibility is a blocker, not silent scope reduction.', []],
      ['reject', 'Reject the feature addition', 'RETURN outside_frozen_scope', 'Do not implement the new feature under the existing baseline.', []],
      ['open', 'Keep analysis open', 'RETURN unresolved_decisions_with_owner_and_evidence_needed', 'No baseline signature or semantic sync approval is fabricated.', []]
    ]
  },
  {
    id: 'voice', prefix: 'VOICE', title: '41 Local Voice Session',
    notes: 'F-20; SC-14; EA-VOICE-01. Push-to-talk and spoken replies are independent. Typed requests reuse the reply stages without entering microphone stages. One owner-bound task spans capture, confirmation, help and speech; positive local voice tests remain mandatory on 4 GB.',
    nodes: [
      ['request', 'Receive push-to-talk', 'task = create_explicit_voice_task_before_capture(event)', 'A trusted microphone-button event binds one owner/session and finite ledger before acquisition. No always-listening microphone or speech inferred from background observation.', [['', 'grant']]],
      ['grant', 'Microphone grant live?', 'IF input_enabled AND microphone_consent_live', 'OS permission, source scope and EA user choice must all agree.', [['yes', 'budget'], ['no', 'limited']]],
      ['budget', 'Reserve voice resources', 'lease = resource_guard.admit_serial_voice_stage(task.ledger)', 'Capture, recognition, confirmation, classification and reply use the same shrinking parent. Unload incompatible workers before this stage; no upload or replacement ledger.', [['admitted', 'record'], ['denied', 'limited']]],
      ['record', 'Capture bounded utterance', 'audio = bounded_capture_and_close_microphone(task)', 'Close the device at release/Stop/deadline before transcription or confirmation. Visible recording status reflects the actual device, not an open handle through the answer wait.', [['captured', 'transcribe'], ['ended', 'finish']]],
      ['transcribe', 'Transcribe locally', 'transcript = approved_ASR.decode(audio)', 'Record selected language and ambiguity. Separate transcript lifetime from raw-audio lifetime.', [['decoded', 'release'], ['failed', 'limited']]],
      ['release', 'Release recognition resources', 'release_ASR_worker_and_ineligible_audio()', 'The next inference or math stage must fit the same complete-process resource budget.', [['', 'confirm']]],
      ['confirm', 'Clarification required?', 'IF transcript.ambiguous OR intent.has_consequential_effect', 'Misheard delete my history cannot be treated as an approved deletion. Memory manager confirmation still applies.', [['yes', 'edit'], ['no', 'dispatch']]],
      ['edit', 'Request transcript confirmation', 'transcript = bounded_confirmation_under_existing_task(task)', 'Keep uncertainty visible; use the existing question/time/owner limits. Decline/cancel/expiry performs no operation and cannot renew the task. Consequential own-data/settings actions still require their separate exact confirmation.', [['accepted', 'dispatch'], ['cancelled', 'finish']]],
      ['dispatch', 'Dispatch the ordinary request', 'result = on_help_request(transcript, existing_task = task)', 'The common deliver_requested_help path expands into dispatch and reply stages once. Preserve the original task through ASR/help; invalid or expired tasks fail closed. Voice grants no desktop access, retention or external execution.', [['', 'speak']], 'capabilities'],
      ['speak', 'Spoken reply enabled?', 'IF output_enabled AND result.has_live_speakable_payload AND current_result_may_be_spoken', 'Shared reply stage for typed and voice help; typed output needs no mic permission. Recheck owner, source, expiry and mute policy. Failed/needs-input results are not completed answers; TTS uses the original shrinking ledger.', [['yes', 'synthesize'], ['no', 'finish']]],
      ['synthesize', 'Synthesize a local reply', 'audio_reply = resource_guarded_local_TTS(result)', 'Text is already available; selected voice artifacts need license and 4GB evaluation.', [['ready', 'play'], ['failed', 'limited']]],
      ['play', 'Play the permitted reply', 'play_with_immediate_mute_and_stop(audio_reply)', 'Cancel output on Stop, source revocation or session termination; no unsolicited background speech.', [['', 'finish']]],
      ['limited', 'Explain voice unavailability', 'show_typed_fallback_and_specific_reason()', 'A speech failure preserves the existing text/marks without rerunning help, repeating a memory/settings operation or starting another ledger. Fallback is not a positive voice conformance pass.', [['', 'finish']]],
      ['finish', 'Release voice-session resources', 'RETURN after_audio_device_worker_and_buffer_cleanup', 'Common finally applies on all failures, including recognizer crashes and canceled synthesis.', []]
    ]
  },
  {
    id: 'personalTools', prefix: 'TOOL', title: '42 Internal Assistant Tools',
    notes: 'F-15..18, F-32; SC-11/12/18/21; EA-TOOLS-01, EA-CHART-01..05. Notes, calendar, conversions, logic and embedded Archi diagrams operate only inside EA. Finite domains and budgets require pre-freeze approval.',
    nodes: [
      ['intent', 'Accept an internal-tool request', 'task = explicit_typed_internal_request()', 'Carry cancellation, resource budget and source provenance from supplied or authorized content.', [['', 'supported']]],
      ['supported', 'Tool belongs to approved scope?', 'IF typed_registry.supports(task.kind)', 'No fallback from an unsupported intention to shell code or arbitrary plugins.', [['yes', 'sources'], ['no', 'limited']]],
      ['sources', 'Input sources still permitted?', 'IF provenance_policy_and_revisions_match()', 'A draft that quotes an observed file inherits its retention restrictions.', [['yes', 'kind'], ['no', 'limited']]],
      ['kind', 'Select the internal service', 'service = task.kind', 'Each service validates a typed schema. Writing in EA is distinct from editing a target app.', [['draft', 'draft'], ['schedule', 'schedule'], ['logic', 'logic'], ['convert', 'convert'], ['chart', 'chart']]],
      ['draft', 'Assemble an inert artifact', 'result = code_text_or_checklist_under_explicit_output_contract()', 'MAKE expands formatting, bounded generation, preview and explicit transfer for EA-owned artifacts. Source facts remain attributed; code/tests/configurations/patches are never executed or applied.', [['', 'present']], 'artifacts'],
      ['schedule', 'Validate the schedule', 'result = calendar_engine.validate_recurrence_zone_and_DST()', 'Ask about ambiguous/nonexistent times. Attachments/links stay inert; no external invites or calendar writes.', [['valid', 'present'], ['ambiguous', 'limited']]],
      ['logic', 'Check the bounded plan', 'result = check_declared_branches_under_shared_limits(task)', 'R-04: user-reviewed finite-domain guards, gaps/overlaps, counterexamples and bounded path coverage. UNKNOWN/TIMEOUT are incomplete. No action execution, automatic chart generation or universal proof.', [['', 'present']], 'branchCheck'],
      ['convert', 'Calculate the conversion', 'result = units_duration_or_timezone_library(task)', 'Use dated offline rules; user-supplied rates are not verified current exchange rates.', [['', 'present']]],
      ['present', 'Present result and limitations', 'show_typed_result_with_oracle_and_coverage(result)', 'Calculations and schedule previews are not automatically durable work.', [['', 'save']]],
      ['save', 'Durable save explicitly requested?', 'IF user_requests_save_or_scheduled_reminder', 'A reminder across restart requires a permitted saved schedule; otherwise offer an explicit session-only timer.', [['yes', 'eligible'], ['no', 'finish']]],
      ['eligible', 'Result eligible for persistence?', 'IF acquisition_and_current_data_rules_allow(result)', 'Collection-off observations cannot be saved by copying them into notes or a reminder description.', [['yes', 'persist'], ['no', 'limited']]],
      ['persist', 'Save the EA-owned artifact', 'commit_with_current_data_generation(result)', 'Atomic save, revision checks, and explicit export destinations. No background write to another application.', [['saved', 'finish'], ['failed', 'limited']]],
      ['limited', 'Explain the internal-tool limit', 'CALL limits(task, current_evidence)', 'Return clarification/partial/unavailable/error accurately; do not invent an exact date, calculation or successful save.', [['', 'finish']], 'limits'],
      ['finish', 'Release tool resources', 'RETURN result_with_lifetime_and_completion_status', 'Saved reminders use occurrence IDs, bounded scheduling and persistent pending status across sleep/restart. After a crash, uncertain OS-toast delivery stays uncertain; no universal exactly-once delivery guarantee.', []],
      ['chart', 'Draft an embedded methodology chart', 'result = CALL methodology(task)', 'The requested Archi workspace is inside EA. Shared finite limits prevent runaway generation; the graph never executes its depicted workflow.', [['', 'finish']], 'methodology']
    ]
  },
  {
    id: 'adapterLifecycle', prefix: 'ADAPT', title: '43 Dataset & Adapter Lifecycle',
    notes: 'F-23; SC-19/37; EA-ADAPTER-01. User confirmed guided export/import with actual training in a separately launched self-hosted tool. LEARN makes review accessible; this flow owns compatible inference-time activation. KARL remains untouched.',
    nodes: [
      ['request', 'Accept a lifecycle request', 'request = explicit_export_or_adapter_selection()', 'No automatic training, generic GGUF injection or background dataset collection.', [['export', 'dataset'], ['adapter', 'manifest']]],
      ['dataset', 'Review eligible dataset records', 'dataset = CALL export(user_selection)', 'The export flow checks purpose consent, provenance, redaction, retention and final preview.', [['', 'exported']], 'export'],
      ['exported', 'Report export status', 'RETURN actual_export_result_and_external_copy_limits', 'A dataset file is not a trained model. No training process is launched by this flow.', []],
      ['manifest', 'Read the adapter manifest', 'manifest = bounded_safe_artifact_metadata()', 'Identify base model, tokenizer, format, quantization/runtime requirements, license, origin and data lineage.', [['', 'compatible']]],
      ['compatible', 'Exact compatibility established?', 'IF base_tokenizer_format_and_runtime_contract_match', 'An arbitrary file extension or matching parameter count is insufficient.', [['yes', 'eligible'], ['no', 'reject']]],
      ['eligible', 'Artifact provenance still eligible?', 'IF lineage_is_current_AND_public_or_exclusively_authorized_for_current_owner', 'Unknown ownership or another user\'s private training data blocks activation; renaming merged weights as a base model does not remove their lineage. Forgotten training data cannot be proven removed by deleting a database row. Block affected adapters until rebuilt or replaced.', [['yes', 'evaluate'], ['no', 'reject']]],
      ['evaluate', 'Evaluate the candidate adapter', 'evidence = bounded_internal_inference_fixtures(base_plus_adapter)', 'Use independent expected answers and measured 4 GB resource limits. The linked quality flow describes engineering validation, not an exposed external-command tool. No KARL invocation or self-certified model grading.', [['pass', 'review'], ['fail', 'reject']], 'quality'],
      ['review', 'Review activation evidence', 'show_compatibility_quality_RAM_license_and_data_limits(evidence)', 'Show differences from the last accepted model; personality is not allowed to alter target truth or math.', [['', 'approve']]],
      ['approve', 'User approves activation?', 'IF explicit_adapter_activation_confirmed', 'Loading an adapter does not broaden any read, retention, network or execution grant.', [['yes', 'activate'], ['no', 'finish']]],
      ['activate', 'Activate the compatible adapter', 'inference_registry.activate_for_live_owner_epoch_under_resource_guard()', 'Recheck owner/session and provenance at activation. Record only that owner\'s previous eligible configuration, without keeping forbidden prompt caches or loading another private adapter.', [['active', 'health'], ['failed', 'rollback']]],
      ['health', 'Runtime contract still holds?', 'IF quality_resource_and_provenance_checks_remain_valid', 'Revocation or a regression invalidates the activation; no hidden fallback upload.', [['yes', 'finish'], ['no', 'rollback']]],
      ['rollback', 'Restore the permitted configuration', 'restore_last_good_still_eligible_model_or_base()', 'Do not restore an older adapter containing forgotten data; if none qualifies, disclose that inference is unavailable.', [['', 'finish']]],
      ['reject', 'Explain the rejected adapter', 'show_incompatibility_or_quality_or_lineage_failure()', 'Preserve typed tools and evidence. Do not report machine unlearning or compatibility without proof.', [['', 'finish']]],
      ['finish', 'Return the active configuration', 'RETURN actual_model_state_and_limits', 'Late candidate output is discarded after rollback. Explicit dataset/adapter actions have their own data receipts.', []]
    ]
  },
  {
    id: 'methodology', prefix: 'CHART', title: '44 Embedded Archi',
    notes: 'F-32; SC-21; EA-CHART-01..05. Confirmed built-in workspace direction, not implemented. Explicit requests only; finite shared generation/repair budgets; no external control or workflow execution. Numeric caps remain proposals.',
    nodes: [
      ['event', 'Receive a chart request', 'request = typed_methodology_request()', 'A new chart or a selected-chart revision has a goal, inputs, completion conditions and a desired level of detail.', [['', 'explicit']]],
      ['explicit', 'Request explicitly user-originated?', 'IF request.origin == USER_REQUEST', 'EA-generated content, diagram changes, observer events, autosave and sync flags cannot start or renew generation.', [['yes', 'budget'], ['no', 'ignore']]],
    ['budget', 'Use the shared request budget', 'ledger = existing_parent_with_tighter_chart_limits(request)', 'Proposals: 3 total model passes, 90 active seconds, 200 nodes, 400 edges, 8 subflows, depth 3. Tighten the existing request ledger; only a new explicit top-level task creates one. Include classification, children and repairs; never replenish counters. An independent supervisor owns the deadline.', [['', 'inputs']]],
      ['inputs', 'Inputs permitted and sufficient?', 'IF chart_generation_enabled AND scoped_inputs_and_goal_are_available', 'Use the user request and authorized selected evidence; no unrelated project crawl. Preserve source provenance and acquisition-time persistence eligibility.', [['yes', 'snapshot'], ['no', 'limited']]],
      ['snapshot', 'Snapshot the selected EA canvas', 'baseline = canvas_revision_and_selected_content()', 'New charts start in an EA-owned draft. Imported original files are not overwrite targets; preserve unrelated user nodes and layout.', [['', 'admit']]],
      ['admit', 'Generation still admitted?', 'IF ledger.remaining AND task.live AND resource_guard.admits()', 'Check shared passes, active deadline, bytes/depth/size, cancellation and current permissions before every stage. A child cannot allocate a fresh parent budget.', [['yes', 'consume'], ['no', 'limited']]],
      ['consume', 'Consume one generation pass', 'ledger.debit_pass_before_model_call()', 'The first draft and all repair or child-generation calls consume the same monotonic count. No model-controlled counter reset.', [['', 'generate']]],
      ['generate', 'Generate a typed graph proposal', 'proposal = bounded_local_graph_draft_or_repair(request, ledger)', 'Only nodes, edges, descriptions, inert pseudocode and evidence references. No shell, application clicks, executable chart instructions or automatic follow-up requests.', [['draft', 'parse'], ['failed', 'repair']]],
      ['parse', 'Decode the bounded graph schema', 'graph = independently_validate_graph_or_typed_patch(proposal, baseline, ledger)', 'R-01/R-03: validate locally bundled schema, stable IDs, exact selected scope and source references independently of grammar output. Parse errors consume existing repair budget; the linked contract never starts a second generation call.', [['valid', 'fingerprint'], ['invalid', 'repair']], 'outputContract'],
      ['fingerprint', 'Compare semantic progress', 'progress = compare_with_seen_graphs_and_previous_issues(graph)', 'Stable node identity and typed content matter; moving nodes or paraphrasing a label is not a repaired missing branch. Keep the bounded history in request RAM.', [['', 'repeat']]],
      ['repeat', 'Repeated or stalled revision?', 'IF repeated_fingerprint_OR_A_B_A_OR_no_measurable_progress', 'Stop early instead of redrafting forever. Hard budgets still stop novelty-producing loops that evade semantic comparison.', [['yes', 'limited'], ['no', 'check']]],
      ['check', 'Check graph structure', 'issues = structural_checks_and_evidence_validation(graph)', 'Check IDs, endpoints, branch labels, reachability, atomic concepts and source references. A deliberate cycle gets an exit-condition warning, not automatic deletion or a claim of formal proof.', [['', 'valid']]],
      ['valid', 'Blocking graph errors resolved?', 'IF no_blocking_schema_structure_or_evidence_errors', 'Uncertain methodology is labeled as an assumption or unresolved item. Known false evidence or broken graph structure is not published as complete.', [['yes', 'layout'], ['no', 'repair']]],
      ['layout', 'Lay out the bounded diagram', 'draft = bounded_selected_layout_with_protected_geometry_checks(graph, baseline, ledger)', 'R-03: preserve unrelated/pinned geometry, routes, colors and manual text; layout only new or explicitly selected unpinned elements. Rendering/navigating a recursive subflow never recursively generates more charts. Preserve the last valid draft. PATCH details this same preview/commit sequence, not a second edit.', [['ready', 'preview'], ['failed', 'repair']], 'chartPatch'],
      ['preview', 'Show the editable chart proposal', 'show_embedded_Archi_preview_with_changes_and_unknowns(draft)', 'The workspace is inside EA. A preview is task RAM, not an autosaved file. The user can inspect the method without running it.', [['', 'accept']]],
      ['accept', 'User accepts this revision?', 'IF user_accepts_exact_current_proposal', 'Accept permits an EA-owned canvas edit, not a save or source-retention override. A new refinement requires another deliberate user request after this job ends.', [['yes', 'fresh'], ['no', 'finish']]],
      ['fresh', 'Canvas and policy still current?', 'IF task.live AND preview_revision_and_source_policy_still_match()', 'Recheck after user review and immediately before atomic application. Cancellation or expired temporary evidence cannot be overridden by an old approval.', [['yes', 'apply'], ['no', 'conflict']]],
      ['apply', 'Apply an undoable EA canvas edit', 'canvas.compare_and_apply_in_memory(draft, baseline)', 'Preserve unrelated edits and use revision checks at commit, not only before it. Draft/undo buffers inherit source lifetime and deletion rules.', [['applied', 'save'], ['conflict', 'conflict']]],
      ['save', 'Explicit chart save requested?', 'IF user_requests_EA_chart_save', 'Creation and acceptance do not silently enable disk history, autosave, exports or training.', [['yes', 'eligible'], ['no', 'finish']]],
      ['eligible', 'Chart eligible for persistence?', 'IF original_and_current_data_policy_allow_all_sources', 'Collection-off observations cannot be laundered through graph labels, pseudocode, thumbnails, undo history or backups.', [['yes', 'persist'], ['no', 'limited']]],
      ['persist', 'Save the permitted EA chart', 'commit_owned_chart_with_policy_and_revision_checks()', 'Explicit selected export can use the approved Archi schema. Failed saves leave valid RAM work intact and are reported accurately.', [['saved', 'finish'], ['failed', 'limited']]],
      ['repair', 'Another bounded repair allowed?', 'IF same_parent_budget_remains_AND_error_is_repairable', 'A repair is never an unbounded validation loop. Preserve the same request ID, counters, timeout and source scope.', [['yes', 'admit'], ['no', 'limited']]],
      ['conflict', 'Preserve the current user chart', 'return_conflict_without_applying_stale_changes()', 'Show what changed and require a fresh user review; never silently overwrite manual edits or automatically regenerate because the canvas changed.', [['', 'finish']]],
      ['limited', 'Report the stopping condition', 'show_last_valid_permitted_draft_and_specific_limit()', 'Stop workers; do not fabricate missing steps. Cancellation/revocation discards ineligible late data. Further work needs a new explicit user request, not self-renewal.', [['', 'finish']]],
      ['ignore', 'Ignore automatic generation triggers', 'RETURN no_chart_job_started', 'The diagram may be observed under a separate policy, but generated nodes and sync events are never user requests.', []],
      ['finish', 'Release chart-generation resources', 'RETURN actual_outcome_after_common_cleanup', 'An independent watchdog handles hung model/parser/layout work. Completed charts stay editable under their permitted lifetime; the depicted workflow is never executed.', []]
    ]
  }
];
