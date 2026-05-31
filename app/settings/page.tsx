export default function SettingsPage() {
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage local database setup, AI configuration, review strategy, and future backup options.</p>
        </div>
      </div>

      <section className="grid grid-2">
        <div className="panel">
          <h2>AI Configuration</h2>
          <p>Configure `OPENAI_API_KEY` and optional `OPENAI_MODEL` in `.env` or `.env.local`. AI requests run only on the server side.</p>
          <p>Without an API key, word enrichment and writing feedback use deterministic fallback content.</p>
          <div className="row">
            <span className={hasApiKey ? "status" : "tag"}>{hasApiKey ? "AI enabled" : "Fallback mode"}</span>
            <span className="status">{model}</span>
          </div>
        </div>
        <div className="panel">
          <h2>Data Storage</h2>
          <p>The current version stores learning data in SQLite through Prisma. The local database file is `data/dev.db`.</p>
          <div className="row">
            <a className="button secondary" href="/api/export">
              Export JSON
            </a>
            <a className="button secondary" href="/api/backup/sqlite">
              Download SQLite
            </a>
          </div>
        </div>
        <div className="panel">
          <h2>Review Strategy</h2>
          <p>Unfamiliar: review soon. Vague: 1 day. Familiar: 3 days. Mastered: 7 days.</p>
        </div>
        <div className="panel">
          <h2>Next Stage</h2>
          <p>The next version should add richer review analytics, import preview, and visible AI request results on each page.</p>
        </div>
      </section>
    </div>
  );
}
