export default function SettingsPage() {
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
        </div>
        <div className="panel">
          <h2>Data Storage</h2>
          <p>The current version stores learning data in SQLite through Prisma. The local database file is `data/dev.db`.</p>
        </div>
        <div className="panel">
          <h2>Review Strategy</h2>
          <p>Unfamiliar: review soon. Vague: 1 day. Familiar: 3 days. Mastered: 7 days.</p>
        </div>
        <div className="panel">
          <h2>Next Stage</h2>
          <p>The next version should add visible AI status messages, database backup, and export tools.</p>
        </div>
      </section>
    </div>
  );
}
