#!/usr/bin/env bash
# Program: ea - apply-archi-upgrade.sh
# Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
# Last Modified: 2026-11-18
# Purpose: Applies the saved archi upgrade patch after safety checks, rebuilds archi, and runs its logic test in offscreen mode.
# Stop on any error, on unset variables, and on failures inside pipes.
set -euo pipefail
# Find the folder this script lives in so it works from any current directory.
board_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# Verify the archi files still match their recorded checksums before patching.
sha256sum --check "$board_dir/archi-before.sha256"
# If a list of files the patch creates exists, make sure none of them already exist.
if [[ -f "$board_dir/archi-new-files.txt" ]]; then
    while IFS= read -r file; do
        if [[ -n "$file" && -e "$file" ]]; then
            printf 'Refusing to replace newly created file: %s\n' "$file" >&2
            exit 1
        fi
    done < "$board_dir/archi-new-files.txt"
fi
# Apply the upgrade patch (apply_patch must be available on this machine).
apply_patch < "$board_dir/archi-upgrade.patch"
# Rebuild archi using two parallel jobs.
cmake --build /home/user/archi/build --parallel 2
# Run archi with no visible window and software rendering, starting at its LogicTest entry point.
QT_QPA_PLATFORM=offscreen QT_QUICK_BACKEND=software ARCHI_ENTRY=LogicTest \
    /home/user/archi/build/archi
