"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trophy, Medal, Award, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { fireConfetti } from "@/app/utils/confetti";
import { playCorrectSound, playIncorrectSound } from "@/app/utils/sound";
import { useGlobalScore } from "@/app/hooks/useGlobalScore";

interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL: string;
  score: number;
}

const allQuizQuestions = [
  // Lok Sabha
  {
    question: "How many seats are there in the Lok Sabha?",
    options: ["245", "543", "550", "500"],
    correct: 1,
  },
  {
    question: "What is the minimum age to vote in Lok Sabha elections?",
    options: ["21 years", "25 years", "18 years", "16 years"],
    correct: 2,
  },
  {
    question: "Which type of bill can only be introduced in the Lok Sabha?",
    options: [
      "Ordinary Bill",
      "Constitutional Amendment Bill",
      "Money Bill",
      "Private Member Bill",
    ],
    correct: 2,
  },
  {
    question: "Who is the presiding officer of the Lok Sabha?",
    options: ["President", "Vice President", "Prime Minister", "Speaker"],
    correct: 3,
  },
  {
    question: "What is the normal term of the Lok Sabha?",
    options: ["4 years", "5 years", "6 years", "Until dissolved"],
    correct: 1,
  },
  // Vidhan Sabha
  {
    question: "Which state has the largest Vidhan Sabha?",
    options: ["Maharashtra (288)", "Uttar Pradesh (403)", "West Bengal (294)", "Bihar (243)"],
    correct: 1,
  },
  {
    question: "How many states have a Vidhan Parishad (Upper House)?",
    options: ["3", "4", "6", "8"],
    correct: 2,
  },
  {
    question: "Who leads the state government?",
    options: ["Governor", "Chief Minister", "Speaker", "President"],
    correct: 1,
  },
  {
    question: "What is the term length for a Member of Legislative Assembly (MLA)?",
    options: ["4 Years", "5 Years", "6 Years", "Lifetime"],
    correct: 1,
  },
  {
    question: "Can a non-member become Chief Minister?",
    options: ["No", "Yes, but must get elected within 6 months", "Yes, indefinitely", "Only if Governor permits"],
    correct: 1,
  },
  // Panchayat
  {
    question: "Which constitutional amendment established Panchayati Raj?",
    options: ["42nd Amendment", "73rd Amendment", "44th Amendment", "86th Amendment"],
    correct: 1,
  },
  {
    question: "What is the head of a Gram Panchayat called?",
    options: ["Zila Pramukh", "MLA", "Sarpanch", "Tehsildar"],
    correct: 2,
  },
  {
    question: "How many tiers does the Panchayati Raj system have?",
    options: ["2", "3", "4", "5"],
    correct: 1,
  },
  {
    question: "What is the Gram Sabha?",
    options: [
      "A meeting of elected Panchayat members only",
      "A council of village elders",
      "An assembly of ALL registered voters in the village",
      "A committee appointed by the state government"
    ],
    correct: 2,
  },
  {
    question: "What is the mandatory reservation for women in Panchayats?",
    options: ["10%", "25%", "33% (One-third)", "50%"],
    correct: 2,
  }
];

