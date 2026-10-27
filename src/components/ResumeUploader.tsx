"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { extractPdfText } from "@/lib/extractPdfText";

const MAX_BYTES = 5 * 1024 * 1024;

export interface ResumeState {
  name: string;
  size: number;
  text: string;
  truncated: boolean;
}

export default function ResumeUploader({
  resume,
  onChange,
}: {
  resume: ResumeState | null;
  onChange: (r: ResumeState | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setBusy(true);
    try {
      const result = await extractPdfText(file);
      onChange({
        name: file.name,
        size: file.size,
        text: result.text,
        truncated: result.truncated,
      });
    } catch (e) {
      onChange(null);
      setError(e instanceof Error ? e.message : "Failed to read the PDF.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">Upload Resume (optional, PDF)</span>
      <input
        ref={inputRef}
        id="resume"
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!resume ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <button
            type="button"
            className="btn btn-ghost mx-auto"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
            {busy ? "Reading PDF…" : "Choose PDF file"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Max 5 MB. Text is extracted in your browser and only sent when you generate.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-start gap-3">
            <FileText size={18} className="mt-0.5 shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{resume.name}</p>
              <p className="text-xs text-slate-600">
                {(resume.size / 1024).toFixed(0)} KB · {resume.text.length} characters extracted
                {resume.truncated ? " (truncated)" : ""}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 size={13} /> Resume text extracted successfully
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-slate-500">
                  Preview extracted text
                </summary>
                <p className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-2 text-[11px] text-slate-600">
                  {resume.text.slice(0, 800)}
                </p>
              </details>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                className="btn btn-ghost px-2 py-1 text-xs"
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </button>
              <button
                type="button"
                className="btn btn-ghost px-2 py-1 text-xs"
                onClick={() => onChange(null)}
                aria-label="Remove resume"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
