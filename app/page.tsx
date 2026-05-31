import Link from "next/link";
import { readData } from "@/lib/store";

export default async function DashboardPage() {
  const data = await readData();
  const now = new Date().toISOString();
  const dueWords = data.words.filter((word) => word.nextReviewAt <= now);
  const mastered = data.words.filter((word) => word.status === "mastered");
  const reviewedToday = data.reviews.filter((review) => review.reviewedAt.slice(0, 10) === now.slice(0, 10));
  const daily = data.dailySentences[0];
  const masteryRate = data.words.length ? Math.round((mastered.length / data.words.length) * 100) : 0;
  const statusCounts = ["new", "unfamiliar", "vague", "familiar", "mastered"].map((status) => ({
    status,
    count: data.words.filter((word) => word.status === status).length
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Learning Dashboard</h1>
          <p>Track vocabulary, reviews, AI practice, and daily learning progress from one place.</p>
        </div>
        <Link className="button" href="/words/new">
          Add Word
        </Link>
      </div>

      <section className="grid grid-3">
        <div className="panel">
          <div className="metric">{data.words.length}</div>
          <p>Vocabulary words</p>
        </div>
        <div className="panel">
          <div className="metric">{dueWords.length}</div>
          <p>Due for review</p>
        </div>
        <div className="panel">
          <div className="metric">{masteryRate}%</div>
          <p>Mastery rate</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>Review Progress</h2>
          <p>{reviewedToday.length} reviews completed today.</p>
          <div className="progress-list">
            {statusCounts.map((item) => (
              <div className="progress-row" key={item.status}>
                <span>{item.status}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <Link className="button secondary" href="/review">
            Start Review
          </Link>
        </div>
        <div className="panel">
          <h2>AI Practice</h2>
          <div className="progress-list">
            <div className="progress-row">
              <span>Writing records</span>
              <strong>{data.writingPractices.length}</strong>
            </div>
            <div className="progress-row">
              <span>Grammar exercises</span>
              <strong>{data.grammarExercises.length}</strong>
            </div>
            <div className="progress-row">
              <span>Listening practices</span>
              <strong>{data.listeningPractices.length}</strong>
            </div>
          </div>
          <div className="row">
            <Link className="button secondary" href="/writing">
              Writing
            </Link>
            <Link className="button secondary" href="/grammar">
              Grammar
            </Link>
            <Link className="button secondary" href="/listening">
              Listening
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>Daily Sentence</h2>
          <p className="sentence">{daily?.sentence}</p>
          <p>{daily?.translationZh}</p>
          <Link className="button secondary" href="/daily">
            Study Sentence
          </Link>
        </div>
        <div className="panel">
          <h2>Next Best Action</h2>
          <p>
            Import or add words first, then review due words and generate AI exercises from your real learning material.
          </p>
          <div className="row">
            <Link className="button" href="/words/import">
              Import Words
            </Link>
            <Link className="button secondary" href="/settings">
              Backup Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
