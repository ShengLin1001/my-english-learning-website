import Link from "next/link";
import { readData } from "@/lib/store";
import { WordStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type WordsSearchParams = {
  imported?: string;
  skipped?: string;
  deleted?: string;
  q?: string;
  status?: WordStatus | "all";
  tag?: string;
};

const statuses: Array<WordStatus | "all"> = ["all", "new", "unfamiliar", "vague", "familiar", "mastered"];

export default async function WordsPage({ searchParams }: { searchParams?: Promise<WordsSearchParams> }) {
  const data = await readData();
  const params = searchParams ? await searchParams : {};
  const query = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "all";
  const tag = (params.tag ?? "").trim();
  const tags = Array.from(new Set(data.words.flatMap((word) => word.tags ?? []))).sort();

  const filteredWords = data.words.filter((word) => {
    const matchesQuery =
      !query ||
      word.text.toLowerCase().includes(query) ||
      word.meaningZh.toLowerCase().includes(query) ||
      word.definitionEn.toLowerCase().includes(query) ||
      word.tags.some((item) => item.toLowerCase().includes(query));
    const matchesStatus = status === "all" || word.status === status;
    const matchesTag = !tag || word.tags.includes(tag);
    return matchesQuery && matchesStatus && matchesTag;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Vocabulary Library</h1>
          <p>Manage imported words, personal notes, tags, and review status.</p>
          {params.imported ? (
            <p>
              Imported {params.imported} new words. Skipped {params.skipped ?? 0} duplicate or invalid rows.
            </p>
          ) : null}
          {params.deleted ? <p>Deleted the selected word and its review records.</p> : null}
        </div>
        <div className="row">
          <Link className="button secondary" href="/words/import">
            Import
          </Link>
          <Link className="button" href="/words/new">
            Add Word
          </Link>
        </div>
      </div>

      <form className="panel filters">
        <label>
          Search
          <input name="q" defaultValue={params.q ?? ""} placeholder="word, meaning, definition, or tag" />
        </label>
        <label>
          Status
          <select name="status" defaultValue={status}>
            {statuses.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tag
          <select name="tag" defaultValue={tag}>
            <option value="">all</option>
            {tags.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Apply</button>
        <Link className="button secondary" href="/words">
          Reset
        </Link>
      </form>

      {filteredWords.length ? (
        <section className="grid">
          {filteredWords.map((word) => (
            <Link className="item" href={`/words/${word.id}`} key={word.id}>
              <div className="row">
                <h2>{word.text}</h2>
                <span className="status">{word.status}</span>
              </div>
              <p>{word.meaningZh || word.definitionEn || "No meaning yet. Open the detail page to edit or generate learning notes."}</p>
              {word.tags.length ? (
                <div className="row">
                  {word.tags.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="muted">Next review: {new Date(word.nextReviewAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </section>
      ) : (
        <div className="empty">
          <h2>No words match this view</h2>
          <p>Add a word, import a word list, or reset the filters.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="button" href="/words/new">
              Add Word
            </Link>
            <Link className="button secondary" href="/words/import">
              Import
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
