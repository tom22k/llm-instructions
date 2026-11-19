---
description: "TypeScript and Bun conventions: runtime APIs, formatting, compiler strictness, typing idioms"
globs: "**/*.{ts,tsx}"
---

# TypeScript Instructions

Language-neutral rules live in the personal `{{mainFile}}`; this file adds only what is specific to TypeScript and Bun.

## Runtime

- Where the project runs on Bun, use its built-in APIs before adding a package: `Bun.serve` with `routes`, `Bun.file`/`Bun.write`, `Bun.spawn`, `Bun.password`, Bun `SQL`/`bun:sqlite`, and `bun test`.
- Use `bun install`, `bun run` and `bunx`; do not mix in `npm`, `yarn` or `pnpm` commands or lockfiles.
- ES modules only; use `import type` for type-only imports.
- Read environment variables once at startup into a typed, validated config object; never read `process.env`/`Bun.env` deep inside logic.

## Formatting

- Indent with tabs in new projects; otherwise follow the existing formatter configuration.
- Do not hand-format against the project's formatter or linter; run it instead.

## Compiler

- New projects enable `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters` and `noPropertyAccessFromIndexSignature` in `tsconfig.json`. Never loosen an existing project's settings to make code compile.
- Fix type errors at their source; `@ts-expect-error` (never `@ts-ignore`) only with the one-line justification the general rules require.

## Typing

- Type untrusted input as `unknown` and narrow it with type guards or a schema at the boundary.
- Use `satisfies` to check object literals against a type without widening; prefer it over annotations that lose literal types.
- Model variants as discriminated unions with a literal `kind`/`type` field; prefer `as const` objects or string-literal unions over `enum`.
- Prefer `readonly` properties and `ReadonlyArray`/`readonly T[]` for data that should not change.
- Annotate return types of exported functions; let local inference work elsewhere.

## Async

- Every promise is awaited, returned, or explicitly handed to an error handler; never leave one floating.
- Pass `AbortSignal.timeout(ms)` (or a caller's signal) to `fetch` and other cancellable calls.
- Run independent awaits concurrently with `Promise.all`; use `Promise.allSettled` when partial failure is acceptable.
