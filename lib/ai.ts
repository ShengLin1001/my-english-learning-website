import { GrammarExercise, SourceStatus, Word, WritingDiagnostic } from "./types";

type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
};

export type WordLearningContent = {
  meaningZh: string;
  definitionEn: string;
  examples: string[];
  collocations: string[];
  academicUsage: string;
  synonyms: string;
  commonMistakes: string;
};

export type WritingFeedback = {
  polishedText: string;
  formalVersion: string;
  conciseVersion: string;
  revisionNotes: string;
  patterns: string[];
  diagnostics: WritingDiagnostic[];
  learningWords: WordLearningDraft[];
  grammarExercises: GrammarExerciseDraft[];
};

export type WordLearningDraft = WordLearningContent & {
  text: string;
};

export type AiResult<T> = {
  data: T;
  sourceStatus: SourceStatus;
};

export type ListeningFeedback = {
  feedback: string;
};

export type GrammarExerciseDraft = {
  type: GrammarExercise["type"];
  prompt: string;
  answer: string;
  explanation: string;
};

const wordSchema: JsonSchema = {
  name: "word_learning_content",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["meaningZh", "definitionEn", "examples", "collocations", "academicUsage", "synonyms", "commonMistakes"],
    properties: {
      meaningZh: { type: "string" },
      definitionEn: { type: "string" },
      examples: {
        type: "array",
        minItems: 2,
        maxItems: 4,
        items: { type: "string" }
      },
      collocations: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: { type: "string" }
      },
      academicUsage: { type: "string" },
      synonyms: { type: "string" },
      commonMistakes: { type: "string" }
    }
  }
};

const writingSchema: JsonSchema = {
  name: "academic_writing_feedback",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "polishedText",
      "formalVersion",
      "conciseVersion",
      "revisionNotes",
      "patterns",
      "diagnostics",
      "learningWords",
      "grammarExercises"
    ],
    properties: {
      polishedText: { type: "string" },
      formalVersion: { type: "string" },
      conciseVersion: { type: "string" },
      revisionNotes: { type: "string" },
      patterns: {
        type: "array",
        minItems: 2,
        maxItems: 5,
        items: { type: "string" }
      },
      diagnostics: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["category", "original", "replacement", "reason"],
          properties: {
            category: { type: "string", enum: ["clarity", "grammar", "precision", "concision"] },
            original: { type: "string" },
            replacement: { type: "string" },
            reason: { type: "string" }
          }
        }
      },
      learningWords: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "text",
            "meaningZh",
            "definitionEn",
            "examples",
            "collocations",
            "academicUsage",
            "synonyms",
            "commonMistakes"
          ],
          properties: {
            text: { type: "string" },
            meaningZh: { type: "string" },
            definitionEn: { type: "string" },
            examples: { type: "array", minItems: 1, maxItems: 2, items: { type: "string" } },
            collocations: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } },
            academicUsage: { type: "string" },
            synonyms: { type: "string" },
            commonMistakes: { type: "string" }
          }
        }
      },
      grammarExercises: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["type", "prompt", "answer", "explanation"],
          properties: {
            type: { type: "string", enum: ["fill", "correction", "rewrite", "naturalness"] },
            prompt: { type: "string" },
            answer: { type: "string" },
            explanation: { type: "string" }
          }
        }
      }
    }
  }
};

const grammarSchema: JsonSchema = {
  name: "grammar_exercise",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["type", "prompt", "answer", "explanation"],
    properties: {
      type: { type: "string", enum: ["fill", "correction", "rewrite", "naturalness"] },
      prompt: { type: "string" },
      answer: { type: "string" },
      explanation: { type: "string" }
    }
  }
};

const listeningSchema: JsonSchema = {
  name: "listening_feedback",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["feedback"],
    properties: {
      feedback: { type: "string" }
    }
  }
};

