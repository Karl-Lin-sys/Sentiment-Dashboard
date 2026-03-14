import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  trend: { timePeriod: string; sentimentScore: number }[];
  words: { text: string; weight: number; sentiment: 'positive' | 'negative' }[];
  executiveSummary: string;
  actionableAreas: string[];
}

export async function analyzeReviews(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following customer reviews and extract:
1. A sentiment trend over time (if dates are present, group by them; otherwise, divide the text into 5 sequential segments). The sentiment score should be between -1 (very negative) and 1 (very positive).
2. A list of the most frequent complaints and praises (words or short phrases), their relative weight (1-100), and whether they are positive or negative.
3. An executive summary of the overall sentiment.
4. The top 3 actionable areas for improvement.

Reviews:
${text}`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trend: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timePeriod: { type: Type.STRING },
                sentimentScore: { type: Type.NUMBER },
              },
              required: ["timePeriod", "sentimentScore"],
            },
          },
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                weight: { type: Type.NUMBER },
                sentiment: { type: Type.STRING, enum: ["positive", "negative"] },
              },
              required: ["text", "weight", "sentiment"],
            },
          },
          executiveSummary: { type: Type.STRING },
          actionableAreas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["trend", "words", "executiveSummary", "actionableAreas"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
}

export function createChatSession(context: string) {
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      systemInstruction: `You are an AI assistant helping a user understand their customer sentiment dashboard.
Here is the context of the analysis:
${context}

Answer the user's questions based on this data. Be concise and helpful.`,
    },
  });
}
