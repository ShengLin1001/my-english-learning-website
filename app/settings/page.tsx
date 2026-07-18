export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const provider = process.env.AI_PROVIDER || (process.env.DEEPSEEK_API_KEY ? "deepseek" : "openai");
  const hasApiKey = provider === "deepseek" ? Boolean(process.env.DEEPSEEK_API_KEY) : Boolean(process.env.OPENAI_API_KEY);
  const databaseUrl = process.env.DATABASE_URL || "not configured";
  const canBackupSqlite = databaseUrl.startsWith("file:");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">ResearchLoop settings</p>
          <h1>设置</h1>
          <p>查看智能反馈状态、数据存储和间隔复习策略。</p>
        </div>
      </div>

      <section className="grid grid-2">
        <div className="panel">
          <h2>智能反馈</h2>
          <p>智能反馈请求只在服务端处理，浏览器不会收到访问凭据。未配置在线服务时，ResearchLoop 会使用本地回退内容保持流程可用。</p>
          <div className="row">
            <span className={hasApiKey ? "status" : "tag"}>{hasApiKey ? "AI enabled" : "Fallback mode"}</span>
          </div>
        </div>
        <div className="panel">
          <h2>数据存储</h2>
          <p>学习数据保存在本地 SQLite 数据库中。你可以导出通用 JSON，或下载完整数据库备份。</p>
          <div className="row">
            <span className={canBackupSqlite ? "status" : "tag"}>{canBackupSqlite ? "SQLite 可备份" : "需要 SQLite 文件地址"}</span>
          </div>
          <div className="row">
            <a className="button secondary" href="/api/export">
              导出 JSON
            </a>
            <a className="button secondary" href="/api/backup/sqlite">
              下载 SQLite
            </a>
          </div>
        </div>
        <div className="panel">
          <h2>间隔复习策略</h2>
          <p>不熟悉：今天稍后；模糊：1 天；熟悉：3 天；已掌握：7 天。</p>
        </div>
        <div className="panel">
          <h2>隐私提示</h2>
          <p>只粘贴你有权处理的内容。公开演示请使用原创或合成段落，不要提交未公开的论文数据。</p>
        </div>
      </section>
    </div>
  );
}
