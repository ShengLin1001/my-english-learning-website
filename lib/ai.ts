import { Word } from "./types";

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
    required: ["polishedText", "formalVersion", "conciseVersion", "revisionNotes", "patterns"],
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
      }
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

export async function generateWritingFeedback(inputText: string, context: string): Promise<WritingFeedback> {
  const fallback = fallbackWritingFeedback(inputText);

  return callResponsesJson<WritingFeedback>({
    schema: writingSchema,
    fallback,
    instructions:
      "You are an academic English writing coach for scientific papers. Improve clarity, precision, concision, and formal academic style. Explain the revision briefly.",
    input: [`Writing context: ${context}`, `Original text: ${inputText}`].join("\n")
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
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallback;
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
      return fallback;
    }

    const payload = (await response.json()) as { output_text?: string };
    if (!payload.output_text) {
      return fallback;
    }

    return JSON.parse(payload.output_text) as T;
  } catch {
    return fallback;
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
  return {
    polishedText: inputText ? `A more precise academic version: ${inputText}` : "",
    formalVersion: inputText ? `It is demonstrated that ${inputText.charAt(0).toLowerCase()}${inputText.slice(1)}` : "",
    conciseVersion: inputText,
    revisionNotes:
      "Fallback response: configure OPENAI_API_KEY to generate detailed AI feedback. This record is still saved for later review.",
    patterns: ["It is demonstrated that...", "These results indicate that...", "This observation suggests that..."]
  };
}
