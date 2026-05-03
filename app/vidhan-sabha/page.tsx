"use client";

import { useState } from "react";
import { Landmark, Users, CalendarDays, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import constituenciesData from "../data/constituencies.json";
import { useQuiz } from "@/app/hooks/useQuiz";
import QuizCard from "@/app/components/ui/QuizCard";
import type { Question } from "@/app/types";

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
    content: `The Vidhan Sabha has the power to make laws on subjects in the State List and Concurrent List of the Constitution. It controls the state government – the Chief Minister and Council of Ministers are collectively responsible to the Vidhan Sabha. It passes the state budget, approves taxation for state subjects, and can pass resolutions requesting the central government to create or alter the boundaries of states. In states with a Vidhan Parishad (upper house), Money Bills can only be introduced in the Vidhan Sabha.`
  },
  {
    title: "Vidhan Parishad (Upper House)",
    content: `Only 6 states in India have a bicameral legislature with a Vidhan Parishad (Legislative Council): Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, and Uttar Pradesh. The Vidhan Parishad acts as a revising chamber. Its members are elected indirectly by local bodies, teachers, graduates, MLAs, and the Governor. It cannot reject Money Bills but can delay them for up to 14 days.`
  },
];

const quizQuestions: Question[] = [
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
  const quiz = useQuiz({ questions: quizQuestions });

  const vidhanSabhaConstituencies = constituenciesData.filter(c => c.type === "Vidhan Sabha");

  return (
    <div className="flex flex-col gap-10 p-4 sm:p-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 t-card px-6 py-3 rounded-full border t-border mb-4">
          <Landmark className="w-6 h-6 t-accent" aria-hidden="true" />
          <span className="text-sm font-bold t-accent uppercase tracking-wider">State Legislative Assembly</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold t-text tracking-tight">Vidhan Sabha</h1>
        <p className="t-muted mt-3 max-w-xl mx-auto">The state-level legislative assembly where elected MLAs govern their respective states and represent local constituencies.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {vidhanSabhaFacts.map((fact) => (
          <div key={fact.label} className="t-card border t-border rounded-2xl p-5 text-center hover:t-border-hover transition-all group hover:-translate-y-1 shadow-sm">
            <fact.icon className="w-8 h-8 t-accent mx-auto mb-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="text-2xl font-extrabold t-text">{fact.value}</p>
            <p className="text-sm t-muted mt-1">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex t-card p-1.5 rounded-full border t-border shadow-sm" role="tablist" aria-label="Content tabs">
        {(["info", "states", "quiz"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            aria-label={tab === "info" ? "Learn tab" : tab === "states" ? "State Data tab" : "Quiz tab"}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === tab ? "t-bg3 t-accent shadow-md border t-border" : "t-muted hover:t-text"
            }`}
          >
            {tab === "info" ? "Learn" : tab === "states" ? "State Data" : "Quiz"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-3">
          {sections.map((section, idx) => (
            <div key={idx} className="t-card border t-border rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenSection(openSection === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:t-card/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                aria-expanded={openSection === idx}
                aria-label={section.title}
              >
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
        <div className="t-card border t-border rounded-3xl overflow-hidden shadow-lg" role="table" aria-label="State assemblies data">
          <div className="grid grid-cols-4 gap-4 p-4 border-b t-border t-bg3/50 text-sm font-bold t-muted" role="row">
            <span role="columnheader">State</span>
            <span className="text-center" role="columnheader">Seats</span>
            <span className="text-center" role="columnheader">Last Election</span>
            <span className="text-center" role="columnheader">Ruling Party</span>
          </div>
          {stateAssemblies.map((s, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 p-4 border-b t-border/50 last:border-0 hover:t-card/30 transition-colors text-sm" role="row">
              <span className="font-semibold t-text" role="cell">{s.state}</span>
              <span className="text-center t-text2" role="cell">{s.seats}</span>
              <span className="text-center t-text2" role="cell">{s.lastElection}</span>
              <span className="text-center" role="cell">
                <span className="t-bg3 border t-border px-2 py-0.5 rounded-full t-accent font-bold text-xs">{s.rulingParty}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "quiz" && (
        <QuizCard
          question={quiz.currentQuestion}
          quizState={quiz.quizState}
          totalQuestions={quiz.totalQuestions}
          isComplete={quiz.isComplete}
          onAnswer={quiz.handleAnswer}
          onNext={quiz.nextQuestion}
          onReset={quiz.resetQuiz}
        />
      )}
    </div>
  );
}
