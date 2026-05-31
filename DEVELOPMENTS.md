# Development Plan

## Project Goal

Build a personal English learning website focused on effective learning rather than rote memorization. The system should help the user import and grow a vocabulary library, review words with spaced repetition, study high-quality English sentences, train grammar through immediate feedback, improve academic writing, and improve listening through generated audio and learning-oriented feedback.

The product should be useful as a personal learning tool first, then gradually expand into a more complete AI-assisted English learning system.

## Recommended Technical Stack

- Framework: Next.js with TypeScript
- UI: Tailwind CSS and shadcn/ui
- Database: SQLite for the first local version
- ORM: Prisma
- AI integration: server-side API routes, with generated results cached in the database
- Audio: browser `speechSynthesis` for the first version, high-quality TTS service later
- Deployment target: Vercel or another Node-compatible hosting platform

This stack is chosen because the repository is currently empty, and the application needs a clean full-stack foundation that can support database operations, AI calls, and later deployment.

## Core Product Modules

### 1. Learning Dashboard

Purpose: give the user a clear daily entry point.

Expected features:

- Today's review count
- New words to learn
- Daily English sentence
- Recent grammar or writing practice
- Progress overview
- Shortcuts to vocabulary, review, writing, listening, and grammar training

### 2. Vocabulary Library

Purpose: serve as the main learning content source.

Expected features:

- Import vocabulary from CSV, JSON, and TXT
- Add new words manually
- Search words
- Filter by learning status
- Edit word details
- View word learning history

Suggested initial import formats:

```csv
word,meaning,example
analyze,分析,We analyze the experimental results.
```

```json
[
  {
    "word": "analyze",
    "meaning": "分析",
    "example": "We analyze the experimental results."
  }
]
```

TXT format should initially support one word per line.

### 3. Word Detail and AI Enrichment

Purpose: help the user understand each word through meaning, context, collocations, and academic usage.

Expected features:

- Chinese meaning
- English definition
- Pronunciation field
- Example sentences
- Fixed collocations
- Academic writing usage
- Synonym comparison
- Common mistakes
- AI-generated learning notes

Important implementation rule:

AI-generated content must be saved to the database and reused. Do not regenerate content every time a page is opened.

### 4. Spaced Repetition Review

Purpose: replace rote memorization with feedback-based learning.

Initial review states:

- New
- Unfamiliar
- Vague
- Familiar
- Mastered

Suggested first scheduling logic:

- Wrong or unfamiliar: review again soon
- Vague: review in 1 day
- Familiar: review in 3 days
- Mastered: review in 7 days or later

This can start as a simple rule-based system and later evolve into a more advanced spaced repetition algorithm.

### 5. Daily Classic English Sentence

Purpose: build language sense through high-quality sentences.

Expected features:

- One sentence per day
- Chinese explanation
- Grammar breakdown
- Key words and phrases
- Imitation writing prompt
- Save useful expressions to the user's library

### 6. Grammar Training

Purpose: improve grammar through quick tests and immediate explanations.

Expected exercise types:

- Fill in the blank
- Error correction
- Sentence rewriting
- Naturalness judgment
- Short explanation tasks

Feedback should include:

- Correct answer
- Why the user's answer is wrong or less natural
- Better expression
- Similar examples
- Reusable grammar pattern

### 7. Academic Writing Coach

Purpose: help the user improve scientific paper writing.

Expected features:

- Polish English academic sentences
- Translate Chinese research statements into academic English
- Provide concise, formal, and Nature-style variants
- Explain revision reasons
- Extract reusable academic sentence patterns
- Support different writing contexts:
  - Abstract
  - Introduction
  - Results
  - Discussion
  - Methods

The writing module should prioritize clarity, precision, logical flow, and field-appropriate academic tone.

### 8. Listening Training

Purpose: improve listening through active learning and feedback, not exam-style drills.

First version:

- Read word examples aloud with browser TTS
- Read daily sentences aloud
- Slow and normal speed modes
- User types heard keywords
- Immediate feedback based on missing or incorrect keywords

Later version:

- High-quality generated audio
- Listening clips based on the user's vocabulary
- Shadowing practice
- Academic listening snippets
- Adaptive listening difficulty

## Data Model Draft

### Word

Suggested fields:

- `id`
- `text`
- `phonetic`
- `meaningZh`
- `definitionEn`
- `examples`
- `collocations`
- `academicUsage`
- `synonyms`
- `commonMistakes`
- `source`
- `status`
- `familiarity`
- `nextReviewAt`
- `createdAt`
- `updatedAt`

### ReviewLog

Suggested fields:

- `id`
- `wordId`
- `rating`
- `isCorrect`
- `userAnswer`
- `feedback`
- `reviewedAt`

### DailySentence

Suggested fields:

