"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherForm() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
    setFileName(file.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "خطای ناشناخته رخ داد.");
      }
      router.push(`/lesson/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته رخ داد.");
      setLoading(false);
    }
  }

  const charCount = text.trim().length;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="lesson-text"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          متن جزوه‌ی جلسه
        </label>
        <textarea
          id="lesson-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFileName(null);
          }}
          rows={10}
          dir="auto"
          disabled={loading}
          placeholder="متن جزوه را این‌جا paste کنید… (یا فایل txt آپلود کنید)"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-7 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span className="tabular">{charCount} کاراکتر</span>
          {fileName && <span>فایل: {fileName}</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          📎 آپلود فایل txt
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="submit"
          disabled={charCount === 0 || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              در حال ساخت درس…
            </>
          ) : (
            <>✨ ساخت درس تعاملی</>
          )}
        </button>
      </div>

      {loading && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
          هوش مصنوعی در حال تبدیل جزوه به درس تعاملی است. این کار ممکن است تا یک
          دقیقه طول بکشد؛ لطفاً صفحه را نبندید.
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          ⚠️ {error}
        </p>
      )}
    </form>
  );
}
