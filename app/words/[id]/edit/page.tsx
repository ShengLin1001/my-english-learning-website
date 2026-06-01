import Link from "next/link";
import { notFound } from "next/navigation";
import { updateWord } from "@/lib/actions";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function EditWordPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ duplicate?: string }>;
}) {
  const data = await readData();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const word = data.words.find((item) => item.id === id);
  const duplicateWord = query.duplicate ? data.words.find((item) => item.id === query.duplicate) : undefined;

  if (!word) {
    notFound();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Edit Word</h1>
          <p>Update meanings, examples, tags, and learning notes for this word.</p>
        </div>
        <Link className="button secondary" href={`/words/${word.id}`}>
          Cancel
        </Link>
      </div>

      {duplicateWord ? (
        <div className="panel notice-panel">
          <strong>Already in vocabulary:</strong> <Link href={`/words/${duplicateWord.id}`}>{duplicateWord.text}</Link>
        </div>
      ) : null}

      <form className="panel form" action={updateWord}>
        <input type="hidden" name="wordId" value={word.id} />
        <label>
          Word
          <input name="text" required defaultValue={word.text} />
        </label>
        <label>
          Phonetic
          <input name="phonetic" defaultValue={word.phonetic} />
        </label>
        <label>
          Chinese Meaning
          <input name="meaningZh" defaultValue={word.meaningZh} />
        </label>
        <label>
          English Definition
          <textarea name="definitionEn" defaultValue={word.definitionEn} />
        </label>
        <label>
          Examples, one per line
          <textarea name="examples" defaultValue={word.examples.join("\n")} />
        </label>
        <label>
          Collocations, one per line
          <textarea name="collocations" defaultValue={word.collocations.join("\n")} />
        </label>
        <label>
          Tags
          <input name="tags" defaultValue={word.tags.join(", ")} />
        </label>
        <label>
          Academic Usage
          <textarea name="academicUsage" defaultValue={word.academicUsage} />
        </label>
        <label>
          Synonym Notes
          <textarea name="synonyms" defaultValue={word.synonyms} />
        </label>
        <label>
          Common Mistakes
          <textarea name="commonMistakes" defaultValue={word.commonMistakes} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
