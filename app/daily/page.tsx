import { readData } from "@/lib/store";

export default async function DailyPage() {
  const data = await readData();
  const daily = data.dailySentences[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>每日英文经典句</h1>
          <p>通过高质量句子积累词汇、语法和可仿写表达。</p>
        </div>
      </div>

      <section className="panel">
        <p className="sentence">{daily.sentence}</p>
        <p>{daily.translationZh}</p>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>语法拆解</h2>
          <p>{daily.grammarNotes}</p>
        </div>
        <div className="panel">
          <h2>关键词</h2>
          <div className="row">
            {daily.keywords.map((keyword) => (
              <span className="status" key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>今日仿写</h2>
        <p>{daily.imitationPrompt}</p>
      </section>
    </div>
  );
}
