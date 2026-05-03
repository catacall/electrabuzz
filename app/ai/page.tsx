"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalScore } from "../hooks/useGlobalScore";
import { useUser } from "@clerk/nextjs";
import {
  Bot,
  CheckCircle,
  ShieldAlert,
  BookOpen,
  Send,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { fireConfetti } from "@/app/utils/confetti";
import { playCorrectSound, playIncorrectSound } from "@/app/utils/sound";
import type { AIResponse } from "@/app/types";
import ErrorFallback from "@/app/components/ui/ErrorFallback";

const beginnerSuggestions = [
  { label: "What is Lok Sabha?", mode: "explain" as const },
  { label: "How do I vote in India?", mode: "explain" as const },
  { label: "What is EVM?", mode: "explain" as const },
  { label: "How does Panchayat work?", mode: "explain" as const },
  { label: "Is voting mandatory in India?", mode: "fact-check" as const },
  { label: "Can NRIs vote in elections?", mode: "fact-check" as const },
];

export default function AIPage() {
  const { user } = useUser();
  const { addPoints } = useGlobalScore();
  const [mode, setMode] = useState<"fact-check" | "explain">("explain");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [streamText, setStreamText] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setQuizAnswered(false);
    setSelectedOption(null);
    setStreamText("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setResponse({
          type: "error",
          data: {
            explanation:
              data.details ||
              data.error ||
              "Something went wrong. Please try again.",
          },
        });
        setStreamText(
          data.details ||
            data.error ||
            "Something went wrong. Please try again.",
        );
        return;
      }

      setResponse(data as AIResponse);

      // Simulate typing effect for the explanation
      const text =
        data.type === "fact-check"
          ? data.data?.explanation || ""
          : data.data?.explanation || "";
      let i = 0;
      setStreamText("");
      const interval = setInterval(() => {
        i += 3;
        setStreamText(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 10);
    } catch (error) {
      console.error("Failed to fetch AI response", error);
      setResponse({
        type: "error",
        data: {
          explanation:
            "Network error. Please check your connection and try again.",
        },
      });
      setStreamText(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (s: (typeof beginnerSuggestions)[0]) => {
    setMode(s.mode);
    setQuery(s.label);
  };

  const handleQuizAnswer = (index: number) => {
    if (quizAnswered || response?.type !== "explain") return;
    setSelectedOption(index);
    setQuizAnswered(true);
    const isCorrect = index === response.data.quiz.correctAnswer;

    if (isCorrect) {
      fireConfetti();
      playCorrectSound();
      if (user) addPoints(10);
    } else {
      playIncorrectSound();
    }
  };

  const handleRetry = () => {
    setResponse(null);
    setStreamText("");
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-4xl mx-auto min-h-[80vh] pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 t-card border t-border p-4 rounded-2xl sm:rounded-3xl t-shadow transition-colors">
        <div
          className="t-accent-bg p-2.5 sm:p-3 rounded-xl sm:rounded-2xl"
          aria-hidden="true"
        >
          <Bot className="w-8 h-8 sm:w-10 sm:h-10 t-accent" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold t-text tracking-tight">
            Electra Assistant
          </h1>
          <p className="text-xs sm:text-sm t-muted hidden sm:block">
            Ask anything about Indian elections
          </p>
        </div>
      </div>

      <p className="t-text2 mb-6 text-center px-4 text-sm sm:text-base">
        Your personal guide to Indian elections. Pick a mode and ask a question
        below!
      </p>

      {/* Mode Toggle */}
      <div
        className="flex t-card border t-border p-1 sm:p-1.5 rounded-full mb-6 w-full max-w-md t-shadow transition-colors"
        role="tablist"
        aria-label="AI mode selection"
      >
        <button
          onClick={() => setMode("explain")}
          role="tab"
          aria-selected={mode === "explain"}
          aria-label="Explain mode"
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            mode === "explain"
              ? "t-bg3 t-accent t-shadow border t-border"
              : "t-text2 hover:t-text"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Explain
        </button>
        <button
          onClick={() => setMode("fact-check")}
          role="tab"
          aria-selected={mode === "fact-check"}
          aria-label="Fact check mode"
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            mode === "fact-check"
              ? "t-bg3 t-accent t-shadow border t-border"
              : "t-text2 hover:t-text"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Fact Check
        </button>
      </div>

      {/* Beginner Suggestions */}
      {!response && !loading && (
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center gap-2 mb-3 t-muted">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Try asking
            </span>
          </div>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Suggested questions">
            {beginnerSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                role="listitem"
                aria-label={`Ask: ${s.label}`}
                className="t-card border t-border px-3 py-2 rounded-full text-xs sm:text-sm t-text2 hover:t-accent hover:t-border-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative mb-8 group"
        aria-label="Ask a question"
      >
        <input
          type="text"
          className="w-full t-input border rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-4 sm:pl-6 pr-14 sm:pr-16 text-base sm:text-lg t-shadow transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={
            mode === "explain"
              ? "e.g., What is Lok Sabha?"
              : "e.g., Is voting mandatory in India?"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          aria-label="Enter your question"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          aria-label={loading ? "Loading" : "Submit question"}
          className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 p-2.5 sm:p-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-colors flex items-center justify-center shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div
          className="w-full max-w-3xl t-card border t-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 t-shadow flex items-center gap-4"
          role="status"
          aria-label="AI is thinking"
        >
          <div className="t-accent-bg p-2 rounded-xl">
            <Bot className="w-6 h-6 t-accent animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="t-text font-semibold">Thinking...</p>
            <p className="t-muted text-sm">Analyzing your question with AI</p>
          </div>
          <Loader2 className="w-6 h-6 t-accent animate-spin" />
        </div>
      )}

      {/* Results */}
      {response && (
        <div ref={resultRef} className="w-full max-w-3xl space-y-6">
          {response.type === "fact-check" && (
            <div className="t-card border t-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 t-shadow transition-colors">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {response.data.verdict === "Verified" ? (
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                ) : response.data.verdict === "Misinformation" ? (
                  <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
                ) : (
                  <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold t-text">
                    {response.data.verdict}
                  </h3>
                  <span className="text-xs sm:text-sm t-muted t-bg3 px-3 py-1 rounded-full inline-block mt-1 border t-border">
                    Confidence: {response.data.confidence}%
                  </span>
                </div>
              </div>
              <div className="t-text2 leading-relaxed text-sm sm:text-base t-bg3 p-4 sm:p-6 rounded-xl sm:rounded-2xl border t-border">
                {streamText || response.data.explanation}
              </div>
            </div>
          )}

          {response.type === "explain" && (
            <>
              <div className="t-card border t-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 t-shadow transition-colors">
                <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 t-text flex items-center gap-2 sm:gap-3">
                  <Bot className="t-accent w-5 h-5 sm:w-6 sm:h-6" />
                  Explanation
                </h3>
                <div className="t-text2 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {streamText || response.data.explanation}
                </div>
              </div>

              {response.data.quiz && (
                <div className="t-card border t-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden t-shadow transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />

                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-xl font-bold t-accent">
                      Quick Quiz
                    </h3>
                    <span className="t-accent-bg t-accent text-xs font-bold px-2 sm:px-3 py-1 rounded-full border t-border">
                      +10 PTS
                    </span>
                  </div>

                  <p className="text-sm sm:text-lg t-text font-medium mb-4 sm:mb-6">
                    {response.data.quiz.question}
                  </p>

                  {response.data.quiz.options &&
                  response.data.quiz.options.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3" role="radiogroup" aria-label="Quiz options">
                      {response.data.quiz.options.map(
                        (opt: string, idx: number) => {
                          const isCorrect =
                            idx === response.data.quiz.correctAnswer;
                          const isSelected = selectedOption === idx;
                          let cls =
                            "t-bg3 border t-border t-text2 hover:t-card";
                          if (quizAnswered) {
                            if (isCorrect)
                              cls =
                                "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 scale-[1.02]";
                            else if (isSelected)
                              cls =
                                "bg-red-500/15 border-red-500/50 text-red-600 dark:text-red-300 shake-animation";
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              disabled={quizAnswered}
                              aria-label={`Option ${idx + 1}: ${opt}`}
                              aria-pressed={isSelected}
                              className={`w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 text-sm sm:text-base ${cls} ${!quizAnswered ? "hover:scale-[1.01]" : ""} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{opt}</span>
                                {quizAnswered && isCorrect && (
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-bounce-in shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <p className="t-muted text-sm py-4">
                      No quiz options available.
                    </p>
                  )}

                  {quizAnswered && (
                    <div
                      className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl font-medium text-center text-sm sm:text-base border transition-all duration-300 ${
                        selectedOption === response.data.quiz.correctAnswer
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30"
                      }`}
                      role="alert"
                    >
                      {selectedOption === response.data.quiz.correctAnswer
                        ? user
                          ? "✅ Correct! +10 points added."
                          : "✅ Correct! Sign in to save your score."
                        : `❌ Not quite — the answer was: ${response.data.quiz.options[response.data.quiz.correctAnswer]}`}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {response.type === "error" && (
            <ErrorFallback
              title="AI Error"
              message={
                streamText ||
                response.data?.explanation ||
                "An unexpected error occurred."
              }
              onRetry={handleRetry}
            />
          )}
        </div>
      )}
    </div>
  );
}
