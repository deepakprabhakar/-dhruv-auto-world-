# Dhruv Auto World

Production-oriented React (Vite) showroom with Firebase Authentication (Google), Firestore chat history, and Groq-powered AI car advice for the Indian used-car market.

## Tech stack

- React 19 + Vite 8
- React Router 7
- Firebase Auth (Google) + Firestore
- Groq API (`llama-3.3-70b-versatile`)

## Prerequisites

- Node.js 20+
- A [Firebase](https://console.firebase.google.com/) project with Authentication and Firestore enabled
- A [Groq](https://console.groq.com/) API key

## Setup

1. **Clone and install**

   ```bash
   cd dhruv-auto-world
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and fill in values (Vite exposes only variables prefixed with `VITE_`):

   | Variable | Description |
   |----------|-------------|
   | `VITE_GROQ_API_KEY` | Groq API key |
   | `VITE_FIREBASE_API_KEY` | Firebase web API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
   | `VITE_FIREBASE_APP_ID` | App ID |

3. **Firebase console**

   - Enable **Google** sign-in under Authentication → Sign-in method.
   - Create a **Firestore** database (production or test mode during development).
   - Deploy rules from `firestore.rules` (Firestore → Rules), or use the Emulator for local work.

4. **Run locally**

   ```bash
   npm run dev
   ```

5. **Production build**

   ```bash
   npm run build
   npm run preview
   ```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/) and set the same `VITE_*` environment variables in Project Settings → Environment Variables.
3. The included `vercel.json` rewrites all routes to `index.html` for client-side routing.

## Firestore data model

Chats are stored per user:

- Path: `users/{uid}/chats/{chatId}`
- Fields:
  - `messages`: array of `{ role: 'user' | 'assistant', content: string }`
  - `previewTitle`: short label for the sidebar
  - `updatedAt`: server timestamp (for ordering)

## Project structure

- `src/config/firebase.js` — Firebase app init
- `src/context/AuthContext.jsx` — Google auth + session
- `src/data/cars.js` — Static inventory
- `src/pages/*` — Home (showroom), category, car detail, chat, login
- `src/services/groq.js` — Groq chat completions
- `src/constants/ai.js` — System prompt and model id

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Optimised production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Security notes

- Never commit `.env`; it is gitignored by the Vite template.
- Restrict Firestore with the provided rules so each user can only access their own `users/{uid}/chats/*` documents.
