# SophiaPortfolio — AI-Powered System Architect Portfolio

A React 19 + Vite + TypeScript portfolio website featuring an AI career assistant, PDF export, and contact delegation.

---

## ✨ Features

| Feature | Implementation |
|---------|----------------|
| **AI Career Assistant** | Google Gemini (`gemini-2.5-flash-lite`) with Function Calling for structured responses |
| **Remote Data Sync** | **Planned / Optional** — Supabase Storage to host `resume.md` → fetched at startup → parsed by Gemini into typed JSON (see `.env.example`) |
| **PDF Export** | Playwright + `@sparticuz/chromium` (serverless-compatible) renders CV page to `Ruiping_Wang_CV.pdf` |
| **Dual View Modes** | Portfolio view (`/`) + CV view (`?view=cv`) with shared data |
| **Theme Switching** | Dark/Light mode persisted in `localStorage`, CSS variable design system |
| **Contact Delegation** | Vercel Serverless Function → Pushover push notification with visitor email & conversation summary |

---

## 🏗 Architecture

```
SophiaPortfolio/
├── App.tsx                      # Entry: view routing, PortfolioProvider, theme
├── contexts/PortfolioContext.tsx   # Data loading: Supabase → Gemini parse → merge with defaults (planned)
├── services/geminiService.ts     # Frontend AI client communicating with /api/chat
├── components/
│   ├── AIChat.tsx               # Chat bubbles, tool calls, Markdown rendering
│   ├── ProjectCard.tsx          # Project showcase cards
│   ├── Hero.tsx / Experience.tsx / CVPage.tsx / Header.tsx
├── data/defaults.ts             # Full default PortfolioData (projects, experience, skills, contact)
├── types.ts                     # PortfolioData, Project, Experience, SkillCategory types
├── api/
│   ├── chat.ts                  # Vercel endpoint for secure Gemini API calls
│   ├── contact.ts               # Vercel endpoint for Pushover & email notifications
│   └── cv-pdf.ts                # Vercel endpoint for serverless PDF generation
```

---

## 📦 Key Dependencies

```json
{
  "react": "^19.2.3",
  "@google/genai": "^1.34.0",          // Gemini Function Calling
  "@supabase/supabase-js": "^2.45.4",   // Remote resume storage (planned)
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
# Server-side key for AI chat via /api/chat (Kept server-side only)
GEMINI_API_KEY=your_google_ai_studio_key

# Optional: Remote resume sync (Planned — Supabase bucket + resume.md not yet provisioned)
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_STORAGE_BUCKET=SophiaCareer
# SUPABASE_FILE_PATH=resume.md

# Optional: Contact delegation via Pushover
PUSHOVER_USER_KEY=your_pushover_user_key
PUSHOVER_API_TOKEN=your_pushover_app_token
```

> **Graceful degradation**: If `GEMINI_API_KEY` is missing, AI chat is disabled gracefully. Supabase variables are optional — the app always falls back to `data/defaults.ts` without blocking the UI.

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
- **Resume-driven content (planned)**: Single source of truth (`resume.md` in Supabase) parsed by Gemini into the exact UI schema

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio.