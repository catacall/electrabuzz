"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bot } from "lucide-react";
import type { FactCheckData } from "@/app/types";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorFallback from "./ui/ErrorFallback";

export default function FactGuardGame() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkClaim = async () => {
    if (!claim.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.details || data.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdictColor =
    result?.verdict === "Verified"
      ? "text-emerald-400"
      : result?.verdict === "Misinformation"
        ? "text-red-400"
        : "text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="t-card border t-border shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold t-text flex items-center gap-2">
        <Bot className="w-6 h-6 t-accent" /> Fact Guard
      </h2>
      <textarea
        className="w-full mt-4 p-3 rounded-xl t-input border t-border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        rows={3}
        placeholder='Paste a political claim… e.g., "Only citizens with a college degree can vote in India"'
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        aria-label="Enter a political claim to fact-check"
      />
      <button
        onClick={checkClaim}
        disabled={loading || !claim.trim()}
        aria-label="Verify claim"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-colors shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {loading ? "Checking..." : "Verify Claim"}
      </button>

      {loading && (
        <LoadingSpinner
          message="Analyzing claim..."
          submessage="Our AI is fact-checking your statement"
        />
      )}

      {error && (
        <div className="mt-4">
          <ErrorFallback
            title="Fact-check failed"
            message={error}
            onRetry={checkClaim}
          />
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 t-bg3 border t-border rounded-xl">
          <p className="font-bold t-text">
            Verdict: <span className={verdictColor}>{result.verdict}</span>
          </p>
          <p className="t-text2 mt-2 text-sm">{result.explanation}</p>
          {result.confidence !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs t-muted">Confidence:</span>
              <div className="flex-1 h-2 t-bg3 rounded-full overflow-hidden border t-border">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-xs font-bold t-accent">{result.confidence}%</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
