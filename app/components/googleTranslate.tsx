"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (options: GoogleTranslateOptions, elementId: string): void;
          InlineLayout: {
            SIMPLE: number;
            VERTICAL: number;
            HORIZONTAL: number;
          };
        };
      };
    };
  }
}

interface GoogleTranslateOptions {
  pageLanguage: string;
  includedLanguages?: string;
  layout?: number;
  autoDisplay?: boolean;
}

export default function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (!window.google?.translate) {
        console.error("Google Translate not available");
        setError("Google Translate not available");
        return;
      }

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,pa,bn,te,mr,ta",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element",
        );
      } catch (err) {
        console.error("Error initializing Google Translate:", err);
        setError("Failed to initialize translation");
      }
    };

    // Check if already loaded
    if (window.google?.translate) {
      setTimeout(() => {
        initializeGoogleTranslate();
        setIsLoaded(true);
      }, 0);
      return;
    }

    // Set up the initialization function
    window.googleTranslateElementInit = () => {
      initializeGoogleTranslate();
      setIsLoaded(true);
    };

    // Load the Google Translate script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      setError("Failed to load Google Translate");
      console.error("Failed to load Google Translate script");
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      delete window.googleTranslateElementInit;
      // Optional: remove the script if needed
      const existingScript = document.querySelector(
        'script[src*="translate.google.com"]',
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div id="google_translate_element" className="mt-2"></div>
      {!isLoaded && !error && (
        <div className="text-sm text-gray-400 mt-2">Loading translator...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 mt-2">
          {error} - Please refresh the page
        </div>
      )}
    </div>
  );
}
