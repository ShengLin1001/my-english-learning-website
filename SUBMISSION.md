# ResearchLoop Submission Kit

Use this copy as the source of truth for the Devpost page and public demo. Replace only the three clearly marked fields after deployment and recording.

## Submission Fields

- Project name: ResearchLoop
- Track: Education
- Repository: https://github.com/ShengLin1001/my-english-learning-website
- Live demo: `REPLACE_WITH_LIVE_URL`
- Public video: `REPLACE_WITH_YOUTUBE_URL`
- Primary Codex Session ID: `REPLACE_WITH_FEEDBACK_SESSION_ID`

## One-line Pitch

ResearchLoop turns feedback on one research-English paragraph into a reusable learning loop of explained edits, vocabulary cards, grammar practice, spaced review, and visible progress.

## Project Description

Researchers often paste a paragraph into a writing assistant, read the polished result once, and lose the learning opportunity. ResearchLoop keeps the learner's original text at the center. It explains the important changes, converts the same paragraph into session-linked vocabulary and grammar practice, and carries completed reviews back to a dashboard.

The result is a focused three-minute loop: analyze, practice, and review. Live structured feedback and deterministic local fallback follow the same product path, so the tool remains demonstrable when an external service is unavailable. Runtime vendor and model names are deliberately kept out of the learner-facing identity because the contribution is the learning workflow, not a model comparison.

## What Was Built During Build Week

The repository existed before the event as a collection of separate English-learning pages. The Build Week extension added:

- structured writing diagnostics for clarity, grammar, precision, and concision;
- atomic creation of a writing session, vocabulary cards, and grammar exercises;
- focused review routes that preserve the originating writing session;
- dashboard progress connecting feedback to later practice;
- visible live-feedback or fallback status without vendor/model branding;
- an original judge sample, optional demo authentication, deployment guidance, and explicit pre-existing-work evidence.

The `build-week-preexisting` tag and [`BUILD_WEEK.md`](./BUILD_WEEK.md) make the event boundary auditable.

## How Codex Was Used

Codex was the primary engineering environment. It inspected the existing application and database flow, selected a minimal session-link design that reused the current Prisma models, coordinated independent backend, interface, and release-readiness work, reviewed the integrated changes, and drove production builds plus browser-level validation.

Codex also identified two release risks that changed the result: a public demo originally exposed write, export, backup, and API-cost surfaces without authentication; and existing vocabulary could miss the current session queue because of a future review date. The final version adds optional Basic Auth and reschedules reused words into the active session without introducing a new task system.

## Judge Test Instructions

1. Open the live demo and enter the private credentials supplied in the Devpost testing field.
2. Go to `科研英语闭环`, choose `一键填充原创示例`, and submit.
3. Inspect the categorized edits, then choose `开始 3 分钟练习`.
4. Rate one word card and return to the dashboard to see the session progress change.

The hosted demo must contain only the bundled original sample and synthetic learning records.

## Video Script (about 2 minutes 35 seconds)

### 0:00–0:20 — Problem

> Research writing feedback is easy to read once and forget. ResearchLoop turns one paragraph into a short learning loop, so the writer practices the language behind the correction instead of only copying a polished answer.

Show the dashboard, then open `科研英语闭环`.

### 0:20–0:50 — Create the Loop

> I will use this original materials-science example. The learner chooses the paper section and submits the paragraph. ResearchLoop keeps the original text, returns a polished version, and explains the important changes by category.

Click `一键填充原创示例`, then `生成反馈与练习`. During the wait, explain the three visible steps: analyze, practice, review.

### 0:50–1:25 — Explainable Feedback

> Here the tool identifies concrete grammar and precision issues. Each item shows the original wording, the replacement, and the reason. The important product step is below: the same response has already become vocabulary cards and two grammar exercises linked to this writing session.

Point to the issue count, one before/after explanation, and the generated-practice count. Do not discuss the vendor or model.

### 1:25–1:55 — Active Practice

> Now I start the three-minute practice. These are not generic flashcards; they came from the paragraph we just analyzed. I recall one expression, reveal its context, and rate how well I know it. That schedules the next review while keeping the session relationship.

Click `开始 3 分钟练习`, enter a short recall note, and select `掌握不错`.

### 1:55–2:20 — Close the Loop

> Back on the dashboard, the latest writing session shows its issues, cards, exercises, and review progress together. The correction has become something the learner can revisit and measure.

Return to the dashboard and point to `1/4` or the current progress value.

### 2:20–2:35 — Codex and Event Boundary

> I built this meaningful extension with Codex as the primary engineering environment. Codex helped connect the pre-existing pages into one coherent workflow, validate the live and fallback paths, and harden the public demo. The repository tag and evidence file clearly separate the pre-event baseline from the Build Week work.

End on the public GitHub repository and `BUILD_WEEK.md`.

## Final Consistency Check

- Keep the spoken project name, Devpost title, README, and deployed navigation as `ResearchLoop`.
- Do not add a vendor or model name to the title, screenshots, or learner-facing explanation.
- Keep the video below three minutes and add English captions if the narration is not in English.
- Put demo credentials only in Devpost's private testing instructions, never in the repository or video.
- Run `/feedback` in the primary Codex task and copy that Session ID into Devpost and `BUILD_WEEK.md`.