export async function generateWordLearningContent(word: Word): Promise<WordLearningContent> {
  const fallback = fallbackWordContent(word);

  return callResponsesJson<WordLearningContent>({
    schema: wordSchema,
    fallback,
    instructions:
      "You are an English learning tutor for a Chinese researcher. Return concise, accurate learning content. Focus on context, collocations, academic usage, and common mistakes.",
    input: [
      `Word: ${word.text}`,
      `Existing Chinese meaning: ${word.meaningZh || "none"}`,
      `Existing English definition: ${word.definitionEn || "none"}`,
      `Existing examples: ${word.examples.join(" | ") || "none"}`,
      "Write Chinese explanations where useful, but examples and collocations must be in English."
    ].join("\n")
  });
}

export async function generateWritingFeedback(inputText: string, context: string): Promise<AiResult<WritingFeedback>> {
  const fallback = fallbackWritingFeedback(inputText);

  return callResponsesJsonResult<WritingFeedback>({
    schema: writingSchema,
    fallback,
    validate: isWritingFeedback,
    instructions:
      "You are an academic English writing coach for scientific papers. Improve clarity, precision, concision, grammar, and formal style. Diagnose exact edits, extract 3-5 reusable words or phrases, and create exactly 2 short grammar exercises based on the learner's own text. Chinese explanations should be concise; examples remain English.",
    input: [`Writing context: ${context}`, `Original text: ${inputText}`].join("\n")
  });
}

export async function generateGrammarExercise(sourceText: string): Promise<GrammarExerciseDraft> {
  const fallback = fallbackGrammarExercise(sourceText);

  return callResponsesJson<GrammarExerciseDraft>({
    schema: grammarSchema,
    fallback,
    instructions:
      "You are an English grammar coach. Create one short, useful exercise with immediate feedback. Prefer academic English examples when possible.",
    input: `Create one grammar exercise based on this learning material:\n${sourceText}`
  });
}

export async function generateListeningFeedback(sourceText: string, userTranscript: string): Promise<ListeningFeedback> {
  const fallback = fallbackListeningFeedback(sourceText, userTranscript);

  return callResponsesJson<ListeningFeedback>({
    schema: listeningSchema,
    fallback,
    instructions:
      "You are an English listening coach. Compare the learner transcript with the source text. Give concise, learning-oriented feedback, not exam scoring.",
    input: [`Source text: ${sourceText}`, `Learner transcript: ${userTranscript}`].join("\n")
  });
}

async function callResponsesJson<T>({
  schema,
  fallback,
  instructions,
  input
}: {
  schema: JsonSchema;
  fallback: T;
  instructions: string;
  input: string;
}): Promise<T> {
  return (await callResponsesJsonResult({ schema, fallback, instructions, input })).data;
}

async function callResponsesJsonResult<T>({
  schema,
  fallback,
  instructions,
  input,
  validate
}: {
  schema: JsonSchema;
  fallback: T;
  instructions: string;
  input: string;
  validate?: (value: unknown) => value is T;
}): Promise<AiResult<T>> {
  const provider = process.env.AI_PROVIDER || (process.env.DEEPSEEK_API_KEY ? "deepseek" : "openai");

  if (provider === "deepseek") {
    return callDeepSeekJson({ schema, fallback, instructions, input, validate });
  }

  return callOpenAIResponsesJson({ schema, fallback, instructions, input, validate });
}

async function callOpenAIResponsesJson<T>({
  schema,
  fallback,
  instructions,
  input,
  validate
}: {
  schema: JsonSchema;
  fallback: T;
  instructions: string;
  input: string;
  validate?: (value: unknown) => value is T;
}): Promise<AiResult<T>> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { data: fallback, sourceStatus: "fallback" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.2",
        input: [
          {
            role: "system",
            content: instructions
          },
          {
            role: "user",
            content: input
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: schema.name,
            schema: schema.schema,
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      return { data: fallback, sourceStatus: "fallback" };
    }

    const payload = (await response.json()) as { output_text?: string };
    if (!payload.output_text) {
      return { data: fallback, sourceStatus: "fallback" };
    }

    const parsed: unknown = JSON.parse(payload.output_text);
    return validate && !validate(parsed)
      ? { data: fallback, sourceStatus: "fallback" }
      : { data: parsed as T, sourceStatus: "ai" };
  } catch {
    return { data: fallback, sourceStatus: "fallback" };
  }
}

