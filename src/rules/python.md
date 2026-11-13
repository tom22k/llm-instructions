---
description: "Python conventions: type hints, pytest, standard-library idioms, logging"
applyTo: "**/*.py"
---

# Python Instructions

Language-neutral rules live in the personal `copilot-instructions.md`; this file adds only what is specific to Python.

## Typing

- Type-hint every function signature and every module-level public value; use modern syntax (`list[str]`, `X | None`) for the project's minimum Python version.
- Run the project's type checker (pyright or mypy) and fix errors at their source.
- Use `typing.Protocol` for structural interfaces and `dataclass(frozen=True, slots=True)` for immutable value types.

## Standard Library

- Prefer standard-library enums and types over hand-rolled constants: `http.HTTPStatus`, `enum.StrEnum`, `pathlib.Path`, `datetime` with `timezone.utc`, `decimal.Decimal`.
- Use `pathlib` over `os.path`, and pass `encoding="utf-8"` to every text-mode `open`/`read_text`/`write_text`.
- Call `subprocess.run` with an argument list, `check=True` and a `timeout`.

## Logging and Errors

- One `logger = logging.getLogger(__name__)` per module; pass values as arguments (`logger.info("loaded %s", path)`), not f-strings.
- Catch specific exception types; never a bare `except:`.

## Testing

- Use `pytest` with plain `assert`, fixtures, `pytest.mark.parametrize`, `tmp_path` and `monkeypatch`; do not add `unittest.TestCase` classes to a pytest suite.
- Reuse fixtures from the nearest `conftest.py` before writing new ones.

## Formatting and Tooling

- Follow PEP 8 naming; use Black formatting.
- Use the project's environment and dependency manager (uv, Poetry, pip-tools) as configured; do not mix them or install into the global interpreter.
