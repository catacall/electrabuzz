"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";

interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL: string;
  score: number;
}

export default function LeaderboardPage() {
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
  }, []);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8 t-card p-4 rounded-3xl border t-border shadow-sm">
        <Trophy className="w-10 h-10 t-accent" />
        <h1 className="text-3xl sm:text-4xl font-extrabold t-text tracking-tight">
          Leaderboard
        </h1>
      </div>
      
      <p className="t-muted mb-10 text-center px-4">
        Top Election Experts. Learn, answer quizzes, and climb the ranks!
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

