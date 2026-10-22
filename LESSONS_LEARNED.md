# Development Experience & Lessons Learned: Securing LLM API Keys in Modern Web Apps

## 1. Executive Summary

During a security review of the production build artifacts, a private Gemini API key was identified embedded as plain text inside the frontend JavaScript chunk (`dist/assets/index-*.js`).

Although the key was not tracked by Git (`dist/` is listed in `.gitignore`), any visitor inspecting DevTools on a deployed instance could extract the key directly. This incident led to a full architectural overhaul: eliminating build-time secret injection and transitioning LLM client calls to serverless proxy functions.

---

## 2. Root Cause Analysis

### 2.1 The Vite `loadEnv` Filter Bypass
Vite protects developers against accidental secret leakage by restricting environment variables loaded into client code to those prefixed with `VITE_`.

In `vite.config.ts`, the following configuration was present:

```typescript
// ❌ Dangerous configuration
const env = loadEnv(mode, '.', '');
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

- **The empty prefix `''`**: Passing an empty string as the third parameter to `loadEnv(mode, '.', '')` disables Vite's prefix filter. This loaded every secret variable from `.env` and `.env.local` into the Vite build process.
- **Literal AST Replacement (`define`)**: Vite’s `define` performs static textual replacements during compilation. Wherever source code referenced `process.env.API_KEY`, the bundler replaced it with the actual key literal string (e.g., `const t = "AIzaSy..."`).

### 2.2 The Fallacy of Client-Side Secret Naming
Renaming the variable to `VITE_GEMINI_API_KEY` would **not** have solved the issue. Any variable prefixed with `VITE_` is automatically exposed to client-side code by design. 

> [!IMPORTANT]
> **Fundamental Security Principle**:
> No secret or private API key should ever be delivered to the client browser runtime. If the browser needs to use a private key, that architecture is inherently insecure.

---

## 3. Architecture Comparison: Before vs. After

### ❌ Before (Client-Side Direct Invocation)

```
[ Browser / Client ]
  ├── components/AIChat.tsx
  └── services/geminiService.ts
        │
        ├── Embedded GEMINI_API_KEY (Leaked in JS bundle)
        └── Direct network call to Google Gemini API
```

- **Risks**:
  - API key visible in network requests and bundle chunks.
  - Quota theft and rate-limit exhaustion by unauthorized users.
  - Client bundle bloated with LLM SDK dependencies (`@google/genai`).

---

###  After (Serverless Backend Proxy)

```
[ Browser / Client ]
  ├── components/AIChat.tsx
  └── services/geminiService.ts (Stateless HTTP client)
        │
        │ HTTP POST /api/chat (No keys exposed)
        ▼
[ Vercel Serverless Function ]
  └── api/chat.ts (Server-side runtime)
        │
        ├── Reads process.env.GEMINI_API_KEY (Server memory only)
        └── Calls Google Gemini API (@google/genai)
```

- **Benefits**:
  - **Zero credential leakage**: `$GEMINI_API_KEY` exists solely inside the serverless runtime environment.
  - **Leaner frontend bundle**: Removed `@google/genai` and related SDK overhead from the client bundle (bundle size reduced from **807 kB** to **550 kB**, a ~32% reduction).
  - **Centralized governance**: Rate limiting, prompt validation, and model switching happen server-side without rebuilding client code.

---

## 4. Key Implementation Steps

1. **Purged Compile-Time Defines**:
   Cleaned [vite.config.ts](file:///Users/ruiping/projects/MyPortFolio/SophiaPortfolio/vite.config.ts) to a standard configuration with no `loadEnv` prefix overrides and no secret substitution.

2. **Created Serverless Chat Endpoint**:
   Implemented [api/chat.ts](file:///Users/ruiping/projects/MyPortFolio/SophiaPortfolio/api/chat.ts) supporting:
   - `chat`: Multi-turn conversational completion with history.
   - `toolResponse`: Function calling flow for visitor inquiry delegation (`delegate_to_owner`).
   - `parseResume`: Structured markdown parsing.
   - Graceful fallback (503 response if the server API key is unconfigured).

3. **Decoupled Frontend Service**:
   Updated [services/geminiService.ts](file:///Users/ruiping/projects/MyPortFolio/SophiaPortfolio/services/geminiService.ts) to interface with `/api/chat` using standard `fetch`, retaining seamless backwards compatibility with UI components.

4. **Updated Serverless Configuration**:
   Configured [vercel.json](file:///Users/ruiping/projects/MyPortFolio/SophiaPortfolio/vercel.json) to allocate standard execution limits for the `/api/chat` route.

---

## 5. Security Checklist & Best Practices for Future Projects

| Category | Rule | Verification Method |
| :--- | :--- | :--- |
| **Env Variables** | Never use `loadEnv(mode, '.', '')` with an empty prefix string. | Code review of `vite.config.ts`. |
| **Vite Prefixes** | Only prefix public, non-secret configuration with `VITE_` (e.g. public endpoints, analytics IDs). | Grep `.env*` for `VITE_` prefixes. |
| **Backend Delegation** | Any call requiring an API key, bearer token, or secret must route through server-side functions (e.g., `/api/*`). | Architectural boundary audits. |
| **Bundle Audit** | Inspect output chunks in `dist/assets/` for sensitive patterns before deployment. | `grep -ri "AIza" dist/` or automated CI bundle scanning. |
| **Credential Rotation** | If an API key is ever embedded into a client bundle, immediately revoke and regenerate it at the provider level. | Cloud console / Google AI Studio rotation. |
| **Defensive Code** | Guard against browser reference errors when checking environment variables (e.g., `typeof process !== 'undefined'`). | Runtime test in production preview. |
