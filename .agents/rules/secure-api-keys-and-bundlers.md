# Secure API Keys & Frontend Bundler Hygiene

## 1. Frontend Bundlers & Environment Variables
- **Preserve Prefix Isolation**: Never disable the bundler's environment variable filter (e.g., never pass an empty string `''` as the prefix filter to Vite's `loadEnv(mode, '.', '')`).
- **No Private Keys in `define`**: Never map private credentials (e.g., `GEMINI_API_KEY`, `OPENAI_API_KEY`, database passwords, private tokens) in `define` or bundler string substitution blocks.
- **Client Prefixes are Public**: Any variable prefixed with `VITE_`, `NEXT_PUBLIC_`, or `REACT_APP_` is bundled in plain text into client-side code and is visible to anyone inspecting developer tools. Only use these for non-sensitive public values.

## 2. LLM & Third-Party API Architecture
- **Serverless / Backend Proxy Required**: Any service call that requires a secret API key or authentication bearer token MUST be executed in a server-side environment (e.g., Vercel serverless function `/api/*`, Node.js backend, Cloudflare Worker).
- **Stateless Client Pattern**: Frontend UI components must communicate with backend proxy routes via standard HTTP (`fetch`). The browser should never directly instantiate client SDKs with developer secret keys.
- **Bundle Tree Shaking**: Do not import private server-only SDKs into frontend component files; this protects secrets and significantly reduces client bundle size.

## 3. Build Verification
- After modifying build configurations or environment handling, verify production build output (`npm run build`).
- Verify that output files in `dist/` or `.next/` do not match sensitive regex patterns (e.g., `AIza[0-9A-Za-z-_]{35}`, `sk-[0-9A-Za-z]{32,}`).
