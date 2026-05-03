import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
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

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        output: Output.object({ schema }),
        system: `You are FactGuard, an expert fact-checker for Indian elections. Return factual, simple explanations.`,
        prompt: `Claim: "${query}"`,
        temperature: 0.3,
      });

      return Response.json({ type: "fact-check", data: result.output });
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

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        output: Output.object({ schema }),
        system: `You are an AI assistant specialized in Indian elections and civics. Explain the user's query clearly and engagingly. Generate a multiple-choice quiz question related to your explanation so the user can test their knowledge.`,
        prompt: `Topic to explain: "${query}"`,
        temperature: 0.7,
      });

      return Response.json({ type: "explain", data: result.output });
    }

    return Response.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error: unknown) {
    console.error("AI API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "AI request failed", details: message },
      { status: 500 }
    );
  }
}

