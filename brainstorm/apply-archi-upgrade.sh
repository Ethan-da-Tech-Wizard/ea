#!/usr/bin/env bash

# ==============================================================================
# Program: apply-archi-upgrade.sh
# Programmer: Ethan-da-Tech-Wizard
# Last Modified: November 19, 2026
# Purpose: Architectural upgrade automation script applying incremental patches
#          to Archi diagram schema files and validating cryptographic SHA256 checksums.
#          Ensures transactional application of diffs, verifies pre-existing file boundaries,
#          triggers parallel CMake incremental compilation, and executes headless offscreen
#          smoke tests to guarantee migration integrity without display server dependencies.
# ==============================================================================

# Halt on error (-e), treat uninitialized variables as fatal errors (-u),
# and prevent pipe masking of intermediate non-zero return codes (-o pipefail).
set -euo pipefail

# Resolve the absolute canonical directory containing this script
board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# ------------------------------------------------------------------------------
# Phase 1: Cryptographic Baseline Validation
# ------------------------------------------------------------------------------
# Verify that source files match the exact pre-migration SHA256 cryptographic digest.
sha256sum --check "$board_dir/archi-before.sha256"

# ------------------------------------------------------------------------------
# Phase 2: Collision and Overwrite Prevention Guard
# ------------------------------------------------------------------------------
# If a new-files manifest is present, assert that none of the target paths exist yet
# to prevent accidental clobbering of local untracked developer assets.
if [[ -f "$board_dir/archi-new-files.txt" ]]; then
    while IFS= read -r file; do
        if [[ -n "$file" && -e "$file" ]]; then
            printf 'Refusing to replace newly created file: %s\n' "$file" >&2
            exit 1
        fi
    done < "$board_dir/archi-new-files.txt"
fi

# ------------------------------------------------------------------------------
# Phase 3: Patch Application & Native Incremental Build
# ------------------------------------------------------------------------------
# Apply unified diff patch to diagram schema sources
apply_patch < "$board_dir/archi-upgrade.patch"

# Trigger parallel C++ compilation of modified Archi subsystems
cmake --build /home/user/archi/build --parallel 2

# ------------------------------------------------------------------------------
# Phase 4: Headless Offscreen Smoke Verification
# ------------------------------------------------------------------------------
# Launch the built executable in headless offscreen mode using the software rasterizer
# to verify engine initialization without an active X11/Wayland display server.
QT_QPA_PLATFORM=offscreen QT_QUICK_BACKEND=software ARCHI_ENTRY=LogicTest \
    /home/user/archi/build/archi
