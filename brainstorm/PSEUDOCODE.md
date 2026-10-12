# EA ZI: Pseudocode

Analysis artifact, not runnable implementation. Rules and numeric budgets
below are proposals unless confirmed in ZI-SCOPE.md. The 65 Archi board views
expand these flows into 1066 atomic nodes. FLOW-REFERENCE.md maps every node ID
to its operation, explanation, and outgoing transitions.
CAPABILITIES.md inventories the proposed tools. ACCEPTANCE.md gives requirement
IDs, independent test oracles, negative cases, and unverified numeric targets.
END-STATE.md is the complete proposed inventory and freeze contract; SCENARIOS.md
defines 39 complex cases. Every included ZI feature must work locally on 4 GB
total system RAM. Quality gates precede latency optimization.

## Capability Boundary

```text
desktop_capabilities = {
    READ_APP_USAGE_METADATA,
    READ_UI_METADATA,
    READ_SCOPED_FILE,
    DISCOVER_APPROVED_LOCAL_FILES,
    READ_TOOLTIP,
    CAPTURE_SELECTED_REGION,
    HIGHLIGHT_CURRENT_CONTROL
}

knowledge_capabilities = {
    RETAIN_OBSERVATION, RECALL_KNOWLEDGE, EDIT_OWN_KNOWLEDGE,
    DELETE_OWN_KNOWLEDGE, EXPORT_SELECTED_KNOWLEDGE
}
internal_capabilities = {
    CALCULATE_VALIDATED_MATH, PLOT_VALIDATED_MATH,
    EDIT_EA_WORKBOOK, EXPORT_USER_SELECTED_EA_ARTIFACT,
    EDIT_EA_NOTE, MANAGE_EA_CALENDAR, SCHEDULE_EA_REMINDER,
    CONVERT_VALIDATED_UNITS, CHECK_BOUNDED_LOGIC,
    LOCAL_PUSH_TO_TALK, LOCAL_SPEECH_OUTPUT, PRESENT_CHARACTER_STATE,
    EDIT_REVIEWED_PROFILE, LOAD_VALIDATED_ADAPTER,
    DRAFT_BOUNDED_METHODOLOGY_CHART, EDIT_EA_OWNED_DIAGRAM,
    COMPOSE_APPROVED_MODULE_PROFILE, DRAFT_INERT_CODE_OR_TEXT,
    MANAGE_EA_ANNOTATION_LAYER, COPY_EXPLICIT_SELECTED_EA_PAYLOAD,
    REVIEW_ELIGIBLE_TRAINING_EXAMPLES
}
# Proposed inventory: include/exclude every entry before analysis sign-off.
# No unnamed future tools may enter after the freeze.
research_capabilities = {FETCH_PUBLIC_RESEARCH} # Explicit task only; separate egress grant.
# Menu reveal is excluded; all AI and private screen context stay local.
capabilities = desktop_capabilities + knowledge_capabilities + internal_capabilities + research_capabilities

absent_capabilities = {
    REVEAL_VERIFIED_MENU_CONTAINER, CLOUD_INFERENCE,
    RUN_SHELL_COMMAND,
    ACTIVATE_APP_COMMAND,
    CHANGE_APP_SETTING,
    WRITE_USER_FILE,
    TYPE_IN_OTHER_APP,
    INSTALL_OR_LAUNCH_SOFTWARE
}

# EA may write its own knowledge/settings when permitted by data rules.
# Selected knowledge exports are also permitted when explicitly requested.
# UI content and model output cannot extend the capability list.
```

## Settings and Rules

```text
settings = {
    pause_all_observation: false,        # includes usage metadata
    background_observation: {
        enabled: false,                  # confirmed opt-in capability; proposed default
        scope: user_selection,
        source_types: explicit_selection,
        purpose: explicit_choice,
        consent_lifetime: explicit_choice,
        capture_grant: NONE,             # distinct from a one-time screenshot grant
        max_event_rate: reviewed_limit,
        max_cache_bytes: reviewed_limit,
        cache_ttl: reviewed_limit
    },
    proactive_hints: false,              # F-29 included; separate opt-in, quiet hours and limits
    collect: false,                      # confirmed screen-history default; short-lived RAM only
    allow_ephemeral_help_when_off: true, # confirmed user preference
    recall_existing_memory: true,
    remember_software_usage: false,
    allowed_apps: user_selection,
    allowed_paths: user_selection,
    broad_read_preset: OFF,              # optional explicit grant, not background activity
    read_ui_text: true,
    read_files: per_source_permission,
    retain_raw_images: false,
    reveal_menus: EXCLUDED,              # confirmed: user opens menus
    retention: TASK_ONLY,
    training_eligible: false,
    public_research: EXPLICIT_REVIEWED_TASK_ONLY,
    cloud_inference: EXCLUDED,
    panel_toggle: SUPER_SHIFT_8,         # click/remap fallback; independent of observation
    resource_budget: measured_low_ram_profile,
    policy_generation: 1
}

authorize(operation, source, purpose):
    reject if trusted_owner_or_session_generation_does_not_match_current_context
    reject private access unless source_namespace_and_lineage_authorize_current_owner
    reject if operation is outside capabilities
    reject acquisition if pause_all_observation
    reject acquisition unless explicit_task_lease OR live_background_lease
    reject background acquisition unless background_observation.enabled
    reject background acquisition outside its scope/types/purpose/lifetime
    reject background acquisition while locked or source identity is uncertain
    reject background menu reveal, focus changes, input injection, or unsolicited pointing
    reject if source is outside its typed local-source or public-research grant
    reject network unless explicit_research_task_and_exact_egress_grant_match
    reject outbound screen_context_local_files_private_memory_or_private_model_output
    reject background network, cloud inference, menu reveal, credentials or browser control
    rules = matching(global_rules, app_rules, source_rules, purpose)
    reject if any applicable rule denies this operation
    reject retention if collect == false
    reject recall if recall_existing_memory == false
    reject training use unless explicitly eligible for that purpose
    return permission(
        operation, source, purpose,
        expires_at = shortest_applicable_retention,
        generation = settings.policy_generation
    )
```

## Shared Operation Contract

This contract applies to every node and helper, including older overview flows.
Detail links describe stages of the same operation, not an extra invocation.
Implicit failure/exception edges return to the caller's typed failure and finally
cleanup path; a missing drawn error arrow is never permission to continue.

```text
OperationEnvelope = {
    trusted_principal, session_generation, task_id, policy_generation,
    data_generation, source_revisions, source_lineage, purpose,
    acquisition_eligibility, expires_at, existing_parent_ledger
}

before_access_or_effect(operation, envelope):
    require registered_operation_AND_current_owner_epoch_and_policy(envelope)
    require source_namespace_and_lineage_authorize_current_owner_before_access()
    require live_scope_purpose_expiry_and_remaining_parent_limits()
    if operation.acquires_external_source:
        require protected_source_exclusions_enforceable_before_acquisition()
    require one_supervised_heavy_stage_if_expensive()
    # Read, recall, display, speech, clipboard, writes and callbacks all carry this envelope.

before_publish_or_commit(result):
    require owner_epoch_policy_data_sources_and_exact_result_revision_still_current()
    require desktop_unlocked_for_private_presentation()
    require no_cancellation_revocation_tombstone_or_expiry()
    require every_source_retains_its_original_lineage_and_eligibility()
    # Check again atomically at the effect, not merely before an asynchronous wait.

on_failed_guard:
    invalidate_affected_output_before_bounded_owned_worker_cleanup()
    return actual_typed_outcome_without_claiming_completion()

on_every_exit:
    close_handles_and_release_nonreturned_private_buffers_without_automatic_retry()
    # Eligible returned results retain a bounded owner/source-bound lifetime.
```

Explicit user-authored notes/settings may be saved without collecting observations;
source-derived fields still need capture-time AND current retention eligibility.
Training-purpose consent is required for datasets, not ordinary knowledge exports.
An export may create only a reviewed new inert artifact, never overwrite source
files, execute content, paste into another app or auto-open the result.

Only a trusted new explicit top-level request creates a parent ledger. Dispatch,
classification, nested helpers, repairs and providers debit or tighten it. User
clarification resumes that same ledger without renewal. A requested continuation
after a limit is a new task with a fresh authorization check, not a reset of the
old task; reused evidence keeps its original expiry and sticky eligibility.
Interactive plot/layer sessions release workers between user events; they do not
automatically regenerate. A bounded live presentation session may remain until
dismissal/expiry; it cannot retain an inference worker while the user reads it.

## Help Loop

```text
on_start:
    show_companion(movable = true, resizable = true, content_reflows = true)
    use_focus_only_when_user_interacts()
    leave_model_unloaded()
    reconcile_background_subscriptions_from_valid_reviewed_policy()
    wait_for_user_or_authorized_observer_event()

on_help_request(question, existing_task = NONE):
    task = NONE
    worker = NONE
    try:
        task = bind_matching_live_task_or_resume_question_or_create_explicit_request(question, existing_task)
        # A supplied but invalid/expired task is rejected, never replaced by a fresh ledger.
        context = eligible_bounded_conversation_context(question.thread)
        intent = resolve_user_intent_from_supplied_input_and_context(question, context) # CAP / TALK
        if intent.needs_clarification:
            present_bounded_clarification(intent, task) # No source reads while waiting.
            return NEEDS_INPUT
        if intent.kind == PUBLIC_RESEARCH:
            result = research_public_sources(question.public_input, task) # WEBR; no desktop read.
            revalidate_task_policy_and_result_provenance(task, result)
            present_or_hold_result_without_reopening_hidden_panel(result)
            maintain_eligible_conversation_context(question, result)
            retain_only_explicitly_eligible_result_candidates(result, task)
            return handoff_eligible_result(result, task)
        if not intent.needs_external_context:
            # Reviewed own-data/settings commands use CTRL, never an external executor.
            result = run_supported_internal_service_or_explain_limit(intent, task)
            revalidate_task_policy_and_result_provenance(task, result)
            present_internal_result(result)
            maintain_eligible_conversation_context(question, result)
            retain_only_explicitly_eligible_result_candidates(result, task)
            return handoff_eligible_result(result, task)

        if pause_all_observation:
            offer_pasted_input_or_allowed_existing_memory_without_new_reads()
            return NEEDS_INPUT

        scoped = request_flow(question, lifecycle = task) # ASK; preserve cleanup ownership on denial.
        if scoped is NONE or scoped.cancelled:
            return CANCELLED_OR_DENIED
        task = scoped

        # Sticky at acquisition time; toggling collection later cannot raise it.
        task.persist_eligible = sticky_acquisition_eligibility_intersected_with_current_rules(task)
        task.capture_generation = policy.generation
        task.deadline = min(task.deadline, bounded_deadline())
        task.max_bytes = min(task.remaining_bytes, configured_task_cache_limit)

        if intent.kind == COMPUTER_SEARCH:
            evidence = search_approved_computer_sources(task) # SEEK, then EXTRACT
        else:
            evidence = inspect_authorized_sources(task)    # UI / MENU / FILE / VIS
            if intent.requests_extraction:
                evidence = extract_readable_evidence(evidence, intent.selector, task.ledger, task.coverage)
        if evidence.status == NEEDS_INPUT:
            present_bounded_clarification(evidence.missing_detail, task)
            return NEEDS_INPUT
        memory = retrieve_currently_allowed(task)      # FIND
        bundle = assemble_revisioned_claims_with_source_status(evidence, memory)  # FACT / CASE
        if intent.requires_current_information AND not current_identity_and_time_supported(bundle):
            present_missing_current_source_or_offer_separately_requested_public_research()
            return NEEDS_INPUT
        if task.goal == LINK_REVIEW:
            bundle += static_link_review_without_network()
        if task.goal == SCAN_HELP:
            bundle += guidance_for_user_run_scanner_only()
        if task.goal == ASSEMBLE_WORK:
            bundle += proposed_outline_without_external_changes()

        if intent.has_registered_internal_result_kind:
            # CAP reuses this intent, evidence and parent ledger; no second acquisition loop.
            # Uncertain extracted mathematics still requires expression confirmation.
            answer = run_supported_internal_service_with_evidence(intent, bundle, task)
        else:
            worker = admit_one_heavy_worker_or_template()  # RAM
            draft = grounded_constrained_draft_or_template(bundle, worker)  # LLM / OUT
            answer = validate_typed_output(draft, task, bundle)
            if task.requests_troubleshooting_case:
                release_heavy_worker(worker) # No inference worker held while awaiting a user test.
                worker = NONE
                answer = assemble_casework_from_verified_claims_and_user_reports(answer)
        revalidate_policy_and_source_revisions(task, answer)
        release_heavy_worker(worker) # Presentation holds no inference worker.
        worker = NONE
        maintain_eligible_conversation_context(question, answer)
        present_answer_and_coverage(answer)            # SHOW
        if answer.has_requested_highlight:
            answer.marker = register_requested_marker_session(answer.target, task) # POINT; nonblocking
        # No application command follows. The user performs any fix.

        for candidate in explicitly_eligible_memory_candidates(task):
            retain_under_serialized_policy_gate(candidate)  # SAVE
        return handoff_eligible_result(answer, task)
    catch Cancelled:
        publish_content_free_status("Cancelled")
        return CANCELLED
    catch RevokedOrTargetChanged:
        discard_pending_answer()
        publish_content_free_status("Scope changed")
        return REVOKED
    catch ResourceLimit:
        return present_and_handoff_eligible_partial_result_or_content_free_limit(task)
    catch ReadOrParserError:
        present_safe_error_without_source_content_in_logs()
        return READ_OR_PARSE_ERROR
    finally:
        cancel_untransferred_adapter_operations(task)
        close_untransferred_read_handles(task)
        release_heavy_worker(worker)
        cancel_and_release_untransferred_internal_service_workers(task)
        evict_task_prompt_context(task)
        release_only_untransferred_task_resources(task)
        return_companion_to_idle()

handoff_eligible_result(result, task):
    require current_owner_epoch_policy_source_revisions_and_original_expiry(task, result)
    result = typed_status_payload_and_optional_presentation_handles(result)
    transfer_only_live_result_buffers_and_requested_presentation_to_owned_session(result)
    # No new authority, ledger, TTL or persistence. Result bytes count in the existing cache.
    # Revocation, lock, Stop, expiry and deletion invalidate every recipient, including TTS.
    return result

```

