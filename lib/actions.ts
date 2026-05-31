"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateGrammarExercise, generateListeningFeedback, generateWordLearningContent, generateWritingFeedback } from "./ai";
import {
  createId,
  createListeningPractice,
  createGrammarExercise,
  createReviewLog,
  createWord,
  createWords,
  createWritingPractice,
  deleteStoredWord,
  nextReviewDate,
  normalizeList,
  readData,
  updateStoredWord
} from "./store";
import { GrammarExercise, ListeningPractice, ReviewLog, Word, WordStatus, WritingPractice } from "./types";

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function addWord(formData: FormData) {
  const text = getString(formData, "text");
  if (!text) {
    redirect("/words/new?error=missing-word");
  }

  const now = new Date().toISOString();

  const word: Word = {
    id: createId("word"),
    text,
    phonetic: getString(formData, "phonetic"),
    meaningZh: getString(formData, "meaningZh"),
    definitionEn: getString(formData, "definitionEn"),
    examples: normalizeList(formData.get("examples")),
    collocations: normalizeList(formData.get("collocations")),
    tags: normalizeTags(getString(formData, "tags")),
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

  await createWord(word);
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

  try {
    if (format === "json") {
      const parsed = JSON.parse(raw) as Array<{ word?: string; text?: string; meaning?: string; meaningZh?: string; example?: string; tags?: string[] | string }>;
      if (!Array.isArray(parsed)) {
        throw new Error("json-not-array");
      }
      for (const item of parsed) {
        const text = String(item.word ?? item.text ?? "").trim();
        if (!text || existing.has(text.toLowerCase())) continue;
        existing.add(text.toLowerCase());
        words.push(
          makeImportedWord(
            text,
            String(item.meaning ?? item.meaningZh ?? ""),
            item.example ? [String(item.example)] : [],
            normalizeTags(Array.isArray(item.tags) ? item.tags.join(",") : String(item.tags ?? "")),
            now
          )
        );
      }
    } else if (format === "csv") {
      const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      for (const [index, line] of lines.entries()) {
        if (index === 0 && line.toLowerCase().includes("word")) continue;
        const [text = "", meaning = "", example = "", tags = ""] = parseCsvLine(line);
        if (!text || existing.has(text.toLowerCase())) continue;
        existing.add(text.toLowerCase());
        words.push(makeImportedWord(text, meaning, example ? [example] : [], normalizeTags(tags), now));
      }
    } else {
      for (const line of raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
        const [text, tagText = ""] = line.split("#").map((item) => item.trim());
        if (!text || existing.has(text.toLowerCase())) continue;
        existing.add(text.toLowerCase());
        words.push(makeImportedWord(text, "", [], normalizeTags(tagText), now));
      }
    }
  } catch (error) {
    redirect("/words/import?error=invalid-format");
  }

  await createWords(words);
  revalidatePath("/words");
  redirect(`/words?imported=${words.length}&skipped=${Math.max(0, raw.split(/\r?\n/).filter(Boolean).length - words.length)}`);
}

function makeImportedWord(text: string, meaningZh: string, examples: string[], tags: string[], now: string): Word {
  return {
    id: createId("word"),
    text,
    phonetic: "",
    meaningZh,
    definitionEn: "",
    examples,
    collocations: [],
    tags,
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

export async function updateWord(formData: FormData) {
  const wordId = getString(formData, "wordId");
  const data = await readData();
  const word = data.words.find((item) => item.id === wordId);

  if (!word) {
    redirect("/words");
  }

  word.text = getString(formData, "text") || word.text;
  word.phonetic = getString(formData, "phonetic");
  word.meaningZh = getString(formData, "meaningZh");
  word.definitionEn = getString(formData, "definitionEn");
  word.examples = normalizeList(formData.get("examples"));
  word.collocations = normalizeList(formData.get("collocations"));
  word.tags = normalizeTags(getString(formData, "tags"));
  word.academicUsage = getString(formData, "academicUsage");
  word.synonyms = getString(formData, "synonyms");
  word.commonMistakes = getString(formData, "commonMistakes");
  word.updatedAt = new Date().toISOString();

  await updateStoredWord(word);
  revalidatePath("/words");
  revalidatePath(`/words/${word.id}`);
  redirect(`/words/${word.id}`);
}

export async function deleteWord(formData: FormData) {
  const wordId = getString(formData, "wordId");
  await deleteStoredWord(wordId);
  revalidatePath("/words");
  revalidatePath("/review");
  redirect("/words?deleted=1");
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

  const review: ReviewLog = {
    id: createId("review"),
    wordId,
    rating,
    userAnswer,
    feedback: buildReviewFeedback(word.text, rating),
    reviewedAt: now
  };

  await updateStoredWord(word);
  await createReviewLog(review);
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

export async function addGrammarExercise() {
  const data = await readData();
  const sourceText =
    data.words[0]?.examples[0] ||
    data.dailySentences[0]?.sentence ||
    "The results indicate that the proposed method improves performance.";
  const draft = await generateGrammarExercise(sourceText);

  const exercise: GrammarExercise = {
    id: createId("grammar"),
    type: draft.type,
    prompt: draft.prompt,
    answer: draft.answer,
    explanation: draft.explanation,
    createdAt: new Date().toISOString()
  };

  await createGrammarExercise(exercise);
  revalidatePath("/grammar");
  redirect("/grammar");
}

export async function enrichWord(formData: FormData) {
  const wordId = getString(formData, "wordId");
  const data = await readData();
  const word = data.words.find((item) => item.id === wordId);

  if (!word) {
    redirect("/words");
  }

  const content = await generateWordLearningContent(word);
  word.definitionEn = content.definitionEn;
  word.meaningZh = content.meaningZh;
  word.examples = content.examples;
  word.collocations = content.collocations;
  word.academicUsage = content.academicUsage;
  word.synonyms = content.synonyms;
  word.commonMistakes = content.commonMistakes;
  word.updatedAt = new Date().toISOString();

  await updateStoredWord(word);
  revalidatePath(`/words/${word.id}`);
  redirect(`/words/${word.id}`);
}

export async function addWritingPractice(formData: FormData) {
  const inputText = getString(formData, "inputText");
  const context = getString(formData, "context");
  const feedback = await generateWritingFeedback(inputText, context);

  const practice: WritingPractice = {
    id: createId("writing"),
    inputText,
    context,
    polishedText: feedback.polishedText,
    formalVersion: feedback.formalVersion,
    conciseVersion: feedback.conciseVersion,
    revisionNotes: feedback.revisionNotes,
    patterns: feedback.patterns,
    createdAt: new Date().toISOString()
  };

  await createWritingPractice(practice);
  revalidatePath("/writing");
  redirect("/writing");
}

export async function submitListeningPractice(formData: FormData) {
  const sourceText = getString(formData, "sourceText");
  const userTranscript = getString(formData, "userTranscript");
  const aiFeedback = await generateListeningFeedback(sourceText, userTranscript);

  const practice: ListeningPractice = {
    id: createId("listening"),
    sourceText,
    mode: "sentence",
    userTranscript,
    feedback: aiFeedback.feedback,
    createdAt: new Date().toISOString()
  };

  await createListeningPractice(practice);
  revalidatePath("/listening");
  redirect("/listening");
}
