# Inkwell

An AI-powered document editor that helps you write with context. Add reference materials as knowledge, and let an intelligent AI assistant help you craft documents that draw from your sources.

## Features

- **Rich Text Editor** — Full formatting with headings, lists, quotes, code, and more
- **Knowledge Context** — Add reference documents and notes that the AI uses when helping you write
- **AI Writing Assistant** — Chat with an AI that understands your document and references to help write, edit, and expand content
- **Auto-save** — Documents save automatically as you type
- **Clean Design** — Minimal, serif-based design for a distraction-free writing experience

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion
- TipTap (rich text editor)
- Convex (backend, database, real-time)
- Clerk (authentication)
- OpenAI GPT-4o (AI assistance)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://www.convex.dev/) account
- A [Clerk](https://clerk.com/) account
- An [OpenAI](https://platform.openai.com/) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will prompt you to log in and create a new project. It will automatically set `VITE_CONVEX_URL` in your `.env.local`.

### 3. Set up Clerk

1. Create a new application at [clerk.com](https://clerk.com)
2. In the Clerk dashboard, go to **JWT Templates** and create a template named `convex`
3. Copy the **Issuer URL** from the JWT template
4. Set the environment variable in Convex:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-issuer-url
```

5. Add your Clerk publishable key to `.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
```

### 4. Set up OpenAI

```bash
npx convex env set OPENAI_API_KEY sk-your-api-key-here
```

### 5. Run the development server

In one terminal, run the Convex dev server:

```bash
npx convex dev
```

In another terminal, run the Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── documents.ts     # Document CRUD
│   ├── knowledge.ts     # Knowledge items CRUD
│   ├── messages.ts      # Chat messages CRUD
│   ├── ai.ts            # OpenAI action
│   └── http.ts          # Streaming HTTP endpoint
├── src/
│   ├── pages/           # Page components
│   ├── components/      # UI components
│   ├── lib/             # Utilities
│   └── main.tsx         # App entry point
└── .env.local           # Environment variables
```
