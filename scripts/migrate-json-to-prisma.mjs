import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const jsonPath = join(process.cwd(), "data", "app-data.json");

function asJsonList(value) {
  return JSON.stringify(Array.isArray(value) ? value.filter(Boolean).map(String) : []);
}

function asDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function main() {
  if (!existsSync(jsonPath)) {
    console.log("No data/app-data.json file found. Nothing to migrate.");
    return;
  }

  const data = JSON.parse(readFileSync(jsonPath, "utf-8"));

  for (const word of data.words ?? []) {
    await prisma.word.upsert({
      where: { id: word.id },
      create: {
        id: word.id,
        text: word.text,
        phonetic: word.phonetic ?? "",
        meaningZh: word.meaningZh ?? "",
        definitionEn: word.definitionEn ?? "",
        examples: asJsonList(word.examples),
        collocations: asJsonList(word.collocations),
        tags: asJsonList(word.tags),
        academicUsage: word.academicUsage ?? "",
        synonyms: word.synonyms ?? "",
        commonMistakes: word.commonMistakes ?? "",
        source: word.source ?? "import",
        status: word.status ?? "new",
        familiarity: word.familiarity ?? 0,
        nextReviewAt: asDate(word.nextReviewAt),
        createdAt: asDate(word.createdAt),
        updatedAt: asDate(word.updatedAt)
      },
      update: {}
    });
  }

  for (const review of data.reviews ?? []) {
    await prisma.reviewLog.upsert({
      where: { id: review.id },
      create: {
        id: review.id,
        wordId: review.wordId,
        rating: review.rating ?? "new",
        userAnswer: review.userAnswer ?? "",
        feedback: review.feedback ?? "",
        reviewedAt: asDate(review.reviewedAt)
      },
      update: {}
    });
  }

  for (const sentence of data.dailySentences ?? []) {
    await prisma.dailySentence.upsert({
      where: { id: sentence.id },
      create: {
        id: sentence.id,
        sentence: sentence.sentence,
        translationZh: sentence.translationZh ?? "",
        grammarNotes: sentence.grammarNotes ?? "",
        keywords: asJsonList(sentence.keywords),
        imitationPrompt: sentence.imitationPrompt ?? "",
        date: sentence.date
      },
      update: {}
    });
  }

  for (const practice of data.writingPractices ?? []) {
    await prisma.writingPractice.upsert({
      where: { id: practice.id },
      create: {
        id: practice.id,
        inputText: practice.inputText,
        context: practice.context ?? "Results",
        polishedText: practice.polishedText ?? "",
        formalVersion: practice.formalVersion ?? "",
        conciseVersion: practice.conciseVersion ?? "",
        revisionNotes: practice.revisionNotes ?? "",
        patterns: asJsonList(practice.patterns),
        createdAt: asDate(practice.createdAt)
      },
      update: {}
    });
  }

  for (const exercise of data.grammarExercises ?? []) {
    await prisma.grammarExercise.upsert({
      where: { id: exercise.id },
      create: {
        id: exercise.id,
        type: exercise.type,
        prompt: exercise.prompt,
        answer: exercise.answer,
        explanation: exercise.explanation ?? "",
        createdAt: asDate(exercise.createdAt)
      },
      update: {}
    });
  }

  for (const practice of data.listeningPractices ?? []) {
    await prisma.listeningPractice.upsert({
      where: { id: practice.id },
      create: {
        id: practice.id,
        sourceText: practice.sourceText,
        mode: practice.mode ?? "sentence",
        userTranscript: practice.userTranscript ?? "",
        feedback: practice.feedback ?? "",
        createdAt: asDate(practice.createdAt)
      },
      update: {}
    });
  }

  console.log("Migrated JSON learning data into Prisma SQLite.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
