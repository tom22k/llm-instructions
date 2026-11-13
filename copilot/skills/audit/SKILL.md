---
name: audit
description: "Use only when the user explicitly asks to audit, review, or clean up code (e.g. 'review this folder', 'code review', 'audit src/'). Batched audit workflow with checklist, numbered findings format, confirmed vs suspected bugs and approval before any change. Do not load for ordinary coding or bug-fix requests."
argument-hint: "<folder or file group> [, <next batch> ...]"
---

# Audit

Audit the folders or file groups the user gives, in the order given. If none are given, ask which to audit.

## Steps

1. Run `git branch --show-current` and `git status`, and read the repository's README and instruction files.
2. Treat each folder (or file group) as one batch and audit only the first one now.
3. Report findings in the format below, followed by "Out of scope" and numbered questions.
4. Stop. Change nothing until I approve findings by number.

## Scope and Batches

- Audit, fix, and report one batch at a time; do not start the next until I approve the current one.
- Re-read the repository's instruction files and re-check `git status`/`git diff` before each batch, since I may have revised your changes or the conventions.
- Stay within the batch. Record anything found outside it under "Out of scope" without fixing it.

## What to Look For

Check each file for, in order of priority:

1. Bugs and errors: crashes, unhandled or swallowed exceptions, null dereferences, resource leaks, off-by-one and boundary errors, races.
2. Security: untrusted input, injection, secrets or personal data in logs.
3. Inconsistencies: the same thing done differently across files (naming, error handling, logging, validation).
4. Duplicated logic, including near-duplicates across files.
5. Performance: repeated passes over the same collection, repeated I/O or interop calls inside loops, work that could be hoisted.
6. Disorganisation and bloat: misplaced members, oversized methods, dead or unreachable code, unused members, imports, and parameters.
7. Comments and docs that restate names, narrate decisions or history, or contradict the code.

## Findings

- Inspect the code first, then present findings before changing anything; implement only what I approve.
- Number findings continuously across batches. Never renumber; withdrawn findings keep their number, marked as withdrawn with the reason.
- Group trivial mechanical findings (ordering, naming, comment clean-up) into one finding per file rather than one per line.
- Format each finding as:

  ```
  N. [Severity] [Confirmed | Suspected] Short title
     Where: <file link with line range>
     Evidence: <what the code does, and the input or state that triggers it>
     Fix: <proposed change>
     Trade-offs: <cost, risk, alternatives>
     Behaviour change: <None | what changes in behaviour, error propagation, or user-visible output>
  ```

- Severity: **High** (crash, data loss, security), **Medium** (wrong result in a reachable case), **Low** (maintainability, readability, performance without user impact).
- Confirmed means provable from the code alone. Otherwise mark it Suspected and ask me to test it rather than fixing speculatively. When I report it does not reproduce, withdraw it with the reason or explain the exact conditions under which it occurs.
- Any finding with a behaviour change needs my explicit decision; never fold it into a refactor.
- Raise proposed file splits, moves, or new abstractions as findings with justification; do not perform them unasked.
- End the findings list with "Out of scope" and numbered questions on ambiguous calls.

## Implementing Approved Findings

- Double-check each approved finding against the current code before fixing it, since I may have changed it in between.
- Fix only what was approved, at its root cause; do not opportunistically fix neighbouring code. Raise new findings discovered while fixing as new numbered findings instead.
- Build and run the tests after the batch, and confirm success before proposing commits.
- Map every finding to exactly one commit, or state why it was deferred or withdrawn.
- Report with commits per the `propose-commits` skill and PR grouping per the `propose-pull-requests` skill, then stop for review.
