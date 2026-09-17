import json
from pathlib import Path
import subprocess
import unittest

PYTHON = "/home/ethan/archi/.venv-math/bin/python"
ENGINE = Path("/home/ethan/archi/src/math_engine.py")


class MathTests(unittest.TestCase):
    def calculate(self, expression, operation="Simplify", variable="x"):
        output = subprocess.run(
            [PYTHON, "-I", str(ENGINE)],
            input=json.dumps(dict(expression=expression, operation=operation, variable=variable)),
            text=True, capture_output=True, timeout=8, check=True,
        )
        return json.loads(output.stdout)

    def test_operations(self):
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
        for expression, operation, expected in cases:
            with self.subTest(operation=operation, expression=expression):
                data = self.calculate(expression, operation)
                self.assertTrue(data["ok"], data)
                self.assertEqual(data["result"], expected)

    def test_rejects_code_and_unbounded_inputs(self):
        expressions = [
            "__import__('os').getcwd()", "open('/tmp/nope', 'w')", "x.__class__",
            "[x for x in range(100)]", "(lambda: 1)()", "x[0]", "2**1000000",
            "'hello'", "1e999", "[1,2,3,4,5,6,7,8,9]", "x" * 1025,
        ]
        for expression in expressions:
            with self.subTest(expression=expression):
                self.assertFalse(self.calculate(expression)["ok"])

    def test_boolean_solver_does_not_claim_arithmetic_proofs(self):
        self.assertFalse(self.calculate("(x > 1) & (x < 0)", "Satisfiable")["ok"])


if __name__ == "__main__":
    unittest.main()
