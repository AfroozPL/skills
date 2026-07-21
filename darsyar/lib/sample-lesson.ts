import type { Lesson } from "./types";

// درس نمونه‌ی هاردکدشده برای مرحله ۱ (بدون AI).
// موضوع: چند اصطلاح رایج انگلیسی در مکالمه‌ی روزمره.
export const sampleLesson: Lesson = {
  id: "sample",
  title: "اصطلاحات کاربردی مکالمه‌ی انگلیسی — جلسه‌ی نمونه",
  keyPoints: [
    "اصطلاح (idiom) معنایی فراتر از معنای تحت‌اللفظی کلماتش دارد؛ باید کل عبارت را یاد گرفت.",
    "هر اصطلاح را در موقعیت‌های مختلف تمرین کنید تا کاربردش ملکه‌ی ذهن شود.",
    "لحن و رسمی/غیررسمی بودن اصطلاح مهم است؛ همه جا مناسب نیستند.",
  ],
  terms: [
    {
      term: "break the ice",
      meaning: "یخ‌شکنی کردن؛ شروع صحبت در جمعی که همدیگر را نمی‌شناسند تا فضا صمیمی شود.",
      examples: [
        "At the party, John told a joke to break the ice.",
        "As a new manager, she asked everyone about their weekend to break the ice.",
        "A simple question about the weather can break the ice with a stranger.",
      ],
      quiz: {
        q: "کدام موقعیت بهترین کاربردِ «break the ice» است؟",
        options: [
          "وقتی می‌خواهی صحبت در جمعی غریبه را شروع کنی",
          "وقتی یک لیوان آب یخ می‌ریزی",
          "وقتی از کسی عصبانی هستی",
          "وقتی هوا خیلی سرد است",
        ],
        answer: 0,
      },
    },
    {
      term: "hit the books",
      meaning: "سخت درس خواندن؛ شروع به مطالعه‌ی جدی، معمولاً پیش از امتحان.",
      examples: [
        "Finals are next week, so I need to hit the books this weekend.",
        "He stopped playing games and hit the books to pass the course.",
        "If you want a scholarship, you'd better hit the books now.",
      ],
      quiz: {
        q: "معنای «hit the books» چیست؟",
        options: [
          "کتاب‌ها را پرت کردن",
          "سخت و جدی درس خواندن",
          "کتاب خریدن",
          "کتابخانه را ترک کردن",
        ],
        answer: 1,
      },
    },
    {
      term: "piece of cake",
      meaning: "کاری بسیار آسان؛ «مثل آب خوردن».",
      examples: [
        "The exam was a piece of cake; I finished it in ten minutes.",
        "Don't worry about the setup — it's a piece of cake.",
        "For an expert like her, fixing the bug was a piece of cake.",
      ],
      quiz: {
        q: "اگر کسی بگوید یک کار «a piece of cake» بود، یعنی…",
        options: [
          "کار خیلی سختی بود",
          "کار خوشمزه‌ای بود",
          "کار خیلی آسانی بود",
          "کار طولانی‌ای بود",
        ],
        answer: 2,
      },
    },
  ],
};
