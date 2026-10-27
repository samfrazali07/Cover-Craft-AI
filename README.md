# CoverCraft AI — AI Cover Letter Generator

Generate personalized, professional cover letters in seconds. Works **with** Google Gemini and
**without** any API key (offline demo/template mode).

> Implementation note: the workspace provided for this sprint is a **Next.js (App Router)**
> project rather than Vite + a separate `/api` folder. The architecture is equivalent — the
> serverless endpoint lives at `src/app/api/generate/route.ts` and is deployable to Vercel as-is.

## Features

- Two-column generator dashboard (stacked on mobile) with a polished empty state.
- Required-field validation with accessible inline error messages.
- **Phase 1 – Demo mode:** template-literal letter generation using the user's real inputs.
- **Phase 2 – Gemini AI:** `POST /api/generate` calls Gemini `gemini-2.5-flash` via the official
  `@google/genai` SDK, server-side only.
- **Phase 3 – Resume PDF parsing:** client-side text extraction with `pdfjs-dist`.
- Copy to clipboard, download `.txt`, inline editing, regenerate, clear/new letter.
- Word & character counts, AI vs Demo mode indicator, loading skeleton, error + retry UI.
- Responsive header with mobile menu, Features and How It Works sections, privacy notice.

## Tech stack

Next.js 16 (App Router, React 19) · TypeScript · Tailwind CSS v4 · `@google/genai` ·
`pdfjs-dist` · `lucide-react`.

## Project structure

```
src/
  app/
    api/generate/route.ts   # Server-side Gemini endpoint (validation, limits, timeout)
    api/health/route.ts
    page.tsx  layout.tsx  globals.css
  components/
    Header.tsx Hero.tsx Generator.tsx ResumeUploader.tsx
    CoverLetterPreview.tsx LoadingState.tsx Sections.tsx
  lib/
    generateTemplate.ts  extractPdfText.ts  types.ts
public/pdf.worker.min.mjs   # PDF.js worker served locally
.env.example  Prompts.md  README.md
```

## Local setup

```bash
npm install
cp .env.example .env        # then edit .env
npm run dev                 # http://localhost:3000
```

### Enabling real AI

1. Create an API key at <https://aistudio.google.com/apikey>.
2. Add it to `.env`:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
3. Restart the dev server.

Without the key, `/api/generate` returns HTTP 503 with a clear message and the UI offers a
one-click "Generate demo template instead" fallback. You can also tick **Use demo mode** to skip
the AI entirely.

### On Vercel

Project → **Settings → Environment Variables** → add `GEMINI_API_KEY` (Production, Preview,
Development) → redeploy. Never add it as `NEXT_PUBLIC_*`.

## Build & deploy

```bash
npm run build
npm run start      # production server
```

Deploy by importing the Git repository into Vercel (framework preset: Next.js) and setting the
environment variable above.

## Security

- The key is only read via `process.env.GEMINI_API_KEY` inside the route handler — it never
  reaches the client bundle.
- `.env`, `.env.local` and `.env.*.local` are git-ignored; `.env.example` holds placeholders only.
- Request payloads are capped (80 KB), resume text 6,000 chars, job description 4,000 chars.
- The AI request uses a 45-second abort timeout; errors are mapped to friendly messages.
- Resume text and job descriptions are explicitly framed as untrusted data in the prompt so
  embedded instructions cannot override the system rules.
- No API keys or resume contents are logged; nothing is persisted.

## Testing performed

`npx next typegen`, `tsc --noEmit`, and `npm run build` all pass. Demo-mode generation, the
validation rules, the 503 no-key path and the production start/health check were exercised
locally. Clipboard, `.txt` download and PDF parsing are browser APIs implemented per spec but
should be re-checked manually in your browser.

## Known limitations

- Scanned/image-only PDFs are **not** supported (no OCR); the uploader reports this clearly.
- Only the first 10 PDF pages are parsed.
- No authentication, payments, history or database by design.
- Markdown rendering is deliberately limited to bold/italic, rendered as React nodes (no HTML
  injection).
