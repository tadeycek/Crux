# Telery

A Socratic CS learning tool that teaches algorithmic thinking through guided AI tutoring — not by giving answers, but by asking the right questions.

## What it does

Students read a problem, write a solution, and instead of being told if they're right or wrong, the AI tutor asks probing questions: *"Why did you use a hashmap here?"*, *"What happens if the input is empty?"*, *"Is there a faster approach?"* — it never gives the answer, it guides students to find it themselves.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Editor | CodeMirror 6 |
| State | Zustand + TanStack Query |
| Backend | Node.js + Express 5 + TypeScript |
| Database | Supabase (PostgreSQL) + Drizzle ORM |
| Auth | Supabase Auth |
| AI | OpenAI API (gpt-4o-mini) |
| Hosting | Render (single Docker container) |

## Dev setup

```bash
# Root (frontend)
npm install
npm run dev

# Backend (separate terminal)
cd backend && npm install && npm run dev
```

Copy `backend/.env.example` to `backend/.env` and fill in the values.

## Features (v1)

- Problem list filtered by topic and difficulty
- In-browser code editor with syntax highlighting (Python, JavaScript, Java, C++)
- Socratic AI tutor chat that reads your code and asks probing questions
- User accounts with session history and progress tracking
- Streak tracking and weak-topic detection
- Free tier: 10 AI messages per day · Pro tier: unlimited (Stripe billing)
