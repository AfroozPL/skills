"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-sm font-medium text-slate-800">{quiz.q}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isCorrect = i === quiz.answer;
          const isPicked = i === selected;

          let cls =
            "w-full rounded-lg border px-3 py-2 text-right text-sm transition ";
          if (!answered) {
            cls +=
              "border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50";
          } else if (isCorrect) {
            cls += "border-green-400 bg-green-50 text-green-800";
          } else if (isPicked) {
            cls += "border-red-400 bg-red-50 text-red-800";
          } else {
            cls += "border-slate-200 bg-white text-slate-400";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setSelected(i)}
              className={cls}
            >
              <span className="ml-2 inline-block font-semibold">
                {["الف", "ب", "ج", "د"][i]})
              </span>
              <span dir="auto">{opt}</span>
              {answered && isCorrect && <span className="float-left">✓</span>}
              {answered && isPicked && !isCorrect && (
                <span className="float-left">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3 flex items-center justify-between">
          <p
            className={
              "text-sm font-medium " +
              (selected === quiz.answer ? "text-green-700" : "text-red-700")
            }
          >
            {selected === quiz.answer ? "✅ آفرین! درست بود." : "❌ درست نبود، دوباره ببین."}
          </p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-xs text-brand-600 underline"
          >
            تلاش دوباره
          </button>
        </div>
      )}
    </div>
  );
}
