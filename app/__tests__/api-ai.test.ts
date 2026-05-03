/**
 * Tests for AI API route — validates input handling and response structure.
 * These test the route handler directly (unit tests), not via HTTP.
 * 
 * @jest-environment node
 */

// Mock the AI SDK to avoid real API calls
jest.mock("@ai-sdk/google", () => ({
  google: jest.fn(() => "mock-model"),
}));

jest.mock("ai", () => ({
  generateText: jest.fn(),
  Output: {
    object: jest.fn(({ schema }: { schema: unknown }) => schema),
  },
}));

// Mock zod to prevent schema errors in mock context
jest.mock("zod", () => {
  const mockSchema = {
    describe: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
    max: jest.fn().mockReturnThis(),
    length: jest.fn().mockReturnThis(),
  };
  return {
    z: {
      object: jest.fn().mockReturnValue(mockSchema),
      string: jest.fn().mockReturnValue(mockSchema),
      number: jest.fn().mockReturnValue(mockSchema),
      array: jest.fn().mockReturnValue(mockSchema),
      enum: jest.fn().mockReturnValue(mockSchema),
    },
  };
});

import { POST } from "@/app/api/ai/route";
import { generateText } from "ai";

const mockedGenerateText = generateText as jest.MockedFunction<typeof generateText>;

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("AI API Route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 for empty query", async () => {
    const req = createRequest({ query: "", mode: "explain" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  test("returns 400 for invalid mode", async () => {
    const req = createRequest({ query: "What is EVM?", mode: "invalid" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid mode");
  });

  test("returns explain response with quiz", async () => {
    mockedGenerateText.mockResolvedValueOnce({
      output: {
        explanation: "EVMs are electronic devices used for voting.",
        quiz: {
          question: "What does EVM stand for?",
          options: ["Electronic Voting Machine", "Electric Volt Meter", "Election Verification Module", "None"],
          correctAnswer: 0,
        },
      },
    } as Awaited<ReturnType<typeof generateText>>);

    const req = createRequest({ query: "What is EVM?", mode: "explain" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.type).toBe("explain");
    expect(data.data.explanation).toContain("EVM");
    expect(data.data.quiz.options).toHaveLength(4);
  });

  test("returns fact-check response with verdict", async () => {
    mockedGenerateText.mockResolvedValueOnce({
      output: {
        verdict: "Verified",
        explanation: "Voting is indeed not mandatory in India.",
        confidence: 95,
      },
    } as Awaited<ReturnType<typeof generateText>>);

    const req = createRequest({
      query: "Voting is not mandatory in India",
      mode: "fact-check",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.type).toBe("fact-check");
    expect(data.data.verdict).toBe("Verified");
    expect(data.data.confidence).toBe(95);
  });

  test("returns 500 when AI fails", async () => {
    mockedGenerateText.mockRejectedValueOnce(new Error("API quota exceeded"));

    const req = createRequest({ query: "What is Lok Sabha?", mode: "explain" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("AI request failed");
    expect(data.details).toContain("quota");
  });
});
