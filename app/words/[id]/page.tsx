import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteWord, enrichWord } from "@/lib/actions";
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
          <p>
            {word.phonetic || "No phonetic note"} · <span className="status">{word.status}</span>
          </p>
          {word.tags.length ? (
            <div className="row">
              {word.tags.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="row">
          <Link className="button secondary" href={`/words/${word.id}/edit`}>
            Edit
          </Link>
          <form action={enrichWord}>
            <input type="hidden" name="wordId" value={word.id} />
            <button type="submit">Generate Notes</button>
          </form>
        </div>
      </div>

      <section className="grid grid-2">
        <div className="panel">
          <h2>Meaning</h2>
          <p>{word.meaningZh || "No Chinese meaning yet."}</p>
          <p>{word.definitionEn || "No English definition yet."}</p>
        </div>
        <div className="panel">
          <h2>Academic Usage</h2>
          <p>{word.academicUsage || "No academic usage note yet."}</p>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>Examples</h2>
          {word.examples.length ? word.examples.map((example) => <p key={example}>{example}</p>) : <p>No examples yet.</p>}
        </div>
        <div className="panel">
          <h2>Collocations</h2>
          {word.collocations.length ? word.collocations.map((item) => <p key={item}>{item}</p>) : <p>No collocations yet.</p>}
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>Synonym Notes</h2>
          <p>{word.synonyms || "Add synonym distinctions after examples are collected."}</p>
        </div>
        <div className="panel">
          <h2>Common Mistakes</h2>
          <p>{word.commonMistakes || "Add common mistakes after review or AI enrichment."}</p>
        </div>
      </section>

      <div className="row" style={{ marginTop: 16 }}>
        <Link className="button secondary" href="/words">
          Back to Library
        </Link>
        <Link className="button" href="/review">
          Review
        </Link>
        <form action={deleteWord}>
          <input type="hidden" name="wordId" value={word.id} />
          <button className="danger" type="submit">
            Delete Word
          </button>
        </form>
      </div>
    </div>
  );
}
