"use client";

import { useMemo, useState } from "react";
import { importWords } from "@/lib/actions";

type PreviewRow = {
  text: string;
  meaning: string;
  example: string;
  tags: string[];
  status: "new" | "duplicate" | "invalid";
  reason: string;
};

export function ImportPreview({ existingWords }: { existingWords: string[] }) {
  const [format, setFormat] = useState("txt");
  const [content, setContent] = useState("");
  const existing = useMemo(() => new Set(existingWords.map((word) => word.toLowerCase())), [existingWords]);
  const preview = useMemo(() => parsePreview(format, content, existing), [format, content, existing]);
  const newRows = preview.filter((row) => row.status === "new");
  const duplicateRows = preview.filter((row) => row.status === "duplicate");
  const invalidRows = preview.filter((row) => row.status === "invalid");

  return (
    <div className="grid grid-2">
      <form className="panel form" action={importWords}>
        <label>
          Format
          <select name="format" value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="txt">TXT: one word per line, optional "# tag"</option>
            <option value="csv">CSV: word,meaning,example,tags</option>
            <option value="json">JSON: array of word objects</option>
          </select>
        </label>
        <label>
          Dictionary Content
          <textarea
            name="content"
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              "TXT:\nanalyze # academic\nsubstantial # writing\n\nCSV:\nword,meaning,example,tags\nanalyze,analysis,We analyze the results.,academic\n\nJSON:\n[{\"word\":\"analyze\",\"meaning\":\"analysis\",\"example\":\"We analyze the results.\",\"tags\":[\"academic\"]}]"
            }
            style={{ minHeight: 320 }}
          />
        </label>
        <button type="submit" disabled={!newRows.length}>
          Confirm Import {newRows.length ? `(${newRows.length})` : ""}
        </button>
      </form>

      <section className="panel">
        <h2>Import Preview</h2>
        <div className="summary-grid">
          <div>
            <strong>{newRows.length}</strong>
            <span>new</span>
          </div>
          <div>
            <strong>{duplicateRows.length}</strong>
            <span>duplicates</span>
          </div>
          <div>
            <strong>{invalidRows.length}</strong>
            <span>invalid</span>
          </div>
        </div>

        {preview.length ? (
          <div className="preview-list">
            {preview.slice(0, 20).map((row, index) => (
              <div className="preview-row" key={`${row.text}-${index}`}>
                <div>
                  <strong>{row.text || "Empty row"}</strong>
                  <p>{row.meaning || row.reason}</p>
                  {row.tags.length ? (
                    <div className="row">
                      {row.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <span className={row.status === "new" ? "status" : "tag"}>{row.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Paste content on the left to preview what will be imported.</p>
        )}

        {preview.length > 20 ? <p>Showing the first 20 rows only. All valid new rows will be imported.</p> : null}
      </section>
    </div>
  );
}

function parsePreview(format: string, raw: string, existing: Set<string>): PreviewRow[] {
  const seen = new Set<string>();

  try {
    if (format === "json") {
      const parsed = JSON.parse(raw || "[]") as Array<{ word?: string; text?: string; meaning?: string; meaningZh?: string; example?: string; tags?: string[] | string }>;
      if (!Array.isArray(parsed)) {
        return [{ text: "", meaning: "", example: "", tags: [], status: "invalid", reason: "JSON must be an array." }];
      }

      return parsed.map((item) =>
        classifyRow(
          {
            text: String(item.word ?? item.text ?? "").trim(),
            meaning: String(item.meaning ?? item.meaningZh ?? "").trim(),
            example: String(item.example ?? "").trim(),
            tags: normalizeTags(Array.isArray(item.tags) ? item.tags.join(",") : String(item.tags ?? ""))
          },
          existing,
          seen
        )
      );
    }

    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    if (format === "csv") {
      return lines
        .filter((line, index) => !(index === 0 && line.toLowerCase().includes("word")))
        .map((line) => {
          const [text = "", meaning = "", example = "", tags = ""] = parseCsvLine(line);
          return classifyRow({ text, meaning, example, tags: normalizeTags(tags) }, existing, seen);
        });
    }

    return lines.map((line) => {
      const [text = "", tagText = ""] = line.split("#").map((item) => item.trim());
      return classifyRow({ text, meaning: "", example: "", tags: normalizeTags(tagText) }, existing, seen);
    });
  } catch {
    return [{ text: "", meaning: "", example: "", tags: [], status: "invalid", reason: "Could not parse this content." }];
  }
}

function classifyRow(
  row: Pick<PreviewRow, "text" | "meaning" | "example" | "tags">,
  existing: Set<string>,
  seen: Set<string>
): PreviewRow {
  const key = row.text.toLowerCase();

  if (!row.text) {
    return { ...row, status: "invalid", reason: "Missing word text." };
  }

  if (existing.has(key) || seen.has(key)) {
    return { ...row, status: "duplicate", reason: "Already exists in this library or import batch." };
  }

  seen.add(key);
  return { ...row, status: "new", reason: "Ready to import." };
}

function normalizeTags(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}