async function callDeepSeekJson<T>({
  schema,
  fallback,
  instructions,
  input,
  validate
}: {
  schema: JsonSchema;
  fallback: T;
  instructions: string;
  input: string;
  validate?: (value: unknown) => value is T;
}): Promise<AiResult<T>> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return { data: fallback, sourceStatus: "fallback" };
  }

  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: [
              instructions,
              "Return valid JSON only. Do not include Markdown fences or explanatory text.",
              `The JSON object must match this JSON Schema: ${JSON.stringify(schema.schema)}`
            ].join("\n")
          },
          {
            role: "user",
            content: `${input}\n\nReturn the answer as JSON.`
          }
        ],
        response_format: { type: "json_object" },
        stream: false
      })
    });

    if (!response.ok) {
      return { data: fallback, sourceStatus: "fallback" };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      return { data: fallback, sourceStatus: "fallback" };
    }

    const parsed: unknown = JSON.parse(content);
    return validate && !validate(parsed)
      ? { data: fallback, sourceStatus: "fallback" }
      : { data: parsed as T, sourceStatus: "ai" };
  } catch {
    return { data: fallback, sourceStatus: "fallback" };
  }
}

function fallbackWordContent(word: Word): WordLearningContent {
  return {
    meaningZh: word.meaningZh || "Add a Chinese meaning based on real context.",
    definitionEn: word.definitionEn || `${word.text} is a word to learn through context, examples, and repeated use.`,
    examples: word.examples.length
      ? word.examples
      : [
          `Researchers use ${word.text} to express a precise idea in context.`,
          `A good learner studies ${word.text} through examples rather than isolated translation.`
        ],
    collocations: word.collocations.length ? word.collocations : [`${word.text} in context`, `use ${word.text} precisely`, `understand ${word.text}`],
    academicUsage:
      word.academicUsage || `In academic writing, check whether "${word.text}" is precise, necessary, and supported by the sentence context.`,
    synonyms: word.synonyms || "Add synonym distinctions after real examples are collected.",
    commonMistakes: word.commonMistakes || "Avoid translating the word mechanically without checking sentence context."
  };
}

function fallbackWritingFeedback(inputText: string): WritingFeedback {
  const sentence = inputText || "The results indicate that the proposed method improves performance.";

  return {
    polishedText: sentence,
    formalVersion: sentence,
    conciseVersion: sentence,
    revisionNotes:
      "AI feedback was unavailable. The original text was saved, and local fallback practice was created so you can continue learning.",
    patterns: ["These results indicate that...", "This observation is consistent with...", "A substantial increase in..."],
    diagnostics: [],
    learningWords: [
      {
        text: "indicate",
        meaningZh: "表明；显示",
        definitionEn: "to show that something is likely or true",
        examples: ["These results indicate that the treatment is effective."],
        collocations: ["results indicate", "evidence indicates"],
        academicUsage: "Use it to state what evidence or results support.",
        synonyms: "show, suggest",
        commonMistakes: "Match the verb with a plural subject: results indicate."
      },
      {
        text: "consistent with",
        meaningZh: "与……一致",
        definitionEn: "in agreement with a result, theory, or observation",
        examples: ["The measurements are consistent with the proposed mechanism."],
        collocations: ["consistent with previous studies", "consistent with the hypothesis"],
        academicUsage: "Use it to compare evidence without claiming exact proof.",
        synonyms: "in agreement with",
        commonMistakes: "Use with, not to: consistent with the data."
      },
      {
        text: "substantial",
        meaningZh: "显著的；大量的",
        definitionEn: "large or important enough to be meaningful",
        examples: ["A substantial improvement was observed after optimization."],
        collocations: ["substantial increase", "substantial improvement"],
        academicUsage: "Use it for a meaningful magnitude; report a number when available.",
        synonyms: "considerable, marked",
        commonMistakes: "Do not use it as a substitute for statistical significance."
      }
    ],
    grammarExercises: [
      {
        type: "correction",
        prompt: "Correct the subject-verb agreement: The results indicates a substantial improvement.",
        answer: "The results indicate a substantial improvement.",
        explanation: "The plural subject results takes indicate, not indicates."
      },
      {
        type: "rewrite",
        prompt: `Rewrite this sentence as concisely as possible without changing its claim: ${sentence}`,
        answer: sentence,
        explanation: "Compare your answer with the source and remove only words that do not change the claim."
      }
    ]
  };
}

