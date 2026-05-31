export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>设置</h1>
          <p>第一版保留配置入口，后续用于 AI API、导入规则、复习间隔和数据备份。</p>
        </div>
      </div>

      <section className="grid grid-2">
        <div className="panel">
          <h2>AI 配置</h2>
          <p>后续通过 `.env.local` 配置 `OPENAI_API_KEY`，AI 请求只在服务端执行。</p>
        </div>
        <div className="panel">
          <h2>数据存储</h2>
          <p>当前第一版使用本地 `data/app-data.json` 保存学习数据，后续可迁移到 Prisma + SQLite。</p>
        </div>
        <div className="panel">
          <h2>复习策略</h2>
          <p>不认识：尽快复习；有印象：1 天后；基本会：3 天后；掌握：7 天后。</p>
        </div>
        <div className="panel">
          <h2>下一阶段</h2>
          <p>接入真实 AI 生成、SQLite 数据库、可编辑词条和更完整的语法题反馈。</p>
        </div>
      </section>
    </div>
  );
}
