"use client";

import { useState } from "react";
import { TreePine, Users, Vote, Layers, ChevronDown, ChevronUp, HelpCircle, CheckCircle, XCircle, ArrowDown } from "lucide-react";
import constituenciesData from "../data/constituencies.json";

const panchayatFacts = [
  { label: "Gram Panchayats", value: "2.5 Lakh+", icon: TreePine },
  { label: "Elected Members", value: "31 Lakh+", icon: Users },
  { label: "Tier System", value: "3 Levels", icon: Layers },
  { label: "Constitutional Basis", value: "73rd Amendment", icon: Vote },
];

const tiers = [
  {
    name: "Zila Parishad",
    level: "District Level (Top Tier)",
    head: "Zila Pramukh / Adhyaksh",
    description: "The Zila Parishad operates at the district level and oversees all Panchayat Samitis within the district. It coordinates development plans, allocates funds from state and central government schemes (like MGNREGA, PM Awas Yojana), supervises block-level bodies, and maintains district roads, hospitals, and secondary schools. Members are elected from territorial constituencies at the district level.",
    color: "t-accent",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  {
    name: "Panchayat Samiti",
    level: "Block / Taluka Level (Middle Tier)",
    head: "Pramukh / Sabhapati",
    description: "The Panchayat Samiti functions at the block or taluka level, bridging the gap between village and district governance. It coordinates development programs for the block, manages primary health centers, implements agricultural programs, oversees primary education, and manages block-level infrastructure. Members include all Sarpanches of Gram Panchayats in the block plus directly elected members.",
    color: "t-accent",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  {
    name: "Gram Panchayat",
    level: "Village Level (Base Tier)",
    head: "Sarpanch / Gram Pradhan",
    description: "The Gram Panchayat is the foundation of rural self-governance, covering one or a cluster of villages. The Sarpanch is directly elected by the village voters. It maintains village roads, manages drinking water supply, sanitation, and street lighting. It collects local taxes and fees, implements government welfare schemes, resolves minor disputes through the Gram Sabha (village assembly where all registered voters can participate), and maintains birth/death records.",
    color: "t-accent",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
];

const sections = [
  {
    title: "What is the Panchayati Raj System?",
    content: `The Panchayati Raj is India's system of rural local self-governance. It was constitutionally established by the 73rd Constitutional Amendment Act, 1992, which added Part IX to the Constitution. The word "Panchayat" comes from "Panch" (five) â€” referring to the traditional council of five elders who governed villages. Today, it is a three-tier democratic structure covering over 6 lakh villages and approximately 65% of India's population.`
  },
  {
    title: "73rd Constitutional Amendment (1992)",
    content: `This landmark amendment made Panchayati Raj a constitutional body rather than a voluntary state provision. Key provisions include: mandatory elections every 5 years; reservation of one-third seats for women (now 50% in many states); reservation for SC/ST communities proportional to their population; establishment of State Election Commissions to conduct Panchayat elections; creation of State Finance Commissions every 5 years to review Panchayat finances; and a Gram Sabha (village assembly) for every village for direct democratic participation.`
  },
  {
    title: "Gram Sabha â€” Direct Democracy in Action",
    content: `The Gram Sabha is the most powerful democratic institution at the village level. It consists of ALL registered voters in the Panchayat area. It must meet at least twice a year (many states mandate four meetings). The Gram Sabha approves the village development plan and annual budget, identifies beneficiaries for government schemes, audits Panchayat accounts and performance, approves public works, and can question the Sarpanch directly. No development plan can be implemented without Gram Sabha approval â€” making it the purest form of direct democracy in India.`
  },
  {
    title: "Key Responsibilities",
    content: `Panchayats are responsible for 29 subjects listed in the Eleventh Schedule of the Constitution, including: agriculture and land improvement; minor irrigation and water management; animal husbandry and fisheries; social forestry; small-scale industries; rural housing; drinking water; roads, bridges, and waterways; rural electrification; poverty alleviation programs; education including primary and secondary schools; health and sanitation; women and child development; public distribution system; and maintenance of community assets.`
  },
];

const quizQuestions = [
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
];

export default function PanchayatPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [quizState, setQuizState] = useState({ current: 0, score: 0, answered: false, selected: null as number | null });

  const panchayatConstituencies = constituenciesData.filter(c => c.type === "Panchayat");

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
          <TreePine className="w-6 h-6 t-accent" />
          <span className="text-sm font-bold t-accent uppercase tracking-wider">Rural Self-Governance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold t-text tracking-tight">Panchayati Raj</h1>
        <p className="t-muted mt-3 max-w-xl mx-auto">India&apos;s three-tier system of grassroots democracy â€” empowering over 6 lakh villages with self-governance since 1992.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {panchayatFacts.map((fact) => (
          <div key={fact.label} className="t-card border t-border rounded-2xl p-5 text-center hover:t-border-hover transition-all group hover:-translate-y-1 shadow-sm">
            <fact.icon className="w-8 h-8 t-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl font-extrabold t-text">{fact.value}</p>
            <p className="text-sm t-muted mt-1">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Three-Tier Visual */}
      <div>
        <h2 className="text-2xl font-bold t-text mb-6 text-center">The Three-Tier Structure</h2>
        <div className="flex flex-col items-center gap-2">
          {tiers.map((tier, idx) => (
            <div key={idx} className="w-full">
              <div className={`t-card border rounded-2xl p-6 shadow-sm ${tier.bgColor} hover:scale-[1.01] transition-transform`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className={`text-xl font-bold ${tier.color}`}>{tier.name}</h3>
                    <p className="text-sm t-muted">{tier.level}</p>
                  </div>
                  <span className="text-sm t-bg3 border t-border px-3 py-1 rounded-full t-text2 font-bold">
                    Head: {tier.head}
                  </span>
                </div>
                <p className="t-text2 leading-relaxed text-sm">{tier.description}</p>
              </div>
              {idx < tiers.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-6 h-6 text-blue-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold t-text mb-4">Deep Dive</h2>
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
      </div>

      {/* Model Panchayats */}
      <div>
        <h2 className="text-2xl font-bold t-text mb-4">Model Panchayats of India</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {panchayatConstituencies.map(c => (
            <div key={c.id} className="t-card border t-border rounded-2xl p-5 hover:t-card transition-all hover:-translate-y-1 shadow-sm group">
              <h3 className="text-lg font-bold t-text">{c.name}</h3>
              <p className="text-sm t-muted">{c.state}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="t-accent font-medium text-sm">{c.representative}</p>
                  <span className="text-xs t-bg3 border t-border px-2 py-0.5 rounded-full t-text2">{c.party}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs t-muted">Voters</p>
                  <p className="text-sm font-bold t-text2">{c.voters.toLocaleString()}</p>
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
    </div>
  );
}

