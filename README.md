# ResearchLoop

ResearchLoop turns one paragraph of research English into a short learning loop: explain the important edits, generate targeted vocabulary and grammar practice, review it, and show the result on a dashboard.

The project is a single-user learning tool rather than a general writing chatbot. Its main goal is to help researchers reuse feedback instead of reading a polished paragraph once and forgetting it.

## Judge Quick Path

1. Open `/writing?demo=1`, then submit the original research-English sample.
2. Review the categorized edits and start the generated three-minute practice.
3. Return to `/` to see that session's issues, cards, exercises, and review progress together.

The app remains usable without an AI credential by returning clearly labelled deterministic fallback content.

## What the Loop Produces

- A polished paragraph and concise revision rationale
- Diagnostics grouped by clarity, grammar, precision, and concision
- Session-linked vocabulary cards and grammar exercises
- A focused review route for the current writing session
- Dashboard progress that connects feedback to later practice

Vocabulary import, daily sentences, standalone grammar practice, listening practice, JSON export, and SQLite backup remain available as supporting tools.

## Architecture

- Next.js 15 and React 19
- TypeScript server components and server actions
- Prisma with a local SQLite database
- Server-side, configurable AI provider with structured JSON validation
- No client-side API credentials and no required external database

AI vendor and model names are intentionally not part of the learner-facing product identity. The interface reports only whether live AI or local fallback content produced a session.

## Local Setup

Prerequisites: Node.js 20 or newer and npm.

```powershell
git clone https://github.com/ShengLin1001/my-english-learning-website.git
cd my-english-learning-website
Copy-Item .env.example .env
npm ci
npm run db:generate
npm run db:push
npm run dev
```

Open `http://localhost:3000`. The default SQLite path in `.env.example` is relative to `prisma/schema.prisma` and resolves to `data/dev.db`.

To use live AI feedback, select a supported provider and set its server-side API key in `.env`. Model override variables are optional. If no valid key is configured, the app uses fallback content and still saves the learning session.

## Demo Access Protection

The repository includes optional HTTP Basic authentication for a hosted demo. It activates only when both variables are non-empty:

```text
DEMO_USER=judge
DEMO_PASSWORD=use-a-long-random-password
```

If either value is missing, authentication is disabled for local development. A hosted instance should use synthetic data only, because authenticated users can create learning records and use the export and backup endpoints.

## Minimal Persistent Deployment

ResearchLoop needs one writable, persistent filesystem because SQLite is a local file. A minimal Railway-style deployment is:

1. Deploy this GitHub repository as one service.
2. Attach one persistent volume at `/data`.
3. Set `DATABASE_URL=file:/data/demo.db` and configure the AI and demo-auth variables.
4. Use `npm run build` as the build command.
5. Use `npm run db:push && npm start` as the start command.
6. Keep one replica; a SQLite volume cannot be shared safely across replicas.

Do not upload a personal `data/dev.db`. Create the public demo from synthetic material, and keep the service available through the judging period.

## Data Import and Ownership

The import screen accepts CSV, JSON, and TXT vocabulary data. No third-party word list is distributed with this repository. Users are responsible for supplying data they are authorized to use; see [`wordlists/README.md`](./wordlists/README.md).

## OpenAI Build Week 2026

This repository existed before the event. The eligible submission work is the ResearchLoop extension developed on the `build-week-2026` branch after the submission period began. [`BUILD_WEEK.md`](./BUILD_WEEK.md) separates the pre-existing baseline from the new product flow and provides slots for commit, verification, demo, and primary Codex session evidence.

[`SUBMISSION.md`](./SUBMISSION.md) contains ready-to-use Devpost copy, judge instructions, and an English demo script that stays under three minutes.

Codex was used as the primary engineering environment to inspect the existing application, define the smallest coherent learning loop, coordinate implementation work, review deployment and data-safety constraints, and run the final checks. The deployed learning feedback provider remains configurable; the product is evaluated as a tool and workflow rather than as a model showcase.

## Verification

```powershell
npm run typecheck
npm run build
```

For a release candidate, also complete the judge quick path with both live AI and fallback mode before recording the demo.

## Known Limits

- Single-user and single-instance by design
- SQLite is suitable for the local tool and event demo, not horizontal scaling
- Shared demo credentials protect the instance but are not a multi-user account system
- AI feedback should be reviewed before reuse in a manuscript

## License

MIT. See [`LICENSE`](./LICENSE).