## Computer-Wide Search

SEEK describes requested discovery, not a service that scans the computer by
default. All permissions, finite budgets and 4 GB constraints still apply.

```text
search_approved_computer_sources(task):
    require explicit_user_search_intent_and_reviewed_local_roots(task)
    require permission_to_enumerate_metadata_AND_read_supported_content(task)
    ledger = child_budget_with_tighter_parent_limits(
        active_seconds = 60, visited_entries = 10000, source_bytes = 64_MiB,
        queues_identity_sets_and_results = existing_cache_limits)
    # Proposed, unmeasured caps; include traversal, decoding, ranking and extraction.
    walker = bounded_permission_filtered_filesystem_iterator(task.roots, ledger)
    results = bounded_ranked_evidence_buffer()
    coverage = scoped_snapshot_coverage_without_protected_path_names()
    try:
        while ledger.admits_another_entry AND task.live:
            entry = walker.next_debiting_every_directory_and_file_visit()
            if entry == END: mark_traversal_exhausted(); break
            if not current_scope_allows(entry): record_safe_gap(DENIED); continue
            identity = verified_regular_local_identity_without_link_or_mount_escape(entry)
            if identity.invalid: record_safe_gap(UNSUPPORTED_ENTRY); continue
            if bounded_seen_set.contains(identity): record_duplicate(); continue
            if not bounded_seen_set.can_add(identity): stop_with_gap(RAM_LIMIT); break
            bounded_seen_set.add(identity)
            try:
                for chunk in supervised_supported_chunks(identity, max_chunk = 256_KiB,
                                                         shared_ledger = ledger):
                    require current_task_scope_handle_identity_and_source_revision_match()
                    matches = exact_terms_identifiers_sections_and_optional_scoped_semantics(chunk)
                    results.retain_bounded_matches_with_source_locators(matches)
                    coverage.record_actual_bytes_revision_and_decode_status(chunk)
            catch DecodeOrFileRevisionFailure as error:
                results.discard_affected_revision(identity)
                coverage.record_safe_file_gap(error)
                continue # One unreadable file does not end a still-admitted pass.
            if FAST_mode AND requested_fast_result_found: record_early_stop(); break
            # THOROUGH mode does not reject content just because its filename ranks poorly.
    catch BudgetOrTraversalFailure as error:
        coverage.record_actual_failure_and_unread_frontier(error)
    finally:
        close_read_handles_and_iterator_without_persisting_private_inventory()
    require task_and_policy_still_live # Cancellation/revocation propagates to common cleanup.
    if extraction_still_admitted_under_same_ledger:
        return extract_readable_evidence(results, task.selector, ledger, coverage)
    return already_verified_permitted_partial_evidence_with_actual_coverage()
```

No hidden full-disk list, unlimited dedup set, disk-spooled cache when collection
is off, source execution or administrator request. A result can be complete only
for the named inspected snapshot and declared supported scope. Report unread
bytes/files, missing matches, truncation and changing sources; zero found matches
does not prove absence in uninspected data. Readable extraction is not file export.
A new user-requested pass revalidates any permitted temporary continuation cursor;
expired cursors are discarded. Changed snapshots cannot be merged into fake full
coverage. Search completion never starts a new pass or chart automatically.

## Readable Evidence Extraction

EXTRACT accepts selected files, search results or other already-permitted source
references. Quotes, explanations and calculations remain visibly distinct.

```text
extract_readable_evidence(candidates, selector, ledger, coverage):
    require ledger.live AND every_source_currently_permitted(candidates)
    target = resolve_document_identity_edition_and_exact_selector(selector, candidates)
    if target.ambiguous:
        return NEEDS_INPUT_with_evidenced_choices_or_free_text()
    source_range = bounded_exact_section_or_table_and_necessary_context(target, ledger)
    if missing_or_uncertain_exact_target(source_range): return specific_evidence_gap()
    facts = preserve_literals_numbers_units_rows_columns_qualifiers_and_footnotes(source_range)
    validate_exact_identifier_not_substring_match() # 432 is not 4320.
    if calculation_requested: use_existing_math_service_with_cited_inputs_and_same_limits()
    result = format_excerpt_explanation_or_table_with_unknowns_and_omitted_ranges(facts)
    result.citations = source_revision_edition_section_printed_page_viewer_page_row_or_byte_range()
    require policy_data_task_and_source_revisions_still_match()
    result.lineage_and_retention = original_source_rules_without_escalation()
    return result
```

Do not choose silently between document 1113, section 1113 and a claimed total of
1113 rules. Unsupported office/archive/encrypted formats remain explicit gaps
until their parsers and resource/privacy contracts are included before freeze.
This requirement does not quietly expand the approved file-format inventory.

## Clarification And Conversation Continuity

TALK covers the whole user-turn lifecycle; its clarification helpers do not
recursively dispatch another conversation or reset an existing parent budget.
The user confirmed local files and visible apps/pages only for current information.

```text
present_bounded_clarification(intent, task):
    require task.live AND task.remaining_question_rounds > 0
    require material_missing_detail_changes_answer_or_scope(intent)
    missing = canonical_missing_detail_ID(intent)
    if task.already_asked(missing): return NEEDS_INPUT_without_repetition
    task.debit_and_record_question_before_display(missing)
    question = controller_bound_question_ID_with_task_policy_and_expiry()
    show_one_question_with_meaningful_choices_or_free_text_plus_skip_cancel(question)
    release_heavy_workers_and_close_source_read_handles()
    return WAITING_FOR_EXPLICIT_SUBMISSION
    # Default selection, timeout and source text never count as an answer or grant.

on_clarification_response(event):
    require event.origin == USER_SUBMISSION
    require matching_live_question_ID_task_and_policy_generation(event)
    if event.cancelled: invalidate_task_and_question(); return CANCELLED
    if event.skipped: return labeled_low_risk_assumption_or_NEEDS_INPUT()
    attribute_answer_to_user_and_update_intent_without_overwriting_source_facts()
    if proposed_scope_widens: require_separate_explicit_source_grant()
    resume_same_parent_task_without_renewing_deadline_or_question_budget()

maintain_eligible_conversation_context(user_turn, result):
    state = {topic, goals, entities, user_corrections, attributed_claims,
             source_revision_refs, unresolved_questions, actual_outcomes, expiry}
    inherit_original_source_permissions_purpose_retention_and_deletion_lineage(state)
    bounded_context.adopt_only_still_eligible_records_without_extending_expiry(state)
    if compression_needed:
        preserve_qualifiers_conflicts_and_open_questions_or_mark_a_context_gap()
    if explicit_saved_thread_policy AND acquisition_and_current_eligibility:
        atomically_save_selected_thread_with_actual_status_and_revision_checks()
    # No weight training, secret profiling or retroactive saving of collection-off facts.

on_topic_clear_correction_forget_or_source_revocation(event):
    invalidate_affected_thread_claims_summaries_pending_questions_and_derived_artifacts()
    if saved_data_forget_requested: use_existing_tombstone_and_cleanup_flow()

answer_current_information_request(intent, evidence):
    require selected_participant_event_date_and_rule_edition_are_unambiguous()
    if not requested_identity_and_time_supported_by_current_permitted_sources(evidence):
        return NEEDS_INPUT_or_PARTIAL_with_request_for_selected_current_evidence()
    return attributed_local_visible_or_reviewed_public_facts_with_times_and_limitations()
    # Public fetching occurs only in WEBR after its separate task grant.
    # No browser control, background feed, audio capture or guessed live fact.
```

Proposed question cap is three rounds per task. The pending question retains a
small controller-owned expiring record; ordinary worker cleanup does not renew
its counters or preserve an unlimited transcript. Waiting is interruptible and
does not acquire fresh context. Thread continuity never extends a task-only
source lifetime: expired observed facts require fresh permitted evidence, even
when the user's goal remains known. Saved conversation does not restore grants.

"Think for the user" means resolve likely intent, compare evidence and alternatives,
explain implications and propose useful next steps with visible uncertainty. It
does not mean mind-reading, making consequential choices, autonomous background
research or external execution. A visible scoreboard is evidence of what was
displayed, not proof of the real-time state of a match or a guaranteed prediction.

## Module Composition And Profiles

CFG implements a proposed analysis contract, not current APIs. One settings
schema drives defaults, controls, rich help and advanced JSON configuration.

```text
on_explicit_profile_change(event):
    require event.origin == USER_SETTINGS_ACTION
    base = snapshot_current_profile_and_policy_revision()
    proposal = bounded_versioned_declarative_parser(event.payload)
    reject_unknown_keys_scripts_remote_refs_and_undeclared_capabilities(proposal)
    graph = bounded_dependency_graph_of_verified_installed_catalogue(proposal)
    if cycles_missing_providers_conflicts_or_unsupported_versions(graph):
        return CONFIGURATION_ERROR_with_actual_state()
    require invariant_host_controls_and_ZI_boundary_preserved(graph)
    preferences = defaults_then_named_profile_then_explicit_task_preferences()
    effective_grants = intersection_of_live_independent_source_purpose_grants()
    effective_caps = minimum_of_approved_hard_caps_profile_and_remaining_task_caps()
    show_exact_diff_value_origins_data_cost_dependencies_and_restart_needs()
    if not explicit_confirmation_of_current_preview_and_separate_new_grants(): return UNCHANGED
    revoke_disabled_capabilities_and_cancel_affected_jobs_before_persistence()
    if not atomic_compare_and_save_profile(base, proposal):
        return UNSAVED_with_actual_restrictive_state()
    try:
        lazy_attach_verified_admitted_providers_without_implicit_downloads()
        run_bounded_synthetic_health_checks_without_personal_content()
    catch ActivationFailure:
        restore_last_valid_profile_but_never_revoked_grants_or_adapters()
    return actual_enabled_disabled_blocked_and_saved_state()
```

Disable does not delete saved data or hide Forget. No automatic app-based profile
switching, startup scripts, background plugin installation or arbitrary model-owned
tools. Recipes/templates supply inert task inputs, not capability registrations or
automatic job triggers. Post-freeze user-created content is allowed within approved
contracts; new product capabilities are not. Quitting/uninstalling remains user-controlled.

## Code And Text Artifacts

MAKE creates EA-owned drafts under F-34, not changes to another application's
source tree. All errors/cancellation use the common cleanup and lineage barriers.

```text
make_artifact(request, parent):
    require explicit_user_request_AND_approved_enabled_artifact_module()
    contract = resolve_format_version_schema_encoding_newlines_indent_and_edit_scope(request)
    if contract.materially_ambiguous: return bounded_TALK_question(parent)
    ledger = child_with_tighter_parent_limits(passes = 3, active_seconds = 60,
                                             output_bytes = 256_KiB, files = 8)
    base = selected_EA_draft_revision_and_eligible_sources()
    seen = bounded_semantic_fingerprint_history()
    while ledger.admitted_AND_task_and_sources_live():
        ledger.debit_before_generation()
        draft = bounded_local_generation_or_selected_repair(contract, base)
        if repeated_A_B_A_or_no_progress(draft, seen): break
        checks = bounded_inert_parser_schema_and_literal_checks(draft, contract)
        # No evaluation, compiler, project import, formatter hook or generated-test execution.
        if checks.required_format_satisfied:
            require current_task_source_and_policy_revisions_match()
            return editable_inert_preview_with_exact_payload_and_untested_behavior(draft)
        if not checks.repairable: break
    return permitted_unverified_draft_with_specific_errors_or_limit()

on_explicit_artifact_transfer(event):
    require event.origin == USER_COPY_OR_EXPORT
    payload = exact_selected_payload_revision_not_explanation_wrapper()
    require source_transfer_eligibility_at_acquisition_AND_current_policy()
    require live_payload_task_data_and_destination_preview_revision()
    if validation_receipt_does_not_match_exact_payload_bytes():
        drop_verified_label_or_recheck_within_remaining_budget()
    if event.kind == COPY:
        clipboard.write_selected_payload_without_paste(payload)
        report_copy_and_external_history_limits()
    else:
        for selected_file in bounded_explicit_file_selection(event):
            require safe_user_chosen_new_destination_without_traversal_or_symlink_escape()
            create_new_inert_file_without_exec_bit_or_auto_open(selected_file)
            record_actual_per_file_status_without_private_content_logs()
        report_actual_success_partial_or_failed_exports()

on_owned_clipboard_expiry(receipt):
    if ownership_can_be_verified_AND_clipboard_still_matches(receipt):
        clear_only_owned_selection()
    # Never clear a newer selection. External managers/history cannot be recalled.
```

