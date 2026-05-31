import { addGrammarExercise } from "@/lib/actions";
import { readData } from "@/lib/store";

export default async function GrammarPage() {
  const data = await readData();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Grammar Training</h1>
          <p>Generate short exercises from your current learning material, then check the answer and explanation immediately.</p>
        </div>
        <form action={addGrammarExercise}>
          <button type="submit">Generate Exercise</button>
        </form>
      </div>

      <section className="grid">
        {data.grammarExercises.map((exercise) => (
          <div className="panel" key={exercise.id}>
            <div className="row">
              <span className="status">{exercise.type}</span>
              <h2>Exercise</h2>
            </div>
            <p>{exercise.prompt}</p>
            <details>
              <summary>Show answer and feedback</summary>
              <p>
                <strong>Answer: </strong>
                {exercise.answer}
              </p>
              <p>{exercise.explanation}</p>
            </details>
          </div>
        ))}
      </section>
    </div>
  );
}
