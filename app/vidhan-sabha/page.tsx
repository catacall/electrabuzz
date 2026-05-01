"use client";

import { useState } from "react";
import { Landmark, Users, CalendarDays, ChevronDown, ChevronUp, HelpCircle, CheckCircle, XCircle, MapPin } from "lucide-react";
import constituenciesData from "../data/constituencies.json";

const vidhanSabhaFacts = [
  { label: "Total States & UTs", value: "28 + 8", icon: Landmark },
  { label: "Term Duration", value: "5 Years", icon: CalendarDays },
  { label: "Largest Assembly", value: "UP (403)", icon: Users },
  { label: "Smallest Assembly", value: "Puducherry (33)", icon: MapPin },
];

const stateAssemblies = [
  { state: "Uttar Pradesh", seats: 403, lastElection: 2022, rulingParty: "BJP" },
  { state: "Maharashtra", seats: 288, lastElection: 2024, rulingParty: "Mahayuti (BJP+)" },
  { state: "West Bengal", seats: 294, lastElection: 2021, rulingParty: "TMC" },
  { state: "Tamil Nadu", seats: 234, lastElection: 2021, rulingParty: "DMK" },
  { state: "Bihar", seats: 243, lastElection: 2020, rulingParty: "NDA" },
  { state: "Rajasthan", seats: 200, lastElection: 2023, rulingParty: "BJP" },
  { state: "Madhya Pradesh", seats: 230, lastElection: 2023, rulingParty: "BJP" },
  { state: "Karnataka", seats: 224, lastElection: 2023, rulingParty: "INC" },
  { state: "Gujarat", seats: 182, lastElection: 2022, rulingParty: "BJP" },
  { state: "Kerala", seats: 140, lastElection: 2021, rulingParty: "LDF" },
  { state: "Delhi", seats: 70, lastElection: 2025, rulingParty: "BJP" },
  { state: "Punjab", seats: 117, lastElection: 2022, rulingParty: "AAP" },
];

const sections = [
  {
    title: "What is Vidhan Sabha?",
    content: `The Vidhan Sabha (Legislative Assembly) is the lower house of the state legislature in India. It is the primary elected body at the state level, where Members of the Legislative Assembly (MLAs) are directly elected by the people. Each state is divided into territorial constituencies; voters in each constituency elect one MLA through the FPTP system. The leader of the majority party or coalition becomes the Chief Minister.`
  },
  {
    title: "How are MLA elections different from MP elections?",
    content: `While both use the FPTP system, MLA elections happen at the state level for the Vidhan Sabha and MP elections at the national level for the Lok Sabha. Constituencies for MLAs are smaller and more local compared to parliamentary constituencies. A Lok Sabha constituency typically contains 5-7 Vidhan Sabha constituencies within it. State elections can happen independently of the general elections, and different states vote at different times.`
  },
  {
    title: "Powers of the Vidhan Sabha",
    content: `The Vidhan Sabha has the power to make laws on subjects in the State List and Concurrent List of the Constitution. It controls the state government â€” the Chief Minister and Council of Ministers are collectively responsible to the Vidhan Sabha. It passes the state budget, approves taxation for state subjects, and can pass resolutions requesting the central government to create or alter the boundaries of states. In states with a Vidhan Parishad (upper house), Money Bills can only be introduced in the Vidhan Sabha.`
  },
  {
    title: "Vidhan Parishad (Upper House)",
    content: `Only 6 states in India have a bicameral legislature with a Vidhan Parishad (Legislative Council): Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, and Uttar Pradesh. The Vidhan Parishad acts as a revising chamber. Its members are elected indirectly by local bodies, teachers, graduates, MLAs, and the Governor. It cannot reject Money Bills but can delay them for up to 14 days.`
  },
];

const quizQuestions = [
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
];

