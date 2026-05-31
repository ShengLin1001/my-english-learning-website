import Link from "next/link";
import { notFound } from "next/navigation";
import { enrichWord } from "@/lib/actions";
import { readData } from "@/lib/store";

export default async function WordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const data = await readData();
  const { id } = await params;
  const word = data.words.find((item) => item.id === id);

  if (!word) {
    notFound();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{word.text}</h1>
          <p>{word.phonetic || "尚未记录音标"} · <span className="status">{word.status}</span></p>
        </div>
        <form action={enrichWord}>
          <input type="hidden" name="wordId" value={word.id} />
          <button type="submit">生成学习内容</button>
        </form>
      </div>

      <section className="grid grid-2">
        <div className="panel">
          <h2>释义</h2>
          <p>{word.meaningZh || "暂无中文释义。"}</p>
          <p>{word.definitionEn || "暂无英文释义。"}</p>
        </div>
        <div className="panel">
          <h2>科研写作用法</h2>
          <p>{word.academicUsage || "还没有记录科研写作用法。"}</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>例句</h2>
          {word.examples.length ? word.examples.map((example) => <p key={example}>{example}</p>) : <p>暂无例句。</p>}
        </div>
        <div className="panel">
          <h2>固定搭配</h2>
          {word.collocations.length ? word.collocations.map((item) => <p key={item}>{item}</p>) : <p>暂无固定搭配。</p>}
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>近义词辨析</h2>
          <p>{word.synonyms || "后续可由 AI 或手动补充。"}</p>
        </div>
        <div className="panel">
          <h2>常见错误</h2>
          <p>{word.commonMistakes || "后续可由 AI 或手动补充。"}</p>
        </div>
      </section>

      <div className="row" style={{ marginTop: 16 }}>
        <Link className="button secondary" href="/words">返回词库</Link>
        <Link className="button" href="/review">去复习</Link>
      </div>
    </div>
  );
}
