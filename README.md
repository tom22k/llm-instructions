# llm-instructions

Personal collection of instruction files for LLMs, chiefly GitHub Copilot Chat.

## Contents

| File | Target | Applies |
| --- | --- | --- |
| [vscode/general.instructions.md](vscode/general.instructions.md) | Copilot Chat in VS Code | Always (`applyTo: "**"`): communication style, engineering principles, Git conventions, workflow |
| [vscode/commit-message.instructions.md](vscode/commit-message.instructions.md) | Copilot Chat in VS Code | On demand: commit subject/body format, type selection, commit ordering |
| [vscode/pull-request.instructions.md](vscode/pull-request.instructions.md) | Copilot Chat in VS Code | On demand: grouping commits into PRs, title and body format |
| [vscode/review.instructions.md](vscode/review.instructions.md) | Copilot Chat in VS Code | On demand: batched audits, findings format, approval workflow |
| [browser/general.instructions.md](browser/general.instructions.md) | Any LLM | General instructions for non-coding related tasks |
| [browser/coding.instructions.md](browser/coding.instructions.md) | Copilot Chat on github.com | Condensed version of the VS Code general instructions |

The on-demand files are selected by VS Code from their `description` front matter; `general.instructions.md` links to them by relative path, so keep them in the same folder.

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

`general-browser-chat.instructions.md` has no front matter and is not loaded by VS Code. Paste its contents into the personal instructions of Copilot Chat on github.com. It is a condensed restatement of `general.instructions.md`, so update both when changing a rule.
