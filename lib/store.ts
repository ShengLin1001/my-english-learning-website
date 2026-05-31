import { promises as fs } from "fs";
import path from "path";
import { AppData, DailySentence, GrammarExercise } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "app-data.json");

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const seedDailySentence: DailySentence = {
  id: "daily-seed-1",
  sentence: "The limits of my language mean the limits of my world.",
  translationZh: "我的语言边界意味着我的世界边界。",
  grammarNotes:
    "This sentence uses a simple subject-verb-object structure. The phrase 'the limits of...' is useful for academic writing when describing conceptual boundaries.",
  keywords: ["limits", "language", "world"],
  imitationPrompt: "The limits of my vocabulary mean the limits of my academic expression.",
  date: todayIso()
};

const seedGrammarExercise: GrammarExercise = {
  id: "grammar-seed-1",
  type: "rewrite",
  prompt: "Rewrite this sentence in a more academic style: We found that the material changed a lot.",
  answer: "We observed a substantial change in the material.",
  explanation:
    "'Observed' is more precise than 'found', and 'substantial change' is more academic than 'changed a lot'.",
  createdAt: new Date().toISOString()
};

const defaultData: AppData = {
  words: [],
  reviews: [],
  dailySentences: [seedDailySentence],
  writingPractices: [],
  grammarExercises: [seedGrammarExercise],
  listeningPractices: []
};

export async function readData(): Promise<AppData> {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    const parsed = JSON.parse(raw) as AppData;
    return migrateData(parsed);
  } catch (error) {
    await writeData(defaultData);
    return defaultData;
  }
}

export async function writeData(data: AppData) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeList(value: FormDataEntryValue | null) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function nextReviewDate(status: string) {
  const now = new Date();
  const daysByStatus: Record<string, number> = {
    unfamiliar: 0,
    vague: 1,
    familiar: 3,
    mastered: 7,
    new: 0
  };

  now.setDate(now.getDate() + (daysByStatus[status] ?? 1));
  return now.toISOString();
}

function migrateData(data: AppData): AppData {
  return {
    ...defaultData,
    ...data,
    words: (data.words ?? []).map((word) => ({
      ...word,
      tags: word.tags ?? [],
      examples: word.examples ?? [],
      collocations: word.collocations ?? [],
      nextReviewAt: word.nextReviewAt ?? new Date().toISOString()
    })),
    reviews: data.reviews ?? [],
    dailySentences: data.dailySentences?.length ? data.dailySentences : defaultData.dailySentences,
    writingPractices: data.writingPractices ?? [],
    grammarExercises: data.grammarExercises?.length ? data.grammarExercises : defaultData.grammarExercises,
    listeningPractices: data.listeningPractices ?? []
  };
}