- `id`
- `sentence`
- `translationZh`
- `grammarNotes`
- `keywords`
- `imitationPrompt`
- `date`

### WritingPractice

Suggested fields:

- `id`
- `inputText`
- `context`
- `polishedText`
- `formalVersion`
- `conciseVersion`
- `revisionNotes`
- `patterns`
- `createdAt`

### GrammarExercise

Suggested fields:

- `id`
- `type`
- `prompt`
- `answer`
- `explanation`
- `source`
- `createdAt`

### ListeningPractice

Suggested fields:

- `id`
- `sourceText`
- `mode`
- `userTranscript`
- `feedback`
- `createdAt`

## Recommended Routes

- `/`: dashboard
- `/words`: vocabulary library
- `/words/import`: dictionary import
- `/words/new`: add word
- `/words/[id]`: word detail
- `/review`: daily review
- `/daily`: daily sentence
- `/grammar`: grammar training
- `/writing`: academic writing coach
- `/listening`: listening training
- `/settings`: API and learning settings

## Implementation Roadmap

### Phase 0: Repository Foundation

Tasks:

- Initialize Next.js with TypeScript
- Add Tailwind CSS
- Add shadcn/ui or equivalent component structure
- Add Prisma and SQLite
- Add `.env.example`
- Add basic lint and formatting scripts

Deliverable:

- A runnable web application with a clean project layout.

### Phase 1: Vocabulary MVP

Tasks:

- Implement `Word` model
- Implement vocabulary list page
- Implement manual word creation
- Implement word detail page
- Implement word editing
- Implement search and status filtering

Deliverable:

- The user can maintain a personal vocabulary library.

### Phase 2: Dictionary Import

Tasks:

- Add CSV import
- Add JSON import
- Add TXT import
- Validate imported words
- Show import summary
- Avoid duplicate entries where possible

Deliverable:

- The user can import an initial dictionary and continue editing it.

### Phase 3: Review System

Tasks:

- Implement `ReviewLog`
- Add review queue based on `nextReviewAt`
- Add feedback buttons:
  - Unfamiliar
  - Vague
  - Familiar
  - Mastered
- Update next review date after each answer
- Show daily review progress

Deliverable:

- The user can review words with a simple spaced repetition system.

### Phase 4: Daily Sentence

Tasks:

- Implement `DailySentence`
- Add daily sentence page
- Add sentence explanation UI
- Add grammar notes and keyword extraction fields
- Allow saving useful words or phrases into the word library

Deliverable:

- The user has a daily language-sense learning page.

### Phase 5: AI Word Enrichment

Tasks:

- Add server-side AI route
- Add prompt templates for word explanation
- Generate structured JSON
- Validate AI output before saving
- Cache generated content in `Word`
- Add regenerate button only when explicitly requested

Deliverable:

- Each word can be enriched with AI-generated meanings, examples, collocations, and academic usage.

### Phase 6: Grammar Training

Tasks:

- Implement grammar exercise model
- Generate or seed initial exercises
- Add answer submission UI
- Add immediate feedback
- Link exercises to words or daily sentences where useful

Deliverable:

- The user can train grammar with short, feedback-rich exercises.

### Phase 7: Academic Writing Coach

Tasks:

- Add writing page
- Add context selector
- Add AI polishing route
- Save writing practice history
- Display revision rationale and reusable patterns

Deliverable:

- The user can improve scientific paper writing with reusable feedback.

### Phase 8: Listening Training

Tasks:

- Add listening page
- Use browser TTS for word examples and daily sentences
- Add speed control
- Add keyword transcript input
- Add immediate feedback

Deliverable:

- The user can train listening based on current learning content.

### Phase 9: Polish, Backup, and Deployment

Tasks:

- Improve responsive UI
- Add data export and backup
- Add settings page
- Add deployment configuration
- Add README usage instructions

Deliverable:

- The application is ready for daily use and future deployment.

## MVP Scope

The first useful version should include:

- Next.js project foundation
- SQLite database
- Vocabulary list
- Add word
- Import words
- Word detail
- Simple review queue
- Daily sentence page
- AI word enrichment route
- Academic writing coach page

Grammar and listening can be added immediately after the MVP foundation is stable.

## Implemented First Version

The repository now contains a runnable Next.js MVP with:

- Dashboard route at `/`
- Vocabulary list at `/words`
- Manual word creation at `/words/new`
- CSV, JSON, and TXT import at `/words/import`
- Word detail pages at `/words/[id]`
- Placeholder word enrichment that stores generated learning content locally
- Review queue at `/review`
- Daily sentence at `/daily`
- Grammar training page at `/grammar`
- Academic writing practice at `/writing`
- Listening practice with browser speech synthesis at `/listening`
- Settings page at `/settings`

