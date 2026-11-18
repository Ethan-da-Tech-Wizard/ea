# Program: ea - test_math.py
# Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
# Last Modified: 2026-11-18
# Purpose: Unit tests that run the archi math engine script and check its results and its refusal of unsafe input.

# === Imports ===
import json
from pathlib import Path
import subprocess
import unittest

# Paths to the math engine's Python and script (these point at a specific machine layout).
PYTHON = "/home/user/archi/.venv-math/bin/python"
ENGINE = Path("/home/user/archi/src/math_engine.py")


class MathTests(unittest.TestCase):
    """Tests for the math engine script, run as a separate process."""
    def calculate(self, expression, operation="Simplify", variable="x"):
        """Run the engine with the given inputs and return its JSON reply as a dict."""
        # Start the engine in isolated mode (-I), send the request as JSON on stdin, and capture its output.
        output = subprocess.run(
            [PYTHON, "-I", str(ENGINE)],
            input=json.dumps(dict(expression=expression, operation=operation, variable=variable)),
            text=True, capture_output=True, timeout=8, check=True,
        )
        # Decode the engine's JSON answer.
        return json.loads(output.stdout)

    def test_operations(self):
        """Each case is (expression, operation, expected text); the engine must succeed and match it."""
        # Table of inputs and their expected results.
        cases = [
            ("sin(x)**2 + cos(x)**2", "Simplify", "1"),
            ("(x + 1)**3", "Expand", "x**3 + 3*x**2 + 3*x + 1"),
            ("x**2 - 1", "Factor", "(x - 1)*(x + 1)"),
            ("sin(x)*x", "Differentiate", "x*cos(x) + sin(x)"),
            ("2*x", "Integrate", "x**2 + C"),
            ("x**2 - 4", "Solve = 0", "[-2, 2]"),
            ("[[1,2],[3,4]]", "Determinant", "-2"),
            ("[[1,0],[0,2]]", "Inverse", "Matrix([[1, 0], [0, 1/2]])"),
            ("[[1,0],[0,2]]", "Eigenvalues", "{1: 1, 2: 1}"),
            ("a & ~a", "Satisfiable", "False"),
            ("(a & b) | (a & ~b)", "Boolean simplify", "a"),
            ("(2 + 3*I)*(2 - 3*I)", "Expand", "13"),
            ("Rational(1,3) + Rational(1,6)", "Simplify", "1/2"),
        ]
        # Run every case as its own subtest so one failure does not hide the rest.
        for expression, operation, expected in cases:
            with self.subTest(operation=operation, expression=expression):
                data = self.calculate(expression, operation)
                self.assertTrue(data["ok"], data)
                self.assertEqual(data["result"], expected)

    def test_rejects_code_and_unbounded_inputs(self):
        """Code-like, text, oversized, or very large inputs must be rejected (ok is false)."""
        expressions = [
            "__import__('os').getcwd()", "open('/tmp/nope', 'w')", "x.__class__",
            "[x for x in range(100)]", "(lambda: 1)()", "x[0]", "2**1000000",
            "'hello'", "1e999", "[1,2,3,4,5,6,7,8,9]", "x" * 1025,
        ]
        for expression in expressions:
            with self.subTest(expression=expression):
                self.assertFalse(self.calculate(expression)["ok"])

    def test_boolean_solver_does_not_claim_arithmetic_proofs(self):
        """Satisfiability of an arithmetic comparison must not be claimed as proven."""
        self.assertFalse(self.calculate("(x > 1) & (x < 0)", "Satisfiable")["ok"])


# Run the tests when this file is executed directly.
if __name__ == "__main__":
    unittest.main()
