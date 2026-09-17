#!/usr/bin/env bash
set -euo pipefail
board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
sha256sum --check "$board_dir/archi-before.sha256"
if [[ -f "$board_dir/archi-new-files.txt" ]]; then
    while IFS= read -r file; do
        if [[ -n "$file" && -e "$file" ]]; then
            printf 'Refusing to replace newly created file: %s\n' "$file" >&2
            exit 1
        fi
    done < "$board_dir/archi-new-files.txt"
fi
apply_patch < "$board_dir/archi-upgrade.patch"
cmake --build /home/ethan/archi/build --parallel 2
QT_QPA_PLATFORM=offscreen QT_QUICK_BACKEND=software ARCHI_ENTRY=LogicTest \
    /home/ethan/archi/build/archi
