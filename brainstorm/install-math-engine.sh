#!/usr/bin/env bash

# ==============================================================================
# Program: install-math-engine.sh
# Programmer: Ethan-da-Tech-Wizard
# Last Modified: November 19, 2026
# Purpose: Environment provisioning script establishing an isolated Python runtime
#          and pinning symbolic computer algebra dependencies (SymPy) for Archi's MathEngine.
#          Creates an isolated virtual environment to prevent system package collisions,
#          validates semver compatibility bounds (SymPy >= 1.14, < 2), and ensures
#          deterministic headless evaluation of algebraic calculations.
# ==============================================================================

# Halt on error (-e), treat uninitialized variables as fatal errors (-u),
# and prevent pipe masking of intermediate non-zero return codes (-o pipefail).
set -euo pipefail

# ------------------------------------------------------------------------------
# Phase 1: Isolated Python Virtual Environment Provisioning
# ------------------------------------------------------------------------------
# Create clean virtual environment isolating mathematical dependencies
python3 -m venv /home/user/archi/.venv-math

# ------------------------------------------------------------------------------
# Phase 2: Pinned Symbolic Math Package Installation
# ------------------------------------------------------------------------------
# Install SymPy adhering strictly to semantic version range >= 1.14 and < 2.0.0
# to ensure compatibility with C++ MathEngine IPC protocol and expression serialization.
/home/user/archi/.venv-math/bin/python -m pip install --disable-pip-version-check 'sympy>=1.14,<2'
