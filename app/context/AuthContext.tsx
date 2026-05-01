"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, provider, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  userScore: number;
  updateUserScore: (score: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!auth);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    if (!auth) {
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && db) {
        // Fetch or create user document
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserScore(docSnap.data().score || 0);
        } else {
          await setDoc(userDocRef, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            score: 0,
            createdAt: new Date()
          });
        }
      } else {
        setUserScore(0);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (!auth || !provider) {
      console.warn("Firebase Auth is not configured. Please check your .env.local file.");
      alert("Firebase Auth is not configured. Please add your Firebase credentials to .env.local to enable sign-in.");
      return;
    }
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserScore = async (points: number) => {
    if (!user || !db) return;
    const newScore = userScore + points;
    setUserScore(newScore);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { score: newScore }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, userScore, updateUserScore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
