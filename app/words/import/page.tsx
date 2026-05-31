import { importWords } from "@/lib/actions";

export default function ImportWordsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>导入词典</h1>
          <p>第一版支持 CSV、JSON 和 TXT。导入时会跳过已经存在的单词。</p>
        </div>
      </div>

      <form className="panel form" action={importWords}>
        <label>
          格式
          <select name="format" defaultValue="txt">
            <option value="txt">TXT：一行一个单词</option>
            <option value="csv">CSV：word,meaning,example</option>
            <option value="json">JSON：数组对象</option>
          </select>
        </label>
        <label>
          词典内容
          <textarea
            name="content"
            required
            placeholder={"TXT:\nanalyze\nsubstantial\n\nCSV:\nword,meaning,example\nanalyze,分析,We analyze the results."}
            style={{ minHeight: 280 }}
          />
        </label>
        <button type="submit">开始导入</button>
      </form>
    </div>
  );
}
