// Research-led analysis refinements. CALLs describe contracts, not implemented APIs.
export const strengtheningFlows = [
  {
    id: 'outputContract', prefix: 'OUT', title: '45 Typed Output Contract',
    notes: 'R-01; SC-22; EA-OUT-01/02; E-20/21. Syntax, references and factual support are separate checks. The controller owns authority; source/model text is inert data.',
    nodes: [
      ['request', 'Accept the task envelope', 'envelope = controller_owned_task_snapshot()', 'Origin, scope, source IDs, policy generation and remaining budget are supplied by trusted code, never parsed from source instructions.', [['', 'schema']]],
      ['schema', 'Select a local schema', 'schema = bundled_schema_for_allowed_result_kind()', 'Use a pinned, compatibility-tested schema with bounded strings/arrays and no remote references or user-supplied schema extensions.', [['', 'lease']]],
      ['lease', 'Acquire a bounded worker lease', 'lease = resource_guard.admit(task)', 'Every model, parser and renderer stage consumes the same live parent deadline. Admission failure returns unavailable. GUARD details this ongoing worker lifecycle, not a second job execution.', [['ready', 'generate'], ['denied', 'reject']], 'resourceGuard'],
      ['generate', 'Request constrained output', 'raw = bounded_grammar_guided_draft(envelope, schema)', 'This call consumes an already-debited model pass. Grammar support is tested; grammar success is not semantic correctness.', [['', 'parse']]],
      ['parse', 'Parse bounded result data', 'parsed = strict_parse_with_duplicate_key_and_size_checks(raw)', 'Reject malformed nesting, duplicate keys, excess bytes and unexpected fields before constructing UI objects.', [['', 'shape']]],
      ['shape', 'Schema valid?', 'IF independent_schema_validator_accepts(parsed)', 'This independent check must enforce constraints the runtime grammar converter might omit.', [['yes', 'refs'], ['no', 'reject']]],
      ['refs', 'Resolve evidence references', 'refs = resolve_only_supplied_source_and_target_IDs(parsed)', 'The model cannot invent a live UI target, source revision, permission, completed action or user request.', [['', 'current']]],
      ['current', 'References current and permitted?', 'IF references_match_scope_revision_and_policy(refs)', 'Unknown, revoked, expired or cross-task references block dependent claims and pointing.', [['yes', 'support'], ['no', 'reject']]],
      ['support', 'Assess claim support', 'assessment = check_literals_calculations_and_attribution(parsed, refs)', 'Use exact-label checks and established math engines where applicable. Other claims remain attributed inference or unknown; no claim of universal semantic verification.', [['', 'classify']]],
      ['classify', 'Assign visible claim status', 'result = mark_observed_documented_inferred_unknown(assessment)', 'Conflicts and coverage gaps remain visible. An unsupported current-control instruction is withheld, not upgraded by fluent wording.', [['', 'render']]],
      ['render', 'Render inert content', 'view = render_escaped_text_and_typed_internal_results(result)', 'No remote images, active HTML, script, command links or automatic URL requests. A malicious citation cannot create network traffic.', [['', 'publish']]],
      ['publish', 'Publish if task still live', 'RETURN compare_policy_generation_then_publish(view)', 'Last-moment cancellation or revocation discards output. Cleanup is mandatory on every return.', []],
      ['reject', 'Return a bounded failure', 'RETURN INVALID_or_UNAVAILABLE_without_publication', 'The caller may repair only within its existing debited parent ledger. This subflow never renews budgets or retries itself.', []]
    ]
  },
  {
    id: 'casework', prefix: 'CASE', title: '46 Evidence Casework',
    notes: 'R-02; SC-23; EA-CASE-01; E-22. Proposed inspectable case representation within existing notes/evidence capabilities. User actions and observed results remain distinct.',
    nodes: [
      ['goal', 'Record the requested outcome', 'case.goal = explicit_user_goal', 'Keep the desired outcome separate from an inferred diagnosis. The current question establishes no unlimited investigation.', [['', 'symptom']]],
      ['symptom', 'Record the reported symptom', 'case.symptom = attributed_user_report()', 'A report of failure is evidence of the report; it is not proof of a particular cause.', [['', 'sources']]],
      ['sources', 'Acquire scoped evidence', 'sources = bounded_read_and_recall_under_current_policy()', 'Use app/version/role/revision filters and exact labels/errors first. Optional semantic retrieval must obey the same scope.', [['', 'claims']]],
      ['claims', 'Attach claim provenance', 'claims = source_revision_locator_and_status(sources)', 'Separate observed, documented, inferred, user-reported and unknown claims; original retention eligibility follows every derivative.', [['', 'hypotheses']]],
      ['hypotheses', 'List competing explanations', 'case.hypotheses = bounded_attributed_alternatives(claims)', 'Do not invent calibrated probabilities. The current role, app version and disabled control may support different explanations.', [['', 'conflict']]],
      ['conflict', 'Evidence conflicts?', 'IF material_claims_disagree', 'New UI state does not silently erase older documentation or the user report.', [['yes', 'expose'], ['no', 'need']]],
      ['expose', 'Show the disagreement', 'show_source_specific_conflict()', 'Identify exactly what conflicts and which conclusion is withheld.', [['', 'need']]],
      ['need', 'Another observation necessary?', 'IF one_missing_fact_could_change_guidance', 'Request the minimum useful evidence; avoid repeatedly asking equivalent questions.', [['yes', 'ask'], ['no', 'conclude']]],
      ['ask', 'Suggest one user test', 'show_manual_test_reason_and_expected_distinguishing_result()', 'For example, ask the user to open a menu and report whether Pause is disabled. EA never performs the test.', [['', 'wait']]],
      ['wait', 'Wait within the task lifetime', 'event = wait_for_explicit_user_result_or_expiry()', 'No automatic scraping, polling or chart generation while waiting.', [['result', 'result'], ['ended', 'partial']]],
      ['result', 'Attribute the actual result', 'case.result = user_report_or_new_authorized_observation(event)', 'Record whether a result is reported or directly observed. Do not label a suggested test completed merely because time elapsed.', [['', 'conclude']]],
      ['conclude', 'Explain the supported conclusion', 'answer = conclusion_with_alternatives_and_coverage(case)', 'Unresolved cause is a legitimate result. No automatic claim of repair, complete coverage or malware safety.', [['', 'present']]],
      ['present', 'Present the case', 'RETURN policy_checked_case_in_EA()', 'Saved notes/case history require acquisition-time and current source eligibility; default task-only state expires.', []],
      ['partial', 'Return the unresolved case', 'RETURN PARTIAL_with_missing_fact', 'Preserve only currently permitted evidence; another investigative pass requires explicit user continuation.', []]
    ]
  },
  {
    id: 'chartPatch', prefix: 'PATCH', title: '47 Selected Chart Changes',
    notes: 'R-03; SC-24; EA-PATCH-01/02; E-23/24. This is the chart revision subflow inside CHART, not a second generation loop. Preserve user-owned content and layout.',
    nodes: [
      ['scope', 'Capture the selected edit scope', 'scope = explicit_node_edge_and_operation_selection()', 'Editing a label does not authorize deleting its neighbors, changing settings or rearranging the entire project.', [['', 'base']]],
      ['base', 'Snapshot the base revision', 'base = immutable_canvas_snapshot_with_stable_IDs()', 'Include source-policy/data generations and user-pinned geometry in the preview preconditions.', [['', 'operations']]],
      ['operations', 'Accept typed operations', 'ops = bounded_allowed_graph_operations(proposal)', 'Allow declared add/remove/update node/edge operations only. No arbitrary JSON paths, file paths, URLs to fetch or application commands.', [['', 'targets']]],
      ['targets', 'All targets within edit scope?', 'IF operation_targets_and_incident_edges_are_authorized(ops, scope)', 'Deleting a node must explicitly account for its incident edges. An unknown/stale stable ID rejects the whole proposal.', [['yes', 'candidate'], ['no', 'reject']]],
      ['candidate', 'Build a private candidate', 'candidate = apply_to_copy(base, ops)', 'The live canvas is untouched during validation. New IDs are assigned by the host and cannot collide.', [['', 'validate']]],
      ['validate', 'Validate the complete candidate', 'issues = structural_reference_and_source_checks(candidate)', 'Verify every edge endpoint, declared entry/exit, node operation and source lineage. Drawing cycles does not execute them.', [['', 'valid']]],
      ['valid', 'Candidate valid?', 'IF not issues.blocking', 'A repair is returned to CHART and consumes its original remaining passes; this subflow does not start a repair job.', [['yes', 'layout'], ['no', 'reject']]],
      ['layout', 'Lay out permitted elements', 'candidate = bounded_layout_of_new_or_selected_unpinned_elements(candidate)', 'Manual/unrelated positions and routes stay fixed. A full re-layout is allowed only by a separate explicit scope selection.', [['', 'pins']]],
      ['pins', 'Protected geometry unchanged?', 'IF untouched_text_colors_positions_and_routes_match(base)', 'The host verifies actual output, even if the chosen layout library claims interactive or fixed-position support.', [['yes', 'preview'], ['no', 'reject']]],
      ['preview', 'Show the exact change preview', 'approval = review_diff_and_candidate_revision(candidate)', 'Preview additions, deletions, changed assumptions and unresolved evidence, not an unrelated regenerated chart.', [['accepted', 'fresh'], ['rejected', 'reject']]],
      ['fresh', 'Commit preconditions current?', 'IF task_policy_data_and_canvas_revisions_still_match(base, approval)', 'Edits during preview and source revocation invalidate approval. Do not silently rebase or overwrite.', [['yes', 'commit'], ['no', 'conflict']]],
      ['commit', 'Commit one in-memory change', 'canvas.compare_and_apply_in_memory(candidate, expected = base)', 'The commit rechecks all preconditions under one lock and records one policy-aware undo step. A late mismatch returns conflict with zero partial writes.', [['applied', 'done'], ['conflict', 'conflict']]],
      ['done', 'Return the applied revision', 'RETURN APPLIED_revision_and_save_eligibility', 'RAM commit is not a disk save. Persistence follows CHART retention checks, including undo/history/backups.', []],
      ['conflict', 'Preserve current user work', 'RETURN CONFLICT_without_automatic_retry', 'Show that the base changed and request a new deliberate revision request. Never trigger another chart automatically.', []],
      ['reject', 'Discard the private candidate', 'RETURN REJECTED_with_bounded_issues', 'Keep the existing canvas intact and release temporary allocations; no code from the diagram executes.', []]
    ]
  },
  {
    id: 'branchCheck', prefix: 'CHECK', title: '48 Bounded Branch Checks',
    notes: 'R-04; SC-25; EA-LOGIC-01/02; E-25/26. Proposed refinement of bounded logic checks, not a workflow runner or universal termination proof. User-reviewed formal assumptions determine meaning.',
    nodes: [
      ['request', 'Accept an explicit check request', 'request = selected_chart_check_with_shared_parent_ledger()', 'Checking a chart cannot generate more charts. Automatic edits/autosave cannot invoke this operation.', [['', 'grammar']]],
      ['grammar', 'Parse the guard language', 'ast = restricted_Boolean_enum_bounded_integer_guard_parser()', 'Allow literals, finite-domain variables, comparisons and Boolean connectives. No eval, calls, assignments, imports or source pseudocode execution.', [['', 'supported']]],
      ['supported', 'Guards supported?', 'IF every_selected_guard_is_in_the_declared_grammar', 'Natural-language conditions require user-confirmed formalization. Uninterpreted actions remain inert labeled nodes.', [['yes', 'assumptions'], ['no', 'unknown']]],
      ['assumptions', 'Review variable domains', 'assumptions = user_confirmed_domains_and_invariants()', 'Initial proposal: 16 variables, at most 16 values per variable, 200 predicates; these are unmeasured limits, not promises.', [['', 'lease']]],
      ['lease', 'Admit the solver', 'lease = resource_guard.admit(check_task)', 'One check request has at most 5 active seconds, 32 path edges and 32 reported witnesses proposed. All queries share that deadline; no per-query renewal. GUARD details the same ongoing solver lifecycle, not another solve.', [['ready', 'queries'], ['denied', 'unknown']], 'resourceGuard'],
      ['queries', 'Build bounded queries', 'queries = consistency_overlap_gap_and_path_formulas(ast, assumptions)', 'Check assumptions first. Then use A AND gi AND gj for overlap and A AND NOT(OR guards) for a gap. Paths accumulate guards; no state-changing action semantics are inferred.', [['', 'solve']]],
      ['solve', 'Run the bounded solver', 'result = established_solver_with_finite_timeout_and_resource_limit(queries)', 'Disable traces to disk. The independent watchdog may stop a hung call; expose UNKNOWN/TIMEOUT rather than a passing result.', [['', 'status']]],
      ['status', 'Definitive result available?', 'IF result.is_SAT_or_UNSAT', 'A controller timeout may be classified separately from solver UNKNOWN. Both are incomplete, never UNSAT.', [['yes', 'sat'], ['no', 'unknown']]],
      ['sat', 'Witness found?', 'IF result == SAT', 'A SAT gap/overlap query identifies a counterexample within the declared domain; SAT assumptions merely mean the assumptions are consistent.', [['yes', 'witness'], ['no', 'bounded']]],
      ['witness', 'Validate the witness', 'witness = independently_evaluate_guard_AST(result.assignment)', 'Check a returned assignment against the restricted expression evaluator. An invalid witness is an engine failure, not user evidence.', [['valid', 'present'], ['invalid', 'unknown']]],
      ['bounded', 'Describe the bounded result', 'report = classify_UNSAT_for_the_specific_query()', 'UNSAT assumptions mean inconsistent inputs, not a correct workflow. UNSAT path queries only exclude paths within the reviewed bound and formalization.', [['', 'present']]],
      ['present', 'Show coverage and assumptions', 'RETURN source_checked_report_without_canvas_changes', 'Identify checks completed, paths not explored, formal inputs and engine/version. No guarantee of real-world success or termination.', []],
      ['unknown', 'Return incomplete analysis', 'RETURN UNKNOWN_or_TIMEOUT_or_UNSUPPORTED_with_coverage', 'No automatic budget increase, chart revision, action execution or recursive self-check. The user can submit a smaller/new request.', []]
    ]
  },
  {
    id: 'resourceGuard', prefix: 'GUARD', title: '49 Resource Supervisor',
    notes: 'R-05; SC-26; EA-GUARD-01/02; E-27. Conceptual worker lifecycle used by model/OCR/parser/layout/solver/voice. Resource controls are not an access-control sandbox.',
    nodes: [
      ['job', 'Accept a bounded job', 'job = typed_job_with_parent_ledger_and_resource_profile()', 'A child references its parent limits. No model text can reset counters, expand permission or select an arbitrary executable.', [['', 'probe']]],
      ['probe', 'Probe enforcement availability', 'controls = tested_OS_capability_probe_without_escalation()', 'On Linux assess actual delegated cgroup controls; never assume a documented interface is usable by this user.', [['', 'supported']]],
      ['supported', 'Required protection available?', 'IF tested_resource_and_access_isolation_contracts_available', 'Memory controls alone do not block network or files. An unavailable required protection blocks this worker; no root prompt or unsandboxed fallback.', [['yes', 'memory'], ['no', 'unavailable']]],
      ['memory', 'Measure live headroom', 'headroom = current_available_RAM_minus_system_reserve()', 'Track resident UI/supervisor and all buffers against the EA ceiling separately. Already-resident EA is reflected in available RAM and is not subtracted twice. WORK details incremental demand and whole-system accounting.', [['', 'fits']]],
      ['fits', 'Measured job profile fits?', 'IF incremental_peak_plus_margin_fits_headroom_AND_total_EA_peak_fits_ceiling(job)', 'Unknown profiles require feasibility evidence, not speculative admission. Include loader/handoff peaks and retained pages. Limits can temporarily overshoot, so retain a measured margin.', [['yes', 'lease'], ['no', 'unavailable']]],
      ['lease', 'Reserve the heavy-worker slot', 'lease = atomic_single_heavy_worker_admission(parent_ledger)', 'Foreground help preempts optional background work. Recheck headroom after acquiring the slot; queued work cannot exceed a bounded queue.', [['', 'limits']]],
      ['limits', 'Install enforceable limits', 'configure_worker_RAM_CPU_deadline_and_access_boundaries(lease)', 'The try/finally lifecycle begins before configuration and launch. Keep UI/supervisor outside the owned launch group while counting their memory. No target app is launched or controlled.', [['', 'launch']]],
      ['launch', 'Launch the internal worker', 'worker = start_allowlisted_internal_service(lease)', 'The lease tracks partial launch children even if launch throws before returning a handle. Cleanup reaps only that owned group. Pass only scoped data/handles; no ZI external executor.', [['', 'monitor']]],
      ['monitor', 'Observe supervisor events', 'event = bounded_wait_for_completion_pressure_cancel_or_deadline()', 'A monotonic deadline and process supervision remain live if the worker is hung. Pressure admission is advisory; enforced caps remain independent.', [['complete', 'current'], ['stop', 'cancel']]],
      ['current', 'Result generation still current?', 'IF result_matches_live_task_policy_and_source_revisions', 'Before reaping, detach a bounded successful payload into parent-owned storage with copy peaks accounted. Late/canceled/revoked output is rejected; publication rechecks again after cleanup.', [['yes', 'release'], ['no', 'cancel']]],
      ['cancel', 'Invalidate worker output', 'invalidate_task_result_generation()', 'This must happen before waiting for shutdown; cached data from another task cannot be reused.', [['', 'stop']]],
      ['stop', 'Terminate remaining worker work', 'supervisor_stop_children_with_finite_escalation()', 'Stop the owned internal worker, never arbitrary user applications. Preserve the last permitted UI draft.', [['', 'release']]],
      ['release', 'Release the worker lease', 'reap_owned_group_and_release_only_untransferred_buffers()', 'The returned payload is parent-owned and stays charged; do not free borrowed memory beneath the caller. Quarantine the slot if children/residency remain unresolved. Account permitted warm pages and scoped caches; slot release is not proof of reclaimed RAM.', [['', 'finish']]],
      ['finish', 'Report the actual outcome', 'RETURN guarded_payload_or_actual_cleanup_failure_status', 'Recheck owner/source/policy/expiry after cleanup. Pending cleanup cannot be called COMPLETE or permit another heavy worker. No crash-proof claim; positive completed cases remain required.', []],
      ['unavailable', 'Return unavailable protection or RAM', 'RETURN UNAVAILABLE_without_launch', 'Offer bounded exact evidence or a smaller requested scope where possible; required feature feasibility remains a blocker.', []]
    ]
  },
  {
    id: 'forgetProof', prefix: 'ERASE', title: '50 Verify Forgetting',
    notes: 'R-06; SC-27; EA-ERASE-01/02; E-22/28. Logical exclusion is immediate; physical cleanup is a separately verified resumable operation. No universal forensic-erasure promise.',
    nodes: [
      ['selection', 'Accept the forget selection', 'selection = explicit_owned_data_selection()', 'Preview affected owned copies and trained/external limits without widening the selected scope.', [['', 'closure']]],
      ['closure', 'Preview derivative lineage', 'preview = selected_sources_and_derived_record_IDs()', 'Preview claims, chunks, indexes, summaries, charts, undo/history, caches, datasets and owned backups. This is not the authoritative cleanup inventory; that closure is recomputed inside the deletion transaction.', [['', 'tombstone']]],
      ['tombstone', 'Commit the deletion barrier', 'affected = transaction_current_closure_tombstones_and_cleanup_inventory(selection)', 'Within the shared lock recheck owner/confirmed scope, resolve current descendants, mark tombstones, advance data generation and persist cleanup inventory before commit. When expanding DEL, reuse its committed transaction receipt instead of starting a second deletion.', [['', 'cancel']]],
      ['cancel', 'Cancel affected work', 'invalidate_readers_workers_previews_and_caches(affected)', 'No late save can resurrect a deleted source. User-authored unrelated work is not removed.', [['', 'plan']]],
      ['plan', 'Load committed cleanup stores', 'job = load_committed_content_free_cleanup_inventory(affected)', 'Inventory was persisted with tombstones, before cancellation or filesystem work. Resume that exact opaque-ID job after interruption; do not rebuild it from already-deleted lineage.', [['', 'compat']]],
      ['compat', 'Storage deletion mode supported?', 'IF audited_SQLite_FTS_and_store_versions_are_compatible', 'FTS5 secure-delete and core secure_delete are distinct. Migration/downgrade must not silently disable the supported deletion contract.', [['yes', 'purge'], ['no', 'pending']]],
      ['purge', 'Remove owned derivatives', 'purge_or_rewrite_each_owned_store(job)', 'Use tested deletion paths for base/FTS/vector data, temporary files, caches, journals/WAL and backups. Respect locks and quotas.', [['', 'verify']]],
      ['verify', 'Verify each store result', 'results = check_owned_cleanup_inventory(job)', 'Production receipts report actual store status. Synthetic acceptance additionally searches shadow/index/page/backup canaries; a search returning zero is insufficient.', [['', 'complete']]],
      ['complete', 'All owned cleanup verified?', 'IF every_owned_store_result_is_complete', 'A locked backup, offline device or failed checkpoint remains pending. Never relabel it complete because lookup is blocked.', [['yes', 'receipt'], ['no', 'pending']]],
      ['receipt', 'Report bounded cleanup evidence', 'RETURN owned_cleanup_complete_with_external_limits', 'Distinguish EA-owned cleanup from SSD/swap/OS copies, external exports and trained weights. Retain only minimal nonpayload tombstones as needed.', []],
      ['pending', 'Retain the incomplete job', 'persist_pending_store_status_without_payload()', 'Retry only through bounded storage maintenance, with no observation, model or chart generation. Tombstones remain authoritative.', [['', 'partial']]],
      ['partial', 'Report pending cleanup honestly', 'RETURN EXCLUDED_BUT_CLEANUP_PENDING', 'The user sees what is inaccessible, what is still pending and why. Restore must filter tombstones before exposing old data.', []]
    ]
  },
  {
    id: 'artifactTrust', prefix: 'TRUST', title: '51 Artifact Trust',
    notes: 'R-07; SC-28; EA-TRUST-01/02; E-29. Explicit installer/settings maintenance, not an assistant action or automatic remote research. Existing offline operation is separate from accepting a new update.',
    nodes: [
      ['request', 'Accept a maintenance request', 'request = explicit_setup_or_update_or_local_import()', 'This privileged maintenance path is outside the model tool registry. Consent names artifact, source, size and destination.', [['', 'channel']]],
      ['channel', 'Publisher or user-managed artifact?', 'IF artifact_has_publisher_trust_channel', 'Local user adapters may lack publisher signatures; that does not make them publisher-authenticated.', [['publisher', 'metadata'], ['local', 'local']]],
      ['metadata', 'Verify trusted metadata', 'metadata = maintained_verifier_from_pinned_trust_root()', 'Check signature thresholds, declared hashes/lengths, versions, expiry and rollback/freeze rules. Bounded offline bundles or explicitly approved installer fetch only.', [['valid', 'stage'], ['invalid', 'reject']]],
      ['local', 'Review user-managed provenance', 'approval = review_unverified_local_artifact_origin_and_risk()', 'Keep a distinct trust label; require safe tensor/data-only formats, no executable model code, license/compatibility review and explicit local import.', [['approved', 'stage'], ['declined', 'reject']]],
      ['stage', 'Stage the selected bytes', 'staged = bounded_temporary_artifact_copy()', 'Do not overwrite the active artifact. A digest identifies bytes but cannot authenticate a publisher without trusted metadata.', [['', 'hash']]],
      ['hash', 'Verify identity and length', 'check_expected_hash_length_and_complete_bytes(staged)', 'Mismatch, truncation, excess size or substituted content rejects the candidate.', [['valid', 'compat'], ['invalid', 'reject']]],
      ['compat', 'Check runtime compatibility', 'check_license_format_tokenizer_base_and_schema_versions(staged)', 'For adapters, exact compatible base/tokenizer matters. A successful parse is not quality or memory acceptance.', [['valid', 'evaluate'], ['invalid', 'reject']]],
      ['evaluate', 'Evaluate the candidate profile', 'result = existing_quality_privacy_and_4GB_acceptance_protocol(staged)', 'Use published/synthetic fixed fixtures; do not benchmark with private user observations by default. Keep the current artifact active.', [['', 'passed']]],
      ['passed', 'Candidate gates pass?', 'IF required_quality_resource_and_compatibility_gates_pass', 'No faster-but-wrong swap or larger-RAM exception. New unsupported models remain unvalidated candidates.', [['yes', 'activate'], ['no', 'reject']]],
      ['activate', 'Confirm artifact activation', 'approval = explicit_artifact_change_preview()', 'Show memory/disk needs, trust label, current metadata freshness, settings changes and rollback limits.', [['approved', 'commit'], ['declined', 'reject']]],
      ['commit', 'Activate the verified candidate', 'atomic_revision_checked_active_artifact_switch()', 'Recheck bytes, consent, lineage and current trust/metadata authorization at activation. Preserve last-working trusted bytes and trust/version floors; no private-data restoration on rollback.', [['', 'done']]],
      ['done', 'Report actual artifact status', 'RETURN active_hash_version_trust_and_freshness', 'Offline use cannot prove latest revocation/latest release. Expired metadata blocks a new publisher update, not an automatic disabling of already installed offline functionality.', []],
      ['reject', 'Reject the staged candidate', 'RETURN previous_active_artifact_unchanged', 'No disabling verification, auto-root or automatic retries. Report blocked updates and clock/metadata uncertainty separately from existing offline availability.', []]
    ]
  },
  {
    id: 'assurance', prefix: 'TRACE', title: '52 Traceability And Drills',
    notes: 'R-08; SC-29; EA-TRACE-01/02; E-30. Engineering analysis/test procedure, not a runtime ZI agent capability. Structural checks never fabricate semantic approval.',
    nodes: [
      ['change', 'Identify the specification change', 'change = explicit_analysis_revision()', 'Record whether it refines an existing contract or adds a user outcome. Frozen-scope additions remain rejected.', [['', 'map']]],
    ['map', 'Resolve all analysis references', 'refs = parse_ALIGNMENT_and_REFINEMENTS_indexes()', 'The full inventory index covers every current sector; the refinement index adds R-01..08 node-level links. Check reciprocal feature/scenario references and coverage of settings, requirements, pseudocode, evidence and experiments.', [['', 'resolve']]],
      ['resolve', 'Every reference resolves?', 'IF all_referenced_definitions_and_node_IDs_exist', 'A missing acceptance criterion or deleted linked node is a visible failure, not a silently dropped link.', [['yes', 'content'], ['no', 'blocked']]],
      ['content', 'Compare board semantics', 'check_source_saved_board_and_reference_content()', 'Compare labels, pseudocode, descriptions and transitions; preserve user layout and flag conflicting edits rather than overwrite.', [['', 'agree']]],
      ['agree', 'Structural checks pass?', 'IF no_missing_or_conflicting_artifact_content', 'Matching structure is necessary, not sufficient for semantic agreement.', [['yes', 'fixtures'], ['no', 'blocked']]],
      ['fixtures', 'Define independent fixtures', 'oracles = synthetic_scenarios_and_expected_invariants()', 'Include revoke/save, cancel/late output, collection-off/undo, deleted-data/restore and repeated-child-budget sequences.', [['', 'implementation']]],
      ['implementation', 'Runtime exists to test?', 'IF EA_implementation_is_available', 'Documentation tests cannot demonstrate the not-yet-built model, solver, screen overlay or resource supervisor.', [['yes', 'drill'], ['no', 'planned']]],
      ['drill', 'Run bounded stateful drills', 'results = established_property_test_engine(oracles)', 'Use fixed reproducible seeds/failure traces without real private data. Assert invariants after each transition, not only the happy-path ending.', [['', 'record']]],
      ['planned', 'Record tests as planned', 'record_PLANNED_NOT_VERIFIED()', 'Keep unmeasured 4 GB/latency/privacy/model claims open. Do not convert a well-written criterion into a pass.', [['', 'record']]],
      ['record', 'Record actual evidence', 'attach_build_profile_fixture_and_result_metadata()', 'If no runtime exists, record only artifact-test evidence plus planned drills. Avoid private source payloads in records.', [['', 'review']]],
      ['review', 'Request semantic review', 'mark_linked_docs_for_human_sync_review()', 'Review exact revisions and meaning. Content hashes detect drift, not agreement; never automatically mark reviewed.', [['', 'finish']]],
      ['finish', 'Return the analysis state', 'RETURN OPEN_until_all_exit_gates_and_user_signoff', 'The next phase is design only after the approved analysis baseline. No feature is silently added after freeze.', []],
      ['blocked', 'Keep the discrepancy visible', 'RETURN ARTIFACT_MISMATCH_with_affected_IDs', 'Repair the linked specification and rerun checks. No autonomous EA loop regenerates documents or diagrams.', []]
    ]
  }
];
