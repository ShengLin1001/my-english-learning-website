import Link from "next/link";
import { reviewWord } from "@/lib/actions";
import { readData } from "@/lib/store";
import { WordStatus } from "@/lib/types";

const ratings: Array<[WordStatus, string]> = [
  ["unfamiliar", "不认识"],
  ["vague", "有印象"],
  ["familiar", "基本会"],
  ["mastered", "掌握"]
];

export default async function ReviewPage() {
  const data = await readData();
  const now = new Date().toISOString();
  const word = data.words.find((item) => item.nextReviewAt <= now);
  const latest = data.reviews[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>今日复习</h1>
          <p>根据熟悉程度安排下一次复习，先形成稳定的学习闭环。</p>
        </div>
      </div>

      {latest ? (
        <div className="panel" style={{ marginBottom: 16 }}>
          <h2>上次反馈</h2>
          <p>{latest.feedback}</p>
        </div>
      ) : null}

      {word ? (
        <form className="panel form" action={reviewWord}>
          <input type="hidden" name="wordId" value={word.id} />
          <div>
            <span className="status">{word.status}</span>
            <h2 style={{ marginTop: 8 }}>{word.text}</h2>
            <p>{word.meaningZh || word.definitionEn || "先回忆含义，再查看详情补充内容。"}</p>
          </div>
          <label>
            你的回忆或造句
            <textarea name="userAnswer" placeholder="写下你记得的意思、搭配，或用它造一句话。" />
          </label>
          <div className="row">
            {ratings.map(([value, label]) => (
              <button className={value === "mastered" ? "warm" : undefined} name="rating" value={value} key={value}>
                {label}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <div className="empty">
          <h2>今天没有到期单词</h2>
          <p>可以添加新词，或打开词库查看已有内容。</p>
          <Link className="button" href="/words">查看词库</Link>
        </div>
      )}
    </div>
  );
}
