# Codex Project Instructions

## Project Identity

This repository is for a personal AI-assisted English learning website. The site should prioritize effective learning, vocabulary growth, grammar feedback, academic writing improvement, and listening practice.

The first product target is a usable personal study tool, not a broad public education platform.

## Current Implementation Direction

Preferred stack unless changed by the user:

- Next.js
- TypeScript
- Local JSON storage for the first runnable MVP
- Prisma and SQLite as the next persistence upgrade
- Server-side AI API routes

Keep the application usable without configured AI credentials. AI features should degrade gracefully.

The current first version stores data in `data/app-data.json`. This file is generated at runtime and ignored by Git.

## Documentation Map

- `README.md`: project overview and user-facing introduction
- `DEVELOPMENTS.md`: implementation plan, phases, data models, and roadmap
- `AGENTS.md`: instructions for future Codex work in this repository

## File Deletion Safety

Do not bulk delete files or directories.

Do not use:

- `del /s`
- `rd /s`
- `rmdir /s`
- `Remove-Item -Recurse`
- `rm -rf`

When deleting is necessary, delete only one explicit file path at a time.

Correct PowerShell example:

```powershell
Remove-Item "C:\path\to\file.txt"
```

If many files need deletion, stop and ask the user to handle or approve a safer explicit plan.

## Platform Notes

The user has noted that some future work may happen in a CentOS HPC environment. When a necessary command is missing or has an unsuitable version in that environment, first check whether a suitable version is available through:

```bash
module avail
```

The current repository path may be used from Windows/PowerShell as well. Prefer commands that work cleanly in the active environment.

## Python Environment

For Codex-related Python operations, default to the user's isolated environment:

- Python: `/c/Users/louis/mysoft/env/pyenv/codex/Scripts/python`
- pip: `/c/Users/louis/mysoft/env/pyenv/codex/Scripts/pip`

Do not install Codex-related Python packages into unrelated virtual environments.

## Git Commit Instructions

When generating or choosing a Git commit message, use the `$p-git-commit` skill by default.

Do not create commits unless the user explicitly asks for a commit.

Before committing, inspect:

```powershell
git status --short
git diff --cached --stat
```

## File Encoding

Use UTF-8 for reading and writing project files.

## AI Integration Rules

- Do not call AI APIs directly from frontend client components.
- Use server-side routes or server actions for AI calls.
- Cache AI-generated word explanations, examples, collocations, grammar feedback, and writing suggestions.
- Add explicit user actions for expensive AI calls.
- Validate structured AI output before saving it.
- Keep fallback UI for missing API keys or failed AI responses.

## Learning Product Rules

- Prefer spaced repetition and feedback-driven learning over rote memorization.
- Word learning should be context-rich: meanings, examples, collocations, academic usage, and common mistakes.
- Grammar training should provide immediate explanations, not only correct answers.
- Writing support should help with scientific paper style and should explain why edits improve clarity or precision.
- Listening training should focus on learning and feedback, not exam-style listening questions.

## Implementation Discipline

- Keep changes scoped to the requested feature.
- Follow existing project patterns once the project has code.
- Keep environment variables documented in `.env.example`.
- Avoid hidden network assumptions in tests.
- Prefer small composable modules over large mixed-purpose files.
- Do not overwrite user changes.
