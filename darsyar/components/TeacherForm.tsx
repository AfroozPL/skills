"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const LOADING_MESSAGES = [
  "در حال خواندن جزوه…",
  "استخراج اصطلاح‌های کلیدی…",
  "ساخت مثال‌های متنوع…",
  "طراحی تمرین‌های چهارگزینه‌ای…",
  "آماده‌سازی درس نهایی…",
];

export default function TeacherForm() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // چرخش پیام‌های لودینگ برای اطمینان‌بخشی در انتظارِ نسبتاً طولانی
  useEffect(() => {
    if (!loading) {
      setMsgIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [loading]);

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error ??
            "متأسفانه مشکلی پیش آمد. لطفاً چند لحظه بعد دوباره تلاش کنید.",
        );
      }
      router.push(`/lesson/${data.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
      );
      setLoading(false);
    }
  }

  const charCount = text.trim().length;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <p className="text-sm font-medium text-brand-700">
          {LOADING_MESSAGES[msgIndex]}
        </p>
        <p className="max-w-xs text-xs leading-6 text-slate-400">
          هوش مصنوعی در حال ساخت درس شماست. این کار ممکن است تا یک دقیقه طول
          بکشد؛ لطفاً صفحه را نبندید.
        </p>
      </div>
    );
  }

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
          placeholder="متن جزوه را این‌جا paste کنید… (یا فایل txt آپلود کنید)"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-7 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
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
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
          disabled={charCount === 0}
          className="rounded-xl bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✨ ساخت درس تعاملی
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          ⚠️ {error}
        </p>
      )}
    </form>
  );
}
