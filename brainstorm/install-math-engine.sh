#!/usr/bin/env bash

# ==============================================================================
# Program: install-math-engine.sh
# Programmer: Ethan-da-Tech-Wizard
# Last Modified: November 18, 2026
# Purpose: Shell provisioning script setting up isolated Python virtual environment and SymPy dependencies for the math engine.
# ==============================================================================
set -euo pipefail
python3 -m venv /home/user/archi/.venv-math
/home/user/archi/.venv-math/bin/python -m pip install --disable-pip-version-check 'sympy>=1.14,<2'
