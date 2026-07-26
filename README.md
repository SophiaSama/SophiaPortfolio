# SophiaPortfolio — AI-Powered System Architect Portfolio

A React 19 + Vite + TypeScript portfolio website featuring an AI career assistant, remote data sync via Supabase, PDF export, and contact delegation.

---

## ✨ Features

| Feature | Implementation |
|---------|----------------|
| **AI Career Assistant** | Google Gemini (`gemini-2.5-flash-lite`) with Function Calling for structured responses |
| **Remote Data Sync** | Supabase Storage hosts `resume.md` → fetched at startup → parsed by Gemini into typed JSON |
| **PDF Export** | Playwright + `@sparticuz/chromium` (serverless-compatible) renders CV page to `Ruiping_Wang_CV.pdf` |
| **Dual View Modes** | Portfolio view (`/`) + CV view (`?view=cv`) with shared data |
| **Theme Switching** | Dark/Light mode persisted in `localStorage`, CSS variable design system |
| **Contact Delegation** | Vercel Serverless Function → Pushover push notification with visitor email & conversation summary |

---

## 🏗 Architecture

```
SophiaPortfolio/
├── App.tsx                      # Entry: view routing, PortfolioProvider, theme
├── contexts/PortfolioContext.tsx   # Data loading: Supabase → Gemini parse → merge with defaults
├── services/geminiService.ts     # Gemini client, system instruction, Function Calling (delegate_to_owner)
├── components/
│   ├── AIChat.tsx               # Chat bubbles, tool calls, Markdown rendering
│   ├── ProjectCard.tsx          # Project showcase cards
│   ├── Hero.tsx / Experience.tsx / CVPage.tsx / Header.tsx
├── data/defaults.ts             # Full default PortfolioData (projects, experience, skills, contact)
├── types.ts                     # PortfolioData, Project, Experience, SkillCategory types
└── api/contact.ts               # Vercel endpoint for Pushover notifications
```

---

## 📦 Key Dependencies

```json
{
  "react": "^19.2.3",
  "@google/genai": "^1.34.0",          // Gemini Function Calling
  "@supabase/supabase-js": "^2.45.4",   // Remote resume storage
  "playwright-core": "^1.61.1",         // PDF generation
  "@sparticuz/chromium": "^149.0.0",    // Serverless Chromium
  "lucide-react": "^0.562.0",           // Icon library
  "react-markdown": "9"                 // AI response rendering
}
```

---

## 🔑 Environment Variables

Create `.env.local` (local) or configure in Vercel (production):

```env
# Required for AI features
API_KEY=your_google_ai_studio_key

# Required for remote resume sync
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (defaults shown)
SUPABASE_STORAGE_BUCKET=SophiaCareer
SUPABASE_FILE_PATH=resume.md

# Optional: Contact delegation via Pushover
PUSHOVER_USER_KEY=your_pushover_user_key
PUSHOVER_API_TOKEN=your_pushover_app_token
```

> **Graceful degradation**: If Supabase/Gemini keys are missing, the app falls back to `data/defaults.ts` without blocking the UI.

---

## 🚀 Quick Start

```bash
cd SophiaPortfolio
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

---

## 💡 Design Highlights

- **Type-safe context**: `PortfolioContext` + `usePortfolio` hook with full TypeScript inference
- **Function Calling delegation**: AI infers visitor name from email, calls `delegate_to_owner` → Vercel → Pushover
- **CSS Variable design system**: `--ink`, `--paper`, `--copper`, `--teal`, `--band`, `--line` for seamless Dark/Light themes
- **Serverless-ready PDF**: `@sparticuz/chromium` works on Vercel/AWS Lambda without bundled binaries
- **Resume-driven content**: Single source of truth (`resume.md` in Supabase) parsed by Gemini into the exact UI schema

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio.