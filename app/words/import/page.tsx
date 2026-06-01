import { readData } from "@/lib/store";
import { ImportPreview } from "./import-preview";

export const dynamic = "force-dynamic";

export default async function ImportWordsPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const data = await readData();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Import Dictionary</h1>
          <p>Preview words before saving them. Duplicate and invalid rows are skipped automatically.</p>
          {params.error ? <p>Import failed. Check the selected format and input structure.</p> : null}
        </div>
      </div>

      <ImportPreview existingWords={data.words.map((word) => word.text)} />
    </div>
  );
}
