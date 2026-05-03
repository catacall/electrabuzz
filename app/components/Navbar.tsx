"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Trophy, Map, Home, Bot, Sun, Moon, Menu, X, LogIn, UserPlus } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const navLinks = [
    { href: "/ai", label: "Electra", icon: Bot },
    { href: "/explore", label: "Explore", icon: Map },
    { href: "/quiz", label: "Quiz", icon: Trophy },
  ];

  return (
    <nav className="w-full t-bg2 t-border border-b sticky top-0 z-50 t-shadow transition-colors duration-300" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight t-text hover:t-accent transition-colors flex items-center gap-2 group">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 t-accent group-hover:scale-110 transition-transform" />
          Electrabuzz
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4" role="menubar">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 t-text2 hover:t-accent transition-colors group text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1" role="menuitem" aria-label={`Navigate to ${link.label}`}>
              <link.icon className="w-4 h-4 t-accent group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-(--border)" />

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full t-card t-border border hover:t-border-hover transition-all" title="Toggle theme" aria-label="Toggle theme">
            {!mounted ? <Sun className="w-4 h-4 text-amber-400" /> : theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 t-accent" />}
          </button>

          {/* Auth Buttons */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton />
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg t-text2 hover:t-text t-border border hover:t-border-hover transition-all cursor-pointer">
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover) transition-all cursor-pointer">
                      <UserPlus className="w-3.5 h-3.5" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile: theme + auth + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full t-card t-border border transition-all" aria-label="Toggle theme">
            {!mounted ? <Sun className="w-4 h-4 text-amber-400" /> : theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 t-accent" />}
          </button>

          {/* Mobile Auth */}
          {isLoaded && isSignedIn && (
            <UserButton />
          )}

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

          {/* Mobile Sign In / Sign Up (only when signed out) */}
          {isLoaded && !isSignedIn && (
            <div className="pt-2 border-t t-border flex flex-col gap-2">
              <SignInButton mode="modal">
                <button className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-sm font-medium t-text2 t-border border hover:t-card transition-all cursor-pointer">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-sm font-medium bg-(--accent) text-white hover:bg-(--accent-hover) transition-all cursor-pointer">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
