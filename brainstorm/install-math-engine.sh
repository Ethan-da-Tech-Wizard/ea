#!/usr/bin/env bash
# Program: ea - install-math-engine.sh
# Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
# Last Modified: 2026-11-18
# Purpose: Creates a Python virtual environment for archi and installs the sympy math library into it.
# Stop on any error, unset variable, or failed pipe.
set -euo pipefail
# Create an isolated Python environment for the math engine.
python3 -m venv /home/user/archi/.venv-math
# Install sympy 1.14 or newer (below 2) into that environment.
/home/user/archi/.venv-math/bin/python -m pip install --disable-pip-version-check 'sympy>=1.14,<2'
