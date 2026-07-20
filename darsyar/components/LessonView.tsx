import type { Lesson } from "@/lib/types";
import QuizCard from "./QuizCard";

export default function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          {lesson.title}
        </h1>
        <p className="mt-1 text-xs text-slate-400 tabular">
          {lesson.terms.length} اصطلاح · {lesson.keyPoints.length} نکته‌ی کلیدی
        </p>
      </header>

      {/* نکات کلیدی */}
      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-brand-700">
          <span>💡</span> نکات کلیدی
        </h2>
        <ul className="space-y-2">
          {lesson.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm leading-7 text-slate-700">
              <span className="text-brand-500">•</span>
              <span dir="auto">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* اصطلاح‌ها */}
      <section className="space-y-6">
        <h2 className="text-base font-bold text-slate-700">📖 اصطلاحات جلسه</h2>
        {lesson.terms.map((term, i) => (
          <article
            key={i}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-800 ltr">{term.term}</h3>
              <p className="mt-1 text-sm leading-7 text-slate-600" dir="auto">
                {term.meaning}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-400">
                مثال‌ها در موقعیت‌های مختلف:
              </p>
              <ul className="space-y-2">
                {term.examples.map((ex, j) => (
                  <li
                    key={j}
                    className="ltr rounded-lg bg-slate-50 px-3 py-2 text-sm leading-7 text-slate-700"
                  >
                    <span className="ml-2 text-slate-400 tabular">{j + 1}.</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-400">تمرین:</p>
              <QuizCard quiz={term.quiz} />
            </div>
          </article>
        ))}
      </section>

      <div className="text-center">
        <a href="/" className="text-sm text-brand-600 underline">
          ← ساخت درس جدید
        </a>
      </div>
    </div>
  );
}
