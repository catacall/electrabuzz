"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogIn, LogOut, Trophy, Map, Home, Bot, Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, signIn, signOut, userScore } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/ai", label: "AI Assistant", icon: Bot },
    { href: "/explore", label: "Explore", icon: Map },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <nav className="w-full t-bg2 t-border border-b sticky top-0 z-50 t-shadow transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight t-text hover:t-accent transition-colors flex items-center gap-2 group">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 t-accent group-hover:scale-110 transition-transform" />
          Electrabuzz
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 t-text2 hover:t-accent transition-colors group text-sm font-medium">
              <link.icon className="w-4 h-4 t-accent group-hover:scale-110 transition-transform" />
              <span>{link.label}</span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full t-card t-border border hover:t-border-hover transition-all" title="Toggle theme" aria-label="Toggle theme">
            {!mounted ? <Sun className="w-4 h-4 text-amber-400" /> : theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 t-accent" />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 t-card border t-border px-3 py-1.5 rounded-full t-shadow">
              <span className="text-sm font-medium t-text">{user.displayName?.split(" ")[0]}</span>
              <span className="text-xs t-accent-bg t-accent font-bold px-2 py-0.5 rounded-full">{userScore} pts</span>
              <button onClick={signOut} className="p-1 t-muted hover:text-red-400 rounded-full transition-all" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={signIn} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-sm">
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full t-card t-border border transition-all" aria-label="Toggle theme">
            {!mounted ? <Sun className="w-4 h-4 text-amber-400" /> : theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 t-accent" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg t-text2 hover:t-text transition-colors" aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden t-bg2 t-border border-t px-4 pb-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl t-text2 hover:t-card transition-colors">
              <link.icon className="w-5 h-5 t-accent" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t t-border">
            {user ? (
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium t-text">{user.displayName}</span>
                  <span className="text-xs t-accent font-bold">{userScore} pts</span>
                </div>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm text-red-400 font-medium">Sign Out</button>
              </div>
            ) : (
              <button onClick={() => { signIn(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-xl font-medium">
                <LogIn className="w-5 h-5" />
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
