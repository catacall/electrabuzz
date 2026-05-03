"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Vote,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import constituenciesData from "../data/constituencies.json";
import { fireConfetti } from "@/app/utils/confetti";
import { playCorrectSound, playIncorrectSound } from "@/app/utils/sound";
import { useGlobalScore } from "@/app/hooks/useGlobalScore";

const lokSabhaFacts = [
  { label: "Total Seats", value: "543", icon: Building2 },
  { label: "Term Duration", value: "5 Years", icon: CalendarDays },
  { label: "Minimum Voting Age", value: "18 Years", icon: Users },
  { label: "Next General Election", value: "2029", icon: Vote },
];

const sections = [
  {
    title: "What is Lok Sabha?",
    content: `The Lok Sabha (House of the People) is the lower house of India's bicameral Parliament. Members are directly elected by the people through universal adult franchise from 543 constituencies across India. It is the principal legislative body that introduces and passes Money Bills and holds the power to form and dissolve the government through a vote of no-confidence.`,
  },
  {
    title: "How are elections conducted?",
    content: `Lok Sabha elections are conducted by the Election Commission of India using the First-Past-The-Post (FPTP) system. India is divided into 543 single-member constituencies. The candidate who receives the most votes in a constituency wins the seat. Elections use Electronic Voting Machines (EVMs) along with Voter Verifiable Paper Audit Trail (VVPAT) for transparency. Eligible citizens above 18 years with a valid voter ID can cast their vote.`,
  },
  {
    title: "Key Powers of Lok Sabha",
    content: `The Lok Sabha has exclusive power over Money Bills â€” only it can introduce and pass them. It elects the Prime Minister (the leader of the majority party/coalition). It can bring a no-confidence motion to dissolve the government. Joint sessions of Parliament, called to resolve deadlocks, are always decided in Lok Sabha's favor due to its larger membership. It approves the national budget and controls government spending.`,
  },
  {
    title: "Historical Milestones",
    content: `The first Lok Sabha was constituted on 17 April 1952 after India's first general elections. India uses the world's largest electorate â€” over 960 million voters as of 2024. The 2024 General Elections were the 18th Lok Sabha elections. The 73rd and 74th Constitutional Amendments (1992) also established a framework for local body elections, complementing parliamentary democracy at the grassroots level.`,
  },
];

const quizQuestions = [
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
];

export default function LokSabhaPage() {
  const { addPoints } = useGlobalScore();
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [quizState, setQuizState] = useState<{
    current: number;
    score: number;
    answered: boolean;
    selected: number | null;
  }>({
    current: 0,
    score: 0,
    answered: false,
    selected: null,
  });

  const lokSabhaConstituencies = constituenciesData.filter(
    c => c.type === "Lok Sabha",
  );

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
    <div className="flex flex-col gap-10 p-4 sm:p-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 t-card px-6 py-3 rounded-full border t-border mb-4">
          <Building2 className="w-6 h-6 t-accent" />
          <span className="text-sm font-bold t-accent uppercase tracking-wider">
            Lower House of Parliament
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold t-text tracking-tight">
          Lok Sabha
        </h1>
        <p className="t-muted mt-3 max-w-xl mx-auto">
          The House of the People the heart of Indian democracy where 543
          elected members represent over 1.4 billion citizens.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {lokSabhaFacts.map(fact => (
          <div
            key={fact.label}
            className="t-card border t-border rounded-2xl p-5 text-center hover:t-border-hover transition-all group hover:-translate-y-1 shadow-sm"
          >
            <fact.icon className="w-8 h-8 t-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl font-extrabold t-text">{fact.value}</p>
            <p className="text-sm t-muted mt-1">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold t-text mb-4">
          Learn About Lok Sabha
        </h2>
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="t-card border t-border rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:t-card/50 transition-colors"
            >
              <span className="text-lg font-semibold t-text">
                {section.title}
              </span>
              {openSection === idx ? (
                <ChevronUp className="w-5 h-5 t-accent" />
              ) : (
                <ChevronDown className="w-5 h-5 t-muted" />
              )}
            </button>
            {openSection === idx && (
              <div className="px-5 pb-5 t-text2 leading-relaxed border-t t-border pt-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Representatives */}
      <div>
        <h2 className="text-2xl font-bold t-text mb-4">
          Notable Constituencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lokSabhaConstituencies.map(c => (
            <div
              key={c.id}
              className="t-card border t-border rounded-2xl p-5 hover:t-card transition-all hover:-translate-y-1 shadow-sm group"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
              <h3 className="text-lg font-bold t-text">{c.name}</h3>
              <p className="text-sm t-muted">{c.state}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="t-accent font-medium">{c.representative}</p>
                  <span className="text-xs t-bg3 border t-border px-2 py-0.5 rounded-full t-text2 font-bold">
                    {c.party}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs t-muted">Voters</p>
                  <p className="text-sm font-bold t-text2">
                    {(c.voters / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Quiz */}
      <div className="t-card border t-border rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-7 h-7 t-accent" />
          <h2 className="text-2xl font-bold t-text">Test Your Knowledge</h2>
        </div>

        {quizState.current < quizQuestions.length ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm t-muted">
                Question {quizState.current + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-bold t-accent">
                Score: {quizState.score}/{quizQuestions.length}
              </span>
            </div>
            <p className="text-lg font-semibold t-text mb-5">
              {quizQuestions[quizState.current].question}
            </p>
            <div className="grid gap-3">
              {quizQuestions[quizState.current].options.map((opt, idx) => {
                const isCorrect =
                  idx === quizQuestions[quizState.current].correct;
                const isSelected = quizState.selected === idx;
                let cls = "t-bg3 border t-border t-text2 hover:t-card";
                if (quizState.answered) {
                  if (isCorrect)
                    cls =
                      "bg-green-500 scale-110 shadow-lg text-white border-green-500";
                  else if (isSelected)
                    cls = "bg-red-500/20 border-red-500/50 text-red-200";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={quizState.answered}
                    className={`w-full text-left p-4 rounded-xl transition-all ${cls} flex items-center justify-between`}
                  >
                    <span>{opt}</span>
                    {quizState.answered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                    {quizState.answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>
            {quizState.answered &&
              quizState.current < quizQuestions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-medium shadow-sm"
                >
                  Next Question 
                </button>
              )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-3xl font-extrabold t-text mb-2">
              Quiz Complete!
            </p>
            <p className="text-xl t-accent font-bold">
              Your Score: {quizState.score} / {quizQuestions.length}
            </p>
            <button
              onClick={() =>
                setQuizState({
                  current: 0,
                  score: 0,
                  answered: false,
                  selected: null,
                })
              }
              className="mt-6 px-6 py-3 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-colors font-medium border t-border"
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
