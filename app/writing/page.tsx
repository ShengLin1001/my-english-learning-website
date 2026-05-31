import { addWritingPractice } from "@/lib/actions";
import { readData } from "@/lib/store";

export default async function WritingPage() {
  const data = await readData();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>科研写作助手</h1>
          <p>输入中文或英文科研句子，记录润色、改写和可复用表达。第一版先完成练习流，后续接入 AI。</p>
        </div>
      </div>

      <form className="panel form" action={addWritingPractice}>
        <label>
          写作场景
          <select name="context" defaultValue="Results">
            <option>Abstract</option>
            <option>Introduction</option>
            <option>Results</option>
            <option>Discussion</option>
            <option>Methods</option>
          </select>
        </label>
        <label>
          原句
          <textarea name="inputText" required placeholder="输入需要改写或润色的科研句子。" />
        </label>
        <button type="submit">生成写作练习记录</button>
      </form>

      <section className="grid" style={{ marginTop: 16 }}>
        {data.writingPractices.map((practice) => (
          <div className="panel" key={practice.id}>
            <div className="row">
              <span className="status">{practice.context}</span>
              <h2>写作记录</h2>
            </div>
            <p><strong>原句：</strong>{practice.inputText}</p>
            <p><strong>润色：</strong>{practice.polishedText}</p>
            <p><strong>正式版本：</strong>{practice.formalVersion}</p>
            <p>{practice.revisionNotes}</p>
            <div className="row">
              {practice.patterns.map((pattern) => (
                <span className="status" key={pattern}>{pattern}</span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
