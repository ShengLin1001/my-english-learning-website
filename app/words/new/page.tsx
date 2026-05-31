import { addWord } from "@/lib/actions";

export default function NewWordPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>添加单词</h1>
          <p>把平时遇到的陌生词加入词库，并记录最初的上下文。</p>
        </div>
      </div>

      <form className="panel form" action={addWord}>
        <label>
          单词
          <input name="text" required placeholder="例如: substantial" />
        </label>
        <label>
          音标
          <input name="phonetic" placeholder="/səbˈstænʃəl/" />
        </label>
        <label>
          中文释义
          <input name="meaningZh" placeholder="大量的；实质性的" />
        </label>
        <label>
          英文释义
          <textarea name="definitionEn" placeholder="A short English definition." />
        </label>
        <label>
          例句，一行一个
          <textarea name="examples" placeholder="The experiment showed a substantial improvement." />
        </label>
        <label>
          固定搭配，一行一个
          <textarea name="collocations" placeholder="substantial evidence&#10;substantial improvement" />
        </label>
        <label>
          科研写作用法
          <textarea name="academicUsage" placeholder="Describe how this word is used in academic writing." />
        </label>
        <button type="submit">保存单词</button>
      </form>
    </div>
  );
}
