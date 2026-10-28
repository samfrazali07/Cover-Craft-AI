# CoverCraft AI — AI Cover Letter Generator

CoverCraft AI is a web application that generates personalized, professional cover letters using Google Gemini AI or a built-in demo mode without an API key.

## Features

- Responsive cover letter generator dashboard.
- Form validation for candidate details and skills.
- Demo mode using personalized templates.
- Gemini AI integration through a secure server-side API.
- Resume PDF upload and text extraction.
- Copy, edit, download, and regenerate cover letters.
- Loading indicators, error handling, and retry options.

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, Google Gemini API, PDF.js, and Lucide React.

## Project Structure

- `src/app/` — Pages, layouts, and API routes.
- `src/components/` — UI components and generator form.
- `src/lib/` — Template generation, PDF extraction, and shared types.
- `public/` — Static assets and PDF.js worker.
- `.env.example` — Environment variable template.
- `Prompts.md` — AI prompting and implementation notes.

## Installation and Setup

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## AI Integration

The application uses Google's Gemini API through the server-side `/api/generate` endpoint. If the API key is unavailable, users can generate cover letters using demo mode.

## Security

- API keys are stored in environment variables.
- `.env` files are excluded from Git using `.gitignore`.
- Input validation and request limits help protect the API.
- Resume content is processed for generation without permanent storage.

## Testing

The project includes build and TypeScript checks, form validation, demo generation, API error handling, and PDF extraction. Browser features should also be tested manually.

## Deployment

Deploy the project using Vercel with the Next.js framework. Add `GEMINI_API_KEY` under **Settings → Environment Variables**, then redeploy.

## Known Limitations

- Scanned PDFs are not supported because OCR is not implemented.
- Only the first 10 PDF pages are processed.
- Authentication, payments, and database features are not included.