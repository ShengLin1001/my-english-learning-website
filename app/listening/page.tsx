import { submitListeningPractice } from "@/lib/actions";
import { readData } from "@/lib/store";
import { ListeningControls } from "./listening-client";

export const dynamic = "force-dynamic";

export default async function ListeningPage() {
  const data = await readData();
  const sourceText =
    data.words[0]?.examples[0] ||
    data.dailySentences[0]?.sentence ||
    "The limits of my language mean the limits of my world.";
  const latest = data.listeningPractices[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Listening Training</h1>
          <p>Listen to learning material, write what you hear, and get immediate feedback focused on missed words and rhythm.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Training Text</h2>
        <p className="sentence">{sourceText}</p>
        <ListeningControls text={sourceText} />
      </section>

      <form className="panel form" action={submitListeningPractice} style={{ marginTop: 16 }}>
        <input type="hidden" name="sourceText" value={sourceText} />
        <label>
          What you heard
          <textarea name="userTranscript" required placeholder="After playing the audio, write the full sentence or the keywords you heard." />
        </label>
        <button type="submit">Submit Feedback</button>
      </form>

      {latest ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Latest Feedback</h2>
          <p>{latest.feedback}</p>
        </section>
      ) : null}
    </div>
  );
}
