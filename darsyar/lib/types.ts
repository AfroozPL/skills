// قرارداد داده‌ی درس — این ساختار در مرحله ۲ عیناً خروجی Claude خواهد بود.
// نگه‌داشتن یک شکل واحد باعث می‌شود UI بین داده‌ی تستی و داده‌ی واقعی تفاوتی نبیند.

export interface Quiz {
  /** صورت سؤال */
  q: string;
  /** چهار گزینه */
  options: string[];
  /** ایندکس گزینه‌ی درست (۰ تا ۳) */
  answer: number;
}

export interface Term {
  /** خودِ اصطلاح یا واژه */
  term: string;
  /** معنی/توضیح کوتاه */
  meaning: string;
  /** سه مثال در موقعیت‌های متفاوت */
  examples: string[];
  /** تمرین چهارگزینه‌ای مربوط به این اصطلاح */
  quiz: Quiz;
}

export interface Lesson {
  /** شناسه‌ی یکتا (در مرحله ۲ از دیتابیس می‌آید) */
  id: string;
  /** عنوان درس */
  title: string;
  /** نکات کلیدی جلسه */
  keyPoints: string[];
  /** فهرست اصطلاحات این جلسه */
  terms: Term[];
}

/** شکل خامی که مدل تولید می‌کند (بدون id که در سرور/دیتابیس اضافه می‌شود). */
export type GeneratedLesson = Pick<Lesson, "title" | "keyPoints" | "terms">;
