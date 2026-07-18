import Link from "next/link";
import { addGrammarExercise } from "@/lib/actions";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GrammarPage({ searchParams }: { searchParams?: Promise<{ session?: string }> }) {
  const [data, params] = await Promise.all([readData(), searchParams ?? Promise.resolve<{ session?: string }>({})]);
  const sessionId = params.session;
  const session = sessionId ? data.writingPractices.find((practice) => practice.id === sessionId) : undefined;
  const exercises = sessionId
    ? data.grammarExercises.filter((exercise) => exercise.sessionId === sessionId)
    : data.grammarExercises;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{session ? "ResearchLoop practice · 当前闭环" : "Focused practice · 针对性训练"}</p>
          <h1>{session ? `${session.context} 语法微练习` : "语法训练"}</h1>
          <p>{session ? "这些题目直接来自你的论文草稿和刚才的表达问题。" : "从当前学习材料生成短练习，作答后立即核对原因。"}</p>
        </div>
        <form action={addGrammarExercise}>
          {sessionId ? <input type="hidden" name="sessionId" value={sessionId} /> : null}
          <button className="secondary" type="submit">再生成一道</button>
        </form>
      </header>

      {session ? (
        <section className="panel source-strip">
          <div>
            <span className="card-label">Source · 本次原文</span>
            <p>{session.inputText}</p>
          </div>
          <Link className="text-link" href={`/writing?session=${encodeURIComponent(session.id)}`}>返回完整反馈</Link>
        </section>
      ) : null}

      <section className="grid grammar-grid">
        {exercises.map((exercise, index) => (
          <article className={sessionId ? "panel grammar-card featured-card" : "panel grammar-card"} key={exercise.id}>
            <div className="section-heading compact">
              <div className="row">
                <span className="status">{typeLabel(exercise.type)}</span>
                {sessionId ? <span className="tag">当前 session</span> : null}
              </div>
              <strong className="exercise-number">{String(index + 1).padStart(2, "0")}</strong>
            </div>
            <h2>{exercise.prompt}</h2>
            <details className="answer-box">
              <summary>查看答案与解释</summary>
              <p className="answer-text"><strong>答案：</strong>{exercise.answer}</p>
              <p>{exercise.explanation}</p>
            </details>
          </article>
        ))}
      </section>

      {!exercises.length ? (
        <div className="empty">
          <h2>{session ? "本次暂未生成语法题" : "还没有语法练习"}</h2>
          <p>点击“再生成一道”，系统会使用当前学习材料创建短练习。</p>
        </div>
      ) : null}

      {session ? (
        <div className="practice-footer">
          <p>完成核对后，回到当前 session 查看整条学习链路。</p>
          <Link className="button warm" href={`/writing?session=${encodeURIComponent(session.id)}`}>返回本次学习闭环</Link>
        </div>
      ) : null}
    </div>
  );
}

function typeLabel(type: string) {
  return ({ fill: "填空", correction: "纠错", rewrite: "改写", naturalness: "自然度" } as Record<string, string>)[type] || type;
}
