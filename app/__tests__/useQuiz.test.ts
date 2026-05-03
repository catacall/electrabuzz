import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "@/app/hooks/useQuiz";
import type { Question } from "@/app/types";

// Mock dependencies
jest.mock("@/app/utils/confetti", () => ({
  fireConfetti: jest.fn(),
}));
jest.mock("@/app/utils/sound", () => ({
  playCorrectSound: jest.fn(),
  playIncorrectSound: jest.fn(),
}));
jest.mock("@/app/hooks/useGlobalScore", () => ({
  useGlobalScore: () => ({
    addPoints: jest.fn(),
    userScore: 0,
    loadingScore: false,
  }),
}));

const mockQuestions: Question[] = [
  {
    question: "Q1?",
    options: ["A", "B", "C", "D"],
    correct: 1,
  },
  {
    question: "Q2?",
    options: ["W", "X", "Y", "Z"],
    correct: 2,
  },
];

describe("useQuiz", () => {
  test("initializes with correct default state", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    expect(result.current.quizState.current).toBe(0);
    expect(result.current.quizState.score).toBe(0);
    expect(result.current.quizState.answered).toBe(false);
    expect(result.current.quizState.selected).toBeNull();
    expect(result.current.quizState.streak).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.totalQuestions).toBe(2);
  });

  test("handles correct answer — increments score and streak", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    act(() => {
      result.current.handleAnswer(1); // correct answer
    });

    expect(result.current.quizState.answered).toBe(true);
    expect(result.current.quizState.selected).toBe(1);
    expect(result.current.quizState.score).toBe(1);
    expect(result.current.quizState.streak).toBe(1);
  });

  test("handles incorrect answer — resets streak", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    // First answer correct
    act(() => {
      result.current.handleAnswer(1);
    });
    expect(result.current.quizState.streak).toBe(1);

    // Next question
    act(() => {
      result.current.nextQuestion();
    });

    // Wrong answer
    act(() => {
      result.current.handleAnswer(0); // wrong
    });
    expect(result.current.quizState.streak).toBe(0);
    expect(result.current.quizState.score).toBe(1); // unchanged
  });

  test("advances to next question", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    act(() => {
      result.current.handleAnswer(1);
    });
    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.quizState.current).toBe(1);
    expect(result.current.quizState.answered).toBe(false);
    expect(result.current.quizState.selected).toBeNull();
    expect(result.current.currentQuestion?.question).toBe("Q2?");
  });

  test("resets quiz state completely", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    // Answer and advance
    act(() => {
      result.current.handleAnswer(1);
    });
    act(() => {
      result.current.nextQuestion();
    });

    // Reset
    act(() => {
      result.current.resetQuiz();
    });

    expect(result.current.quizState.current).toBe(0);
    expect(result.current.quizState.score).toBe(0);
    expect(result.current.quizState.streak).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  test("prevents double-answering same question", () => {
    const { result } = renderHook(() =>
      useQuiz({ questions: mockQuestions })
    );

    act(() => {
      result.current.handleAnswer(1); // correct
    });
    act(() => {
      result.current.handleAnswer(0); // try again (should be ignored)
    });

    expect(result.current.quizState.selected).toBe(1);
    expect(result.current.quizState.score).toBe(1);
  });
});
