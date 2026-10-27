"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  Pencil,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

function renderInline(text: string, key: string) {
  // Safe markdown-lite: bold / italic only, rendered as React nodes (no HTML injection).
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={`${key}-${i}`}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
      return <em key={`${key}-${i}`}>{p.slice(1, -1)}</em>;
    }
    return <Fragment key={`${key}-${i}`}>{p}</Fragment>;
  });
}

export default function CoverLetterPreview({
  letter,
  mode,
  meta,
  onRegenerate,
  onClear,
  onEdit,
  busy,
}: {
  letter: string;
  mode: "ai" | "demo";
  meta: { name: string; role: string; company: string };
  onRegenerate: () => void;
  onClear: () => void;
  onEdit: (text: string) => void;
  busy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(letter);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const words = useMemo(() => letter.trim().split(/\s+/).filter(Boolean).length, [letter]);

  async function copy() {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError("Clipboard blocked by your browser. Select the text and copy manually.");
    }
  }

  function download() {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${meta.company || "draft"}`.replace(/\s+/g, "-").toLowerCase() + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Your Cover Letter</h3>
          <p className="text-xs text-slate-500">
            {meta.name} · {meta.role} @ {meta.company}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            mode === "ai"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {mode === "ai" ? <Sparkles size={13} /> : <FileText size={13} />}
          {mode === "ai" ? "AI Generated (Gemini)" : "Demo Mode (template)"}
        </span>
      </div>

      <div className="py-4">
        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={18}
            className="field font-mono text-sm"
            aria-label="Edit cover letter"
          />
        ) : (
          <article className="letter-body max-h-[32rem] overflow-auto whitespace-pre-wrap text-[0.95rem] text-slate-800">
            {letter.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{renderInline(para, `p${i}`)}</p>
            ))}
          </article>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        {editing ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                onEdit(draft);
                setEditing(false);
              }}
            >
              <Save size={15} /> Save changes
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setDraft(letter);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={copy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button className="btn btn-ghost" onClick={download}>
              <Download size={15} /> Download .txt
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setDraft(letter);
                setEditing(true);
              }}
            >
              <Pencil size={15} /> Edit
            </button>
            <button className="btn btn-ghost" onClick={onRegenerate} disabled={busy}>
              <RefreshCw size={15} className={busy ? "spin" : ""} /> Regenerate
            </button>
            <button className="btn btn-ghost" onClick={onClear}>
              <Trash2 size={15} /> New letter
            </button>
          </>
        )}
        <span className="ml-auto text-xs text-slate-500">
          {words} words · {letter.length} characters
        </span>
      </div>

      {copied && (
        <p role="status" className="mt-3 text-xs font-medium text-emerald-600">
          Cover letter copied to your clipboard.
        </p>
      )}
      {copyError && (
        <p role="alert" className="mt-3 text-xs font-medium text-red-600">
          {copyError}
        </p>
      )}
    </div>
  );
}
