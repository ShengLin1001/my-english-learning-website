import Link from "next/link";
import { reviewWord } from "@/lib/actions";
import { readData } from "@/lib/store";
import { WordStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ratings: Array<[WordStatus, string, string]> = [
  ["unfamiliar", "再来一次", "没有想起含义或用法"],
  ["vague", "有点模糊", "认识，但还不能稳定使用"],
  ["familiar", "掌握不错", "想起了含义和一个语境"],
  ["mastered", "已经掌握", "可以自然地用于句子中"]
];

export default async function ReviewPage({ searchParams }: { searchParams?: Promise<{ session?: string }> }) {
  const [data, params] = await Promise.all([readData(), searchParams ?? Promise.resolve<{ session?: string }>({})]);
  const sessionId = params.session;
  const session = sessionId ? data.writingPractices.find((practice) => practice.id === sessionId) : undefined;
  const sessionTag = sessionId ? `coach-session:${sessionId}` : "";
  const sessionWords = sessionTag ? data.words.filter((item) => item.tags.includes(sessionTag)) : [];
  const scopeWords = sessionId ? sessionWords : data.words;
  const now = new Date().toISOString();
  const dueWords = scopeWords.filter((item) => item.nextReviewAt <= now);
  const word = dueWords[0];
  const scopeWordIds = new Set(scopeWords.map((item) => item.id));
  const scopeReviews = data.reviews.filter(
    (review) => scopeWordIds.has(review.wordId) && (!session || review.reviewedAt >= session.createdAt)
  );
  const latest = scopeReviews[0];
  const reviewedWordIds = new Set(scopeReviews.map((review) => review.wordId));
  const upcomingWords = scopeWords
    .filter((item) => item.nextReviewAt > now)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
    .slice(0, 5);
  const completedCount = sessionId ? reviewedWordIds.size : data.reviews.filter((review) => review.reviewedAt.slice(0, 10) === now.slice(0, 10)).length;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{sessionId ? "ResearchLoop practice · 专属练习" : "Spaced repetition · 间隔复习"}</p>
          <h1>{session ? `${session.context} · 3 分钟练习` : "主动回忆词卡"}</h1>
          <p>{session ? "这些词卡来自你刚才的论文草稿。先回忆，再查看答案并选择熟悉度。" : "先回忆，再揭示答案；你的选择将决定下一次复习时间。"}</p>
        </div>
        <Link className="button secondary" href={session ? `/writing?session=${encodeURIComponent(session.id)}` : "/words"}>
          {session ? "返回写作反馈" : "打开词库"}
        </Link>
      </header>

      <section className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="metric">{dueWords.length}</div>
          <p>{sessionId ? "本次待练词卡" : "现在待复习"}</p>
        </div>
        <div className="panel">
          <div className="metric">{completedCount}</div>
          <p>{sessionId ? "本次已练词卡" : "今日已复习"}</p>
        </div>
        <div className="panel">
          <div className="metric">{scopeWords.length}</div>
          <p>{sessionId ? "本次生成词卡" : "词库总数"}</p>
        </div>
      </section>

      {latest ? (
        <div className="panel feedback-panel" role="status">
          <p className="eyebrow">Latest feedback · 最近反馈</p>
          <h2>记忆提示</h2>
          <p>{latest.feedback}</p>
          <p className="muted">你的回忆：{latest.userAnswer || "这次没有记录回忆内容。"}</p>
        </div>
      ) : null}

      {word ? (
        <form className="panel form review-card focused-review" action={reviewWord}>
          <input type="hidden" name="wordId" value={word.id} />
          {sessionId ? <input type="hidden" name="sessionId" value={sessionId} /> : null}
          <div>
            <div className="row">
              <span className="status">{statusLabel(word.status)}</span>
              {sessionId ? <span className="tag">来自当前科研段落</span> : null}
            </div>
            <h2 className="review-word">{word.text}</h2>
            <p>打开答案前，写下中文含义、一个搭配，或包含它的原创句子。</p>
          </div>
          <label>
            我的回忆（可选）
            <textarea name="userAnswer" placeholder="含义、搭配、例句，或哪里不确定……" />
          </label>
          <details className="answer-box">
            <summary>揭示含义、例句和搭配</summary>
            <div className="answer-grid">
              <div>
                <h3>含义</h3>
                <p>{word.meaningZh || "暂无中文含义。"}</p>
                <p>{word.definitionEn || "No English definition yet."}</p>
              </div>
              <div>
                <h3>例句</h3>
                {word.examples.length ? word.examples.slice(0, 3).map((example) => <p key={example}>{example}</p>) : <p>暂无例句。</p>}
              </div>
              <div>
                <h3>常用搭配</h3>
                {word.collocations.length ? word.collocations.slice(0, 4).map((item) => <p key={item}>{item}</p>) : <p>暂无搭配。</p>}
              </div>
            </div>
            <Link className="text-link" href={`/words/${word.id}`}>查看完整词条</Link>
          </details>
          <fieldset className="rating-fieldset">
            <legend>这次回忆得怎么样？</legend>
            <div className="row">
              {ratings.map(([value, label, description]) => (
                <button className={value === "mastered" ? "warm rating-button" : "rating-button"} name="rating" value={value} key={value}>
                  <strong>{label}</strong>
                  <span>{description}</span>
                  <small>下次：{nextIntervalLabel(value)}</small>
                </button>
              ))}
            </div>
          </fieldset>
        </form>
      ) : sessionId ? (
        <section className="practice-complete" role="status">
          <div>
            <p className="eyebrow">Loop complete · 本轮完成</p>
            <h2>{sessionWords.length ? "本次词卡已完成" : "这次 session 暂无词卡"}</h2>
            <p>{sessionWords.length ? "反馈已经进入间隔复习计划。回到本次 session 查看完整结果。" : "你仍可查看写作反馈和语法微练习。"}</p>
          </div>
          <Link className="button warm" href={`/writing?session=${encodeURIComponent(sessionId)}`}>返回本次学习闭环</Link>
        </section>
      ) : (
        <div className="empty">
          <h2>现在没有待复习的词</h2>
          <p>可以从科研段落生成一组与上下文相关的新词卡。</p>
          <Link className="button" href="/writing">创建 ResearchLoop</Link>
        </div>
      )}

      {upcomingWords.length ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>接下来的复习</h2>
          <div className="progress-list">
            {upcomingWords.map((item) => (
              <div className="progress-row" key={item.id}>
                <Link href={`/words/${item.id}`}>{item.text}</Link>
                <span>{formatDate(item.nextReviewAt)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function nextIntervalLabel(status: WordStatus) {
  if (status === "mastered") return "7 天";
  if (status === "familiar") return "3 天";
  if (status === "vague") return "1 天";
  return "今天稍后";
}

function statusLabel(status: WordStatus) {
  return ({ new: "新词", unfamiliar: "不熟悉", vague: "模糊", familiar: "熟悉", mastered: "已掌握" } as Record<WordStatus, string>)[status];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
