# Electrabuzz ⚡

Electrabuzz is an interactive platform designed to educate users about Indian elections and civics. It features a modern, user-friendly interface and a powerful AI Assistant that helps you understand complex political concepts, fact-check claims, and test your knowledge through interactive quizzes.

## 🛠️ Tech Stack Explained

We built Electrabuzz using modern, powerful tools to ensure it's fast, secure, and easy to use. Here is what's under the hood in simple terms:

- **Next.js (React)**: The core framework we use to build the website. It helps us create fast-loading pages and smooth, interactive user interfaces.
- **Tailwind CSS**: A styling tool that allows us to design beautiful, responsive layouts quickly (like the dark mode cards and colorful buttons).
- **Clerk**: A secure authentication system that handles user sign-ups, logins, and profile management, keeping your data safe.
- **Vercel AI SDK**: The bridge that connects our application to powerful AI models, making it easy to stream responses directly to your screen.
- **Google Gemini API**: The "brain" behind our AI Assistant. We use the `gemini-2.5-pro` model because it's incredibly fast and smart enough to handle complex civic questions.

## 🤖 Meet Your AI Assistant

The Electrabuzz AI Assistant is your personal guide to understanding Indian elections. It has two main superpower modes:

### 1. Explain Mode 📖
Ask the AI to explain any topic related to Indian politics (e.g., "What is the Lok Sabha?" or "How do EVMs work?"). The AI will:
- Provide a clear, detailed, and easy-to-understand explanation.
- **Generate a Quick Quiz:** After explaining the topic, the AI automatically creates a multiple-choice question to test what you just learned. If you're signed in, answering correctly earns you points!

### 2. Fact-Check Mode 🛡️
Not sure if a political rumor is true? Type it in (e.g., "Is voting mandatory in India?"). The AI acts as an expert fact-checker and will:
- Give a direct verdict: **Verified**, **Misinformation**, **Needs Context**, or **Unverified**.
- Provide a confidence score.
- Explain the real facts behind the claim to help combat fake news.

---
### Getting Started Locally

If you want to run this project on your own computer:
1. Clone the repository.
2. Install dependencies by running `npm install`.
3. Create a `.env.local` file and add your `GOOGLE_GENERATIVE_AI_API_KEY` (Get one from Google AI Studio).
4. Run `npm run dev` to start the local server.
