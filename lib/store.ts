import { prisma } from "./prisma";
import {
  AppData,
  DailySentence,
  GrammarExercise,
  ListeningPractice,
  ReviewLog,
  Word,
  WritingPractice
} from "./types";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const seedDailySentence: DailySentence = {
  id: "daily-seed-1",
  sentence: "The limits of my language mean the limits of my world.",
  translationZh: "My language boundaries shape the boundaries of my world.",
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

export async function readData(): Promise<AppData> {
  await seedDatabase();

  const [words, reviews, dailySentences, writingPractices, grammarExercises, listeningPractices] = await Promise.all([
    prisma.word.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.reviewLog.findMany({ orderBy: { reviewedAt: "desc" } }),
    prisma.dailySentence.findMany({ orderBy: { date: "desc" } }),
    prisma.writingPractice.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.grammarExercise.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.listeningPractice.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return {
    words: words.map((word) => ({
      id: word.id,
      text: word.text,
      phonetic: word.phonetic,
      meaningZh: word.meaningZh,
      definitionEn: word.definitionEn,
      examples: parseJsonList(word.examples),
      collocations: parseJsonList(word.collocations),
      tags: parseJsonList(word.tags),
      academicUsage: word.academicUsage,
      synonyms: word.synonyms,
      commonMistakes: word.commonMistakes,
      source: word.source as Word["source"],
      status: word.status as Word["status"],
      familiarity: word.familiarity,
      nextReviewAt: word.nextReviewAt.toISOString(),
      createdAt: word.createdAt.toISOString(),
      updatedAt: word.updatedAt.toISOString()
    })),
    reviews: reviews.map((review) => ({
      id: review.id,
      wordId: review.wordId,
      rating: review.rating as ReviewLog["rating"],
      userAnswer: review.userAnswer,
      feedback: review.feedback,
      reviewedAt: review.reviewedAt.toISOString()
    })),
    dailySentences: dailySentences.map((sentence) => ({
      id: sentence.id,
      sentence: sentence.sentence,
      translationZh: sentence.translationZh,
      grammarNotes: sentence.grammarNotes,
      keywords: parseJsonList(sentence.keywords),
      imitationPrompt: sentence.imitationPrompt,
      date: sentence.date
    })),
    writingPractices: writingPractices.map((practice) => ({
      id: practice.id,
      inputText: practice.inputText,
      context: practice.context,
      polishedText: practice.polishedText,
      formalVersion: practice.formalVersion,
      conciseVersion: practice.conciseVersion,
      revisionNotes: practice.revisionNotes,
      patterns: parseJsonList(practice.patterns),
      createdAt: practice.createdAt.toISOString()
    })),
    grammarExercises: grammarExercises.map((exercise) => ({
      id: exercise.id,
      type: exercise.type as GrammarExercise["type"],
      prompt: exercise.prompt,
      answer: exercise.answer,
      explanation: exercise.explanation,
      createdAt: exercise.createdAt.toISOString()
    })),
    listeningPractices: listeningPractices.map((practice) => ({
      id: practice.id,
      sourceText: practice.sourceText,
      mode: practice.mode as ListeningPractice["mode"],
      userTranscript: practice.userTranscript,
      feedback: practice.feedback,
      createdAt: practice.createdAt.toISOString()
    }))
  };
}

export async function seedDatabase() {
  await prisma.dailySentence.upsert({
    where: { date: seedDailySentence.date },
    create: {
      ...seedDailySentence,
      keywords: stringifyList(seedDailySentence.keywords)
    },
    update: {}
  });

  await prisma.grammarExercise.upsert({
    where: { id: seedGrammarExercise.id },
    create: seedGrammarExercise,
    update: {}
  });
}

export async function createWord(word: Word) {
  await prisma.word.create({
    data: {
      ...word,
      examples: stringifyList(word.examples),
      collocations: stringifyList(word.collocations),
      tags: stringifyList(word.tags),
      nextReviewAt: new Date(word.nextReviewAt),
      createdAt: new Date(word.createdAt),
      updatedAt: new Date(word.updatedAt)
    }
  });
}

export async function createWords(words: Word[]) {
  if (!words.length) {
    return;
  }

  await prisma.word.createMany({
    data: words.map((word) => ({
      ...word,
      examples: stringifyList(word.examples),
      collocations: stringifyList(word.collocations),
      tags: stringifyList(word.tags),
      nextReviewAt: new Date(word.nextReviewAt),
      createdAt: new Date(word.createdAt),
      updatedAt: new Date(word.updatedAt)
    }))
  });
}

export async function updateStoredWord(word: Word) {
  await prisma.word.update({
    where: { id: word.id },
    data: {
      text: word.text,
      phonetic: word.phonetic,
      meaningZh: word.meaningZh,
      definitionEn: word.definitionEn,
      examples: stringifyList(word.examples),
      collocations: stringifyList(word.collocations),
      tags: stringifyList(word.tags),
      academicUsage: word.academicUsage,
      synonyms: word.synonyms,
      commonMistakes: word.commonMistakes,
      source: word.source,
      status: word.status,
      familiarity: word.familiarity,
      nextReviewAt: new Date(word.nextReviewAt),
      updatedAt: new Date(word.updatedAt)
    }
  });
}

export async function deleteStoredWord(wordId: string) {
  await prisma.word.delete({
    where: { id: wordId }
  });
}

export async function createReviewLog(review: ReviewLog) {
  await prisma.reviewLog.create({
    data: {
      ...review,
      reviewedAt: new Date(review.reviewedAt)
    }
  });
}

export async function createWritingPractice(practice: WritingPractice) {
  await prisma.writingPractice.create({
    data: {
      ...practice,
      patterns: stringifyList(practice.patterns),
      createdAt: new Date(practice.createdAt)
    }
  });
}

export async function createListeningPractice(practice: ListeningPractice) {
  await prisma.listeningPractice.create({
    data: {
      ...practice,
      createdAt: new Date(practice.createdAt)
    }
  });
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

export function stringifyList(values: string[]) {
  return JSON.stringify(values.filter(Boolean));
}

function parseJsonList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
