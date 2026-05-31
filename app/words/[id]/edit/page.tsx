import Link from "next/link";
import { notFound } from "next/navigation";
import { updateWord } from "@/lib/actions";
import { readData } from "@/lib/store";

export default async function EditWordPage({ params }: { params: Promise<{ id: string }> }) {
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
          <h1>Edit Word</h1>
          <p>Update meanings, examples, tags, and learning notes for this word.</p>
        </div>
        <Link className="button secondary" href={`/words/${word.id}`}>
          Cancel
        </Link>
      </div>

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
