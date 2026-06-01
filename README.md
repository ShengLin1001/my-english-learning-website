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
- Prisma
- SQLite
- Server-side AI API routes

The first version should work locally and remain usable even when AI credentials are not configured.

## AI Setup

AI calls are made from server actions through the OpenAI Responses API. Configure these values in `.env` or `.env.local`:

```text
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.2
```

If `OPENAI_API_KEY` is missing, the app keeps working and saves fallback learning content instead of calling the API.

## Current MVP Status

The current runnable version includes:

- Dashboard
- Learning progress analytics
- Vocabulary library
- Manual word creation
- CSV, JSON, and TXT word import
- Import preview with duplicate and invalid-row detection
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
- JSON export and SQLite database backup downloads

Learning data is stored in a local SQLite database at `data/dev.db`, which is ignored by Git.

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
"/c/Program Files/nodejs/npm.cmd" run dev -- --hostname 127.0.0.1 --port 3000
```

Open:

```text
http://localhost:3000
```

Do not use PowerShell syntax such as `$env:npm_config_cache=...` or `& 'C:\Program Files\nodejs\npm.cmd' ...` inside Git Bash.

## Database Setup

The project uses Prisma with SQLite. The local `.env` file should contain:

```text
DATABASE_URL="file:../data/dev.db"
```

Generate the Prisma client:

```powershell
$env:npm_config_cache='F:\BaiduSyncdisk\version20240608\main_code_space\my-english-learning-website\.npm-cache'
& 'C:\Program Files\nodejs\npm.cmd' run db:generate
```

Create or update the local SQLite schema:

```powershell
$env:npm_config_cache='F:\BaiduSyncdisk\version20240608\main_code_space\my-english-learning-website\.npm-cache'
& 'C:\Program Files\nodejs\npm.cmd' run db:push
```

If older JSON data exists in `data/app-data.json`, migrate it into SQLite:

```powershell
$env:npm_config_cache='F:\BaiduSyncdisk\version20240608\main_code_space\my-english-learning-website\.npm-cache'
& 'C:\Program Files\nodejs\npm.cmd' run db:migrate-json
```

## Data Export and Backup

Download a portable JSON export:

```text
http://localhost:3000/api/export
```

Download the local SQLite database:

```text
http://localhost:3000/api/backup/sqlite
```

Keep the development server bound to `127.0.0.1` when using backup endpoints so private learning data is not exposed to the local network.

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

The next recommended versions should focus on editing and managing learning records:

- Add user-visible AI error/status messages
- Add editable daily sentence and grammar exercise history management
- Add richer review analytics and progress charts
- Add deletion or archiving for writing, grammar, and listening records

## Repository Notes

Future Codex work should follow [AGENTS.md](./AGENTS.md), especially the file deletion safety rules, UTF-8 encoding requirement, Python environment notes, and commit-message workflow.