First-version storage used local JSON in `data/app-data.json`. The third version replaces this with Prisma and SQLite while preserving the route structure and learning workflows.

Verified commands:

```powershell
npm run typecheck
npm run build
```

## Implemented Second Version

The second version improves the vocabulary foundation:

- Added word tags to the data model
- Added automatic migration for older local JSON records without tags
- Added vocabulary search by word, meaning, definition, or tag
- Added status filtering
- Added tag filtering
- Added word editing route at `/words/[id]/edit`
- Added single-word deletion with related review-log cleanup
- Improved import parsing for CSV, JSON, and TXT
- Added import error handling for invalid input format
- Added import summary with imported and skipped counts
- Updated the word detail page with edit, delete, tags, and cleaner learning-note controls

Verified commands:

```powershell
npm run typecheck
npm run build
```

Local HTTP checks returned 200 for:

- `/words`
- `/words/import`
- `/words/new`

## Implemented Third Version

The third version upgrades the data layer:

- Added Prisma and SQLite dependencies
- Added `prisma/schema.prisma`
- Added local Prisma client helper at `lib/prisma.ts`
- Replaced JSON-file storage with Prisma-backed storage in `lib/store.ts`
- Preserved the existing `readData()` interface for pages
- Added database write helpers for words, reviews, writing practice, and listening practice
- Updated server actions to write through Prisma instead of rewriting `data/app-data.json`
- Added `db:generate`, `db:push`, and `db:migrate-json` scripts
- Added `scripts/migrate-json-to-prisma.mjs` for migrating older local JSON learning data
- Updated local setup documentation for SQLite

Local database:

```text
data/dev.db
```

The database file is ignored by Git.

## Implemented Fourth Version

The fourth version connects server-side AI generation for the highest-value flows:

- Added `lib/ai.ts`
- Added OpenAI Responses API integration through server-side `fetch`
- Added structured JSON Schema output for word learning content
- Added structured JSON Schema output for academic writing feedback
- Connected AI word enrichment to the existing word detail action
- Connected AI academic writing feedback to the writing practice action
- Preserved deterministic fallback behavior when `OPENAI_API_KEY` is missing
- Added `OPENAI_MODEL` configuration with `gpt-5.2` as the default
- Updated settings and documentation for AI configuration

Current AI-backed features:

- Word meanings, English definitions, examples, collocations, academic usage, synonyms, and common mistakes
- Academic writing polished version, formal version, concise version, revision notes, and reusable patterns

## Implemented Fifth Version

The fifth version extends AI-assisted learning beyond words and writing:

- Added structured JSON Schema output for grammar exercise generation
- Added AI/fallback grammar exercise creation from current learning material
- Added `addGrammarExercise` server action
- Added database write helper for generated grammar exercises
- Rebuilt the grammar page with a "Generate Exercise" action
- Added structured AI/fallback listening feedback
- Connected listening submissions to AI/fallback feedback
- Rebuilt the listening page with clearer learning-oriented UI text

Current AI-backed features:

- Word learning notes
- Academic writing feedback
- Grammar exercise generation
- Listening transcript feedback

## Implemented Sixth Version

The sixth version improves observability and data safety:

- Rebuilt the dashboard with stable English UI text
- Added vocabulary mastery rate
- Added due-review count and today's review count
- Added word status distribution
- Added AI practice counters for writing, grammar, and listening
- Added visible AI status in settings
- Added model display in settings
- Added JSON export endpoint at `/api/export`
- Added SQLite backup endpoint at `/api/backup/sqlite`
- Added backup/export buttons to settings
- Updated documentation for data export and backup

Current backup options:

- JSON export for portability
- SQLite database download for full local backup

## Engineering Principles

- Keep generated AI content structured and cached.
- Do not call AI directly from client components.
- Keep user learning records in the database.
- Prefer small, testable features over one large feature branch.
- Keep import logic strict and transparent.
- Avoid destructive file operations.
- Use UTF-8 for all text files.
- Document new environment variables in `.env.example`.
- Keep the website usable even when AI credentials are not configured.

## Risks and Mitigations

### AI Cost

Mitigation:

- Cache all generated content.
- Add explicit generate buttons.
- Avoid automatic background generation in early versions.

### Unstable AI Output

Mitigation:

- Ask AI for structured JSON.
- Validate output before saving.
- Show fallback messages when parsing fails.

### Overly Broad Scope

Mitigation:

- Build vocabulary, import, and review first.
- Add AI and listening after the data model is stable.

### Dictionary Copyright

Mitigation:

- Let the user import personal or public-domain word lists.
- Do not bundle copyrighted dictionaries unless licensing is clear.

### Audio Quality

Mitigation:

- Start with browser TTS.
- Add higher-quality TTS only after listening workflows are proven useful.
