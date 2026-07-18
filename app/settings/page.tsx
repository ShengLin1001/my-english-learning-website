export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const provider = process.env.AI_PROVIDER || (process.env.DEEPSEEK_API_KEY ? "deepseek" : "openai");
  const model = provider === "deepseek" ? process.env.DEEPSEEK_MODEL || "deepseek-v4-pro" : process.env.OPENAI_MODEL || "gpt-5.2";
  const hasApiKey = provider === "deepseek" ? Boolean(process.env.DEEPSEEK_API_KEY) : Boolean(process.env.OPENAI_API_KEY);
  const databaseUrl = process.env.DATABASE_URL || "not configured";
  const canBackupSqlite = databaseUrl.startsWith("file:");

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
          <p>Configure `AI_PROVIDER` with either OpenAI or DeepSeek credentials in `.env` or `.env.local`. AI requests run only on the server side.</p>
          <p>Without a provider API key, AI features use deterministic fallback content.</p>
          <div className="row">
            <span className={hasApiKey ? "status" : "tag"}>{hasApiKey ? "AI enabled" : "Fallback mode"}</span>
            <span className="status">{provider}</span>
            <span className="status">{model}</span>
          </div>
        </div>
        <div className="panel">
          <h2>Data Storage</h2>
          <p>The current version stores learning data in SQLite through Prisma. SQLite backup uses the `DATABASE_URL` file path.</p>
          <div className="row">
            <span className={canBackupSqlite ? "status" : "tag"}>{canBackupSqlite ? "SQLite backup available" : "SQLite file URL required"}</span>
          </div>
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
          <p>The next version should add editable daily sentences, grammar history management, and visible AI request results on each page.</p>
        </div>
      </section>
    </div>
  );
}
