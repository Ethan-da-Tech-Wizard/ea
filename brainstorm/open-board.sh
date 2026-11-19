#!/usr/bin/env bash

# ==============================================================================
# Program: open-board.sh
# Programmer: Ethan-da-Tech-Wizard
# Last Modified: November 19, 2026
# Purpose: Incremental build runner and launcher script for the Archi interactive diagram board.
#          Inspects dependency timestamp freshness between C++/CMake sources and compiled artifacts,
#          triggers parallel incremental compilation via CMake when stale, and replaces the shell
#          process via exec with the GUI binary passing the target declarative QML layout.
# ==============================================================================

# Halt on error (-e), treat uninitialized variables as fatal errors (-u),
# and prevent pipe masking of intermediate non-zero return codes (-o pipefail).
set -euo pipefail

# Resolve canonical script directory
board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# ------------------------------------------------------------------------------
# Phase 1: Timestamp-Based Incremental Build Verification
# ------------------------------------------------------------------------------
# Recompile executable if binary is missing or if any C++ headers/sources/CMakeLists
# are newer than the compiled target artifact.
if [[ ! -x "$board_dir/build/archi-board" || "$board_dir/board.cpp" -nt "$board_dir/build/archi-board" \
        || "$board_dir/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/MathEngine.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentSync.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/CMakeLists.txt" -nt "$board_dir/build/archi-board" ]]; then
    # Generate build tree and run parallel compilation across 2 jobs
    cmake -S "$board_dir" -B "$board_dir/build"
    cmake --build "$board_dir/build" --parallel 2
fi

# ------------------------------------------------------------------------------
# Phase 2: Process Replacement Execution
# ------------------------------------------------------------------------------
# Execute the native interactive board GUI, replacing the bash process image
exec "$board_dir/build/archi-board" "$board_dir/ArchiBoard.qml"
