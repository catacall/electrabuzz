import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const verdictSchema = z.object({
  verdict: z.enum([
    "Verified",
    "Misinformation",
    "Needs Context",
    "Unverified",
  ]),
  explanation: z.string(),
  confidence: z.number().min(0).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claim } = body;

    if (!claim || typeof claim !== "string" || !claim.trim()) {
      return Response.json(
        { error: "Invalid request", details: "A valid claim string is required." },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: verdictSchema }),
      system: `You are FactGuard, an expert fact-checker for Indian elections.
Return factual, simple explanations.`,
      prompt: `Claim: "${claim}"`,
      temperature: 0.3,
    });

    return Response.json(result.output);
  } catch (error: unknown) {
    console.error("Quiz API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "Fact-check request failed", details: message },
      { status: 500 }
    );
  }
}
