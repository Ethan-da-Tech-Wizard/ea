#!/usr/bin/env bash
set -euo pipefail
python3 -m venv /home/user/archi/.venv-math
/home/user/archi/.venv-math/bin/python -m pip install --disable-pip-version-check 'sympy>=1.14,<2'
