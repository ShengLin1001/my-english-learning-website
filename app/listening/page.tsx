import { submitListeningPractice } from "@/lib/actions";
import { readData } from "@/lib/store";
import { ListeningControls } from "./listening-client";

export default async function ListeningPage() {
  const data = await readData();
  const sourceText =
    data.words[0]?.examples[0] ||
    data.dailySentences[0]?.sentence ||
    "The limits of my language mean the limits of my world.";
  const latest = data.listeningPractices[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>听力训练</h1>
          <p>基于当前学习材料朗读句子，输入听到的关键词，并得到即时反馈。</p>
        </div>
      </div>

      <section className="panel">
        <h2>训练文本</h2>
        <p className="sentence">{sourceText}</p>
        <ListeningControls text={sourceText} />
      </section>

      <form className="panel form" action={submitListeningPractice} style={{ marginTop: 16 }}>
        <input type="hidden" name="sourceText" value={sourceText} />
        <label>
          听到的内容或关键词
          <textarea name="userTranscript" required placeholder="播放后写下你听到的关键词或完整句子。" />
        </label>
        <button type="submit">提交反馈</button>
      </form>

      {latest ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>最近反馈</h2>
          <p>{latest.feedback}</p>
        </section>
      ) : null}
    </div>
  );
}
