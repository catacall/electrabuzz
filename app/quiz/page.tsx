"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";
import { useQuiz } from "@/app/hooks/useQuiz";
import QuizCard from "@/app/components/ui/QuizCard";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import type { Question, LeaderboardUser } from "@/app/types";

const allQuizQuestions: Question[] = [
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
  const {
    quizState,
    currentQuestion,
    isComplete,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    totalQuestions,
  } = useQuiz({ questions: allQuizQuestions, shuffle: true });

  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-3xl mx-auto space-y-12">
      
      {/* Quiz Section */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-4 mb-8 t-card p-4 rounded-3xl border t-border shadow-sm">
          <Trophy className="w-10 h-10 t-accent" aria-hidden="true" />
          <h1 className="text-3xl sm:text-4xl font-extrabold t-text tracking-tight">
            Ultimate Election Quiz
          </h1>
        </div>
        <p className="t-muted mb-8 text-center px-4">
          Test your knowledge across Lok Sabha, Vidhan Sabha, and Panchayati Raj. Each correct answer boosts your rank on the leaderboard!
        </p>

        <QuizCard
          question={currentQuestion}
          quizState={quizState}
          totalQuestions={totalQuestions}
          isComplete={isComplete}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onReset={resetQuiz}
          title="Ultimate Election Quiz"
        />
      </div>

      {/* Leaderboard Section */}
      <div className="w-full" role="region" aria-label="Global Leaderboard">
        <h2 className="text-2xl font-bold t-text mb-6 text-center">Global Leaderboard</h2>
        {loading ? (
          <LoadingSpinner message="Loading leaderboard..." />
        ) : (
          <div className="w-full t-card border t-border rounded-3xl overflow-hidden shadow-lg">
            {leaders.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-6 border-b t-border last:border-0 hover:t-card/50 transition-colors group ${
                  index === 0 ? "bg-blue-900/20" : ""
                }`}
              >
                <div className="flex shrink w-8 text-center font-bold text-2xl t-muted group-hover:scale-110 transition-transform" aria-label={`Rank ${index + 1}`}>
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
                  <Award className="w-5 h-5 t-accent" aria-hidden="true" />
                  <span className="font-bold t-text" aria-label={`${user.score} points`}>
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