Numerical caps above are unmeasured proposals. A user edit invalidates previous
validation receipts; Copy/Export checks the current selected bytes. Exact JSON
cannot contain a Markdown fence or an explanatory prefix. Keep assumed dependencies,
placeholders, test plans and diagnostic notes separate from raw payloads. Unsupported
languages can be displayed as unvalidated text, not sold as verified syntax.
No code execution, installing dependencies, running tests, applying patches or
overwriting existing project files. A user-chosen new EA artifact export remains
the existing narrow exception to the general external-file-write prohibition.
Temporary-only observations cannot silently persist through clipboard or exports.

## Requested Annotation Layers

INK extends exact pointing with EA-owned drawing and text layers. Linked POINT
detail means reuse the identity/coordinate-validation stages, not a recursive
invocation of the whole marker lifecycle.

```text
create_requested_annotation(request, task):
    require explicit_user_request_AND_enabled_overlay_AND_live_overlay_grant()
    objects = parse_allowlisted_shapes_and_plain_text(request)
    require within_shared_caps(objects = 50, points = 10000, text_bytes = 16_KiB)
    lifetime = min(60_seconds, task_remaining_lifetime, every_source_remaining_lifetime)
    if request.is_source_anchored:
        geometry = POINT_validate_identity_visibility_transforms_without_drawing()
    else:
        geometry = verified_user_selected_display_region_and_layout_revision()
    if unsupported_or_ambiguous(geometry): return permitted_text_alternative_or_NEEDS_INPUT
    layer = bounded_nonoccluding_layout(objects, geometry)
    require current_task_policy_source_and_display_revisions_match()
    present_click_through_layer_without_focus_change(layer)
    return bounded_owned_layer_session(layer, lifetime)

on_owned_layer_event(event, layer):
    if cancelled_locked_expired_revoked_or_geometry_changed(event):
        hide_first_and_release_listeners_and_source_buffers(layer)
        return ENDED # No automatic generation or screenshot reacquisition.
    require event.is_explicit_EA_layer_edit_AND_current_revision_and_grants()
    candidate = bounded_selected_move_resize_style_delete_undo_or_redo(event)
    require current_geometry_lifetime_lineage_and_shared_object_budgets(candidate)
    atomic_compare_and_apply_to_EA_layer_only(candidate)

on_hide_all():
    revoke_all_owned_layer_sessions_before_idempotent_hide()
    reject_late_worker_or_undo_output()
```

Edit controls remain in EA; the layer must not steal clicks intended for another
app. System prompts, target labels and emergency controls stay unobscured. Keyboard
dismissal depends on supported compositor mechanisms; the panel Hide All and a
text/list alternative remain available. Drawing is not screen capture permission.
Layer/history/export content inherits source retention, expiry and deletion.

## Guided Learning Workbench

LEARN is the proposed accessible interface to existing knowledge, settings and
ADAPT/export contracts. User confirmed actual training runs separately.

```text
on_learning_request(request):
    require explicit_user_learning_intent()
    match request.kind:
        PREFERENCE: return reviewed_style_setting_without_weight_changes()
        KNOWLEDGE: return attributed_fact_edit_and_derivative_invalidation()
        EXAMPLES: return prepare_reviewed_training_handoff(request)
        ADAPTER: return existing_bounded_ADAPT_inference_evaluation_and_activation(request)
        TRAIN_HERE: return EXTERNAL_SELF_HOSTED_TRAINER_REQUIRED_WITHOUT_LAUNCH

prepare_reviewed_training_handoff(request):
    ledger = parent_shrinking_budget(example_count = 1000, dataset_bytes = 16_MiB)
    records = bounded_explicit_selection_with_current_training_purpose_eligibility()
    require records_are_authorized_for_current_owner_without_pooled_private_users()
    examples = review_edit_redact_and_exclude_with_user(records, ledger)
    validate_selected_trainer_schema_and_base_tokenizer_license_lineage(examples)
    split = grouped_source_and_duplicate_aware_train_heldout_split(examples, proposed_fraction = 0.20)
    if independent_evaluation_data_insufficient: label_evaluation_unestablished()
    destination = review_new_dataset_destination(examples, split)
    preview = show_exact_export_bytes_destination_manifest_and_external_resource_needs()
    require explicit_preview_approval_AND_current_data_revision_and_source_eligibility()
    result = commit_reviewed_new_dataset_with_final_guards(preview, destination, ledger)
    show_actual_export_status_and_separate_user_run_training_steps(result)
    return result # No trainer process, upload, schedule or automatic example generation.

commit_reviewed_new_dataset_with_final_guards(preview, destination, ledger):
    require exact_approved_payload_destination_owner_epoch_and_live_source_revisions(preview)
    require no_overwrite_AND_no_symlink_escape(destination)
    # The narrow export committer serializes its final policy gate with revoke/delete.
    # A changed picker destination, collision, edit, owner or source needs fresh review.
    return guarded_bounded_new_file_commit_and_lineage_manifest_or_actual_failure(preview, ledger)
```

Keep training and held-out material distinct; redaction, duplicate checks and a
good syntax score are not proof of useful learning. Returned adapters require
exact compatibility, independent positive/negative comparisons and 4 GB inference
gates before explicit activation. Factual memory, preferences and summaries do
not train weights. External datasets/trained weights cannot be magically erased
by forgetting a record; disclose replacement/retraining and copy-control limits.

## Peaceful Support

CARE applies within the existing answer task. It never adds another model job,
source read, permission request or engagement loop.

```text
supportive_grounded_presentation(result):
    require task_live_AND_user_has_not_dismissed()
    require result.owner_and_session_generation == trusted_current_identity()
    preferences = bounded_current_owner_eligible_style()
    preferences = apply_current_explicit_overrides_including_no_jokes(preferences)
    if task_needs_serious_presentation: suppress_humor_without_changing_facts()
    candidate = bounded_style_presentation_with_immutable_evidence(result, preferences)
    # Same answer budget; no extra joke-generation call. Profanity needs its own choice.
    if qualifiers_numbers_references_or_uncertainty_changed(candidate):
        candidate = direct_factual_template(result)
    if support_rubric_failed(candidate):
        candidate = direct_factual_template(result) # No recursive style retries.
    require owner_session_style_and_source_revisions_still_match_or_discard()
    return candidate
    # Review rubric with humans: no shaming, guilt, fake intimacy, forced cheer,
    # covert profiling, ideological lectures, collection pressure or muted interruptions.
```

Peace/love/respect mean patient help, accessible controls, user agency, bystander
privacy and care for devices. Direct concise answers are allowed. Keep evidence,
warnings and uncertainty intact; admit inability, respect correction and leave
decisions with the user. Idle unloading is a resource measure, not a claim of
measured environmental savings. Do not use affection to optimize engagement.
No generic social check-ins or concern pings. Separately permitted technical hints
and user-requested reminders keep their own contracts. Wit should accompany useful
help, not mock a person, obscure a warning or contaminate exact code/data output.

## Learned Mannerisms And Separate Users

TONE builds reviewed preference proposals; OWNER handles identity changes.
Separate profiles only is confirmed. S-59 workspace profiles are configuration,
not authenticated user identities. Model text never chooses the authorization key.

```text
on_current_presentation_override(command):
    require explicit_supported_task_style_command_AND_live_owner_epoch()
    atomic_apply_task_override_and_increment_style_revision(command)
    cancel_stale_presentation_and_queued_speech_before_more_output()
    optionally_render_existing_verified_facts_under_current_style_and_parent_bounds()
    return SESSION_ONLY_WITHOUT_LEARNING_OR_SAVE

propose_style_change(input, existing_task):
    identity = trusted_current_owner_and_session_generation()
    if not identity.verified: return NO_PRIVATE_LEARNING
    if not input.is_explicit_setting AND not owner.preference_learning_enabled:
        return NO_CHANGE
    evidence = eligible_first_party_input_excluding_quoted_or_other_speakers(input)
    proposal = typed_style_only_proposal_with_lineage(evidence)
    require proposal.fits_existing_budgets(max_fields = 16, active_style_bytes = 4_KiB)
    require no_facts_permissions_diagnoses_or_other_users_private_content(proposal)
    # Reuse bounded current-task output or manual choices; do not launch a new model.
    review = optional_user_opened_editable_review_with_existing_expiry(proposal)
    if not review.explicitly_accepted: return NO_CHANGE
    require owner_epoch_revision_and_source_eligibility_still_match(review)
    if review.lifetime == SAVED:
        require input.is_manual_setting OR evidence.capture_time_retention_eligible
        atomic_owner_scoped_compare_and_save_with_final_policy_check(review)
    else:
        compare_and_set_owner_session_style_without_retrospective_persistence(review)
    increment_style_revision_and_discard_stale_presentation()
    return ACTUAL_CHANGE_STATUS_without_new_generation_or_training

on_identity_event(event):
    require tested_local_identity_event_not_model_text(event)
    increment_session_generation_and_close_private_publication_gate()
    hide_outgoing_private_text_overlays_and_previews()
    release_only_still_owned_clipboard_selection_under_existing_contract()
    cancel_and_bounded_stop_outgoing_workers_capture_and_speech()
    release_private_prompt_KV_queues_handles_and_adapter_state()
    if not outgoing_cleanup_and_isolation_verified(): return PRIVATE_GATE_CLOSED
    target = tested_authenticated_principal_or_fresh_ephemeral_guest(event)
    if target.verified:
        namespace = open_only_authorized_owner_store(target)
        settings = load_bounded_eligible_owner_preferences(namespace)
    else:
        namespace = temporary_guest_context_without_private_retrieval()
        settings = guest_defaults_and_explicit_session_choices()
    config = unchanged_public_base_plus_exclusively_owner_eligible_adapter_or_none()
    require desktop_unlocked_AND_identity_epoch_and_auth_state_current_or_keep_gate_closed()
    bind_publication_to_current_owner_and_fresh_epoch()
    return IDLE_without_check_in_or_resuming_old_tasks()
```

All lookups, caches, prompts, reviews, datasets, writes, callbacks and final
publication carry owner/session generation. Recheck again at commit/publish;
switching A -> B -> A never restores an earlier A task. Wrong-owner or unknown
private artifact lineage blocks activation, even if merged weights are relabelled
as a base model. Never globally train on several users' private examples.
Style changes are not model training; later actual training remains separately
user-run with reviewed owner-scoped exports/imports and compatibility evaluation.

Current-task style commands take the direct override path, not TONE's learning
review. It also works in the current guest session without private retrieval.
It never starts a fresh model pass, renews the task budget or saves a preference;
a pending task may reuse already-verified facts in a current direct presentation.

The active 16-field/4 KiB style proposal sits inside existing RAM/context caps,
including examples; it is not an additional allocation or a benchmark. Prefer
less optional style context over dropping mandatory evidence. No other user's
mutable context stays resident for convenience. A name picker or stylistic guess
does not enforce identity. Same-OS-account authentication/storage is unresolved;
without a tested boundary, only guest behavior is supported in that situation.

## Internal Mathematics

```text
calculate_or_graph(input, task):
    worker = NONE
    try:
        proposal = preserve_input_and_form_expression_proposal(input)
        if proposal.ambiguous:
            return CLARIFY_EXPRESSION_WITH_USER
        ast = restricted_math_parser(proposal.expression)
        # No eval, imports, filesystem functions, arbitrary callbacks, or code.
        assumptions = explicit_real_or_complex_domain_and_variable_constraints()
        angle_mode = current_explicit_angle_mode()
        require compatible_dimensions(ast)
        operation = supported_operation_or_explain_limit(task.intent)
        if operation == PLOT:
            return graph_session(ast, assumptions, angle_mode, task)

        require cost_within_expression_matrix_time_and_output_limits(ast)
        worker = resource_guard.admit_math_worker_or_return_limit()
        result = specialist_engine.compute(ast, operation, assumptions, angle_mode)
        require task.live AND result.expression_revision == task.expression_revision
        validate_result_schema_domain_and_termination_status(result)
        return result_with_exactness_units_assumptions_and_provenance(result)
    catch InvalidInput:
        return BOUNDED_INPUT_ERROR
    catch UnsupportedOrUnsolvedOrTimeout:
        return HONEST_LIMIT_WITHOUT_LLM_NUMERIC_SUBSTITUTION
    finally:
        release(worker)

graph_session(ast, assumptions, angle_mode, task):
    session = bounded_owned_plot_session(ast, assumptions, angle_mode, task)
    start_owned_event_lifecycle(session, run_plot_events)
    return await_first_plot_result_or_limit(session) # Do not wait for the user to close the graph.

run_plot_events(session):
    task, ast, assumptions, angle_mode = session.original_task_and_inputs
    try:
        dirty = true
        parameters = validated_slider_or_table_values()
        viewport = finite_validated_initial_bounds()
        while task.live:
            if dirty:
                revision = next_plot_revision()
                cancel_and_join_superseded_sampling()
                mode = explicitly_selected_supported_plot_mode()
                domains = supervised_domain_stage(ast, assumptions, task.ledger)
                series = supervised_plot_stage(ast, domains, angle_mode, parameters, mode, viewport, task.ledger)
                # Each supervised stage admits, computes, and joins/releases its worker before return.
                segments = separate_invalid_regions_and_known_discontinuities(series)
                require task.live AND revision == latest_plot_revision
                render_plot_with_axes_and_text_table_alternative(segments, viewport)
                publish_first_or_revised_typed_plot_result_with_session_handle(session)
                dirty = false

            require no_heavy_worker_is_owned_by_plot()
            event = await_graph_interaction_or_cancellation()
            if event.changes_expression_parameters_or_viewport:
                ast, assumptions, angle_mode, parameters = validate_and_apply_user_revision(event, ast, assumptions, angle_mode, parameters)
                # Restricted grammar, units/domains and OCR confirmation apply to every revision.
                # Invalid edits retain the previous inputs with an error, not a false redraw.
                viewport = validated_requested_viewport_or_current(event)
                dirty = true
                continue
            if event.requests_trace_root_intersection_or_area:
                result = supervised_query_stage(ast, assumptions, angle_mode, parameters, event, task.ledger)
                require current_owner_source_policy_and_plot_revision(result)
                present_result_with_method_interval_and_incomplete_search_limits(result)
            if event.requests_export:
                preview_selected_artifact_with_source_retention_policy()
                write_only_after_explicit_user_confirmation_and_live_policy_check()
            if event.closes_session: return
    on_failure:
        resolve_pending_first_result_with_actual_typed_limit(session)
    finally:
        resolve_any_still_pending_first_result_as_cancelled(session)
        cancel_and_join_sampling_domain_and_query_workers()
        release_graph_buffers_under_task_retention_policy()

save_workbook(workbook):
    require explicit_user_save()
    require every_source_derived_field_is_still_persistence_eligible()
    preview_any_excluded_temporary_only_content()
    save_EA_owned_workbook_atomically_or_report_failure()
    # Expressions, domains, angle mode, revisions, parameters, and approved data.
    # Collection-off observations cannot be laundered into a saved worksheet.
```

