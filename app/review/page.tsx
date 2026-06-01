import Link from "next/link";
import { reviewWord } from "@/lib/actions";
import { readData } from "@/lib/store";
import { WordStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ratings: Array<[WordStatus, string, string]> = [
  ["unfamiliar", "Again", "I could not recall the meaning or usage."],
  ["vague", "Vague", "I recognized it, but the usage is not stable."],
  ["familiar", "Good", "I recalled the meaning and at least one context."],
  ["mastered", "Mastered", "I can use it naturally in a sentence."]
];

export default async function ReviewPage() {
  const data = await readData();
  const now = new Date().toISOString();
  const dueWords = data.words.filter((item) => item.nextReviewAt <= now);
  const word = dueWords[0];
  const latest = data.reviews[0];
  const reviewedToday = data.reviews.filter((review) => review.reviewedAt.slice(0, 10) === now.slice(0, 10));
  const upcomingWords = data.words
    .filter((item) => item.nextReviewAt > now)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Review Session</h1>
          <p>Recall first, reveal the answer, then choose the next review interval.</p>
        </div>
        <Link className="button secondary" href="/words">
          Library
        </Link>
      </div>

      <section className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="metric">{dueWords.length}</div>
          <p>Due now</p>
        </div>
        <div className="panel">
          <div className="metric">{reviewedToday.length}</div>
          <p>Reviewed today</p>
        </div>
        <div className="panel">
          <div className="metric">{data.words.length}</div>
          <p>Total words</p>
        </div>
      </section>

      {latest ? (
        <div className="panel feedback-panel">
          <h2>Latest Feedback</h2>
          <p>{latest.feedback}</p>
          <p className="muted">Your note: {latest.userAnswer || "No recall note recorded."}</p>
        </div>
      ) : null}

      {word ? (
        <form className="panel form review-card" action={reviewWord}>
          <input type="hidden" name="wordId" value={word.id} />
          <div>
            <span className="status">{word.status}</span>
            <h2 style={{ marginTop: 8 }}>{word.text}</h2>
            <p>Write what you remember before opening the answer. A useful answer includes meaning, one collocation, or one original sentence.</p>
          </div>
          <label>
            Recall note or original sentence
            <textarea name="userAnswer" placeholder="Meaning, collocation, example sentence, or uncertainty." />
          </label>
          <details className="answer-box">
            <summary>Reveal meaning, examples, and collocations</summary>
            <div className="answer-grid">
              <div>
                <h3>Meaning</h3>
                <p>{word.meaningZh || "No Chinese meaning yet."}</p>
                <p>{word.definitionEn || "No English definition yet."}</p>
              </div>
              <div>
                <h3>Examples</h3>
                {word.examples.length ? word.examples.slice(0, 3).map((example) => <p key={example}>{example}</p>) : <p>No examples yet.</p>}
              </div>
              <div>
                <h3>Collocations</h3>
                {word.collocations.length ? word.collocations.slice(0, 4).map((item) => <p key={item}>{item}</p>) : <p>No collocations yet.</p>}
              </div>
            </div>
            <Link className="button secondary" href={`/words/${word.id}`}>
              Open Word Detail
            </Link>
          </details>
          <div className="row">
            {ratings.map(([value, label, description]) => (
              <button className={value === "mastered" ? "warm rating-button" : "rating-button"} name="rating" value={value} key={value}>
                <strong>{label}</strong>
                <span>{description}</span>
                <small>Next: {nextIntervalLabel(value)}</small>
              </button>
            ))}
          </div>
        </form>
      ) : (
        <div className="empty">
          <h2>No words are due now</h2>
          <p>Add new words, enrich existing words, or check the next scheduled reviews.</p>
          <Link className="button" href="/words">Open Library</Link>
        </div>
      )}

      {upcomingWords.length ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Upcoming Reviews</h2>
          <div className="progress-list">
            {upcomingWords.map((item) => (
              <div className="progress-row" key={item.id}>
                <Link href={`/words/${item.id}`}>{item.text}</Link>
                <span>{formatDate(item.nextReviewAt)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function nextIntervalLabel(status: WordStatus) {
  if (status === "mastered") return "7 days";
  if (status === "familiar") return "3 days";
  if (status === "vague") return "1 day";
  return "today";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
