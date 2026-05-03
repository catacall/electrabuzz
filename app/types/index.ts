// ===== Quiz Types =====

export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizState {
  current: number;
  score: number;
  answered: boolean;
  selected: number | null;
  streak: number;
}

// ===== Leaderboard Types =====

export interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL: string;
  score: number;
}

// ===== AI API Types =====

export interface FactCheckData {
  verdict: "Verified" | "Misinformation" | "Needs Context" | "Unverified";
  explanation: string;
  confidence: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ExplainData {
  explanation: string;
  quiz: QuizQuestion;
}

export type AIResponse =
  | { type: "fact-check"; data: FactCheckData }
  | { type: "explain"; data: ExplainData }
  | { type: "error"; data: { explanation: string } };

// ===== Firebase Types =====

export interface FirebaseUserDoc {
  displayName: string;
  photoURL: string;
  score: number;
  createdAt: Date;
}

// ===== Constituency Types =====

export interface Constituency {
  id: number;
  name: string;
  state: string;
  type: "Lok Sabha" | "Vidhan Sabha" | "Panchayat";
  representative: string;
  party: string;
  electionYear: number;
  voters: number;
}
