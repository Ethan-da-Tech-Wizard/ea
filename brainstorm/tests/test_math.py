# ==============================================================================
# Program: test_math.py
# Programmer: Ethan-da-Tech-Wizard
# Last Modified: November 19, 2026
# Purpose: Automated integration test suite validating Archi's symbolic mathematics engine.
#          Executes IPC test runs against the isolated Python/SymPy daemon, verifying symbolic
#          simplification, polynomial expansion, factorization, differentiation, symbolic
#          integration, linear algebra matrix operations, and boolean satisfiability.
#          Enforces strict security boundaries rejecting Python AST code execution,
#          arbitrary I/O primitives, object introspection escapes, and memory-exhaustion payloads.
# ==============================================================================

import json
from pathlib import Path
import subprocess
import unittest

# Virtual environment interpreter and math engine IPC entry point paths
PYTHON = "/home/user/archi/.venv-math/bin/python"
ENGINE = Path("/home/user/archi/src/math_engine.py")


class MathTests(unittest.TestCase):
    """Test suite validating symbolic algebra correctness and execution sandboxing."""

    def setUp(self):
        """Skip test suite if running outside container environment where SymPy runtime is provisioned."""
        if not Path(PYTHON).exists() or not ENGINE.exists():
            raise unittest.SkipTest("Math engine environment not installed on this host")

    def calculate(self, expression, operation="Simplify", variable="x"):
        """Execute a math engine calculation via isolated subprocess IPC over stdin/stdout.

        Args:
            expression: Mathematical expression string to evaluate.
            operation: Algebraic operation name ('Simplify', 'Expand', 'Solve = 0', etc.).
            variable: Target variable for calculus or equation solving.

        Returns:
            Parsed JSON dictionary containing execution status and result string.
        """
        # Execute python subprocess with isolated mode (-I) to prevent user site-packages injection
        output = subprocess.run(
            [PYTHON, "-I", str(ENGINE)],
            input=json.dumps(dict(expression=expression, operation=operation, variable=variable)),
            text=True,
            capture_output=True,
            timeout=8,
            check=True,
        )
        return json.loads(output.stdout)

    def test_operations(self):
        """Verify symbolic mathematics calculation results across diverse algebraic domains."""
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
        """Security sandbox verification: assert that code injection and unbounded memory attacks are rejected."""
        expressions = [
            # Code injection & filesystem access attempts
            "__import__('os').getcwd()", 
            "open('/tmp/nope', 'w')", 
            "x.__class__",
            # Python language comprehension and lambda primitives
            "[x for x in range(100)]", 
            "(lambda: 1)()", 
            "x[0]", 
            # Denial of service via giant integer exponentiation
            "2**1000000",
            # Arbitrary strings and float overflows
            "'hello'", 
            "1e999", 
            "[1,2,3,4,5,6,7,8,9]", 
            # Buffer length boundary limit (expressions > 1024 characters must be rejected)
            "x" * 1025,
        ]
        for expression in expressions:
            with self.subTest(expression=expression):
                self.assertFalse(self.calculate(expression)["ok"])

    def test_boolean_solver_does_not_claim_arithmetic_proofs(self):
        """Boundary invariant test: boolean solver must reject arithmetic inequality relations."""
        self.assertFalse(self.calculate("(x > 1) & (x < 0)", "Satisfiable")["ok"])


if __name__ == "__main__":
    unittest.main()
