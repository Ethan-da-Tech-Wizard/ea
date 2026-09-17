#!/usr/bin/env bash
set -euo pipefail
python3 -m venv /home/ethan/archi/.venv-math
/home/ethan/archi/.venv-math/bin/python -m pip install --disable-pip-version-check 'sympy>=1.14,<2'
