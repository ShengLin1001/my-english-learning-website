import Link from "next/link";
import { readData } from "@/lib/store";

export default async function DashboardPage() {
  const data = await readData();
  const now = new Date().toISOString();
  const dueWords = data.words.filter((word) => word.nextReviewAt <= now);
  const mastered = data.words.filter((word) => word.status === "mastered");
  const daily = data.dailySentences[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>学习仪表盘</h1>
          <p>从词库、复习、每日句和科研写作开始，把每天遇到的英语变成可积累的学习材料。</p>
        </div>
        <Link className="button" href="/words/new">添加单词</Link>
      </div>

      <section className="grid grid-3">
        <div className="panel">
          <div className="metric">{data.words.length}</div>
          <p>词库单词</p>
        </div>
        <div className="panel">
          <div className="metric">{dueWords.length}</div>
          <p>今天需要复习</p>
        </div>
        <div className="panel">
          <div className="metric">{mastered.length}</div>
          <p>已掌握</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>今日英文句子</h2>
          <p className="sentence">{daily?.sentence}</p>
          <p>{daily?.translationZh}</p>
          <Link className="button secondary" href="/daily">查看拆解</Link>
        </div>
        <div className="panel">
          <h2>下一步</h2>
          <p>第一版已经覆盖词库、导入、复习、每日句、写作和听力入口。建议先导入一批词，再开始今日复习。</p>
          <div className="row">
            <Link className="button" href="/words/import">导入词典</Link>
            <Link className="button secondary" href="/review">开始复习</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
