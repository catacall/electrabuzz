import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizCard from "@/app/components/ui/QuizCard";
import type { Question, QuizState } from "@/app/types";

// Mock confetti and sound to prevent errors in test env
jest.mock("@/app/utils/confetti", () => ({
  fireConfetti: jest.fn(),
}));
jest.mock("@/app/utils/sound", () => ({
  playCorrectSound: jest.fn(),
  playIncorrectSound: jest.fn(),
}));

const mockQuestion: Question = {
  question: "How many seats are there in the Lok Sabha?",
  options: ["245", "543", "550", "500"],
  correct: 1,
};

const defaultQuizState: QuizState = {
  current: 0,
  score: 0,
  answered: false,
  selected: null,
  streak: 0,
};

const defaultProps = {
  question: mockQuestion,
  quizState: defaultQuizState,
  totalQuestions: 3,
  isComplete: false,
  onAnswer: jest.fn(),
  onNext: jest.fn(),
  onReset: jest.fn(),
};

describe("QuizCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders quiz question and all options", () => {
    render(<QuizCard {...defaultProps} />);

    expect(
      screen.getByText("How many seats are there in the Lok Sabha?")
    ).toBeInTheDocument();
    expect(screen.getByText("245")).toBeInTheDocument();
    expect(screen.getByText("543")).toBeInTheDocument();
    expect(screen.getByText("550")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  test("calls onAnswer when an option is clicked", async () => {
    const user = userEvent.setup();
    const onAnswer = jest.fn();
    render(<QuizCard {...defaultProps} onAnswer={onAnswer} />);

    await user.click(screen.getByText("543"));
    expect(onAnswer).toHaveBeenCalledWith(1);
  });

  test("shows correct/incorrect feedback after answering", () => {
    const answeredState: QuizState = {
      ...defaultQuizState,
      answered: true,
      selected: 1,
      score: 1,
    };

    render(
      <QuizCard
        {...defaultProps}
        quizState={answeredState}
      />
    );

    // Correct feedback should show
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Correct/)).toBeInTheDocument();
  });

  test("shows wrong answer feedback when incorrect option selected", () => {
    const wrongState: QuizState = {
      ...defaultQuizState,
      answered: true,
      selected: 0, // "245" is wrong
      score: 0,
    };

    render(
      <QuizCard
        {...defaultProps}
        quizState={wrongState}
      />
    );

    expect(screen.getByText(/correct answer was.*543/i)).toBeInTheDocument();
  });

  test("renders completion screen when quiz is done", () => {
    const completeState: QuizState = {
      current: 3,
      score: 2,
      answered: false,
      selected: null,
      streak: 0,
    };

    render(
      <QuizCard
        {...defaultProps}
        quizState={completeState}
        isComplete={true}
      />
    );

    expect(screen.getByText("Quiz Complete!")).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    expect(screen.getByText("Retry Quiz")).toBeInTheDocument();
  });

  test("renders fallback UI when question is undefined", () => {
    render(
      <QuizCard
        {...defaultProps}
        question={undefined}
      />
    );

    expect(screen.getByText("No questions available.")).toBeInTheDocument();
  });
});
