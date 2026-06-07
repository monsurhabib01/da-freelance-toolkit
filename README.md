# DA Freelance Toolkit

AI-powered growth engine for Data Analytics freelancers — built with React + Express + Anthropic API.

## Modules

| Module | What it does |
|--------|--------------|
| ⚡ Proposal Generator | Paste a job description → get a client-focused, hook-first proposal under 180 words |
| 🔍 Gig SEO Optimizer | Input your current gig title → get optimized title, 5 tags, preview snippet + reasons |
| 💰 Rate Calculator | Describe a project scope → get hourly rate, fixed price, market benchmark + upsell move |
| 📋 Client Pipeline | Kanban board to track leads from first contact to done, with pipeline value stats |

## Architecture

```
Browser (React)
    ↓  POST /api/chat  (no API key)
Express Server  (server/index.js)
    ↓  adds x-api-key header from .env
Anthropic API
```

The API key lives only in `.env` on the server. It is never bundled into the frontend or exposed in the browser.

## Tech Stack

- **React 18** + **Vite** — fast dev server, instant HMR
- **Express** — lightweight Node.js backend proxy
- **Anthropic Claude API** — powers all 3 AI modules via `claude-sonnet-4-20250514`
- **dotenv** — loads API key from `.env` at runtime
- **concurrently** — runs backend + frontend in one terminal

## Getting Started

```bash
# 1. Clone
git clone https://github.com/monsurhabib01/da-freelance-toolkit.git
cd da-freelance-toolkit

# 2. Install
npm install

# 3. Add your API key
cp .env.example .env
# Open .env and set: ANTHROPIC_API_KEY=sk-ant-...

# 4. Run both servers with one command
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The terminal will show:
```
✓ API proxy running on http://localhost:3001
✓ API key loaded: YES
```

## Project Structure

```
da-freelance-toolkit/
├── server/
│   └── index.js        ← Express proxy server (API key lives here)
├── src/
│   ├── main.jsx        ← React root mount
│   └── DAToolkit.jsx   ← Main app component (4 modules)
├── index.html
├── vite.config.js  ← Proxy config: /api → localhost:3001 in dev
├── package.json
├── .env            ← YOUR API KEY (never commit this)
└── .env.example    ← safe template to commit
```

## Deploy to Production

```bash
npm run build        # builds React into /dist
npm start            # Express serves /dist + handles /api/chat
```

Set `ANTHROPIC_API_KEY` as an environment variable on your host (Railway, Render, VPS, etc.). Never hardcode it.

---

Built by [@monsurhabib01](https://github.com/monsurhabib01)
