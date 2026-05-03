import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { claim } = await req.json();

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
    model: google("gemini-3.1-pro-latest"),
    output: Output.object({ schema }),
    system: `You are FactGuard, an expert fact-checker for Indian elections.
Return factual, simple explanations.`,
    prompt: `Claim: "${claim}"`,
    temperature: 0.3,
  });

  return Response.json(result.output);
}
