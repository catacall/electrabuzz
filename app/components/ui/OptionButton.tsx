"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "@/app/types";

interface OptionButtonProps {
  option: string;
  index: number;
  isCorrect: boolean;
  isSelected: boolean;
  answered: boolean;
  onClick: (index: number) => void;
}

export default function OptionButton({
  option,
  index,
  isCorrect,
  isSelected,
  answered,
  onClick,
}: OptionButtonProps) {
  let cls = "t-bg3 border t-border t-text2 hover:t-card";
  if (answered) {
    if (isCorrect)
      cls =
        "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 scale-[1.02]";
    else if (isSelected)
      cls =
        "bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-300 shake-animation";
  }

  return (
    <button
      onClick={() => onClick(index)}
      disabled={answered}
      aria-label={`Option ${index + 1}: ${option}`}
      aria-pressed={isSelected}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${cls} flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`shrink w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
            answered && isCorrect
              ? "border-white text-white bg-white/20"
              : answered && isSelected
                ? "border-red-400 text-red-400"
                : "t-border t-muted"
          }`}
        >
          {String.fromCharCode(65 + index)}
        </span>
        <span>{option}</span>
      </span>
      {answered && isCorrect && (
        <CheckCircle className="w-5 h-5 text-white shrink animate-bounce-in" />
      )}
      {answered && isSelected && !isCorrect && (
        <XCircle className="w-5 h-5 text-red-400 shrink" />
      )}
    </button>
  );
}

export function getQuestionStatus(
  question: Question,
  selected: number | null
): {
  isCorrectForIndex: (idx: number) => boolean;
  isSelectedForIndex: (idx: number) => boolean;
} {
  return {
    isCorrectForIndex: (idx: number) => idx === question.correct,
    isSelectedForIndex: (idx: number) => selected === idx,
  };
}
