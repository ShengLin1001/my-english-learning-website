"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createId, nextReviewDate, normalizeList, readData, writeData } from "./store";
import { Word, WordStatus } from "./types";

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function addWord(formData: FormData) {
  const text = getString(formData, "text");
  if (!text) {
    redirect("/words/new?error=missing-word");
  }

  const now = new Date().toISOString();
  const data = await readData();

  const word: Word = {
    id: createId("word"),
    text,
    phonetic: getString(formData, "phonetic"),
    meaningZh: getString(formData, "meaningZh"),
    definitionEn: getString(formData, "definitionEn"),
    examples: normalizeList(formData.get("examples")),
    collocations: normalizeList(formData.get("collocations")),
    academicUsage: getString(formData, "academicUsage"),
    synonyms: "",
    commonMistakes: "",
    source: "manual",
    status: "new",
    familiarity: 0,
    nextReviewAt: now,
    createdAt: now,
    updatedAt: now
  };

  data.words.unshift(word);
  await writeData(data);
  revalidatePath("/words");
  redirect(`/words/${word.id}`);
}

export async function importWords(formData: FormData) {
  const raw = getString(formData, "content");
  const format = getString(formData, "format");
  const data = await readData();
  const existing = new Set(data.words.map((word) => word.text.toLowerCase()));
  const now = new Date().toISOString();
  const words: Word[] = [];

  if (format === "json") {
    const parsed = JSON.parse(raw) as Array<{ word?: string; text?: string; meaning?: string; meaningZh?: string; example?: string }>;
    for (const item of parsed) {
      const text = String(item.word ?? item.text ?? "").trim();
      if (!text || existing.has(text.toLowerCase())) continue;
      existing.add(text.toLowerCase());
      words.push(makeImportedWord(text, String(item.meaning ?? item.meaningZh ?? ""), item.example ? [String(item.example)] : [], now));
    }
  } else if (format === "csv") {
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    for (const [index, line] of lines.entries()) {
      if (index === 0 && line.toLowerCase().includes("word")) continue;
      const [text = "", meaning = "", example = ""] = line.split(",").map((item) => item.trim());
      if (!text || existing.has(text.toLowerCase())) continue;
      existing.add(text.toLowerCase());
      words.push(makeImportedWord(text, meaning, example ? [example] : [], now));
    }
  } else {
    for (const line of raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
      if (existing.has(line.toLowerCase())) continue;
      existing.add(line.toLowerCase());
      words.push(makeImportedWord(line, "", [], now));
    }
  }

  data.words.unshift(...words);
  await writeData(data);
  revalidatePath("/words");
  redirect(`/words?imported=${words.length}`);
}

function makeImportedWord(text: string, meaningZh: string, examples: string[], now: string): Word {
  return {
    id: createId("word"),
    text,
    phonetic: "",
    meaningZh,
    definitionEn: "",
    examples,
    collocations: [],
    academicUsage: "",
    synonyms: "",
    commonMistakes: "",
    source: "import",
    status: "new",
    familiarity: 0,
    nextReviewAt: now,
    createdAt: now,
    updatedAt: now
  };
}

export async function reviewWord(formData: FormData) {
  const wordId = getString(formData, "wordId");
  const rating = getString(formData, "rating") as WordStatus;
  const userAnswer = getString(formData, "userAnswer");
  const data = await readData();
  const word = data.words.find((item) => item.id === wordId);

  if (!word) {
    redirect("/review");
  }

  const now = new Date().toISOString();
  word.status = rating;
  word.familiarity = { unfamiliar: 0, vague: 1, familiar: 2, mastered: 3, new: 0 }[rating] ?? 0;
  word.nextReviewAt = nextReviewDate(rating);
  word.updatedAt = now;

  data.reviews.unshift({
    id: createId("review"),
    wordId,
    rating,
    userAnswer,
    feedback: buildReviewFeedback(word.text, rating),
    reviewedAt: now
  });

  await writeData(data);
  revalidatePath("/review");
  revalidatePath("/words");
  redirect("/review");
}

function buildReviewFeedback(word: string, rating: WordStatus) {
  if (rating === "mastered") return `${word} can move to a longer review interval.`;
  if (rating === "familiar") return `${word} is becoming stable. Review it again in context.`;
  if (rating === "vague") return `Use ${word} in one original sentence before the next review.`;
  return `Return to ${word} soon with examples and collocations.`;
}

export async function enrichWord(formData: FormData) {
  const wordId = getString(formData, "wordId");
  const data = await readData();
  const word = data.words.find((item) => item.id === wordId);

  if (!word) {
    redirect("/words");
  }

  word.definitionEn ||= `${word.text} is a word to learn through context, examples, and repeated use.`;
  word.meaningZh ||= "请根据上下文补充中文释义。";
  word.examples = word.examples.length
    ? word.examples
    : [
        `Researchers use ${word.text} to express a precise idea in context.`,
        `A good learner studies ${word.text} through examples rather than isolated translation.`
      ];
  word.collocations = word.collocations.length ? word.collocations : [`${word.text} in context`, `use ${word.text} precisely`];
  word.academicUsage ||= `In academic writing, focus on whether "${word.text}" is precise, necessary, and supported by the sentence context.`;
  word.synonyms ||= "Add synonym distinctions after real examples are collected.";
  word.commonMistakes ||= "Avoid translating the word mechanically without checking sentence context.";
  word.updatedAt = new Date().toISOString();

  await writeData(data);
  revalidatePath(`/words/${word.id}`);
  redirect(`/words/${word.id}`);
}

export async function addWritingPractice(formData: FormData) {
  const inputText = getString(formData, "inputText");
  const context = getString(formData, "context");
  const data = await readData();

  data.writingPractices.unshift({
    id: createId("writing"),
    inputText,
    context,
    polishedText: inputText ? `A more precise academic version: ${inputText}` : "",
    formalVersion: inputText ? `It is demonstrated that ${inputText.charAt(0).toLowerCase()}${inputText.slice(1)}` : "",
    conciseVersion: inputText,
    revisionNotes:
      "This first version stores the practice record and provides a placeholder response. Connect the AI route later for richer feedback.",
    patterns: ["It is demonstrated that...", "These results indicate that...", "This observation suggests that..."],
    createdAt: new Date().toISOString()
  });

  await writeData(data);
  revalidatePath("/writing");
  redirect("/writing");
}

export async function submitListeningPractice(formData: FormData) {
  const sourceText = getString(formData, "sourceText");
  const userTranscript = getString(formData, "userTranscript");
  const data = await readData();
  const sourceWords = sourceText.toLowerCase().split(/\W+/).filter(Boolean);
  const userWords = new Set(userTranscript.toLowerCase().split(/\W+/).filter(Boolean));
  const missed = sourceWords.filter((word) => !userWords.has(word));

  data.listeningPractices.unshift({
    id: createId("listening"),
    sourceText,
    mode: "sentence",
    userTranscript,
    feedback: missed.length ? `Missing keywords: ${Array.from(new Set(missed)).slice(0, 8).join(", ")}` : "Strong match. Repeat once at normal speed.",
    createdAt: new Date().toISOString()
  });

  await writeData(data);
  revalidatePath("/listening");
  redirect("/listening");
}
