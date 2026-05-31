import { importWords } from "@/lib/actions";

export default async function ImportWordsPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = searchParams ? await searchParams : {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Import Dictionary</h1>
          <p>Support CSV, JSON, and TXT. Duplicate words are skipped automatically.</p>
          {params.error ? <p>Import failed. Check the selected format and input structure.</p> : null}
        </div>
      </div>

      <form className="panel form" action={importWords}>
        <label>
          Format
          <select name="format" defaultValue="txt">
            <option value="txt">TXT: one word per line, optional "# tag"</option>
            <option value="csv">CSV: word,meaning,example,tags</option>
            <option value="json">JSON: array of word objects</option>
          </select>
        </label>
        <label>
          Dictionary Content
          <textarea
            name="content"
            required
            placeholder={
              "TXT:\nanalyze # academic\nsubstantial # writing\n\nCSV:\nword,meaning,example,tags\nanalyze,分析,We analyze the results.,academic\n\nJSON:\n[{\"word\":\"analyze\",\"meaning\":\"分析\",\"example\":\"We analyze the results.\",\"tags\":[\"academic\"]}]"
            }
            style={{ minHeight: 300 }}
          />
        </label>
        <button type="submit">Import Words</button>
      </form>
    </div>
  );
}
