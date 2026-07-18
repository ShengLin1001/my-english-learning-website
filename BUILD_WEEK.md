# OpenAI Build Week 2026 Evidence

This file separates the pre-existing application from work created during the OpenAI Build Week submission period. It should be finalized before the Devpost submission is locked.

## Submission Identity

- Project: ResearchLoop
- Track: Education
- Build branch: `build-week-2026`
- Submission period: July 13, 2026 at 9:00 AM PT through July 21, 2026 at 5:00 PM PT
- Live demo: `PENDING`
- Public YouTube demo: `PENDING`
- Primary Codex `/feedback` Session ID: `PENDING`

## Pre-existing Baseline

The repository began before Build Week. Pre-existing work is disclosed rather than claimed as event work.

| Commit | Date | Boundary |
| --- | --- | --- |
| `29a5e91` | 2026-06-01 | Last original feature/fix commit before the event work |
| `de8b689` | 2026-07-18 | Snapshot of the pre-existing working tree; this commit is a baseline marker, not a new Build Week feature |

Before the extension, the application already had separate pages for vocabulary, spaced review, daily sentences, grammar, academic writing, listening, settings, export, and SQLite backup. Writing feedback was stored as an isolated record; it did not create a session-linked practice loop or report its progress on the dashboard.

## Meaningful Extension Built During the Event

ResearchLoop connects the existing capabilities into one product path:

1. A researcher submits a short paper draft.
2. Structured feedback identifies clarity, grammar, precision, and concision issues.
3. The same action creates session-linked vocabulary cards and grammar exercises.
4. A focused review route keeps practice attached to that writing session.
5. The dashboard reports the resulting issues, practice items, and completion progress.

Release preparation adds a synthetic one-click example, explicit live-AI/fallback status, optional demo authentication, persistent-SQLite deployment instructions, and third-party data boundaries.

## Commit Evidence

| Work | Commit | Verification |
| --- | --- | --- |
| ResearchLoop data model and structured generation | `051a723` | Typecheck; live structured-output and fallback checks |
| Writing-to-practice flow, focused review, and dashboard | `3794229` | Browser judge path through 25% session progress |
| Provider-neutral public demo protection | `6d259ef` | HTTP Basic Auth challenge and success checks |
| Submission, deployment, license, and data-boundary docs | `792751a` | Repository diff and release-document review |

## Codex Collaboration

Codex was the primary engineering environment for the extension. It was used to:

- inspect the complete existing data and server-action flow before changing it;
- choose a minimal session-link design that reused `Word`, `GrammarExercise`, review logs, and SQLite;
- coordinate independent implementation, UI, validation, and release-readiness tasks;
- identify the public-demo risks around unauthenticated mutations, database downloads, API spend, and third-party word lists;
- run type checking, production builds, and browser-level checks against the completed path.

The final `/feedback` Session ID must come from the primary Codex task where most core functionality was built. Do not substitute a planning-only or release-only session.

## Verification Record

Update this table with the final UTC timestamp and result for each release candidate check.

| Check | Result | Timestamp |
| --- | --- | --- |
| `npm run typecheck` | PASS | `2026-07-18T08:40:56Z` |
| `npm run build` | PASS, Next.js 15.5.18 production build | `2026-07-18T08:40:56Z` |
| Live AI judge quick path | PASS, 4 diagnostics, 4 cards, 2 exercises, review progress 1/4 | `2026-07-18T08:40:56Z` |
| No-key fallback judge quick path | PASS, visible fallback status, 3 cards, 2 exercises | `2026-07-18T08:40:56Z` |
| Demo authentication challenge and success | PASS, unauthenticated 401 and authenticated 200 | `2026-07-18T08:40:56Z` |
| Synthetic demo data only | PASS, original sample in isolated disposable SQLite database | `2026-07-18T08:40:56Z` |

## Third-party and Data Disclosure

- The application uses its declared npm dependencies under their respective licenses.
- The runtime AI provider is configured server-side and is not exposed as the product identity.
- No third-party vocabulary list is distributed or loaded into the hosted demo.
- The public demo must use original synthetic research text and synthetic learning records.
- Personal SQLite files and API credentials must remain outside Git.

## Final Submission Checklist

- [ ] Replace all `PENDING` evidence fields.
- [ ] Add repository description, homepage, and live demo URL.
- [ ] Keep the hosted demo available through the judging period.
- [ ] Provide private demo credentials in the testing instructions.
- [ ] Record a public YouTube video under three minutes with English narration or an English translation.
- [ ] Show the working loop and explain specific Codex decisions in the narration.
- [ ] Replace the marked fields in [`SUBMISSION.md`](./SUBMISSION.md) and use its judge path and video script.
- [ ] Run `/feedback` in the primary Codex task and copy its Session ID.
- [ ] Confirm the Devpost text, repository, video, and test instructions describe the same release.
