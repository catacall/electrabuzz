"use client";

import type { Question, QuizState } from "@/app/types";
import OptionButton from "./OptionButton";
import ScoreDisplay from "./ScoreDisplay";
import { Flame } from "lucide-react";

interface QuizCardProps {
  question: Question | undefined;
  quizState: QuizState;
  totalQuestions: number;
  isComplete: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onReset: () => void;
  title?: string;
}

export default function QuizCard({
  question,
  quizState,
  totalQuestions,
  isComplete,
  onAnswer,
  onNext,
  onReset,
  title = "Test Your Knowledge",
}: QuizCardProps) {
  // Handle empty questions gracefully
  if (!question && !isComplete) {
    return (
      <div className="t-card border t-border rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="text-center py-8">
          <p className="text-lg t-muted">No questions available.</p>
          <p className="text-sm t-muted mt-2">
            Please check back later or try a different category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="t-card border t-border rounded-3xl p-6 sm:p-8 shadow-lg"
      role="region"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold t-text">{title}</h2>
        {quizState.streak >= 2 && (
          <div className="flex items-center gap-1.5 bg-orange-500/15 text-orange-500 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse border border-orange-500/30">
            <Flame className="w-4 h-4" />
            {quizState.streak} streak!
          </div>
        )}
      </div>

      {isComplete ? (
        /* Quiz Complete Screen */
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-2">
            {quizState.score === totalQuestions
              ? "🏆"
              : quizState.score >= totalQuestions * 0.7
                ? "🎉"
                : "💪"}
          </div>
          <p className="text-3xl font-extrabold t-text">Quiz Complete!</p>
          <ScoreDisplay
            score={quizState.score}
            total={totalQuestions}
            size="lg"
          />
          <p className="text-sm t-muted">
            {quizState.score === totalQuestions
              ? "Perfect score! You're an election expert! 🌟"
              : quizState.score >= totalQuestions * 0.7
                ? "Great job! Keep learning!"
                : "Good effort! Try again to improve."}
          </p>
          <button
            onClick={onReset}
            aria-label="Retry quiz"
            className="mt-4 px-8 py-3 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-400 hover:to-indigo-400 transition-all font-medium border border-blue-400/30 shadow-lg shadow-blue-500/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Retry Quiz
          </button>
        </div>
      ) : question ? (
        /* Active Quiz */
        <div>
          {/* Progress & Score */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm t-muted">
              Question {quizState.current + 1} of {totalQuestions}
            </span>
            <ScoreDisplay score={quizState.score} total={totalQuestions} />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 t-bg3 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((quizState.current + (quizState.answered ? 1 : 0)) / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Question */}
          <p className="text-lg font-semibold t-text mb-5">
            {question.question}
          </p>

          {/* Options — guard against empty options */}
          {question.options && question.options.length > 0 ? (
            <div
              className="grid gap-3"
              role="radiogroup"
              aria-label="Answer options"
            >
              {question.options.map((opt, idx) => (
                <OptionButton
                  key={idx}
                  option={opt}
                  index={idx}
                  isCorrect={idx === question.correct}
                  isSelected={quizState.selected === idx}
                  answered={quizState.answered}
                  onClick={onAnswer}
                />
              ))}
            </div>
          ) : (
            <p className="t-muted text-sm py-4">
              No options available for this question.
            </p>
          )}

          {/* Next Button */}
          {quizState.answered && quizState.current < totalQuestions - 1 && (
            <button
              onClick={onNext}
              aria-label="Next question"
              className="mt-5 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-400 hover:to-indigo-400 transition-all font-medium shadow-lg shadow-blue-500/20 w-full sm:w-auto active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Next Question →
            </button>
          )}

          {/* Answer Feedback */}
          {quizState.answered && (
            <div
              className={`mt-4 p-3 rounded-xl text-sm font-medium text-center border transition-all duration-300 ${
                quizState.selected === question.correct
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              }`}
              role="alert"
            >
              {quizState.selected === question.correct
                ? quizState.streak >= 3
                  ? `🔥 ${quizState.streak} in a row! +10 points`
                  : "✅ Correct! +10 points"
                : `❌ The correct answer was: ${question.options[question.correct]}`}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
