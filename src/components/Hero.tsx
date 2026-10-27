import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} /> Powered by Google Gemini
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Your Next Opportunity Starts With the Right Words.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Create a personalized, professional cover letter in seconds with AI.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#generator" className="btn btn-primary">
              Generate My Cover Letter <ArrowRight size={16} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              How It Works
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No sign-up. No resume storage. Works in demo mode without an API key.
          </p>
        </div>

        <div className="card relative p-6">
          <div className="absolute -top-3 left-6 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
            Preview
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">Dear Hiring Manager at Northwind Labs,</p>
            <p>
              My name is Alex Rivera, and I am writing to apply for the Frontend Engineer position.
              The role aligns closely with my background in React, TypeScript and design systems.
            </p>
            <p>
              Over the past four years I have shipped accessible interfaces used by thousands of
              people daily, focusing on performance and clear collaboration with design partners.
            </p>
            <p className="text-slate-400">Sincerely, Alex Rivera</p>
          </div>
        </div>
      </div>
    </section>
  );
}
