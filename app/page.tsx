import Link from "next/link";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await readData();
  const now = new Date().toISOString();
  const latestSession = data.writingPractices[0];
  const sessionTag = latestSession ? `coach-session:${latestSession.id}` : "";
  const sessionWords = sessionTag ? data.words.filter((word) => word.tags.includes(sessionTag)) : [];
  const sessionExercises = latestSession
    ? data.grammarExercises.filter((exercise) => exercise.sessionId === latestSession.id)
    : [];
  const sessionWordIds = new Set(sessionWords.map((word) => word.id));
  const reviewedSessionWordIds = new Set(
    data.reviews
      .filter((review) => sessionWordIds.has(review.wordId) && review.reviewedAt >= (latestSession?.createdAt ?? ""))
      .map((review) => review.wordId)
  );
  const dueWords = data.words.filter((word) => word.nextReviewAt <= now);
  const reviewedToday = data.reviews.filter((review) => review.reviewedAt.slice(0, 10) === now.slice(0, 10));
  const diagnostics = latestSession?.diagnostics ?? [];
  const practiceTotal = sessionWords.length;
  const practiceDone = reviewedSessionWordIds.size;
  const progress = practiceTotal ? Math.min(100, Math.round((practiceDone / practiceTotal) * 100)) : 0;
  const sessionHref = latestSession ? `/writing?session=${encodeURIComponent(latestSession.id)}` : "/writing";

  return (
    <div className="page">
      <header className="page-header dashboard-header">
        <div>
          <p className="eyebrow">ResearchLoop dashboard</p>
          <h1>把科研英文反馈练到会用</h1>
          <p>从论文草稿出发，追踪一次反馈如何变成词卡、语法练习和长期记忆。</p>
        </div>
        <Link className="button" href="/writing">
          分析新段落
        </Link>
      </header>

      {latestSession ? (
        <section className="panel session-overview" aria-labelledby="latest-session-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest session · 最近闭环</p>
              <h2 id="latest-session-title">{latestSession.context} · {formatDate(latestSession.createdAt)}</h2>
            </div>
            <span className={latestSession.sourceStatus === "fallback" ? "tag" : "status"}>
              {latestSession.sourceStatus === "fallback" ? "Fallback mode" : "AI enabled"}
            </span>
          </div>

          <p className="session-excerpt">{latestSession.polishedText}</p>
          <div className="grid grid-3 session-metrics">
            <div>
              <strong>{diagnostics.length}</strong>
              <span>个表达问题</span>
            </div>
            <div>
              <strong>{sessionWords.length}</strong>
              <span>张专属词卡</span>
            </div>
            <div>
              <strong>{sessionExercises.length}</strong>
              <span>道语法练习</span>
            </div>
          </div>

          <div className="progress-block" aria-label={`词卡复习进度 ${progress}%`}>
            <div className="progress-copy">
              <span>词卡复习进度</span>
              <strong>{practiceDone}/{practiceTotal}</strong>
            </div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>

          <div className="row">
            <Link className="button warm" href={`/review?session=${encodeURIComponent(latestSession.id)}`}>
              {practiceDone ? "继续本次练习" : "开始 3 分钟练习"}
            </Link>
            <Link className="text-link" href={sessionHref}>查看反馈详情</Link>
          </div>
        </section>
      ) : (
        <section className="coach-hero first-loop">
          <div>
            <p className="eyebrow">Start here · 从这里开始</p>
            <h2>还没有 ResearchLoop session</h2>
            <p>粘贴一段科研英文，几秒钟内获得改写依据、词卡和针对性练习。</p>
          </div>
          <Link className="button warm" href="/writing?demo=1">体验原创示例</Link>
        </section>
      )}

      <section className="grid grid-3 support-metrics">
        <article className="panel">
          <div className="metric">{dueWords.length}</div>
          <p>今日待复习</p>
          <Link className="text-link" href="/review">打开复习队列</Link>
        </article>
        <article className="panel">
          <div className="metric">{reviewedToday.length}</div>
          <p>今日已复习</p>
          <Link className="text-link" href="/words">查看词库</Link>
        </article>
        <article className="panel">
          <div className="metric">{data.writingPractices.length}</div>
          <p>累计科研写作 sessions</p>
          <Link className="text-link" href="/writing">查看历史</Link>
        </article>
      </section>

      <section className="panel secondary-tools">
        <div>
          <h2>继续日常学习</h2>
          <p>这些工具仍可独立使用，但 ResearchLoop 是推荐入口。</p>
        </div>
        <div className="row">
          <Link className="button secondary" href="/daily">每日一句</Link>
          <Link className="button secondary" href="/grammar">语法练习</Link>
          <Link className="button secondary" href="/listening">听力训练</Link>
        </div>
      </section>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
