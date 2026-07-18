import Link from "next/link";
import { addWritingPractice } from "@/lib/actions";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

const demoText =
  "The simulation results shows that smaller grains can improve the strength, but this effect become weak at high temperature because atoms move more easier.";

type WritingSearchParams = {
  session?: string;
  demo?: string;
  error?: string;
};

export default async function WritingPage({ searchParams }: { searchParams?: Promise<WritingSearchParams> }) {
  const [data, params] = await Promise.all([readData(), searchParams ?? Promise.resolve<WritingSearchParams>({})]);
  const requestedSession = params.session;
  const practice = requestedSession
    ? data.writingPractices.find((item) => item.id === requestedSession)
    : data.writingPractices[0];
  const sessionId = practice?.id;
  const diagnostics = practice?.diagnostics ?? [];
  const sessionTag = sessionId ? `coach-session:${sessionId}` : "";
  const sessionWords = sessionTag ? data.words.filter((word) => word.tags.includes(sessionTag)) : [];
  const sessionExercises = sessionId
    ? data.grammarExercises.filter((exercise) => exercise.sessionId === sessionId)
    : [];

  return (
    <div className="page">
      <header className="coach-hero">
        <div>
          <p className="eyebrow">ResearchLoop · 科研英语闭环</p>
          <h1>一段论文草稿，变成一次完整练习</h1>
          <p>粘贴科研英文，获得可解释的改写，并自动生成词卡和语法练习。无需在多个工具间搬运反馈。</p>
        </div>
        <div className="loop-steps" aria-label="学习闭环步骤">
          <span><strong>1</strong> 分析</span>
          <span><strong>2</strong> 练习</span>
          <span><strong>3</strong> 复习</span>
        </div>
      </header>

      {params.error ? (
        <div className="panel error-panel" role="alert">
          <strong>无法开始分析：</strong> {errorMessage(params.error)}
        </div>
      ) : null}

      <form className="panel form coach-form" action={addWritingPractice}>
        <div className="form-heading">
          <div>
            <h2>分析新的科研段落</h2>
            <p id="writing-help">建议输入 1–5 句英文。系统会保留原文，并解释每一处关键修改。</p>
          </div>
          <Link className="text-link" href="/writing?demo=1">
            一键填充原创示例
          </Link>
        </div>
        <label>
          论文场景
          <select name="context" defaultValue="Results">
            <option>Abstract</option>
            <option>Introduction</option>
            <option>Results</option>
            <option>Discussion</option>
            <option>Methods</option>
          </select>
        </label>
        <label>
          英文草稿
          <textarea
            aria-describedby="writing-help"
            defaultValue={params.demo === "1" ? demoText : ""}
            maxLength={6000}
            minLength={12}
            name="inputText"
            required
            placeholder="Paste a paragraph from your paper draft..."
          />
        </label>
        <button type="submit">生成反馈与练习</button>
        <p className="form-note">通常需要几秒钟。AI 不可用时会生成可演示的本地回退内容。</p>
      </form>

      {requestedSession && !practice ? (
        <div className="panel notice-panel" role="status">
          <h2>未找到这次练习</h2>
          <p>它可能已被删除。你可以直接创建一次新的 ResearchLoop。</p>
        </div>
      ) : null}

      {practice ? (
        <section className="session-result" aria-labelledby="session-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current session · 当前闭环</p>
              <h2 id="session-title">{practice.context} 写作反馈</h2>
            </div>
            <span className={practice.sourceStatus === "fallback" ? "tag" : "status"}>
              {practice.sourceStatus === "fallback" ? "Fallback mode" : "AI enabled"}
            </span>
          </div>

          <div className="grid grid-2">
            <article className="panel copy-card">
              <span className="card-label">Original · 原文</span>
              <p>{practice.inputText}</p>
            </article>
            <article className="panel copy-card featured-card">
              <span className="card-label">Polished · 推荐改写</span>
              <p>{practice.polishedText}</p>
            </article>
          </div>

          <article className="panel" style={{ marginTop: 16 }}>
            <div className="section-heading compact">
              <div>
                <h2>为什么这样修改</h2>
                <p>{practice.revisionNotes}</p>
              </div>
              <span className="status">{diagnostics.length} 个关键问题</span>
            </div>
            {diagnostics.length ? (
              <div className="diagnostic-list">
                {diagnostics.map((diagnostic, index) => (
                  <div className="diagnostic-item" key={`${diagnostic.original}-${index}`}>
                    <span className="tag">{categoryLabel(diagnostic.category)}</span>
                    <div>
                      <p className="change-line">
                        <del>{diagnostic.original}</del>
                        <span aria-hidden="true">→</span>
                        <ins>{diagnostic.replacement}</ins>
                      </p>
                      <p>{diagnostic.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">本次反馈没有需要单独列出的关键问题。</p>
            )}
          </article>

          <div className="practice-callout">
            <div>
              <p className="eyebrow">反馈已转化为练习</p>
              <h2>{sessionWords.length} 张词卡 + {sessionExercises.length} 道语法题</h2>
              <p>先主动回忆，再查看答案。完成后，进度会回到本次 session。</p>
            </div>
            <Link className="button warm primary-cta" href={`/review?session=${encodeURIComponent(practice.id)}`}>
              开始 3 分钟练习
            </Link>
          </div>
        </section>
      ) : (
        <section className="empty coach-empty">
          <h2>你的第一条学习闭环从这里开始</h2>
          <p>还没有写作 session。填入自己的段落，或使用上面的原创示例体验完整流程。</p>
        </section>
      )}

      {data.writingPractices.length > 1 ? (
        <details className="panel session-history">
          <summary>查看历史 sessions（{data.writingPractices.length}）</summary>
          <div className="progress-list">
            {data.writingPractices.slice(0, 8).map((item) => (
              <Link className="progress-row" href={`/writing?session=${encodeURIComponent(item.id)}`} key={item.id}>
                <span>{item.context} · {formatDate(item.createdAt)}</span>
                <strong>{item.id === practice?.id ? "当前" : "查看"}</strong>
              </Link>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function categoryLabel(category: string) {
  return ({ clarity: "清晰度", grammar: "语法", precision: "准确性", concision: "简洁性" } as Record<string, string>)[category] || category;
}

function errorMessage(error: string) {
  if (error === "text-too-long") return "段落不能超过 6000 个字符。";
  if (error === "context-too-long") return "论文场景名称过长。";
  return "请输入需要分析的科研英文段落。";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