export default function VidhanSabhaPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"info" | "states" | "quiz">("info");
  const [quizState, setQuizState] = useState({ current: 0, score: 0, answered: false, selected: null as number | null });

  const vidhanSabhaConstituencies = constituenciesData.filter(c => c.type === "Vidhan Sabha");

  const handleAnswer = (idx: number) => {
    if (quizState.answered) return;
    setQuizState(prev => ({
      ...prev, answered: true, selected: idx,
      score: idx === quizQuestions[prev.current].correct ? prev.score + 1 : prev.score,
    }));
  };

  const nextQuestion = () => setQuizState(prev => ({ ...prev, current: prev.current + 1, answered: false, selected: null }));

  return (
    <div className="flex flex-col gap-10 p-4 sm:p-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 t-card px-6 py-3 rounded-full border t-border mb-4">
          <Landmark className="w-6 h-6 t-accent" />
          <span className="text-sm font-bold t-accent uppercase tracking-wider">State Legislative Assembly</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold t-text tracking-tight">Vidhan Sabha</h1>
        <p className="t-muted mt-3 max-w-xl mx-auto">The state-level legislative assembly where elected MLAs govern their respective states and represent local constituencies.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {vidhanSabhaFacts.map((fact) => (
          <div key={fact.label} className="t-card border t-border rounded-2xl p-5 text-center hover:t-border-hover transition-all group hover:-translate-y-1 shadow-sm">
            <fact.icon className="w-8 h-8 t-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl font-extrabold t-text">{fact.value}</p>
            <p className="text-sm t-muted mt-1">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex t-card p-1.5 rounded-full border t-border shadow-sm">
        {(["info", "states", "quiz"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all capitalize ${
              activeTab === tab ? "bg-slate-700 t-accent shadow-md border t-border" : "t-muted hover:text-slate-200"
            }`}>
            {tab === "info" ? "Learn" : tab === "states" ? "State Data" : "Quiz"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-3">
          {sections.map((section, idx) => (
            <div key={idx} className="t-card border t-border rounded-2xl overflow-hidden shadow-sm">
              <button onClick={() => setOpenSection(openSection === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:t-card/50 transition-colors">
                <span className="text-lg font-semibold t-text">{section.title}</span>
                {openSection === idx ? <ChevronUp className="w-5 h-5 t-accent" /> : <ChevronDown className="w-5 h-5 t-muted" />}
              </button>
              {openSection === idx && (
                <div className="px-5 pb-5 t-text2 leading-relaxed border-t t-border pt-4">{section.content}</div>
              )}
            </div>
          ))}

          <div className="mt-6">
            <h3 className="text-xl font-bold t-text mb-4">Notable MLA Constituencies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vidhanSabhaConstituencies.map(c => (
                <div key={c.id} className="t-card border t-border rounded-2xl p-5 hover:t-card transition-all hover:-translate-y-1 shadow-sm group">
                  <h3 className="text-lg font-bold t-text">{c.name}</h3>
                  <p className="text-sm t-muted">{c.state}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="t-accent font-medium">{c.representative}</p>
                      <span className="text-xs t-bg3 border t-border px-2 py-0.5 rounded-full t-text2 font-bold">{c.party}</span>
                    </div>
                    <span className="text-xs t-muted">{c.electionYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "states" && (
        <div className="t-card border t-border rounded-3xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-4 gap-4 p-4 border-b t-border t-bg3/50 text-sm font-bold t-muted">
            <span>State</span><span className="text-center">Seats</span><span className="text-center">Last Election</span><span className="text-center">Ruling Party</span>
          </div>
          {stateAssemblies.map((s, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 p-4 border-b t-border/50 last:border-0 hover:t-card/30 transition-colors text-sm">
              <span className="font-semibold t-text">{s.state}</span>
              <span className="text-center t-text2">{s.seats}</span>
              <span className="text-center t-text2">{s.lastElection}</span>
              <span className="text-center">
                <span className="t-bg3 border t-border px-2 py-0.5 rounded-full t-accent font-bold text-xs">{s.rulingParty}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="t-card border t-border rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-7 h-7 t-accent" />
            <h2 className="text-2xl font-bold t-text">Test Your Knowledge</h2>
          </div>
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
                    if (isCorrect) cls = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
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
                <button onClick={nextQuestion} className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-medium shadow-sm">
                  Next Question â†’
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-3xl font-extrabold t-text mb-2">Quiz Complete!</p>
              <p className="text-xl t-accent font-bold">Your Score: {quizState.score} / {quizQuestions.length}</p>
              <button onClick={() => setQuizState({ current: 0, score: 0, answered: false, selected: null })}
                className="mt-6 px-6 py-3 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-colors font-medium border t-border">
                Retry Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

