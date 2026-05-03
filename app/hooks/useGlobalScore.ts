import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useGlobalScore() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userScore, setUserScore] = useState<number>(0);
  const [loadingScore, setLoadingScore] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrCreateUserDoc() {
      if (!isLoaded) return;
      
      if (!isSignedIn || !user || !db) {
        if (isMounted) {
          setUserScore(0);
          setLoadingScore(false);
        }
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          if (isMounted) {
            setUserScore(docSnap.data().score || 0);
          }
        } else {
          // Initialize user in Firestore
          await setDoc(userDocRef, {
            displayName: user.fullName || user.username || "Anonymous Voter",
            photoURL: user.imageUrl || "",
            score: 0,
            createdAt: new Date(),
          });
          if (isMounted) {
            setUserScore(0);
          }
        }
      } catch (error) {
        console.error("Error fetching/creating user in Firestore:", error);
      } finally {
        if (isMounted) {
          setLoadingScore(false);
        }
      }
    }

    fetchOrCreateUserDoc();

    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, isSignedIn]);

  const addPoints = useCallback(
    async (points: number) => {
      if (!isSignedIn || !user || !db) return;

      const newScore = userScore + points;
      setUserScore(newScore); // Optimistic UI update

      try {
        const userDocRef = doc(db, "users", user.id);
        await setDoc(userDocRef, { 
          score: newScore,
          displayName: user.fullName || user.username || "Anonymous Voter",
          photoURL: user.imageUrl || ""
        }, { merge: true });
      } catch (error) {
        console.error("Error updating score in Firestore:", error);
      }
    },
    [user, isSignedIn, userScore]
  );

  return { userScore, addPoints, loadingScore };
}
