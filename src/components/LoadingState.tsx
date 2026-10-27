import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
      <Loader2 size={28} className="spin text-indigo-600" />
      <p className="text-sm font-semibold text-slate-800">Generating your cover letter...</p>
      <p className="text-xs text-slate-500">This usually takes a few seconds.</p>
      <div className="mt-3 w-full max-w-sm space-y-2">
        {[90, 100, 80, 95, 70].map((w, i) => (
          <div
            key={i}
            className="h-2.5 animate-pulse rounded bg-slate-200"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
