import Link from "next/link";
import { saveDailyExpression } from "@/lib/actions";
import { readData } from "@/lib/store";

export default async function DailyPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await readData();
  const daily = data.dailySentences[0];
  const params = searchParams ? await searchParams : {};
  const savedId = getParam(params.saved);
  const duplicateId = getParam(params.duplicate);
  const hasMissingExpression = getParam(params.error) === "missing-expression";
  const savedWord = savedId ? data.words.find((word) => word.id === savedId) : undefined;
  const duplicateWord = duplicateId ? data.words.find((word) => word.id === duplicateId) : undefined;
  const existingWords = new Map(data.words.map((word) => [word.text.toLowerCase(), word]));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Daily Sentence</h1>
          <p>Turn one high-quality sentence into vocabulary, grammar awareness, and reusable writing patterns.</p>
        </div>
        <Link className="button secondary" href="/words?tag=daily-sentence">
          Daily Library
        </Link>
      </div>

      {savedWord ? (
        <div className="panel notice-panel">
          <strong>Saved to vocabulary:</strong> <Link href={`/words/${savedWord.id}`}>{savedWord.text}</Link>
        </div>
      ) : null}

      {duplicateWord ? (
        <div className="panel notice-panel">
          <strong>Already in vocabulary:</strong> <Link href={`/words/${duplicateWord.id}`}>{duplicateWord.text}</Link>
        </div>
      ) : null}

      {hasMissingExpression ? (
        <div className="panel notice-panel">
          <strong>Expression is required.</strong> Add a keyword or phrase before saving.
        </div>
      ) : null}

      <section className="panel">
        <p className="sentence">{daily.sentence}</p>
        <p>{daily.translationZh}</p>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>语法拆解</h2>
          <p>{daily.grammarNotes}</p>
        </div>
        <div className="panel">
          <h2>Key Words</h2>
          <div className="daily-keyword-list">
            {daily.keywords.map((keyword) => (
              <DailyExpressionForm
                existingWordId={existingWords.get(keyword.toLowerCase())?.id}
                key={keyword}
                sentence={daily.sentence}
                text={keyword}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h2>Imitation Prompt</h2>
          <p>{daily.imitationPrompt}</p>
        </div>
        <form className="panel form" action={saveDailyExpression}>
          <input type="hidden" name="sentence" value={daily.sentence} />
          <div>
            <h2>Save a Useful Expression</h2>
            <p>Capture a phrase, structure, or academic expression from today's sentence.</p>
          </div>
          <label>
            Expression
            <input name="text" placeholder="the limits of..." />
          </label>
          <button type="submit">Save Expression</button>
        </form>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>How This Becomes Review Material</h2>
        <p>Saved expressions enter the review queue immediately and keep today's sentence as their first example.</p>
      </section>
    </div>
  );
}

function DailyExpressionForm({
  existingWordId,
  sentence,
  text
}: {
  existingWordId?: string;
  sentence: string;
  text: string;
}) {
  if (existingWordId) {
    return (
      <Link className="daily-chip saved" href={`/words/${existingWordId}`}>
        {text}
        <span>Saved</span>
      </Link>
    );
  }

  return (
    <form action={saveDailyExpression}>
      <input type="hidden" name="text" value={text} />
      <input type="hidden" name="sentence" value={sentence} />
      <button className="daily-chip" type="submit">
        {text}
        <span>Save</span>
      </button>
    </form>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
