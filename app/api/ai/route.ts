import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { query, mode } = await req.json();

  if (mode === "fact-check") {
    const schema = z.object({
      verdict: z.enum([
        "Verified",
        "Misinformation",
        "Needs Context",
        "Unverified",
      ]),
      explanation: z.string(),
      confidence: z.number().min(0).max(100),
    });

    const result = await generateObject({
      model: google("gemini-2.5-pro"),
      schema,
      system: `You are FactGuard, an expert fact-checker for Indian elections. Return factual, simple explanations.`,
      prompt: `Claim: "${query}"`,
      temperature: 0.3,
    });

    return Response.json({ type: "fact-check", data: result.object });
  } 
  
  if (mode === "explain") {
    const schema = z.object({
      explanation: z.string().describe("Detailed, clear explanation of the topic"),
      quiz: z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctAnswer: z.number().min(0).max(3).describe("Index of the correct option")
      }).describe("A multiple choice question to test understanding")
    });

    const result = await generateObject({
      model: google("gemini-2.5-pro"),
      schema,
      system: `You are an AI assistant specialized in Indian elections and civics. Explain the user's query clearly and engagingly. Generate a multiple-choice quiz question related to your explanation so the user can test their knowledge.`,
      prompt: `Topic to explain: "${query}"`,
      temperature: 0.7,
    });

    return Response.json({ type: "explain", data: result.object });
  }

  return Response.json({ error: "Invalid mode" }, { status: 400 });
}
