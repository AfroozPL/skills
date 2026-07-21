import type { GeneratedLesson, Quiz, Term } from "./types";

/**
 * اعتبارسنجی خروجی مدل. حتی با structured outputs، محدودیت‌های شمارشی
 * (دقیقاً ۳ مثال، دقیقاً ۴ گزینه) در سطح schema پشتیبانی نمی‌شوند،
 * پس این‌جا دستی چک می‌کنیم. اگر رد شود، endpoint یک retry می‌زند.
 */

export class LessonValidationError extends Error {}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validateQuiz(quiz: unknown, where: string): Quiz {
  if (typeof quiz !== "object" || quiz === null)
    throw new LessonValidationError(`${where}: quiz باید یک شیء باشد`);
  const q = quiz as Record<string, unknown>;
  if (!isNonEmptyString(q.q))
    throw new LessonValidationError(`${where}: صورت سؤال (q) نامعتبر است`);
  if (!Array.isArray(q.options) || q.options.length !== 4)
    throw new LessonValidationError(`${where}: باید دقیقاً ۴ گزینه داشته باشد`);
  if (!q.options.every(isNonEmptyString))
    throw new LessonValidationError(`${where}: همه‌ی گزینه‌ها باید متن باشند`);
  if (
    typeof q.answer !== "number" ||
    !Number.isInteger(q.answer) ||
    q.answer < 0 ||
    q.answer > 3
  )
    throw new LessonValidationError(`${where}: answer باید عددی بین ۰ تا ۳ باشد`);
  return { q: q.q, options: q.options as string[], answer: q.answer };
}

function validateTerm(term: unknown, i: number): Term {
  const where = `اصطلاح #${i + 1}`;
  if (typeof term !== "object" || term === null)
    throw new LessonValidationError(`${where}: باید یک شیء باشد`);
  const t = term as Record<string, unknown>;
  if (!isNonEmptyString(t.term))
    throw new LessonValidationError(`${where}: عنوان اصطلاح نامعتبر است`);
  if (!isNonEmptyString(t.meaning))
    throw new LessonValidationError(`${where}: معنی نامعتبر است`);
  if (!Array.isArray(t.examples) || t.examples.length !== 3)
    throw new LessonValidationError(`${where}: باید دقیقاً ۳ مثال داشته باشد`);
  if (!t.examples.every(isNonEmptyString))
    throw new LessonValidationError(`${where}: همه‌ی مثال‌ها باید متن باشند`);
  return {
    term: t.term,
    meaning: t.meaning,
    examples: t.examples as string[],
    quiz: validateQuiz(t.quiz, where),
  };
}

/** ورودی ناشناخته را به یک GeneratedLesson معتبر تبدیل یا خطا پرتاب می‌کند. */
export function validateGeneratedLesson(data: unknown): GeneratedLesson {
  if (typeof data !== "object" || data === null)
    throw new LessonValidationError("خروجی باید یک شیء JSON باشد");
  const d = data as Record<string, unknown>;

  if (!isNonEmptyString(d.title))
    throw new LessonValidationError("عنوان درس (title) نامعتبر است");
  if (!Array.isArray(d.keyPoints) || d.keyPoints.length === 0)
    throw new LessonValidationError("حداقل یک نکته‌ی کلیدی لازم است");
  if (!d.keyPoints.every(isNonEmptyString))
    throw new LessonValidationError("همه‌ی نکات کلیدی باید متن باشند");
  if (!Array.isArray(d.terms) || d.terms.length === 0)
    throw new LessonValidationError("حداقل یک اصطلاح لازم است");

  return {
    title: d.title,
    keyPoints: d.keyPoints as string[],
    terms: d.terms.map(validateTerm),
  };
}
