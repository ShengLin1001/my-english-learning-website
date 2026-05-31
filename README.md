# My English Learning Website

A personal AI-assisted English learning website for vocabulary growth, sentence learning, grammar training, academic writing improvement, and listening practice.

The goal is to build a practical learning system that helps the user understand English through context, feedback, and repeated use instead of rote memorization.

## Planned Features

- Import a dictionary or word list as the main learning content
- Add unfamiliar words encountered during daily study
- Review words with a spaced repetition workflow
- Study one classic English sentence each day
- Train grammar with immediate tests and feedback
- Generate AI-assisted word explanations, example sentences, collocations, and academic usage notes
- Improve scientific paper writing through academic English polishing and reusable sentence patterns
- Improve listening through generated or browser-read audio with active feedback

## Product Direction

This project should become a personal English learning system with these core ideas:

- Learn words in context, not as isolated translations
- Use examples and collocations to build language sense
- Review based on familiarity and mistakes
- Turn daily reading and research writing into learning material
- Use AI as a tutor, not as a replacement for active practice

## Recommended Stack

The repository is currently planned around:

- Next.js
- TypeScript
- Local JSON storage for the first runnable MVP
- Prisma and SQLite as the next persistence upgrade
- Server-side AI API routes

The first version should work locally and remain usable even when AI credentials are not configured.

## Current MVP Status

The current runnable version includes:

- Dashboard
- Vocabulary library
- Manual word creation
- CSV, JSON, and TXT word import
- Word detail page
- Word editing
- Single-word deletion with related review cleanup
- Vocabulary search
- Status and tag filters
- Word tags
- Import duplicate and invalid-row summary
- Placeholder AI word enrichment saved to local data
- Spaced repetition review flow
- Daily sentence page
- Grammar exercise page
- Academic writing practice page
- Listening practice with browser speech synthesis
- Settings page

Learning data is currently stored in `data/app-data.json`, which is generated automatically at runtime and ignored by Git.

## Local Development

This project is usually opened from either PowerShell or Git Bash on Windows. Use the command style that matches the terminal you are currently using.

### PowerShell

Install dependencies:

```powershell
$env:npm_config_cache='F:\BaiduSyncdisk\version20240608\main_code_space\my-english-learning-website\.npm-cache'
& 'C:\Program Files\nodejs\npm.cmd' install
```

Start the development server:

```powershell
$env:npm_config_cache='F:\BaiduSyncdisk\version20240608\main_code_space\my-english-learning-website\.npm-cache'
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

Open:

```text
http://localhost:3000
```

### Git Bash / MINGW64

Install dependencies:

```bash
export npm_config_cache="/f/BaiduSyncdisk/version20240608/main_code_space/my-english-learning-website/.npm-cache"
"/c/Program Files/nodejs/npm.cmd" install
```

Start the development server:

```bash
export npm_config_cache="/f/BaiduSyncdisk/version20240608/main_code_space/my-english-learning-website/.npm-cache"
"/c/Program Files/nodejs/npm.cmd" run dev -- --hostname 0.0.0.0 --port 3000
```

Open:

```text
http://localhost:3000
```

Do not use PowerShell syntax such as `$env:npm_config_cache=...` or `& 'C:\Program Files\nodejs\npm.cmd' ...` inside Git Bash.

## Development Plan

See [DEVELOPMENTS.md](./DEVELOPMENTS.md) for the detailed implementation roadmap, proposed data models, routes, MVP scope, and engineering risks.

## Initial MVP

The first version includes:

- Project foundation
- Vocabulary library
- Manual word creation
- Dictionary import
- Word detail page
- Simple spaced repetition review
- Daily sentence page
- Placeholder AI word enrichment
- Academic writing coach

Grammar training and listening practice can be added after the vocabulary and review foundation is stable.

## Near-Term Roadmap

The next recommended version is the data-layer upgrade:

- Replace local JSON storage with Prisma and SQLite
- Add database migrations
- Preserve the current route structure and learning workflows
- Add safer data backup and export
- Prepare the project for deployment

## Repository Notes

Future Codex work should follow [AGENTS.md](./AGENTS.md), especially the file deletion safety rules, UTF-8 encoding requirement, Python environment notes, and commit-message workflow.
