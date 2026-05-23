# Crux (think.dev)

A Socratic CS learning tool that teaches algorithmic thinking through guided AI tutoring — not by giving answers, but by asking the right questions.

## What it does

Students read a problem, write a solution, and instead of being told if they're right or wrong, the AI tutor asks probing questions: *"Why did you use a hashmap here?"*, *"What happens if the input is empty?"*, *"Is there a faster approach?"* — it never gives the answer, it guides students to find it themselves.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Editor | CodeMirror 6 |
| State | Zustand + TanStack Query |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL) + Drizzle ORM |
| Auth | Supabase Auth |
| AI | OpenAI API (gpt-4o-mini) |
| Hosting | Vercel (frontend) + Railway (backend) |

## Dev setup

```bash
npm install
npm run dev
```

## Features (v1)

- Problem list filtered by topic and difficulty
- In-browser Python code editor with syntax highlighting
- Socratic AI tutor chat that reads your code and asks probing questions
- User accounts with session history and progress tracking
- Streak tracking and weak-topic detection
