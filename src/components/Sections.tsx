import {
  FileUp,
  Gauge,
  Lock,
  PenLine,
  Settings2,
  Sparkles,
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "Real AI writing", text: "Google Gemini drafts a tailored letter from your details, resume and the job description." },
  { icon: FileUp, title: "Resume parsing", text: "Upload a text-based PDF and we extract the content in your browser to personalize the letter." },
  { icon: Settings2, title: "Four tones", text: "Professional, Confident, Enthusiastic or Entry-Level — pick the voice that fits the role." },
  { icon: Gauge, title: "Demo mode", text: "No API key? The offline template engine still produces a complete, personalized letter." },
  { icon: PenLine, title: "Edit & export", text: "Edit the draft inline, copy it to the clipboard, or download it as a .txt file." },
  { icon: Lock, title: "Private by design", text: "No accounts, no database. Your API key stays server-side and resumes are never stored." },
];

const steps = [
  { n: "1", title: "Enter your details", text: "Name, role, company and key skills. Add experience and the job posting for better results." },
  { n: "2", title: "Attach your resume", text: "Optional. We read the PDF text locally in your browser and send only the text with your request." },
  { n: "3", title: "Generate & refine", text: "Gemini writes the letter (or demo mode does). Edit, regenerate, copy or download it." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Features</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <f.icon size={18} />
            </span>
            <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">How It Works</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="card p-5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {s.n}
            </span>
            <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 flex items-start gap-3 border-indigo-100 bg-indigo-50/60 p-5">
        <Lock size={18} className="mt-0.5 shrink-0 text-indigo-700" />
        <p className="text-sm text-slate-700">
          <strong className="font-semibold">Privacy & security:</strong> CoverCraft AI has no
          accounts and no database. Your Gemini API key is read server-side only and is never
          exposed to the browser. Resume files never leave your device — only the extracted text
          (capped at 6,000 characters) is sent with your generation request, and nothing is stored
          after the response is returned.
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p className="flex items-center gap-2">
          <PenLine size={15} className="text-indigo-600" /> CoverCraft AI
        </p>
        <p>Built with Next.js & Google Gemini · Letters are drafts — always review before sending.</p>
      </div>
    </footer>
  );
}
