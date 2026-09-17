#!/usr/bin/env bash
set -euo pipefail

board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if [[ ! -x "$board_dir/build/archi-board" || "$board_dir/board.cpp" -nt "$board_dir/build/archi-board" \
        || "$board_dir/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentFiles.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/MathEngine.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/../../archi/src/DocumentSync.h" -nt "$board_dir/build/archi-board" \
        || "$board_dir/CMakeLists.txt" -nt "$board_dir/build/archi-board" ]]; then
    cmake -S "$board_dir" -B "$board_dir/build"
    cmake --build "$board_dir/build" --parallel 2
fi
exec "$board_dir/build/archi-board" "$board_dir/ArchiBoard.qml"
