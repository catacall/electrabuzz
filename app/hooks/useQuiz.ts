import { useState, useCallback } from "react";
import type { Question, QuizState } from "@/app/types";
import { fireConfetti } from "@/app/utils/confetti";
import { playCorrectSound, playIncorrectSound } from "@/app/utils/sound";
import { useGlobalScore } from "@/app/hooks/useGlobalScore";

interface UseQuizOptions {
  questions: Question[];
  shuffle?: boolean;
  pointsPerCorrect?: number;
}

export function useQuiz({
  questions,
  shuffle = false,
  pointsPerCorrect = 10,
}: UseQuizOptions) {
  const { addPoints } = useGlobalScore();

  const [quizQuestions, setQuizQuestions] = useState<Question[]>(() =>
    shuffle ? [...questions].sort(() => Math.random() - 0.5) : questions
  );

  const [quizState, setQuizState] = useState<QuizState>({
    current: 0,
    score: 0,
    answered: false,
    selected: null,
    streak: 0,
  });

  const currentQuestion: Question | undefined =
    quizQuestions[quizState.current];

  const isComplete = quizState.current >= quizQuestions.length;

  const handleAnswer = useCallback(
    (idx: number) => {
      if (quizState.answered || !currentQuestion) return;

      const isCorrect = idx === currentQuestion.correct;

      if (isCorrect) {
        fireConfetti();
        playCorrectSound();
        addPoints(pointsPerCorrect);
      } else {
        playIncorrectSound();
      }

      setQuizState((prev) => ({
        ...prev,
        answered: true,
        selected: idx,
        score: isCorrect ? prev.score + 1 : prev.score,
        streak: isCorrect ? prev.streak + 1 : 0,
      }));
    },
    [quizState.answered, currentQuestion, addPoints, pointsPerCorrect]
  );

  const nextQuestion = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      current: prev.current + 1,
      answered: false,
      selected: null,
    }));
  }, []);

  const resetQuiz = useCallback(() => {
    const newQuestions = shuffle
      ? [...questions].sort(() => Math.random() - 0.5)
      : questions;
    setQuizQuestions(newQuestions);
    setQuizState({
      current: 0,
      score: 0,
      answered: false,
      selected: null,
      streak: 0,
    });
  }, [questions, shuffle]);

  return {
    quizQuestions,
    quizState,
    currentQuestion,
    isComplete,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    totalQuestions: quizQuestions.length,
  };
}
