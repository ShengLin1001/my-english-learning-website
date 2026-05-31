import { addWord } from "@/lib/actions";

export default function NewWordPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add Word</h1>
          <p>Add unfamiliar words from reading, writing, listening, or daily study.</p>
        </div>
      </div>

      <form className="panel form" action={addWord}>
        <label>
          Word
          <input name="text" required placeholder="substantial" />
        </label>
        <label>
          Phonetic
          <input name="phonetic" placeholder="/səbˈstænʃəl/" />
        </label>
        <label>
          Chinese Meaning
          <input name="meaningZh" placeholder="大量的；实质性的" />
        </label>
        <label>
          English Definition
          <textarea name="definitionEn" placeholder="A short English definition." />
        </label>
        <label>
          Examples, one per line
          <textarea name="examples" placeholder="The experiment showed a substantial improvement." />
        </label>
        <label>
          Collocations, one per line
          <textarea name="collocations" placeholder={"substantial evidence\nsubstantial improvement"} />
        </label>
        <label>
          Tags
          <input name="tags" placeholder="academic, writing, listening" />
        </label>
        <label>
          Academic Usage
          <textarea name="academicUsage" placeholder="Describe how this word is used in academic writing." />
        </label>
        <button type="submit">Save Word</button>
      </form>
    </div>
  );
}
