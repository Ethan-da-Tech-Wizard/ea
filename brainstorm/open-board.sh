#!/usr/bin/env bash
# Program: ea - open-board.sh
# Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
# Last Modified: 2026-11-18
# Purpose: Rebuilds the board program if any of its sources are newer than the binary, then launches it on ArchiBoard.qml.

# Stop on any error, unset variable, or failed pipe.
set -euo pipefail

# Find the folder this script lives in.
board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# Rebuild if the binary is missing, or if any source or header (here or in archi) is newer than it.
if [[ ! -x "$board_dir/build/archi-board" || "$board_dir/board.cpp" -nt "$board_dir/build/archi-board" \
        || "$board_dir/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/MathEngine.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentSync.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/CMakeLists.txt" -nt "$board_dir/build/archi-board" ]]; then
    # Configure the build, then compile with two parallel jobs.
    cmake -S "$board_dir" -B "$board_dir/build"
    cmake --build "$board_dir/build" --parallel 2
fi
# Replace this shell with the board program, opening ArchiBoard.qml.
exec "$board_dir/build/archi-board" "$board_dir/ArchiBoard.qml"
