# AGENTS.md

<!-- Template: copy to the repository root as AGENTS.md, replace every [placeholder], and delete sections that do not apply. Keep only facts an agent cannot infer from the code. -->

General coding standards come from each contributor's personal instructions; this file holds repository-specific facts only. Where the two conflict, this file wins.

## Project Overview

<One or two sentences: what the project does, for whom, and its current state.>

## Tech Stack

- Language and runtime: [e.g. TypeScript on Bun 1.x]
- Frameworks and key libraries: [...]
- Data stores: [database and how it is accessed]
- Hosting and CI: [...]

## Commands

| Task | Command |
| --- | --- |
| Install | `[bun install]` |
| Build | `[...]` |
| Test (all) | `[bun test]` |
| Test (one file) | `[bun test path/to/file.test.ts]` |
| Lint and format | `[...]` |
| Run locally | `[...]` |

Run build, lint and tests before reporting a change as done.

## Architecture

- `<dir>/`: [responsibility]
- `<dir>/`: [responsibility]
- Request or data flow: [e.g. route -> handler -> service -> repository]

## Conventions

- [Rules that extend or override personal instructions, with the file or example to copy, e.g. "Return errors as `AppError` from `src/errors.ts`"]
- Commits and PRs: [convention or link]

## Boundaries

- Never edit: [generated files, vendored code, applied migrations]
- Ask before: [schema changes, new dependencies, public API changes]
