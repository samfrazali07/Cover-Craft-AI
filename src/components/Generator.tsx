"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Rocket, RotateCcw, Sparkles } from "lucide-react";
import ResumeUploader, { type ResumeState } from "./ResumeUploader";
import CoverLetterPreview from "./CoverLetterPreview";
import LoadingState from "./LoadingState";
import { generateTemplate } from "@/lib/generateTemplate";
import { TONES, type LetterInput, type Tone } from "@/lib/types";

interface FormState {
  fullName: string;
  jobRole: string;
  company: string;
  skills: string;
  experience: string;
  jobDescription: string;
  tone: Tone;
  demoMode: boolean;
}

const EMPTY: FormState = {
  fullName: "",
  jobRole: "",
  company: "",
  skills: "",
  experience: "",
  jobDescription: "",
  tone: "Professional",
  demoMode: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function Generator() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [resume, setResume] = useState<ResumeState | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [mode, setMode] = useState<"ai" | "demo">("demo");
  const [meta, setMeta] = useState({ name: "", role: "", company: "" });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Please enter your full name.";
    if (!form.jobRole.trim()) e.jobRole = "Please enter the job role you are applying for.";
    if (!form.company.trim()) e.company = "Please enter the target company.";
    if (!form.skills.trim()) e.skills = "Add at least one skill (comma separated).";
    else if (form.skills.split(",").filter((s) => s.trim()).length < 1)
      e.skills = "Add at least one skill.";
    if (form.experience && !/^[\w\s.+-]{1,30}$/.test(form.experience))
      e.experience = "Use a short value like 3 or 5+.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function payload(): LetterInput {
    return {
      fullName: form.fullName.trim(),
      jobRole: form.jobRole.trim(),
      company: form.company.trim(),
      skills: form.skills.trim(),
      experience: form.experience.trim(),
      jobDescription: form.jobDescription.trim(),
      tone: form.tone,
      resumeText: resume?.text || "",
    };
  }

  function makeDemo() {
    const input = payload();
    setLetter(generateTemplate(input));
    setMode("demo");
    setMeta({ name: input.fullName, role: input.jobRole, company: input.company });
    setApiError(null);
  }

  async function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    if (loading) return;
    if (!validate()) {
      document.getElementById("fullName")?.focus();
      return;
    }
    setApiError(null);

    if (form.demoMode) {
      makeDemo();
      return;
    }

    setLoading(true);
    const input = payload();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { letter?: string; error?: string };
      if (!res.ok || !data.letter) {
        setApiError(data.error || `Request failed (${res.status}).`);
      } else {
        setLetter(data.letter);
        setMode("ai");
        setMeta({ name: input.fullName, role: input.jobRole, company: input.company });
      }
    } catch {
      setApiError("Network error — could not reach the server. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setForm(EMPTY);
    setResume(null);
    setErrors({});
    setLetter(null);
    setApiError(null);
  }

  const fields = [
    { id: "fullName", label: "Candidate Full Name *", ph: "e.g. Alex Rivera" },
    { id: "jobRole", label: "Job Role / Position *", ph: "e.g. Frontend Engineer" },
    { id: "company", label: "Target Company *", ph: "e.g. Northwind Labs" },
  ] as const;

  return (
    <section id="generator" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cover Letter Generator</h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill in your details, optionally attach a resume, and generate a tailored letter.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleGenerate} noValidate className="card p-5 md:p-6">
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label className="label" htmlFor={f.id}>
                  {f.label}
                </label>
                <input
                  id={f.id}
                  className="field"
                  placeholder={f.ph}
                  value={form[f.id]}
                  aria-invalid={!!errors[f.id]}
                  aria-describedby={errors[f.id] ? `${f.id}-err` : undefined}
                  onChange={(ev) => set(f.id, ev.target.value)}
                />
                {errors[f.id] && (
                  <p id={`${f.id}-err`} role="alert" className="mt-1 text-xs text-red-600">
                    {errors[f.id]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="label" htmlFor="skills">
                Key Skills * <span className="font-normal text-slate-400">(comma separated)</span>
              </label>
              <input
                id="skills"
                className="field"
                placeholder="React, TypeScript, REST APIs, Accessibility"
                value={form.skills}
                aria-invalid={!!errors.skills}
                onChange={(e) => set("skills", e.target.value)}
              />
              {errors.skills && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {errors.skills}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="experience">
                  Years of Experience <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="experience"
                  className="field"
                  placeholder="e.g. 4"
                  value={form.experience}
                  aria-invalid={!!errors.experience}
                  onChange={(e) => set("experience", e.target.value)}
                />
                {errors.experience && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.experience}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="tone">
                  Professional Tone
                </label>
                <select
                  id="tone"
                  className="field"
                  value={form.tone}
                  onChange={(e) => set("tone", e.target.value as Tone)}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="jobDescription">
                Job Description <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="jobDescription"
                rows={5}
                className="field"
                placeholder="Paste the job posting here for a sharper, more tailored letter."
                value={form.jobDescription}
                onChange={(e) => set("jobDescription", e.target.value.slice(0, 4000))}
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">
                {form.jobDescription.length}/4000
              </p>
            </div>

            <ResumeUploader resume={resume} onChange={setResume} />

            <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.demoMode}
                onChange={(e) => set("demoMode", e.target.checked)}
              />
              <span>
                <span className="font-semibold">Use demo mode</span> — generate with the offline
                template engine instead of Gemini. No API key required.
              </span>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {form.demoMode ? <FileText size={16} /> : <Rocket size={16} />}
              {loading ? "Generating…" : "Generate Cover Letter"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearForm} disabled={loading}>
              <RotateCcw size={15} /> Clear Form
            </button>
          </div>

          {apiError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <p className="flex items-start gap-2 font-medium">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {apiError}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-ghost" onClick={() => handleGenerate()}>
                  Retry with AI
                </button>
                <button type="button" className="btn btn-ghost" onClick={makeDemo}>
                  Generate demo template instead
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Output */}
        <div>
          {loading ? (
            <LoadingState />
          ) : letter ? (
            <CoverLetterPreview
              letter={letter}
              mode={mode}
              meta={meta}
              busy={loading}
              onRegenerate={() => handleGenerate()}
              onClear={clearForm}
              onEdit={setLetter}
            />
          ) : (
            <div className="card flex h-full flex-col items-center justify-center p-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Sparkles size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Your letter will appear here
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Complete the form and press “Generate Cover Letter”. You can edit, copy and
                download the result.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
