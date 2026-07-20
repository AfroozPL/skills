"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherForm() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
    setFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // مرحله ۱: هنوز AI نداریم؛ فقط جریان را نشان می‌دهیم و درس نمونه را باز می‌کنیم.
    // در مرحله ۲ این‌جا متن به endpoint تولید درس ارسال می‌شود.
    router.push("/lesson/sample");
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

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        مرحله ۱ (اسکلت): فعلاً دکمه‌ی ساخت، یک درس نمونه‌ی آماده را باز می‌کند. در
        مرحله ۲ متن شما واقعاً به هوش مصنوعی سپرده می‌شود.
      </p>
    </form>
  );
}