export default function QuizAndLeaderboardPage() {
  const { addPoints } = useGlobalScore();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quizQuestions, setQuizQuestions] = useState(allQuizQuestions);
  const [quizState, setQuizState] = useState<{
    current: number;
    score: number;
    answered: boolean;
    selected: number | null;
  }>({ current: 0, score: 0, answered: false, selected: null });

  useEffect(() => {
    // Shuffle questions on mount
    setQuizQuestions([...allQuizQuestions].sort(() => Math.random() - 0.5));

    async function fetchLeaderboard() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedLeaders: LeaderboardUser[] = [];
        querySnapshot.forEach((doc) => {
          fetchedLeaders.push({ id: doc.id, ...doc.data() } as LeaderboardUser);
        });
        setLeaders(fetchedLeaders);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [quizState.current]); // re-fetch leaderboard occasionally, like when advancing questions

  const handleAnswer = (idx: number) => {
    if (quizState.answered) return;
    const isCorrect = idx === quizQuestions[quizState.current].correct;

    if (isCorrect) {
      fireConfetti();
      playCorrectSound();
      addPoints(10);
    } else {
      playIncorrectSound();
    }

    setQuizState(prev => ({
      ...prev,
      answered: true,
      selected: idx,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const nextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      current: prev.current + 1,
      answered: false,
      selected: null,
    }));
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-3xl mx-auto space-y-12">
      
      {/* Quiz Section */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-4 mb-8 t-card p-4 rounded-3xl border t-border shadow-sm">
          <Trophy className="w-10 h-10 t-accent" />
          <h1 className="text-3xl sm:text-4xl font-extrabold t-text tracking-tight">
            Ultimate Election Quiz
          </h1>
        </div>
        <p className="t-muted mb-8 text-center px-4">
          Test your knowledge across Lok Sabha, Vidhan Sabha, and Panchayati Raj. Each correct answer boosts your rank on the leaderboard!
        </p>

        <div className="t-card border t-border rounded-3xl p-6 sm:p-8 shadow-sm">
          {quizState.current < quizQuestions.length ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm t-muted">Question {quizState.current + 1} of {quizQuestions.length}</span>
                <span className="text-sm font-bold t-accent">Score: {quizState.score}/{quizQuestions.length}</span>
              </div>
              <p className="text-lg font-semibold t-text mb-5">{quizQuestions[quizState.current].question}</p>
              <div className="grid gap-3">
                {quizQuestions[quizState.current].options.map((opt, idx) => {
                  const isCorrect = idx === quizQuestions[quizState.current].correct;
                  const isSelected = quizState.selected === idx;
                  let cls = "t-bg3 border t-border t-text2 hover:t-card";
                  if (quizState.answered) {
                    if (isCorrect) cls = "bg-green-500 scale-110 shadow-lg text-white border-green-500";
                    else if (isSelected) cls = "bg-red-500/20 border-red-500/50 text-red-200";
                  }
                  return (
                    <button key={idx} onClick={() => handleAnswer(idx)} disabled={quizState.answered}
                      className={`w-full text-left p-4 rounded-xl transition-all ${cls} flex items-center justify-between`}>
                      <span>{opt}</span>
                      {quizState.answered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {quizState.answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                    </button>
                  );
                })}
              </div>
              {quizState.answered && quizState.current < quizQuestions.length - 1 && (
                <button onClick={nextQuestion} className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-medium shadow-sm w-full sm:w-auto">
                  Next Question →
                </button>
              )}
              {quizState.answered && quizState.current === quizQuestions.length - 1 && (
                <button onClick={() => {
                  setQuizQuestions([...allQuizQuestions].sort(() => Math.random() - 0.5));
                  setQuizState({ current: 0, score: 0, answered: false, selected: null });
                }} className="mt-5 px-6 py-3 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-colors font-medium border t-border w-full sm:w-auto">
                  Restart Quiz
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold t-text mb-6 text-center">Global Leaderboard</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="w-full t-card border t-border rounded-3xl overflow-hidden shadow-lg">
            {leaders.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-6 border-b t-border last:border-0 hover:t-card/50 transition-colors group ${
                  index === 0 ? "bg-blue-900/20" : ""
                }`}
              >
                <div className="flex shrink w-8 text-center font-bold text-2xl t-muted group-hover:scale-110 transition-transform">
                  {index === 0 ? <Medal className="w-8 h-8 text-yellow-400" /> : 
                   index === 1 ? <Medal className="w-8 h-8 t-text2" /> : 
                   index === 2 ? <Medal className="w-8 h-8 text-amber-600" /> : 
                   `#${index + 1}`}
                </div>
                
                <div className="flex shrink group-hover:-translate-y-0.5 transition-transform">
                  {user.photoURL ? (
                    <Image 
                      src={user.photoURL} 
                      alt={user.displayName} 
                      width={50} 
                      height={50} 
                      className="rounded-full border-2 t-border"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] rounded-full t-bg3 flex items-center justify-center border-2 t-border">
                      <UserIcon />
                    </div>
                  )}
                </div>
                
                <div className="flex grow">
                  <h3 className="text-xl font-bold t-text group-hover:t-accent transition-colors">{user.displayName || "Anonymous User"}</h3>
                </div>
                
                <div className="flex items-center gap-2 t-bg3 px-4 py-2 rounded-full border t-border shadow-sm group-hover:border-blue-500/30 transition-colors">
                  <Award className="w-5 h-5 t-accent" />
                  <span className="font-bold t-text">
                    {user.score} pts
                  </span>
                </div>
              </div>
            ))}
            {leaders.length === 0 && (
              <div className="p-12 text-center t-muted">
                No users on the leaderboard yet. Be the first!
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
