---
description: "Use when grouping commits into pull requests or writing PR titles and descriptions: grouping rules, title format, body template, ready status"
---

# Pull Request Instructions

Check for a repository PR template (`.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/`) first; if one exists, fill it in instead of the body format below.

## Grouping

- Group related commits into the smallest sensible set of focused, independently reviewable PRs, aligned with the batch order where practical. Work one PR at a time and stop after each.
- Each PR must build and pass tests on top of its base branch alone. State the merge order when one PR depends on another.
- Explain any dependency that forces changes from different batches into the same PR.
- Keep behaviour-changing commits in a separate PR from pure refactors where practical, so they can be reviewed, reverted, or deferred on their own.
- Split a PR whose diff a reviewer cannot read in one sitting, unless the bulk is mechanical (renames, moves); say so in the body.

## Title

- A single line, `type(context): summary`, under 72 characters, following [commit-message.instructions.md](commit-message.instructions.md).
- For a single-commit PR, reuse the commit subject.
- For several commits, choose the `type` of the dominant change, the directory common to all commits as `context`, and summarise the shared goal rather than listing the commits.

## Body

Concise, no filler, same punctuation rules as commit bodies. Omit a section only where noted.

```
## Summary
One or two sentences: what the PR achieves and why.

## Changes
- One bullet per commit or distinct concern, in commit order

## Behaviour changes
- Any change to behaviour, error propagation, or user-visible output, or "None"

## Testing
- Built and tested automatically: <commands run and result>
- Needs manual testing: <scenarios, including edge cases>

## Dependencies
- Merge after / depends on <PR or branch> (omit section if none)
```

## Status

- Mark a PR as ready only when all its commits are reviewed and approved and the build succeeds.
- When I revise commits before committing, re-check `git log` and update the PR text to match what was actually committed.