function isWritingFeedback(value: unknown): value is WritingFeedback {
  if (!isRecord(value)) return false;

  const diagnostics = value.diagnostics;
  const learningWords = value.learningWords;
  const grammarExercises = value.grammarExercises;

  return (
    hasStrings(value, ["polishedText", "formalVersion", "conciseVersion", "revisionNotes"]) &&
    isStringArray(value.patterns, 2, 5) &&
    Array.isArray(diagnostics) &&
    diagnostics.length >= 1 &&
    diagnostics.length <= 8 &&
    diagnostics.every(
      (item) =>
        isRecord(item) &&
        ["clarity", "grammar", "precision", "concision"].includes(String(item.category)) &&
        hasStrings(item, ["original", "replacement", "reason"])
    ) &&
    Array.isArray(learningWords) &&
    learningWords.length >= 3 &&
    learningWords.length <= 5 &&
    learningWords.every(
      (item) =>
        isRecord(item) &&
        hasStrings(item, ["text", "meaningZh", "definitionEn", "academicUsage", "synonyms", "commonMistakes"]) &&
        isStringArray(item.examples, 1, 2) &&
        isStringArray(item.collocations, 1, 3)
    ) &&
    Array.isArray(grammarExercises) &&
    grammarExercises.length === 2 &&
    grammarExercises.every(
      (item) =>
        isRecord(item) &&
        ["fill", "correction", "rewrite", "naturalness"].includes(String(item.type)) &&
        hasStrings(item, ["prompt", "answer", "explanation"])
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasStrings(value: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => typeof value[key] === "string" && value[key].trim().length > 0);
}

function isStringArray(value: unknown, min: number, max: number): value is string[] {
  return Array.isArray(value) && value.length >= min && value.length <= max && value.every((item) => typeof item === "string" && item.trim());
}

function fallbackGrammarExercise(sourceText: string): GrammarExerciseDraft {
  const base = sourceText || "The results indicate that the proposed method improves performance.";

  return {
    type: "rewrite",
    prompt: `Rewrite this sentence in a more precise academic style: ${base}`,
    answer: base,
    explanation:
      "Fallback exercise: configure an AI provider to generate adaptive grammar exercises. Focus on precision, verb choice, and sentence structure."
  };
}

function fallbackListeningFeedback(sourceText: string, userTranscript: string): ListeningFeedback {
  const sourceWords = sourceText.toLowerCase().split(/\W+/).filter(Boolean);
  const userWords = new Set(userTranscript.toLowerCase().split(/\W+/).filter(Boolean));
  const missed = Array.from(new Set(sourceWords.filter((word) => !userWords.has(word)))).slice(0, 8);

  return {
    feedback: missed.length
      ? `Missing keywords: ${missed.join(", ")}. Replay at a slower speed and focus on these words.`
      : "Strong match. Repeat once at normal speed and imitate the rhythm."
  };
}