These functions specify desired behavior, not a home-grown math engine. Engine
and parser selection require testing. In particular, SymPy's documented
`parse_expr` uses `eval`; it is not an untrusted-input security boundary. See
[SymPy parsing documentation](https://docs.sympy.org/latest/modules/parsing.html).

## Precise Screen Circles

```text
register_requested_marker_session(target_ref, task):
    session = bounded_owned_marker_session_under_original_task_limits(task)
    # Event-state lifecycle: initial draw returns a handle; it does not block speech/help.
    session.on_refresh = callback:
        try:
            require session.live AND task.live
            require live_source_and_overlay_grants(task)
            target = adapter.resolve_identity(target_ref)
            if not target.uniquely_identified:
                return session.close(CLARIFY_TARGET_WITHOUT_MARKER)
            if not target.visible OR target.visibility_uncertain:
                return session.close(EXPLAIN_HIDDEN_OR_UNVERIFIABLE_TARGET)

            bounds = adapter.bounds_with_declared_coordinate_space(target)
            scene = snapshot_monitor_layout_window_capture_and_overlay_transforms()
            if not scene.supported_and_calibrated:
                return session.close(OFFER_PERMITTED_LABELLED_CROP_OR_LITERAL_PATH)
            transform = compose_only_transforms_required_by(bounds.space, scene)
            # Include crop/window offsets, monitor origin/rotation/scale once.
            outline = clip_transformed_target_with_tested_padding(bounds, transform)
            require unchanged_policy_target_window_capture_and_layout_revisions()
            session.overlay.draw_click_through_without_focus(outline)
        on_failure_or_unavailable:
            session.close_with_literal_path_or_permitted_crop_limit()
        finally:
            release_temporary_capture_buffers()
    session.on_invalidation = callback(event):
        session.overlay.hide() # Hide before any reacquisition, including failed refreshes.
        if event.revokes_or_locks_or_cancels_or_expires: return session.close()
        if task.live: dispatch_one_coalesced_refresh_within_existing_parent_budget(session)
        else: session.close()
    session.on_close = hide_overlay_and_release_only_owned_subscriptions
    session.subscribe_to_request_bound_geometry_and_lifecycle_events()
    session.on_refresh()
    return session.live_handle_or_typed_limit()
```

Correct target identity is separate from accurate coordinates. Both must pass.
The initial four-physical-pixel fixture target and 100 ms invalidation target
are proposals, not achieved results. Unsupported display mappings must abstain.

## Menu Exploration

```text
inspect_relevant_menu_branches(query, app, evidence, task):
    queue = bounded_menu_frontier(iter_known_relevant_containers(app, query), task.ledger)
    visited = bounded_menu_seen_set(task.ledger)
    gaps = bounded_policy_filtered_coverage(task.ledger)

    while queue not empty and task.has_time_and_depth_budget():
        stop if user_cancels or app_focus_changes or policy_generation_changes
        if not debit_menu_visit_before_pop(task.ledger): break # Denied and duplicate branches cost work too.
        container = queue.pop()
        skip if already visited
        if not visited.add(container.stable_identity): break # Charge bytes; stop honestly if full.
        fresh = read_current_identity_role_and_state(container)

        if children_can_be_read_without_interaction(fresh):
            children = read_children(fresh)
        else:
            response = ask_user_to_open_observed_container_without_input_injection(fresh)
            if response != OPENED:
                gaps.append(container, "User must expose this area")
                continue
            require_same_task_owner_source_and_remaining_budget()
            fresh = observe_bounded_user_expansion_without_holding_heavy_worker()
            if not fresh.expanded:
                gaps.append(container, "Menu still hidden or changed")
                continue
            permit = authorize(READ_UI_METADATA, fresh, HELP)
            children = guarded_read(task, fresh, READ_UI_METADATA)

        evidence.add_exact_labels_paths_states_and_sources(children)
        queue.append_within_remaining_queue_and_byte_caps(unvisited_relevant_submenus(children, query))

    gaps += any_unvisited_or_inaccessible_branches()
    return coverage(visited, gaps, scope = app_and_sources_actually_inspected)

# Never call an arbitrary default action to learn what it does.
# No tested reveal adapter exists in ZI; only the user opens menus.
```

## Panel Visibility And Public Research

```text
on_panel_toggle_click_or_shortcut_activation():
    ignore_key_autorepeat_and_duplicate_activation()
    toggle_panel_visibility_only() # Super+Shift+8; show actual OS binding or remap/click fallback.
    preserve_observation_grant_draft_and_original_task_deadline()
    keep_observation_indicator_and_Pause_Stop_controls_reachable()
    # No new read, model job, consent change or web request from showing/hiding.

research_public_sources(request, parent):
    require explicit_user_research_intent_and_current_owner(parent)
    if pause_all_observation: return ACQUISITION_PAUSED_WITH_ZERO_NETWORK
    topic = user_entered_public_terms_or_URL_without_private_context()
    if topic_is_missing_or_materially_ambiguous: return NEEDS_INPUT
    preview = exact_public_query_provider_scope_and_limits(topic)
    grant = deliberate_submission_of_that_reviewed_public_request(preview)
    # A visible Research field can preview terms/provider and grant on the same Submit.
    # No second confirmation for unchanged terms already deliberately submitted there.
    if not current_exact_grant(grant): return DENIED_WITH_ZERO_NETWORK
    ledger = tighten_existing_parent_ledger(parent) # No reset after preview or failure.
    evidence = bounded_source_set_under_original_retention_rules()
    try:
        route = configured_permitted_public_source_or_search_endpoint(topic)
        if route unavailable: return UNAVAILABLE_WITH_ZERO_NETWORK
        pending = bounded_in_scope_public_request_queue(route)
        while pending AND admit_under_live_grant_and_original_ledger():
            candidate = debit_network_attempt_and_pop(pending)
            require egress_from_user_public_input_or_fetched_public_links_only(candidate)
            require no_private_context_credentials_cookies_or_browser_session(candidate)
            target = validate_public_HTTPS_content_endpoint_and_pin_public_address(candidate)
            # Reject loopback/private/link-local/metadata addresses, unsafe ports and actions.
            response = bounded_GET_no_auto_redirects_no_auth_no_script_or_subresources(target)
            # Limit compressed AND decompressed bytes, time, requests and queue bookkeeping.
            if response.is_redirect:
                enqueue_only_if_original_grant_redirect_budget_and_public_target_allow(response)
                continue # The redirect repeats every admission/address/egress guard.
            if response.denied_or_throttled_or_CAPTCHA_or_login_or_unsupported:
                record_actual_gap(); break # No provider rotation, bypass or automatic retry.
            evidence.add(inert_extraction_with_URL_date_and_precise_source_locations(response))
            release_network_and_parser_buffers_before_heavy_model_admission()
            if evidence_sufficient: break
            enqueue_only_bounded_in_scope_public_links(evidence)
        answer = supervised_local_synthesis_under_same_ledger(evidence)
        # Private screen context may be combined locally after fetching, with no further egress.
        # If no model can be admitted, return verified extracts and disclose the limitation.
        checked = independent_claim_reference_date_and_conflict_checks(answer, evidence)
        require_current_owner_policy_source_lifetimes_and_task_before_publish(checked)
        return cited_result_with_actual_coverage_gaps_and_typed_status(checked)
    finally:
        close_owned_sockets_release_workers_and_untransferred_temporary_buffers()
    # Every partial/cancel/exception exit uses cleanup and the shared publication guard.
    # Hidden-panel completion never reopens EA; no cloud inference or background research.
```

Queries/URLs and connection metadata necessarily reach public-source recipients.
Raw screens, extracted screen text, app/window titles, local files, private memory
and private-context model output never enter the network planner. A general search
provider must be tested and available; source-specific APIs and supplied public URLs
have narrower coverage. No guarantee of unlimited free hosting or full-web coverage.

## Background Observation

```text
reconcile_background_subscriptions_from_valid_reviewed_policy():
    stop_subscriptions_with_invalid_scope_or_generation()
    if not setup_complete OR not background_observation.enabled:
        show_actual_observation_state(OFF)
        return
    if pause_all_observation OR desktop_locked OR not consent_lifetime_live:
        show_actual_observation_state(PAUSED)
        return
    subscribe_only_to_approved_source_change_events()
    show_actual_observation_state(ACTIVE_OR_BLOCKED_BY_ADAPTER)
    # Panel visibility is deliberately absent from all observation guards.
    # No automatic widening or renewed permission after restart/unlock.
    # New displays require review; exclude EA surfaces/protected regions before capture.

on_background_event(event):
    lease = NONE
    try:
        require background_observation.enabled
        require not pause_all_observation AND not desktop_locked
        require event_matches_live_scope_types_purpose_and_lifetime(event)
        require protected_source_exclusions_can_be_enforced_before_read()
        require coalescer_and_rate_and_resource_guard_admit(event)
        lease = authorize(event.proposed_passive_read, event.source, BACKGROUND)
        if lease.denied: return
        persist_eligible = collect AND retention_rule_allows(event.source)
        source = passive_adapter.read_changed_content(lease)
        require live_unchanged_policy_lease_and_source_revision(lease, source)
        context = bounded_expiring_RAM_context(source, persist_eligible)
        if persist_eligible:
            retain_under_serialized_policy_gate(context)
        # No background menu opening, web research, permission prompt/circle/speech, or executor.
        if separate_hint_grant AND fresh_context AND quiet_hours_and_rate_budget_allow:
            reserve_hint_budget_before_local_work()
            candidate = one_bounded_local_hint_with_foreground_work_priority(context)
            release_heavy_worker_before_hint_publication()
            if current_owner_source_hint_grant_and_quiet_hours_still_allow:
                show_non_focusing_hint_or_hidden_panel_badge_without_reopening(candidate)
        # Denied events never reach hint creation; no permanent model or retry loop.
        # Background OCR needs its own grant and admission; no permanent model loop.
    catch DeniedOrCancelledOrStaleOrResourceLimit:
        discard_event_without_content_logs_or_replay()
    finally:
        close_event_handles_and_release_raw_buffers(lease)
        # An allowed RAM cache has explicit byte/expiry limits and invalidation.

on_background_observation_disabled_or_expired():
    atomically_disable_background_and_advance_policy_generation()
    unsubscribe_and_cancel_background_workers()
    drop_queued_events_pending_commits_and_late_results()
    evict_background_temporary_context()
    show_actual_observation_state(OFF)
    # Explicit help remains available; Pause all reading stops both modes.
    # Saved knowledge is deleted by Forget/retention, not by disabling observation.
```

## Collection and Knowledge

```text
on_app_activation(event):
    if not background_observation.enabled or pause_all_observation:
        return
    if not live_background_scope_and_lifetime(event) or not collect or not remember_software_usage:
        return
    if app_metadata_is_allowed(event.app_id):
        retain_under_serialized_policy_gate(owner_bound_usage_fact(event))
        # No window title, screenshot, file read, or proactive suggestion.

on_observation(event):
    require_valid_capture_permission(event)
    transient = bounded_task_cache(event)
    if not collect:
        mark(transient, retention = TASK_ONLY, durable_eligible = false)
        return

    store_permission = authorize_retention(event.source, event.purpose)
    if store_permission allowed:
        fact = normalize_with_provenance(event)
        return retain_under_serialized_policy_gate(fact)
        # Usage-history writes still need the distinct APP/history eligibility gate.

on_collection_or_source_policy_change(new_settings):
    atomically_update_settings_and_increment_generation()
    cancel_affected_reads_and_pending_persistent_writes()
    mark_old_ephemeral_observations_ineligible_for_future_persistence()
    if pause_all_observation:
        stop_watchers()
        discard_temporary_capture_buffers()
    reconcile_background_subscriptions_from_valid_reviewed_policy()

on_user_correction(record, replacement):
    update_fact_with_origin(USER_CORRECTION)
    invalidate_or_rebuild_derivatives(record.id)
    show_correction_and_source_history_under_current_retention_rules()

on_forget(selection):
    preview_owned_selection_and_descendant_scope_for_confirmation(selection)
    transaction under shared_policy_and_memory_lock:
        require current_owner_and_confirmed_selection_or_valid_expiry_rule(selection)
        affected = current_owned_derivation_closure(selection)
        publish_tombstones(affected)
        advance_data_generation()
        persist_content_free_cleanup_job(affected.ids)
        commit()
    # The preview is not the deletion inventory. Concurrently committed derivatives
    # are included by the in-lock closure; subsequent writes must reject deleted parents.
    # Filesystem deletion is not atomically part of a SQLite transaction.
    cancel_workers_that_reference(affected)
    evict_matching_prompt_and_retrieval_caches()
    results = verify_forgetting(affected)  # ERASE; includes FTS/undo/history/backups
    if any_cleanup_failed:
        retain_tombstones()
        persist_retry_with_content_free_error()
    report_owned_cleanup_status()
    report_external_exports_and_trained_weights_not_automatically_erased()

```

## Resources And External Training Boundary

WORK details contract-preserving stage selection; RAM/GUARD apply to the selected
stage, not an additional invocation of the whole task. The optimization experiments
and illustrative memory allocation are in RESEARCH.md, P-17.

```text
before_expensive_work(job):
    require tested_resource_and_access_protection_available_without_auto_root()
    profile = measured_profile_including_loader_copies_and_retained_state(job)
    if profile_unknown or not stage_fits_both_EA_ceiling_and_live_system_headroom(profile):
        use_exact_lookup_or_ask_for_smaller_scope()
        return
    return supervise_internal_job(job) # GUARD owns launch, monitoring and cleanup once.
    # Transient safe fallback does not pass a positive feature conformance test.
    # Every included feature needs measured completion on 4 GB total RAM.
    # Lower display detail may not silently relax a numerical error tolerance.

on_explicit_training_export(selection):
    return prepare_reviewed_training_handoff(selection.with_existing_parent_ledger)
    # No training is started by collecting, compressing, or exporting.
    # Actual weight training is outside ZI, not a hidden high-RAM ZI tier.
    # Trained weights require replacement/retraining to forget learned data.
```

## Bounded Working Set

This is proposed orchestration, not a replacement reasoning model or an execution
backend. Structured reads/exact lookup, specialist computation, cropped OCR and
model explanation are separate stages. A capability's existing controller owns
its finite plan and any allowed repair; WORK never invents another job or budget.

```text
stage_fits_both_EA_ceiling_and_live_system_headroom(profile):
    measured = consistent_current_process_tree_and_system_accounting()
    additional = profile.incremental_peak_including_loader_and_handoff_copies
    require all_retained_weights_results_pages_and_private_buffers_are_charged()
    return measured.EA_resident + additional + margin <= EA_ceiling
       AND additional + margin <= measured.system_available - system_reserve
    # Available RAM already reflects resident EA; do not subtract it twice.
    # Shared pages use one accounting convention. Separate copies are not shared.

run_staged_work(task):
    require existing_authorized_task_and_finite_parent_ledger(task)
    contract = exact_question_required_evidence_coverage_and_precision(task)
    plan = finite_controller_plan_from_reviewed_capability_catalog(contract)
    require plan.stage_visits_are_reserved_within_existing_parent_limits()
    working_set = bounded_evidence_frontier_and_result_store()
    try:
        while plan.has_unvisited_stage AND parent.can_consume_stage_visit():
            if not live_task_policy_sources_and_generations():
                return cancel_invalidate_and_discard_affected_work()
            stage = plan.peek_unvisited_stage()
            parent.consume_stage_visit()  # Cache hits cannot avoid the limit.
            key = exact_operation_inputs_provider_schema_and_source_policy_key(stage)
            result = scoped_cache_get_or_miss(key)
            if result == MISS:
                profile = choose_one_measured_quality_passing_fit(stage)
                if profile == NONE: record_gap(NO_TESTED_FIT); break
                inputs = pack_without_dropping_required_clauses_or_qualifications(stage)
                if not inputs.fit(profile): record_gap(INPUT_LIMIT); break
                if not parent.can_consume_provider_pass(stage):
                    record_gap(PASS_LIMIT); break
                parent.consume_provider_pass(stage)
                result = supervise_internal_job(stage.with(profile, inputs))
                # GUARD owns admission, launch, finally-stop/reap and release once.
                # No next heavy stage before release; retained pages still count.
                if result.status != COMPLETE: record_gap(result.status); break
            checked = bounded_independent_contract_and_live_source_checks(result)
            if not checked.admissible: record_gap(UNVERIFIED); break
            if not working_set.can_merge_within_all_caps(checked):
                record_gap(WORKING_SET_LIMIT); break
            working_set.merge_with_lineage_and_completed_source_ranges(checked)
            if not plan.advance_once_without_repeated_cursor():
                record_gap(NO_PROGRESS); break
        if plan.has_unvisited_stage: record_gap(REMAINING_WORK)
        require live_task_policy_sources_and_generations_or_cancel_and_discard()
        status = COMPLETE_only_if_contract_and_required_coverage_are_verified()
        return bounded_eligible_evidence_and_explicit_gaps(status)
    finally:
        release_nonreturned_transient_buffers_and_owned_worker_resources()
    # Caller rechecks publication, pointing and retention. No automatic continuation.
```

The proposed 8 MiB per-task text cache is inside the 16 MiB shared transient cap,
not another allocation. Decoder/model scratch belongs to the admitted heavy-stage
profile; controller-owned payload copies and query results also count. Temporary
data must not spill to disk just because a database or parser runs out of RAM.
Compressing storage, making a summary, retrieving evidence and training weights
remain distinct operations. No exact answer may rely only on a lossy summary.
For model stages, tokenize the system prompt, schema and evidence, reserving the
answer allowance inside the context limit before packing. Oversized evidence
requires already-budgeted stages or an explicit gap, never silent truncation.

## Shared Read Contract

This contract applies to every read/reveal/capture state in the diagrams, not
only the first permission decision. A timeout, exception, cancellation, or
policy change returns a typed outcome to the caller, whose finally block runs.

```text
guarded_read(task, source, operation):
    require operation IN ZI_REGISTERED_READ_CAPABILITIES
    require not task.cancelled
    require now < task.deadline
    require source.identity == task.authorized_identity OR verified_identity_within_explicit_discovery_grant(source, task)
    permit = authorize(operation, source, HELP)
    require permit.allowed
    require protected_source_exclusions_enforceable_before_read(source)
    require task.remaining_byte_and_node_budget > 0

    result = await adapter.read_with_timeout_and_cancel(
        source, permit, bounded_bytes, task.cancel_token
    )

    if task.cancelled OR policy.generation != permit.generation OR owner_epoch_changed(task):
        release(result)
        raise RevokedOrCancelled
    if not current_scope_contains(result.actual_source):
        release(result)
        raise ScopeMismatch
    if source_changed_during_read(result):
        release(result)
        return gap(STALE_SOURCE)

    result = exclude_protected_fields(result)
    result.trust = UNTRUSTED_SOURCE_DATA
    result.capture_generation = permit.generation
    result.persist_eligible = task.persist_eligible AND permit.retention_allowed
    result.source_bindings = original_source_identity_revision_and_temporary_use_bounds(permit, result)
    result.expires_at = earliest_temporary_use_deadline(task, permit, result.source_bindings)
    return result

request_manual_container_opening(task, container):
    require current_foreground_task_and_observed_container_identity()
    return NEEDS_USER_MENU_OPENING # No action invocation or input injection.
```

## Temporary Cache

Proposed initial cache limit: 8 MiB of extracted text/metadata per active task.
This is a sublimit of the shared 16 MiB proposal in S-13, not additive capacity.
Raw image buffers have their own strict pixel/byte limit and are released after
extraction; their decoded peak and copies count in the measured stage profile.
The cap and TTL must be benchmarked. A thorough read streams rather
than keeping the entire source resident.

```text
CacheKey = {
    principal_id, session_generation,
    app_id, app_version, window_identity, source_revision,
    scope_digest, policy_generation, data_generation, extraction_kind,
    operation, parameters_digest, input_digest, provider_revision, schema_revision
}

cache_put(task, key, evidence):
    require current_owner_task_key_source_bindings_and_evidence_revision(task, key, evidence)
    with serialized_cache_policy_and_quota_gate:
        require original_evidence_and_every_source_binding_still_live(evidence)
        evict_expired_entries_and_release_only_unreferenced_reservations()
        existing_entry = cache.lookup(key)
        previous_expiry = existing_entry.expires_at if existing_entry is not NONE else evidence.expires_at
        expiry = min(task.deadline, now + short_TTL, evidence.expires_at,
                     earliest_source_binding_expiry(evidence), previous_expiry)
        if expiry <= now: return NOT_CACHED
        reservation = reserve_global_and_task_cache_bytes_atomically(task, key, evidence)
        # Count aggregate task/global use, metadata, aliases and handoff copies; replace by net delta.
        # Bounded eviction may free space, but cannot discard live consumer buffers or overcommit.
        if reservation.denied: return NOT_CACHED
        try:
            cache[key] = {
                value: adopt_or_copy_within_reservation(evidence),
                captured_key: key,
                source_bindings: evidence.source_bindings,
                owner_task: task.id,
                accounted_bytes: reservation.actual_bytes,
                expires_at: expiry,
                persist_eligible: sticky_intersection(evidence, existing_entry),
                parent_source_ids: evidence.provenance
            }
            commit_cache_entry_and_reservation_atomically(reservation)
        finally:
            rollback_incomplete_insertion_and_release_uncommitted_reservation(reservation)
    return CACHED
    # RAM only. No disk prompt cache, content log, transcript autosave,
    # analytics payload, crash report attachment, or training queue.

cache_get(task, key):
    with serialized_cache_policy_and_quota_gate:
        entry = cache.lookup(key)
        return MISS if entry missing
        return MISS after eviction if expired(entry)
        return MISS after eviction if generations_or_identity_changed(entry.captured_key)
        return MISS after eviction if not current_policy_allows(entry.source_bindings)
        return MISS if not current_task_can_adopt_entry_within_its_aggregate_quota(task, entry)
        return bounded_live_handle_without_extending_original_expiry(entry, task)
    # Reads/reinsertions do not refresh TTL; only a fresh permitted acquisition creates new evidence.
    # Eviction releases its reservation; remaining live consumers stay charged until release.

on_cancel_or_pause_or_revoke_or_forget_or_pressure:
    cancel_affected_workers()
    evict_affected_cache_entries()
    discard_pending_answers_with_affected_sources()
    # Releasing buffers is not a guarantee against OS swap or forensic recovery.

continue_thorough_read(previous_task, frontier):
    show_coverage_progress_and_unread_sources()
    event = require_new_explicit_user_continuation()
    close_previous_ledger_without_renewing_its_counters(previous_task)
    require cursor_owner_scope_source_revision_and_original_expiry_still_valid(frontier)
    task = create_new_bounded_authorized_task(event)
    reuse_only_eligible_evidence_without_extending_its_expiry_or_retention()
    stream_next_chunk(frontier, task.existing_parent_ledger)
    # Fresh reads capture their own policy; old off-captured content never upgrades.
```

## Durable Data Model

IDs, relationships, revisions, and transaction boundaries matter more than
choosing a vector library. The initial store uses structured SQLite tables,
foreign keys, and a full-text index. Optional F-30 indexes are disposable derivatives
whose inclusion is decided before freeze, not a later feature addition.
The tables below are inside an authenticated owner namespace: primary keys,
foreign keys, FTS/vector queries, preferences, quotas, exports, cleanup jobs and
backups all include that owner boundary. They are never global private stores.
Session generations belong to operation envelopes, not permanent record identity;
a new authenticated session can read its owner's still-eligible saved records.
The exact OS/account/storage enforcement remains unresolved, not implied by SQL.

```text
Software(
    app_id PRIMARY KEY, platform, verified_version,
    first_observed_at, last_observed_at, usage_scope
)
Source(
    source_id PRIMARY KEY, kind, app_id, version,
    permitted_locator, observed_at, revision,
    capture_policy_generation, retention_eligibility, expires_at
)
Knowledge(
    record_id PRIMARY KEY, source_id, category, claim,
    origin: OBSERVED | USER_CORRECTED | DERIVED,
    confidence, revision, verified_at, expires_at, deleted_at
)
Control(
    record_id REFERENCES Knowledge,
    literal_label, role, parent_path, observed_state,
    observation_bounds, window_identity
)
Derivation(parent_record_id, child_record_id, transform_version)
Policy(rule_id, structured_conditions, capability, effect, retention, generation)
Export(export_id, owned_destination, record_ids, revisions, purpose, consent_version)
CleanupJob(job_id, affected_ids, completed_stores, retry_status)
Preference(key, explicit_value, scope, user_chosen_lifetime)
FullTextIndex(record_id, searchable_text)
OptionalVectorIndex(record_id, source_revision, embedding_model_revision, vector)

# Every lookup filters tombstones, expiry, current permissions, and revision.
# Source locators and metadata can themselves be sensitive.
# Content-free receipts contain counts/status, not deleted payloads.

retain_under_serialized_policy_gate(candidate):
    if NOT candidate.persist_eligible: return NOT_SAVED
    with shared_policy_and_memory_lock:
        require candidate.owner_epoch_matches_current_authenticated_context()
        require policy.collect
        require current_retention_permission(candidate.sources)
        require candidate.capture_generation == policy.generation
        require all_parent_records_live(candidate)
        require not cancellation_or_deletion_pending(candidate)
        require candidate_available_before_its_temporary_use_expiry()
        candidate.expires_at = earliest_authorized_retention_deadline(candidate)
        # Bound saved lifetime by source retention rules; this does not renew the RAM cache.
        require candidate.expires_at > now
        begin_sqlite_transaction()
        insert_minimized_claim_and_provenance(candidate)
        update_fulltext_entries(candidate)
        commit_or_rollback_on_error()

edit_knowledge(record_id, expected_revision, replacement):
    require explicit_user_edit()
    with memory_transaction:
        require live_record(record_id)
        require revision(record_id) == expected_revision
        store_user_correction_without_forging_original_evidence()
        remove_old_payload_unless_user_history_policy_allows_it()
        invalidate_dependent_summaries_and_indexes()
        increment_record_revision()
        commit_or_rollback_on_error()

restore_backup(backup):
    require explicit_user_restore_review()
    require backup_namespace_and_lineage_authorize_current_owner()
    require compatible_schema_and_integrity(backup)
    apply_current_policy_and_deletion_tombstones_before_exposing_records()
    rebuild_indexes_only_from_eligible_live_records()
    # A backup cannot silently resurrect forgotten knowledge.
```

## Selected Knowledge Export

CTRL dispatches by the explicitly requested purpose. DATA is the training-dataset
detail flow, not the only way to export knowledge under F-10.

```text
selected_export_under_explicit_purpose(request):
    require explicit_current_owner_export_request_AND_existing_parent_limits()
    if request.purpose == TRAINING_DATASET:
        return prepare_reviewed_training_handoff(request)
    require request.purpose == SELECTED_KNOWLEDGE
    records = bounded_owner_scoped_selected_live_records(request.selection)
    preview = inert_export_preview_with_lineage_and_excluded_record_reasons(records)
    require explicit_approval_of_exact_payload_and_new_destination(preview)
    require acquisition_AND_current_export_eligibility_for_every_selected_source()
    require current_owner_epoch_policy_data_and_record_revisions_at_write()
    result = bounded_new_file_export_without_overwrite_symlink_escape_or_auto_open(preview)
    return actual_write_status_and_external_copy_deletion_limits(result)
    # No training-purpose grant is needed for ordinary knowledge export.
    # Export alone is not permission to train, and approval cannot launder temporary data.
```

## Wizard, Preferences, And Security Guidance

```text
ZI_CAPABILITY_REGISTRY = typed_reads + bounded_internal_tools + own_memory_management + own_settings
ZI_ACTION_BROKER = NONE

setup_wizard():
    keep_observation_disabled()
    review_distribution_license_manifest()
    measure_hardware_with_installer_consent()
    choose_resource_preset()
    choose_existing_model_or_explicit_download_or_no_model()
    verify_and_stage_artifact_without_automatic_activation() # TRUST
    choose_EA_storage_location()
    choose_source_grants()
    choose_background_observation_scope_types_purpose_and_lifetime(default = OFF)
    choose_collection_and_recall_independently()
    choose_retention_and_quota()
    choose_personality_and_accessibility_preferences()
    review_effective_permissions()
    save_EA_settings_atomically_if_user_confirms()
    run_synthetic_self_test()
    enable_only_confirmed_read_capabilities()
    # No installed-app crawl or personal-data scan during this wizard.

apply_personality(preference, lifetime):
    require explicit_user_choice_or_reviewed_feedback()
    require current_trusted_owner_session_and_preference_revision()
    require preference_cannot_override_policy_or_truthfulness()
    update_style_without_changing_claims_or_permissions()
    if lifetime == SESSION: keep_in_RAM_only()
    if lifetime == SAVED_SETTING: compare_and_save_owner_eligible_preference()
    # A profile is not a trained model. No secret sensitive-trait inference.
    # Predeclared F-23 export/adapter work uses DATA consent and evaluation.
    # KARL compatibility is unverified and KARL remains untouched.

review_link(link):
    require permitted_visible_destination_or_user_paste()
    if destination_unavailable: return UNKNOWN_DESTINATION
    parsed = standard_URL_library.parse(link.destination)
    if parse_failed: return MALFORMED_WITH_UNCERTAINTY
    host = IDNA_library.normalize(parsed.host)
    registrable_domain = public_suffix_library.domain(host)
    signals = compare_display_text_scheme_userinfo_domain_and_known_reference()
    return evidence_based_risk_report(
        signals,
        limits = [NO_LIVE_REPUTATION, NO_REDIRECT_RESOLUTION, NO_SAFE_GUARANTEE]
    )
    # No navigation, DNS resolution, executable preview, or reputation upload.

help_with_antivirus():
    explain_ZI_cannot_run_scans()
    identify_user_named_or_permitted_existing_scanner()
    read_current_permitted_documentation()
    assemble_verified_steps_for_the_user()
    if user_supplies_report:
        read_report_under_normal_source_and_retention_rules()
        explain_findings_and_detection_limits()
    # No scanner launch, signature update, quarantine, or delete operation.

preview_content(source):
    require source_grant()
    use_inert_text_or_bounded_safe_decoder()
    disable_scripts_macros_external_resources_and_custom_URL_handlers()
    isolate_untrusted_parsing_from_UI_and_database()
    present_preview_without_opening_in_another_app()
```

## Predeclared Optional Modules

```text
enable_optional_module(module):
    require explicit_user_enable()
    require module.feature_ID in approved_frozen_inventory
    require module.contract_version_is_supported()
    require module.requested_capabilities.subset_of(ZI_CAPABILITY_REGISTRY)
    grant = review_module_specific_source_audio_retention_and_purpose_permissions()
    require grant.accepted
    lease = resource_guard.admit_optional_module_or_explain_limit()
    register_typed_module_interface_without_generic_command_channel(module, lease)

deliver_module_output(output, task):
    require output.matches_versioned_request_result_or_presentation_schema()
    require task.live AND current_policy_allows(output.provenance)
    require output.cannot_add_capabilities_or_change_computed_facts()
    present_with_text_fallback()

on_module_failure_disable_or_revocation(module):
    detach_and_cancel_only_module_owned_work()
    release_module_audio_state_and_permissions()
    keep_typed_core_and_calculator_available()
```

Voice creates the same request envelope as typed input; animation consumes
presentation events. Neither is an authority to read, retain, or execute.
Optional-module isolation is a design requirement, not yet a chosen technology.

## Cross-Application Guidance

```text
guide_across_sources(task):
    # Sources can instruct a human; their text cannot instruct EA's policy engine.
    try:
        require live_task_with_explicit_goal_and_source_scope(task)
        app = read_authorized_app_identity_version_role_and_state(task)
        menu_evidence = read_already_exposed_menus(task, app)
        if relevant_menu_closed_or_unknown:
            return NEEDS_INPUT("Open this named menu", already_verified_facts)
        choices = match_literal_labels_paths_and_effects(menu_evidence, task.goal)
        if choices.ambiguous: return resolve_limit(AMBIGUOUS, task, choices)
        show_supported_choices_with_current_state_and_coverage(choices)
        if user_requests_circle: register_requested_marker_session(choices.target, task)

        if task.goal_needs_documentation_or_second_application:
            explain_exact_missing_source_and_why()
            selected_source = wait_for_user_navigation_with_task_deadline()
            # No navigate/click/tab-switch/login operation exists here.
            page = read_selected_browser_source(task, selected_source)
            combined = compare_current_UI_to_versioned_page_claims(choices, page)
            if combined.material_conflict:
                return resolve_limit(CONFLICT, task, combined)
        else:
            combined = choices

        draft = inert_checklist_inside_EA(combined)
        require policy_and_source_revisions_still_match(draft.provenance)
        return evidenced_result(draft, gaps = actually_unread_sources)
    finally:
        release_markers_read_handles_and_temporary_task_data()

read_selected_browser_source(task, reference):
    require browser_grant_and_EA_task_grant_cover(reference.tab, reference.origin)
    require source_not_private_protected_restricted_or_uncertain()
    revision = capture_tab_frame_document_and_layout_revision()
    frames = permitted_frame_origins_only()
    result = bounded_passive_DOM_or_accessibility_read(frames)
    require browser_and_EA_grants_still_live()
    require revision_still_current_including_SPA_mutations()
    result.gaps += denied_cross_origin_or_unread_frames
    result.persist_eligible = acquisition_time_eligibility AND current_policy
    result.untrusted_content_cannot_add_tools_or_permissions = TRUE
    return evidence_with_literal_labels_states_paths_and_coordinate_space(result)
```

The browser permission itself may expire or be narrower than EA's selected
scope. Recheck both. A current URL alone is not a document/control revision.
Login and form submission are user actions. Browser-loaded content is not
permission for EA to fetch linked resources or execute page-provided instructions.

## When Assistance Cannot Complete

```text
Result:
    status: VERIFIED | PARTIAL | NEEDS_INPUT | UNAVAILABLE | CANCELLED | FAILED
    supported_facts, evidence_refs, coverage_gaps, reason, proposed_user_step
    provenance, source_revisions, acquisition_eligibility, data_generation

resolve_limit(reason, task, evidence):
    if task.cancelled: return CANCELLED
    if task.revoked_or_locked_or_expired:
        discard_affected_evidence_and_markers()
        return UNAVAILABLE(reason = AUTHORITY_ENDED)
    if reason.requires_external_execution:
        return UNAVAILABLE(reason = ZI_BOUNDARY, evidenced_user_run_steps_only)

    if reason.transient AND same_live_scope AND task.retry_budget > 0:
        task.retry_budget -= 1
        retry = bounded_read_or_internal_compute_with_common_checks()
        if retry.verified: return VERIFIED(retry)
        # Never reset the retry budget or expand source scope after failure.

    facts = filter_current_permitted_independently_supported_facts(evidence)
    missing = minimal_specific_input_that_could_resolve(reason)
    if missing.exists:
        return NEEDS_INPUT(facts, gaps, one_focused_question(missing))
    if facts.useful:
        return PARTIAL(facts, gaps, precise_reason_for_incompleteness)
    if reason.unsupported_or_resource_limited:
        return UNAVAILABLE(reason, safe_evidenced_alternative_if_any)
    return FAILED(content_free_diagnostic, no_claim_of_completion)
```

An unavailable feature does not receive a passing positive test because the
refusal was polite. Negative safety cases and positive functionality have
separate denominators. Human support or user-run specialist tools can be proposed
only with an honest reason and no automatic content upload.

## Rich Settings Help And Changes

```text
on_option_help(option_id, event):
    help = settings_schema[option_id].help
    require help.has(purpose, default, chosen, effective, scope, lifetime,
                     read_save_delete_send_effects, CPU_RAM, dependencies,
                     risks, restart_effect, example, requirement_reference)
    if event in [HOVER, KEYBOARD_FOCUS]: show_hoverable_dismissible_tooltip(help)
    if event in [CLICK, TAP, OPEN_DETAILS]: show_pinned_keyboard_accessible_details(help)
    if event == ESCAPE: dismiss_and_restore_focus()
    # No mutation of any setting, permission or observed-data store.

propose_settings_change(change):
    require typed_schema_valid(change)
    require feature_IDs_within_approved_scope(change)
    proposed = apply_to_copy_of_current_settings(change)
    effective = intersect_grants_and_apply_deny_precedence(proposed)
    show_diff_with_data_and_resource_effects(effective)
    require explicit_confirmation_of_new_permissions_scopes_and_lifetimes()
    revoke_immediately_for_restrictive_changes()
    result = atomic_compare_and_commit(expected_policy_revision, proposed)
    if not result.saved:
        keep_restrictive_runtime_state()
        return error_showing_actual_and_unsaved_values()
    reconcile_adapters_to_confirmed_current_policy()
    return actual_effective_state()

restore_defaults(page_or_all):
    return propose_settings_change(default_values_for_selected_options())
    # Not Forget. No deletion of knowledge, workbooks or adapters.

import_settings(file):
    config = bounded_versioned_settings_parser(file)
    reject unknown_fields_or_executable_rules(config)
    remove_all_imported_permission_tokens_and_grant_approvals(config)
    return propose_settings_change(config)
```

## Voice And Internal Work

```text
on_typed_request(question):
    return deliver_requested_help(question)

handle_push_to_talk(event):
    require voice_input_enabled AND live_microphone_grant
    task = create_explicit_voice_task_before_capture(event)
    try:
        audio = bounded_local_capture_until_release_or_stop(task)
        close_microphone_before_transcription_or_confirmation()
        transcript = admitted_local_ASR(audio, chosen_language, task.ledger)
        release_ASR_worker_before_next_heavy_stage()
        release_raw_audio_unless_independently_eligible_for_retention()
        if transcript.uncertain OR intent_is_consequential(transcript):
            transcript = bounded_edit_or_confirmation_under_same_task(transcript, task)
        if transcript.cancelled_or_expired: return CANCELLED_OR_EXPIRED
        require transcript_owner_epoch_original_expiry_and_task_still_match(task)
        return deliver_requested_help(transcript, existing_task = task)
    finally:
        close_microphone_and_output_on_stop_revoke_or_completion()
        release_only_untransferred_owned_audio_buffers_and_workers(task)

deliver_requested_help(question, existing_task = NONE):
    task = bind_live_existing_task_or_create_explicit_typed_task(question, existing_task)
    # Invalid supplied tasks fail closed; confirmation/ASR may not create a replacement ledger.
    result = on_help_request(question, existing_task = task)
    if spoken_replies_enabled AND result.has_live_speakable_payload AND current_data_policy_allows(result):
        try:
            stream_cancelable_local_TTS(result, serial_admission_within_original_parent_ledger(task))
        on_speech_failure_or_limit:
            report_actual_speech_status_without_source_payload()
            # speech_failure_does_not_rerun_help_or_discard_text
        finally:
            close_output_and_release_only_owned_speech_workers_and_buffers()
    return result
    # Typed answers can be spoken with mic input off; no microphone grant is requested.
    # A clarification submission resumes this delivery path with its original live task.
    # Control events, idle/background observations and unsubmitted transcripts do not enter it.

run_internal_service(request, validated_evidence = NONE):
    require request.kind in frozen_typed_internal_registry
    require current_source_rules_and_resource_admission()
    request = reuse_resolved_intent_evidence_and_existing_parent(request, validated_evidence)
    if request.kind == MATH: result = calculate_or_graph(confirmed_expression_proposal(request), request.parent_task)
    else if request.kind == CHART: result = draft_embedded_methodology(request, request.parent_task)
    else if request.kind == ARTIFACT: result = make_artifact(request, request.parent_task)
    else if request.kind == ANNOTATION: result = create_requested_annotation(request, request.parent_task)
    else if request.kind == DRAFT: result = cited_notes_or_checklist(request)
    else if request.kind == CALENDAR: result = standards_aware_schedule_preview(request)
    else if request.kind == LOGIC: result = bounded_established_logic_or_graph_engine(request)
    else if request.kind == CONVERT: result = validated_units_or_time_library(request)
    else if request.kind == OWN_DATA_OR_SETTINGS: result = dispatch_reviewed_owned_control(request)
    else: return UNSUPPORTED_INTERNAL_KIND
    if explicit_save_or_scheduled_reminder_requested:
        require result.has_successful_eligible_payload
        require source_acquisition_eligibility AND current_persistence_permission
        commit_only_EA_owned_artifact_with_revision_checks(result)
    return typed_result_with_status_provenance_and_optional_session_handle(result)
    # The help caller presents and hands off once; errors/NEEDS_INPUT are not success payloads.

dispatch_reviewed_owned_control(request):
    require explicit_current_owner_intent_and_registered_CTRL_operation(request)
    require exact_control_scope_and_separate_required_confirmation(request)
    return existing_memory_or_settings_controller(request, request.parent_task)
    # A confirmed transcript is not confirmation of a deletion, export or new grant.
    # TRAIN_HERE and all external commands remain unavailable; no generic command runner.

on_reminder_occurrence(event):
    require persisted_or_session_schedule_still_active(event)
    require current_time_zone_and_recurrence_policy_defined(event)
    require occurrence_not_cancelled_snoozed_or_already_delivered(event)
    apply_approved_missed_occurrence_policy_after_sleep_or_restart()
    commit_pending_occurrence_with_stable_ID_under_schedule_policy()
    display_or_replace_EA_reminder_by_occurrence_ID()
    request_best_effort_OS_notification_if_explicitly_enabled()
    record_known_delivery_status_without_inventing_missing_acknowledgement()
    # Crash between notification and acknowledgement can leave delivery uncertain.
    # Preserve the pending EA entry; do not claim universal exactly-once OS toasts.
```

Neither animation nor personalization is a data source or authority grant.
Animation consumes typed presentation states; profiles can alter style but must
preserve the literal evidence, uncertainty, computed results and permissions.
Proactive hints, if approved, need their own grant, quiet-hours check, rate cap,
deduplication and fresh non-sensitive evidence. No automatic speech or circles.

## Embedded Archi And Bounded Chart Generation

This is a built-in EA workspace, not an external-app import workaround. It is
confirmed scope direction F-32, but no embedding is implemented. Diagram nodes
and their pseudocode are inert data; a drawn loop never becomes a ZI executor.

```text
draft_embedded_methodology(request, parent_task):
    require request.origin == EXPLICIT_USER_REQUEST
    # Origin is assigned by a trusted user interaction, never model/document text.
    require settings.requested_chart_generation_enabled
    require request.goal_inputs_completion_and_detail_are_defined()
    require scoped_source_policy_is_current()
    baseline = snapshot_selected_EA_canvas_revision()
    ledger = tighten_existing_supervised_parent_budget(parent_task.ledger,
        total_model_passes = 3, active_seconds = 90,
        generated_nodes = 200, edges = 400, subflows = 8, nesting_depth = 3,
        RAM_CPU_output_bytes = approved_4GB_profile
    ) # Proposed caps; include prior classification passes, never replenish counters.
    seen = bounded_set()
    previous_issues = NONE
    last_valid = NONE
    try:
        while ledger.has_pass_remaining:
            require task_live_and_sources_still_permitted()
            ledger.debit_pass_before_call() # Includes initial draft, repairs and children.
            proposal = supervised_constrained_graph_or_patch_generation(request, baseline, ledger)
            try:
                typed = validate_typed_output(proposal, task, allowed_source_refs)
                candidate = materialize_selected_chart_candidate(typed, baseline, request.scope)
            catch InvalidOutputOrGraph as error:
                record_bounded_repair_reason(error)
                continue # The same pass count and deadline still apply.
            graph = candidate.graph
            fingerprint = stable_semantic_digest_without_cosmetic_layout(graph)
            if fingerprint in seen: return stopped(REPETITION, last_valid)
            seen.add(fingerprint)
            issues = check_graph_structure_sources_and_requested_constraints(graph)
            if previous_issues != NONE AND no_progress_since_previous_attempt(issues, previous_issues):
                return stopped(NO_PROGRESS, last_valid)
            previous_issues = issues
            if issues.blocking:
                supply_only_bounded_issue_feedback_for_next_pass()
                continue
            draft = supervised_selected_layout(graph, baseline, request.scope, ledger)
            require protected_geometry_text_colors_and_routes_unchanged(baseline, draft)
            require source_policy_and_task_generation_still_current()
            last_valid = draft
            stop_generation_workers_before_waiting_for_human_review()
            approval = show_editable_embedded_chart_and_revision_preview(draft)
            if not approval.accepted: return CANCELLED_without_canvas_change
            require task_live_and_sources_still_permitted()
            require approval_matches_exact_draft_and_current_source_policy()
            require canvas_revision_matches(baseline)
            compare_and_commit_chart_patch(draft, expected = baseline,
                task_generation = current_task_generation, policy = current_policy)
            if explicit_chart_save_requested:
                require acquisition_and_current_persistence_eligibility(draft.sources)
                atomic_EA_chart_save_with_policy_and_revision_recheck()
            return chart_result_with_actual_save_status_and_known_limits()
        return stopped(PASS_LIMIT, last_valid)
    catch CancelledOrRevoked:
        discard_late_or_ineligible_source_derived_output()
        return CANCELLED_or_UNAVAILABLE_with_existing_chart_preserved
    catch DeadlineSizeDepthResourceOrWorkerFailure as reason:
        return stopped(reason, still_permitted(last_valid))
    catch CanvasConflict:
        return NEEDS_INPUT_with_user_work_preserved
    finally:
        supervisor.stop_all_children_and_release_request_buffers()

spawn_child_graph_work(parent, selected_subgoal):
    require parent.ledger.live
    require selected_subgoal.within_parent_scope
    return bounded_child_work(shared_ledger = parent.ledger)
    # Never allocate new generation counters or a new deadline for a child.

on_chart_autosave_observation_or_sync_event(event):
    do_not_enqueue_chart_generation()
    # Data-policy processing and drift flags may run, but do not manufacture intent.

stopped(reason, last_valid):
    supervisor.cancel_remaining_generation_and_layout()
    permitted = filter_current_policy_lifetime_and_data_generation(last_valid)
    show_only_permitted_draft_and_reason(permitted, reason)
    return PARTIAL_if_useful_else_UNAVAILABLE(reason)
```

The supervisor enforces deadlines/cancellation independently of the model and
off the UI thread, including a hung parser/layout worker. Every loop body and
child shares limits; a finite loop is insufficient if one iteration can hang.
Repetition checks need not solve general graph equivalence to stop runaway work:
pass/time/size/resource caps provide independent bounds. User review is not active
generation time, but source/task expiry and revocation still invalidate a preview.
On a save failure, keep permitted RAM work and report "not saved," never success.

Intentional methodology cycles retain visible conditions/exits and uncertainty.
They are not executed or recursively expanded. Generated artifacts, histories,
thumbnails, autosave, exports and backups inherit the original sources' retention
eligibility. An embedded canvas must not bypass policy through Archi's standalone
autosave behavior. Changing a chart never automatically asks EA to change it again.

## R-01 Typed Output And Authority

OUT is the common contract for model output, including generated charts/patches.
Calls here are conceptual pure validation, not extra model passes. Classification,
drafting and repair model calls all debit a controller-owned task ledger before
calling a bounded worker. A helper must not secretly start another inference loop.

```text
validate_typed_output(raw, task, allowed_sources):
    require task.live AND task.ledger.live
    schema = bundled_versioned_schema_for_requested_internal_result_kind()
    require schema.was_tested_with_pinned_runtime_and_has_no_remote_references
    parsed = strict_bounded_parser(raw, reject_duplicate_keys = TRUE)
    require independent_schema_validator_accepts(parsed, schema)
    require parsed.contains_no_policy_origin_budget_or_external_action_fields
    refs = resolve_against_controller_supplied_IDs(parsed.refs, allowed_sources)
    require every_reference_matches_current_scope_revision_policy_and_data_generation(refs)
    support = check_exact_labels_math_results_and_source_attribution(parsed, refs)
    withhold_unsupported_target_instructions_and_fabricated_completed_actions(support)
    result = distinguish_observed_documented_reported_inferred_unknown_and_conflicting(support)
    require task_and_source_generations_still_current()
    return inert_typed_result(result) # Never active HTML, remote images or script links.

on_invalid_output(error):
    return bounded_validation_failure_to_original_caller(error)
    # Only that caller can spend an existing remaining repair pass.
```

Format validity does not establish truth. The independent checker can verify
references, literal labels, numerical results and known constraints; it cannot
prove every natural-language inference. No uncalibrated confidence percentage
substitutes for source support. Prompt injection remains a risk to answer quality,
even though source text cannot grant tools, networking or controller authority.

## R-02 Evidence Casework

CASE is a proposed inspectable representation of existing troubleshooting,
evidence and notes features, not an autonomous investigation agent.

```text
assemble_casework_from_verified_claims_and_user_reports(answer):
    case = {goal, reported_symptom, hypotheses, claims, proposed_user_test,
            actual_result, conclusion, alternatives, missing_evidence, coverage}
    for claim in bounded(answer.claims):
        attach_source_ID_revision_locator_time_and_origin_status(claim)
        inherit_acquisition_retention_and_derivation_lineage(claim)
    retrieve_exact_labels_errors_and_app_version_matches_before_optional_semantic_results()
    preserve_conflicting_claims_without_silently_picking_the_most_fluent_one()
    if one_missing_fact_could_change_the_answer:
        propose_one_manual_observation_and_why_it_distinguishes_hypotheses()
        wait_only_for_explicit_user_response_within_task_lifetime()
        record_result_as_USER_REPORTED_or_NEW_AUTHORIZED_OBSERVATION_or_NOT_PERFORMED
    return supported_conclusion_or_partial_case_with_actual_coverage()

on_case_save_request(case):
    require explicit_save AND acquisition_and_current_source_eligibility(case)
    save_as_EA_owned_note_with_source_lineage_and_deletion_rules()
```

Another test requires a deliberate continuation. Suggested actions never count
as completed actions; no background verification, browser navigation or silent
re-reading is authorized by a hypothesis. A case is temporary unless eligible
for a reviewed save, including summaries and any chart derived from it.

## R-03 Selected Chart Patches

PATCH details CHART's existing parse/layout/preview/commit stages; calling the
stage helpers does not run that sequence twice or allocate another ledger.

```text
materialize_selected_chart_candidate(typed, baseline, scope):
    require typed.base_revision == baseline.revision
    ops = validate_allowlisted_graph_operations_and_field_types(typed)
    require operation_targets_and_incident_edge_changes_within_explicit_scope(ops, scope)
    require existing_IDs_resolve_and_new_IDs_are_host_assigned_without_collision()
    candidate = apply_operations_to_private_copy(baseline, ops)
    require valid_endpoints_sources_entry_exit_and_atomic_node_contracts(candidate)
    return candidate # Original canvas unchanged; errors return to original CHART ledger.

supervised_selected_layout(candidate, baseline, scope, ledger):
    require ledger.live
    layout = established_layout_engine_for_new_or_selected_unpinned_elements(candidate)
    require no_changes_to_protected_text_colors_positions_sizes_or_unaffected_routes()
    require labels_fit_and_affected_geometry_has_no_incoherent_overlap()
    return bounded_layout_preview(layout)

compare_and_commit_chart_patch(draft, expected, task_generation, policy):
    with canvas_policy_and_data_commit_lock:
        require exact_reviewed_draft_and_base_revision_still_match(expected)
        require task_generation_live AND policy_current AND source_lineage_live
        atomically_replace_selected_EA_state_and_record_one_eligible_undo_step(draft)
    # Zero partial mutation on failure. RAM commit is not disk save.
```

Full re-layout needs explicit selection of that scope; pin guarantees are checked
by the host, not assumed from a library name. A stale preview returns CONFLICT,
preserves current user work and never silently rebases/retries/generates another
chart. Imported original files remain untouched.

## R-04 Bounded Branch Analysis

CHECK refines CHECK_BOUNDED_LOGIC. It reads declarative guards, not executable
node pseudocode. The exact finite grammar and caps require approval before freeze.

```text
check_declared_branches_under_shared_limits(request):
    require request.origin == EXPLICIT_USER_REQUEST
    require user_reviewed_formal_assumptions_and_finite_variable_domains()
    ast = parse_Boolean_connectives_comparisons_enum_and_bounded_integer_literals()
    reject calls_assignments_imports_quantifiers_and_arbitrary_expressions()
    ledger = request.existing_parent_ledger_or_new_explicit_check_ledger(
        active_seconds = 5, variables = 16, domain_values_each = 16,
        predicates = 200, path_edges = 32, reported_witnesses = 32)
    # Unmeasured proposed upper caps; a nested check inherits the tighter parent.
    with supervised_internal_solver(ledger, finite_timeout_and_rlimit, no_payload_traces):
        A = confirmed_assumptions_and_domains()
        if solve(A) == UNSAT: return INCONSISTENT_ASSUMPTIONS
        if result_is_unknown_or_expired: return INCOMPLETE
        for decision in bounded_selected_decisions:
            check_gap = solve(A AND NOT(OR(decision.guards)))
            check_each_pair_overlap = solve(A AND guard_i AND guard_j)
            # Every query uses the same shrinking deadline, never a fresh 5 seconds.
            for SAT_assignment in bounded_results:
                require independent_guard_AST_evaluator_confirms_assignment()
                record_counterexample_with_query_type_and_source_nodes()
        inspect_paths_with_accumulated_guards_up_to_shared_edge_and_query_bounds()
        record_unvisited_paths_and_unmodeled_state_changing_actions()
    revalidate_task_policy_and_canvas_revision()
    return report(SAT_witnesses, UNSAT_for_named_queries, UNKNOWN, TIMEOUT, coverage)
    # No chart mutation, external action, model repair, or automatic follow-up.
```

Conditions along paths refer to the reviewed snapshot of variables. Real actions
that change state are not simulated; paths beyond such unmodeled effects are
unknown. An UNSAT gap query only means no gap under A, not a correct real-world
workflow. A path bound is not a termination proof. Example: guards `x > 0` and
`x < 0` over {-1,0,1} have a gap at 0; `x >= 0` and `x <= 0` overlap there.

## R-05 Independent Resource Supervision

GUARD is the shared admission/lifecycle contract, outside the model and UI thread.
Never treat Linux cgroups as filesystem/network isolation or an absolute host
crash guarantee. Actual protection support and low-memory behavior need testing.
The OUT/CHECK admission nodes reserve the lease for their following stages;
their GUARD detail links describe that same lifecycle, not a second invocation.

```text
supervise_internal_job(job):
    require typed_allowlisted_internal_worker AND live_parent_ledger(job)
    controls = probe_tested_OS_enforcement_and_separate_access_isolation()
    if required_controls_unavailable: return UNAVAILABLE_without_launch
    with owned_single_heavy_worker_lease:
        worker = NONE
        result = NONE
        try:
            require measured_peak_profile_exists(job)
            require stage_fits_both_EA_ceiling_and_live_system_headroom(measured_profile(job))
            install_limits_before_launch_with_UI_supervisor_outside_worker_kill_group()
            worker = launch_internal_worker_with_only_scoped_data_and_handles()
            monitor_monotonic_deadline_cancellation_and_live_memory_pressure()
            if pressure_cancel_or_deadline:
                invalidate_output_generation_before_stopping_owned_worker_children()
                result = LIMITED_or_CANCELLED_without_payload
            else:
                require task_policy_data_and_source_revisions_still_match()
                result = detach_bounded_result_into_parent_owned_storage(worker_result, job)
                # Account copy peaks before accepting; returned bytes cannot borrow dying worker memory.
        on_launch_or_worker_failure:
            invalidate_output_generation_before_stopping_owned_worker_children()
            result = actual_typed_worker_failure_without_payload()
        finally:
            cleanup = finite_stop_and_reap_owned_launch_group() # Returns actual status even on failure.
            # The lease tracks partial launch children even if launch never returns a worker handle.
            release_only_untransferred_worker_buffers()
            quarantine_slot_if_owned_children_or_residency_unresolved(cleanup)
            # Never grant a second heavy slot while shutdown is unresolved; keep the UI responsive.
        if not cleanup.confirmed: invalidate_and_release_parent_candidate(result); return CLEANUP_PENDING
        if result.has_payload: require result_owner_policy_source_expiry_and_generation_still_current(result)
        return result
```

No root escalation or unsandboxed fallback to make a feature appear available.
Persistent model weights differ from private prompt/KV caches; cache reuse checks
source revision, purpose, permissions, data generation, expiry and byte budget.
Admission failure can leave exact evidence/manual tools available but does not
count as positive support for the blocked feature on the required 4 GB baseline.

## R-06 Verified Forgetting

ERASE extends on_forget after its tombstone transaction. Logical exclusion must
precede slower cleanup; deletion bookkeeping cannot itself retain source payloads.

```text
verify_forgetting(affected):
    require tombstones_committed_and_data_generation_advanced(affected)
    job = load_cleanup_inventory_committed_with_tombstones(affected)
    cancel_pending_writes_readers_previews_and_derived_chart_history(affected)
    for store in bounded_owned_store_inventory(job):
        if deletion_mode_or_store_version_is_not_supported(store):
            record_pending(store, COMPATIBILITY_BLOCKER)
            continue
        remove_or_rewrite_owned_records_and_shadow_derivatives(store, affected)
        results[store] = verify_store_specific_cleanup_not_only_search_absence()
    keep_nonpayload_tombstones_and_pending_jobs_until_restore_cannot_resurrect_data()
    return per_store_status_with_external_copy_and_trained_weight_limitations(results)

on_restore_owned_backup(backup):
    require explicit_restore AND storage_policy_current()
    staged = parse_selected_backup_without_exposing_its_content()
    staged = filter_current_tombstones_revocations_expiry_and_source_eligibility(staged)
    rebuild_only_eligible_indexes_and_history()
    commit_under_data_generation_check_or_report_conflict()
```

Audit FTS5 secure-delete separately from core SQLite secure_delete and schema
compatibility. Acceptance injects synthetic canaries into database/FTS shadow
stores, journals/WAL, caches, undo/autosave and backups, then inspects each store.
A pending/locked/offline copy prevents an all-clean receipt. Physical overwrite
of every historical SSD/swap/OS/external copy is not claimed; dataset deletion
does not remove a learned fact from model weights.

## R-07 Trusted Artifacts

TRUST is explicit installer/settings maintenance, absent from ZI model tools.
It may use an approved download only in that maintenance context. Normal
assistance never fetches an update, launches an installer or mutates system files.

```text
verify_and_stage_artifact_without_automatic_activation():
    require explicit_user_maintenance_or_local_import_request()
    if publisher_managed_bundle:
        metadata = maintained_trust_verifier(pinned_root, bounded_metadata)
        require signatures_hashes_lengths_versions_expiry_and_rollback_checks_pass()
        require sufficiently_trustworthy_clock_for_new_update_validation()
    else:
        require explicit_review_of_user_managed_origin_and_unverified_publisher_status()
        require supported_inert_tensor_or_data_format_without_executable_model_code()
    staged = bounded_candidate_copy_without_overwriting_active_artifact()
    require exact_expected_bytes_license_format_runtime_and_tokenizer_compatibility()
    require adapter_lineage_still_eligible_if_applicable()
    require independent_quality_privacy_and_positive_4GB_cases_pass()
    return candidate_for_explicit_activation_preview()

on_artifact_activation(candidate):
    require user_approves_exact_candidate AND bytes_consent_and_lineage_still_match()
    require current_trust_policy_and_verified_metadata_still_allow_activation()
    atomically_switch_active_revision_preserving_last_still_eligible_working_artifact()
    never_lower_trusted_metadata_version_floors_during_rollback()
```

An expired/forged update is rejected without overwriting the active version.
The last-working rollback must still be permitted by the current trust and data
policy. Offline verification cannot prove latest releases or revocations; show
that limitation without automatically breaking existing offline functionality.
Installer traffic/explicit artifact writes are maintenance, not ZII automation.

## R-08 Traceability And Stateful Drills

TRACE is an engineering procedure. The full-inventory and refinement indexes record cross-references,
not human approvals. Planned stateful EA runtime tests differ from the artifact
checks implemented in this analysis workspace.

```text
review_research_refinement(change):
    require change.within_open_analysis_or_existing_frozen_contract()
    refs = parse_full_inventory_and_refinement_indexes()
    validate_all_sectors_features_flows_headings_requirements_settings_evidence_and_spikes()
    require exact_acceptance_ID_index_AND_scenario_citation_per_criterion_AND_named_flows_per_scenario()
    require reciprocal_feature_scenario_links_and_no_unindexed_current_artifacts()
    validate_unique_IDs_and_all_feature_requirement_scenario_setting_evidence_links(refs)
    validate_pseudocode_sections_and_linked_saved_flow_nodes(refs)
    compare_source_board_and_reference_semantics_preserving_user_layout()
    if missing_or_conflicting: return ARTIFACT_MISMATCH
    define_independent_synthetic_oracles_and_bounded_stateful_transition_sequences()
    if no_EA_runtime: record_PLANNED_NOT_VERIFIED_for_runtime_claims()
    else: run_drills_and_record_build_profile_seed_results_without_private_payloads()
    keep_document_sync_review_pending_until_explicit_human_semantic_review()
    return OPEN_UNTIL_EXIT_GATES_AND_USER_SIGNOFF
```

Drill sequences include revoke while previewing, collect-off then save, cancel
then late output, delete then restore, A-B-A chart repair and child budget reset
attempts. Assert authority/retention/counter invariants after every transition.
No generated chart, test result or sync warning asks the assistant to generate
another chart. These procedures cannot certify all possible future behaviors.

## Quality-First Feasibility And Freeze

These are engineering review procedures, not tasks exposed to the ZI assistant.

```text
evaluate_configuration(candidate, fixtures, profile):
    require named_total_machine_RAM_at_or_below_4GB(profile)
    require independent_oracles_and_positive_cases_for_every_ZI_feature(fixtures)
    require distribution_manifest_and_offline_availability_review(candidate)
    quality = measure_correctness_precision_privacy_and_coverage(candidate, fixtures)
    if not quality.meets_all_approved_gates: return REJECTED(quality)
    resources = measure_whole_process_tree_plus_foreground_OS_workload(candidate)
    if not every_positive_feature_completes_within_4GB_contract(resources):
        return REJECTED(resources)
    latency = measure_cold_warm_first_useful_complete_and_stop(candidate)
    return PASSING_CONFIGURATION(quality, resources, latency, limits, hashes)

sign_off_analysis():
    require every_feature_explicitly_included_or_excluded()
    require all_G_01_through_G_08_exit_gates_reviewed_and_ready()
    require user_explicitly_approves_complete_inventory_and_evidence()
    baseline = snapshot_approved_docs_board_test_plan_and_artifact_versions()
    baseline.allow_new_features = FALSE
    return DESIGN_MAY_BEGIN_WITHIN_BASELINE

review_post_freeze_change(change):
    if change.adds_user_outcome_permission_format_platform_or_capability:
        return REJECT_OUTSIDE_FROZEN_SCOPE
    require change.preserves_approved_contracts
    require impacted_docs_flows_and_tests_are_reconciled()
    return WITHIN_SCOPE_DESIGN_OR_REPAIR
```

Do not mark the draft frozen because these procedures are written. Focused
4 GB feasibility experiments, scope choices and explicit approval remain open.

## Acceptance Evidence

```text
define_acceptance(requirement):
    assign_stable_requirement_ID()
    describe_Given_preconditions_and_When_trigger()
    describe_Then_outcome_and_forbidden_side_effects()
    record_measurable_threshold_and_independent_oracle()
    add_denial_ambiguity_stale_input_cancel_and_resource_failure_cases()
    link_requirement_to_Archi_nodes_and_test_fixtures()
    review_scope_and_proposed_thresholds_with_user()
    if no_EA_implementation_exists:
        return PLANNED_NOT_VERIFIED
    results = run_tests_on_named_build_hardware_apps_and_permissions()
    return VERIFIED_FOR_THAT_PROFILE only_if all_approved_gates_pass(results)

on_requirement_or_flow_change():
    mark_linked_artifacts_for_sync_review()
    reassess_affected_acceptance_evidence()
    # Matching file revisions do not prove matching meaning or passing behavior.
```

## ZII Delegation, Not ZI

```text
run_delegated_task(goal, user_grant):
    require separately_installed_ZII_execution_backend()
    require explicit_goal_scope_and_finite_budget(user_grant)
    lease = independent_broker.issue_least_privilege_lease(user_grant)
    try:
        while lease.live:
            require not user_cancelled
            require resource_and_time_and_step_budgets_remaining()
            evidence = observe_current_state_under_scope()
            if verified_goal_achieved(evidence): return SUCCESS
            if repeated_failure_or_no_progress(): return BLOCKED
            proposal = planner.propose_one_action(evidence, goal)
            authorization = broker.authorize(proposal, lease)
            if authorization.denied: return NEEDS_USER
            if authorization.requires_confirmation:
                require user_approves_exact_effects(proposal)
            result = broker.execute_in_scoped_isolation(proposal)
            outcome = independently_verify_result(result)
            record_minimal_progress_only_if_retention_allows(outcome)
    finally:
        broker.revoke(lease)
        cancel_remaining_actions()
        report_partial_effects_and_uncertain_outcomes()
    # The model cannot grant itself tools or permissions.
    # External text cannot become a higher-priority instruction.
    # Resuming after a crash requires live permissions and renewed consent.
```
