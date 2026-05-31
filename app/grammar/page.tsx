import { readData } from "@/lib/store";

export default async function GrammarPage() {
  const data = await readData();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>语法训练</h1>
          <p>第一版提供即时反馈式练习框架，后续可接入 AI 按你的错误生成新题。</p>
        </div>
      </div>

      <section className="grid">
        {data.grammarExercises.map((exercise) => (
          <div className="panel" key={exercise.id}>
            <div className="row">
              <span className="status">{exercise.type}</span>
              <h2>练习</h2>
            </div>
            <p>{exercise.prompt}</p>
            <details>
              <summary>查看答案和解释</summary>
              <p><strong>答案：</strong>{exercise.answer}</p>
              <p>{exercise.explanation}</p>
            </details>
          </div>
        ))}
      </section>
    </div>
  );
}
