# llm-instructions

Personal collection of instruction files for LLMs, chiefly GitHub Copilot Chat.

## Contents

| File | Target | Description | Applies |
| --- | --- | --- | --- |
| [vscode/general.instructions.md](vscode/general.instructions.md) | Copilot Chat in VS Code | Core style and engineering rules | Every request |
| [vscode/typescript.instructions.md](vscode/typescript.instructions.md) | Copilot Chat in VS Code | TypeScript and Bun conventions | `*.ts`, `*.tsx` files |
| [vscode/python.instructions.md](vscode/python.instructions.md) | Copilot Chat in VS Code | Python conventions | `*.py` files |
| [vscode/skills/audit/SKILL.md](vscode/skills/audit/SKILL.md) | Copilot in VS Code, CLI | Batched audit and findings workflow | `/audit`, or asking for a review or audit |
| [vscode/skills/propose-commits/SKILL.md](vscode/skills/propose-commits/SKILL.md) | Copilot in VS Code, CLI | Commit split and message format | `/propose-commits`, or asking for commits |
| [vscode/skills/propose-pull-requests/SKILL.md](vscode/skills/propose-pull-requests/SKILL.md) | Copilot in VS Code, CLI | PR grouping, title and body | `/propose-pull-requests`, or asking for PRs |
| [templates/AGENTS.md](templates/AGENTS.md) | Any agent reading `AGENTS.md` | Per-repository skeleton | Copied into a repository |
| [browser/general.instructions.md](browser/general.instructions.md) | Any LLM | General behaviour | Non-coding chats |
| [browser/coding.instructions.md](browser/coding.instructions.md) | Copilot Chat on github.com | Condensed VS Code general rules | Coding chats |

Instruction files apply to every request or to matching files; skills hold task workflows and load on demand.

## Usage

### VS Code

Either copy the files in `vscode/` to the user prompts folder (`%APPDATA%\Code\User\prompts` on Windows), or point VS Code at this repository so edits apply without copying:

```jsonc
// settings.json
"chat.instructionsFilesLocations": {
 "C:/path/to/agent-instructions/vscode": true
}
```

### GitHub Copilot Chat in the browser

`browser/coding.instructions.md` has no front matter and is not loaded by VS Code. Paste its contents into the personal instructions of Copilot Chat on github.com. It is a condensed restatement of `vscode/general.instructions.md`, so update both when changing a rule.

### Skills

The folders in `vscode/skills/` are self-contained skills. Copy each folder to `~/.copilot/skills/`, keeping the folder name equal to the skill's `name`. Each runs as a slash command (`/audit`, `/propose-commits`, `/propose-pull-requests`), and the agent also loads it when a request matches its `description`. `general.instructions.md` refers to them by name.

### Repository template

Copy `templates/AGENTS.md` to the root of a repository and fill in the placeholders. Copilot, Codex and other agents read `AGENTS.md`, so no separate `.github/copilot-instructions.md` is needed.

## Size Limits

- `browser/coding.instructions.md`: at most 4,000 characters, the limit for personal instructions on github.com.
- Every other Markdown file: at most 150 lines.

Check both with [Bun](https://bun.sh):

```sh
bun scripts/check-sizes.ts
bun test
```
