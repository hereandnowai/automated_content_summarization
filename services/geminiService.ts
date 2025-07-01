
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SummaryLength, OutputFormat, SummarizationResult } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 10) {
    console.error("Gemini API Key is not configured or is invalid in process.env.API_KEY.");
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;

const getGenAIClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = getApiKey();
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


const constructPrompt = (
  content: string,
  length: SummaryLength,
  format: OutputFormat,
  focusArea?: string
): string => {
  let lengthInstruction = "";
  switch (length) {
    case SummaryLength.BRIEF:
      lengthInstruction = "Provide a brief overview (50-100 words) containing only the essential points.";
      break;
    case SummaryLength.STANDARD:
      lengthInstruction = "Provide a standard summary (150-300 words) covering main ideas with some supporting details.";
      break;
    case SummaryLength.DETAILED:
      lengthInstruction = "Provide a detailed analysis (300-500 words) offering a comprehensive overview with context.";
      break;
  }

  let formatInstruction = "";
  switch (format) {
    case OutputFormat.PARAGRAPH:
      formatInstruction = "The 'summary' field should contain the main summarized text in a standard paragraph format.";
      break;
    case OutputFormat.BULLET_POINTS:
      formatInstruction = "The 'summary' field should contain the main summarized text as a list of bullet points. Each bullet point should start with a hyphen '-' and be on a new line (e.g., '- Point 1\\n- Point 2').";
      break;
    case OutputFormat.EXECUTIVE_SUMMARY:
      formatInstruction = "The 'summary' field should contain an executive summary, which is business-focused. If appropriate, include recommendations or key decisions highlighted within this summary.";
      break;
  }

  const focusInstruction = focusArea
    ? `Pay special attention to the following focus area: "${focusArea}".`
    : "Provide a general summary.";

  return `
System Instruction: You are an advanced content summarization assistant. Your task is to analyze the provided content and generate a structured summary based on the user's specific needs. Maintain the original context and tone.
Identify key insights, main points, and actionable items.

Return your response as a single, valid JSON object adhering strictly to the following structure. Do NOT include any text, comments, or markdown formatting outside of this JSON object.
Ensure all strings are properly escaped.
Ensure arrays of strings (like "keyInsights", "actionableItems", "suggestedQuestions") do NOT have trailing commas and all elements are correctly quoted and comma-separated. For example: ["Insight 1", "Insight 2", "Insight 3"] or [] if empty.

The JSON object must have these exact keys:
{
  "summary": "string",
  "keyInsights": ["string", "string", ...],
  "actionableItems": ["string", "string", ...],
  "suggestedQuestions": ["string", "string", ...]
}

Details for each field:
- "summary": (string) The main summarized text, adhering to the length and format instructions specified below.
- "keyInsights": (array of strings) A list of 2-5 key insights derived from the content. Provide an empty array [] if no specific insights are found.
- "actionableItems": (array of strings) A list of any actionable items, deadlines, or critical information found. Provide an empty array [] if none are found.
- "suggestedQuestions": (array of strings) A list of 2-3 relevant follow-up questions or areas needing clarification based on the content. Provide an empty array [] if none are found.

Content to summarize:
---
${content}
---

User Requirements:
- Summary Length Instruction: ${lengthInstruction}
- Output Format Instruction for the 'summary' field: ${formatInstruction}
- Focus Area Instruction: ${focusInstruction}

Ensure the entire response is a single, valid JSON object.
`;
};

export const summarizeContent = async (
  content: string,
  length: SummaryLength,
  format: OutputFormat,
  focusArea?: string
): Promise<SummarizationResult> => {
  const genAI = getGenAIClient();
  const prompt = constructPrompt(content, length, format, focusArea);
  let jsonStr = ""; // Declare here to be accessible in catch block

  try {
    const response: GenerateContentResponse = await genAI.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, 
      }
    });
    
    jsonStr = response.text.trim();
    // Remove potential markdown fences if Gemini still wraps JSON in them
    const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedResult = JSON.parse(jsonStr) as SummarizationResult;

    if (typeof parsedResult.summary !== 'string') {
        throw new Error("Invalid summary format received from API: 'summary' field is missing or not a string.");
    }
    if (!Array.isArray(parsedResult.keyInsights)) {
        console.warn("API response 'keyInsights' is not an array. Defaulting to empty array.");
        parsedResult.keyInsights = [];
    }
    if (!Array.isArray(parsedResult.actionableItems)) {
        console.warn("API response 'actionableItems' is not an array. Defaulting to empty array.");
        parsedResult.actionableItems = [];
    }
    if (!Array.isArray(parsedResult.suggestedQuestions)) {
        console.warn("API response 'suggestedQuestions' is not an array. Defaulting to empty array.");
        parsedResult.suggestedQuestions = [];
    }
    
    return parsedResult;

  } catch (error: any) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error.message && error.message.includes("API_KEY_INVALID")) {
        throw new Error("The Gemini API key is invalid. Please check your configuration.");
    }
    if (error instanceof SyntaxError) { 
        console.error("Problematic JSON string that failed to parse:", jsonStr);
        throw new Error(`Failed to parse the summary response from the API. The response was not valid JSON. Detail: ${error.message}`);
    }
    throw new Error(error.message || "An unknown error occurred while communicating with the Gemini API.");
  }
};
