import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Electrabuzz – Learn Indian Elections",
  description: "Interactive platform to explore and learn about the Indian election process",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="t-bg t-text min-h-screen transition-colors duration-300 antialiased">
        <ThemeProvider>
          <ClerkProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto min-h-screen flex flex-col px-4">
              {children}
            </main>
          </ClerkProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
          />
        )}
      </body>
    </html>
  );
}