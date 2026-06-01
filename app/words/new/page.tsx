import Link from "next/link";
import { addWord } from "@/lib/actions";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function NewWordPage({
  searchParams
}: {
  searchParams?: Promise<{ duplicate?: string; error?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const data = await readData();
  const duplicateWord = params.duplicate ? data.words.find((word) => word.id === params.duplicate) : undefined;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add Word</h1>
          <p>Add unfamiliar words from reading, writing, listening, or daily study.</p>
        </div>
      </div>

      {params.error === "missing-word" ? (
        <div className="panel notice-panel">
          <strong>Word is required.</strong> Add a word or phrase before saving.
        </div>
      ) : null}

      {duplicateWord ? (
        <div className="panel notice-panel">
          <strong>Already in vocabulary:</strong> <Link href={`/words/${duplicateWord.id}`}>{duplicateWord.text}</Link>
        </div>
      ) : null}

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
