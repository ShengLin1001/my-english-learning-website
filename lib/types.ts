export type WordStatus = "new" | "unfamiliar" | "vague" | "familiar" | "mastered";

export type Word = {
  id: string;
  text: string;
  phonetic: string;
  meaningZh: string;
  definitionEn: string;
  examples: string[];
  collocations: string[];
  academicUsage: string;
  synonyms: string;
  commonMistakes: string;
  source: "manual" | "import" | "ai-seed";
  status: WordStatus;
  familiarity: number;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewLog = {
  id: string;
  wordId: string;
  rating: WordStatus;
  userAnswer: string;
  feedback: string;
  reviewedAt: string;
};

export type DailySentence = {
  id: string;
  sentence: string;
  translationZh: string;
  grammarNotes: string;
  keywords: string[];
  imitationPrompt: string;
  date: string;
};

export type WritingPractice = {
  id: string;
  inputText: string;
  context: string;
  polishedText: string;
  formalVersion: string;
  conciseVersion: string;
  revisionNotes: string;
  patterns: string[];
  createdAt: string;
};

export type GrammarExercise = {
  id: string;
  type: "fill" | "correction" | "rewrite" | "naturalness";
  prompt: string;
  answer: string;
  explanation: string;
  createdAt: string;
};

export type ListeningPractice = {
  id: string;
  sourceText: string;
  mode: "word" | "sentence" | "academic";
  userTranscript: string;
  feedback: string;
  createdAt: string;
};

export type AppData = {
  words: Word[];
  reviews: ReviewLog[];
  dailySentences: DailySentence[];
  writingPractices: WritingPractice[];
  grammarExercises: GrammarExercise[];
  listeningPractices: ListeningPractice[];
};
