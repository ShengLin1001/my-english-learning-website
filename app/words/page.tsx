import Link from "next/link";
import { readData } from "@/lib/store";

export default async function WordsPage({ searchParams }: { searchParams?: Promise<{ imported?: string }> }) {
  const data = await readData();
  const params = searchParams ? await searchParams : {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>词库</h1>
          <p>管理导入的词典和你平时学习中遇到的新单词。</p>
          {params.imported ? <p>已导入 {params.imported} 个新词。</p> : null}
        </div>
        <div className="row">
          <Link className="button secondary" href="/words/import">导入词典</Link>
          <Link className="button" href="/words/new">添加单词</Link>
        </div>
      </div>

      {data.words.length ? (
        <section className="grid">
          {data.words.map((word) => (
            <Link className="item" href={`/words/${word.id}`} key={word.id}>
              <div className="row">
                <h2>{word.text}</h2>
                <span className="status">{word.status}</span>
              </div>
              <p>{word.meaningZh || word.definitionEn || "还没有释义，打开详情页补充或生成学习内容。"}</p>
              <p className="muted">下次复习：{new Date(word.nextReviewAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </section>
      ) : (
        <div className="empty">
          <h2>词库还是空的</h2>
          <p>先添加一个单词，或导入 CSV、JSON、TXT 词表。</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="button" href="/words/new">添加单词</Link>
            <Link className="button secondary" href="/words/import">导入词典</Link>
          </div>
        </div>
      )}
    </div>
  );
}
