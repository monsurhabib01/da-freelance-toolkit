# DA Freelance Toolkit

AI-powered growth engine for Data Analytics freelancers — built with React + Anthropic API.

## Modules

| Module | What it does |
|--------|-------------|
| ⚡ Proposal Generator | Paste a job description → get a client-focused, hook-first proposal under 180 words |
| 🔍 Gig SEO Optimizer | Input your current gig title → get optimized title, 5 tags, preview snippet + reasons |
| 💰 Rate Calculator | Describe a project scope → get hourly rate, fixed price, market benchmark + upsell move |
| 📋 Client Pipeline | Kanban board to track leads from first contact to done, with pipeline value stats |

## Tech Stack

- **React 18** + **Vite** — fast dev server, instant HMR
- **Anthropic Claude API** — powers all 3 AI modules via `claude-sonnet-4-20250514`
- **Inline styles** — zero CSS dependencies, fully self-contained
- **Google Fonts** — JetBrains Mono + DM Sans

## Getting Started

```bash
# 1. Clone
git clone https://github.com/monsurhabib01/da-freelance-toolkit.git
cd da-freelance-toolkit

# 2. Install
npm install

# 3. Add your Anthropic API key
cp .env.example .env
# Edit .env and add: VITE_ANTHROPIC_API_KEY=sk-ant-...

# 4. Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
da-freelance-toolkit/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config
├── package.json        # Dependencies
├── .env.example        # Environment variable template
└── src/
    ├── main.jsx        # React root mount
    └── DAToolkit.jsx   # Main app component (all 4 modules)
```

## API Key

This app calls the Anthropic API directly from the browser (fine for local use / demos).  
For production deployment, proxy the API call through a backend to protect your key.

Get your key at [console.anthropic.com](https://console.anthropic.com)

---

Built by [@monsurhabib01](https://github.com/monsurhabib01)
