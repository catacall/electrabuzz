"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bot } from "lucide-react";

export default function FactGuardGame() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const checkClaim = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
        <Bot className="w-6 h-6 text-blue-400" /> Fact Guard
      </h2>
      <textarea
        className="w-full mt-4 p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        rows={3}
        placeholder='Paste a political claim… e.g., "Only citizens with a college degree can vote in India"'
        value={claim}
        onChange={e => setClaim(e.target.value)}
      />
      <button
        onClick={checkClaim}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-colors shadow-sm active:scale-95"
      >
        {loading ? "Checking..." : "Verify Claim"}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-slate-900 border border-slate-700 rounded-xl">
          <p className="font-bold text-slate-100">Verdict: <span className="text-blue-400">{result.verdict}</span></p>
          <p className="text-slate-300 mt-2">{result.explanation}</p>
        </div>
      )}
    </motion.div>
  );
}
