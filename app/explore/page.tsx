"use client";

import { useState } from "react";
import constituenciesData from "../data/constituencies.json";
import { Search, MapPin, User, Calendar, Users } from "lucide-react";

const filters = ["All", "Lok Sabha", "Vidhan Sabha", "Panchayat"] as const;

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>("All");

  const filteredConstituencies = constituenciesData.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || c.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatVoters = (voters: number) => {
    if (voters >= 100000) return `${(voters / 100000).toFixed(1)}L`;
    if (voters >= 1000) return `${(voters / 1000).toFixed(1)}K`;
    return voters.toString();
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 t-text flex items-center gap-2">
        <MapPin className="t-accent w-8 h-8" />
        Election Explorer
      </h1>
      <p className="t-muted mb-8 text-center max-w-lg px-4">
        Search across {constituenciesData.length} constituencies â€” Lok Sabha, Vidhan Sabha, and Panchayat.
      </p>

      {/* Search */}
      <div className="relative w-full max-w-2xl mb-6 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 t-muted group-focus-within:t-accent transition-colors" />
        </div>
        <input
          type="text"
          className="w-full t-card border t-border rounded-2xl py-4 pl-12 pr-4 t-text placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg shadow-sm"
          placeholder="Search constituency, state, party, or representative..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex t-card p-1.5 rounded-full border t-border mb-8 w-full max-w-xl shadow-sm">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeFilter === f ? "bg-slate-700 t-accent shadow-md border t-border" : "t-muted hover:t-text"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm t-muted mb-4 w-full px-2">
        Showing {filteredConstituencies.length} of {constituenciesData.length} constituencies
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full px-2">
        {filteredConstituencies.map((c) => (
          <div key={c.id} className="t-card border t-border rounded-2xl p-5 hover:t-card transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 cursor-default">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold t-text flex items-center gap-2">
                  <MapPin className="w-4 h-4 t-accent group-hover:scale-110 transition-transform shrink" />
                  {c.name}
                </h2>
                <p className="text-sm t-muted ml-6">{c.state}</p>
              </div>
              <span className="text-xs t-bg3 border t-border px-2 py-1 rounded-full t-accent font-bold shrink ">
                {c.type === "Lok Sabha" ? "LS" : c.type === "Vidhan Sabha" ? "VS" : "PR"}
              </span>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 t-text2">
                <User className="w-4 h-4 t-accent shrink" />
                <span className="font-medium t-text text-sm truncate">{c.representative}</span>
                <span className="text-xs t-bg3 border t-border px-2 py-0.5 rounded-full t-text2 font-bold shrink">{c.party}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 t-text2">
                  <Calendar className="w-4 h-4 t-accent" />
                  <span className="text-sm">{c.electionYear}</span>
                </div>
                <div className="flex items-center gap-2 t-text2">
                  <Users className="w-4 h-4 t-accent" />
                  <span className="text-sm font-medium">{formatVoters(c.voters)} voters</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredConstituencies.length === 0 && (
          <div className="col-span-full text-center py-12 t-muted">
            No constituencies found matching &quot;{searchTerm}&quot; in {activeFilter}
          </div>
        )}
      </div>
    </div>
  );
}

