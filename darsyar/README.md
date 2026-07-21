# درسیار (Darsyar)

دستیار هوشمندِ ساختِ درس زبان. معلم جزوه‌ی متنی جلسه را آپلود می‌کند، هوش مصنوعی
آن را به یک درس تعاملی (نکات کلیدی، مثال‌های متنوع، تمرین چهارگزینه‌ای) تبدیل می‌کند،
و دانشجو با یک لینک درس را می‌بیند.

## استک

- **Next.js (App Router)** + TypeScript
- **Tailwind CSS** با چیدمان RTL فارسی/انگلیسی
- **Supabase** (دیتابیس و Auth) — مرحله ۲ و ۳
- **Claude API** — مرحله ۲
- استقرار روی **Vercel**

## اجرا در محیط توسعه

```bash
cd darsyar
npm install
cp .env.example .env.local   # کلیدها را پر کنید
npm run dev
```

سپس http://localhost:3000 را باز کنید.

### راه‌اندازی مرحله ۲ (AI + دیتابیس)

۱. یک پروژه‌ی Supabase بسازید و مقادیر `.env.local` را پر کنید:

```
ANTHROPIC_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

۲. محتوای `supabase/schema.sql` را در **SQL Editor** پنل Supabase اجرا کنید تا جدول `lessons` ساخته شود.

۳. `npm run dev` را اجرا کنید، متن جزوه را وارد کنید و «✨ ساخت درس تعاملی» را بزنید — درس واقعی تولید و در دیتابیس ذخیره می‌شود.

### راه‌اندازی مرحله ۳ (کاربران + RLS)

۱. `supabase/schema.sql` را **دوباره** اجرا کنید (بخش RLS به‌صورت idempotent اضافه شده و جدول موجود را خراب نمی‌کند).

۲. در پنل Supabase → **Authentication → Providers → Email** فعال باشد. برای تجربه‌ی روان در MVP، گزینه‌ی **Confirm email** را موقتاً خاموش کنید تا ثبت‌نام بدون تأیید ایمیل مستقیم وارد شود.

۳. به `/login` بروید، حساب معلم بسازید، درس تولید کنید و در `/dashboard` فقط درس‌های خودتان را ببینید. لینک `/lesson/<id>` بدون ورود هم برای دانشجو باز می‌شود.

## نقشه‌ی راه (مرحله‌به‌مرحله)

- [x] **مرحله ۱ — اسکلت با داده‌ی تستی:** صفحه‌ی معلم (paste/آپلود txt) + صفحه‌ی درس با داده‌ی نمونه‌ی هاردکد، طراحی RTL.
- [x] **مرحله ۲ — مغز AI:** endpoint تولید درس با Claude، validate خروجی JSON + یک retry، ذخیره در Supabase.
- [x] **مرحله ۳ — کاربران:** ورود معلم با Supabase Auth، RLS، لینک عمومی درس برای دانشجو.
- [x] **مرحله ۴ — صیقل:** حالت لودینگ چرخشی + اسکلت، صفحات خطا/۴۰۴ فارسی، دکمه‌ی «تولید صوت (به‌زودی)».

## ساختار

```
darsyar/
├── middleware.ts               # refresh session روی هر درخواست
├── app/
│   ├── layout.tsx              # چیدمان RTL + هدر auth-aware
│   ├── error.tsx               # صفحه‌ی خطای فارسی (error boundary)
│   ├── not-found.tsx           # صفحه‌ی ۴۰۴ فارسی
│   ├── page.tsx                # صفحه‌ی معلم (نیازمند ورود برای ساخت)
│   ├── login/page.tsx          # ورود/ثبت‌نام معلم
│   ├── dashboard/page.tsx      # فهرست درس‌های معلم (محافظت‌شده، RLS)
│   ├── lesson/[id]/page.tsx    # صفحه‌ی عمومی درس (لینک دانشجو، بدون ورود)
│   ├── lesson/[id]/loading.tsx # اسکلت لودینگ صفحه‌ی درس
│   ├── auth/signout/route.ts   # خروج
│   └── api/generate/route.ts   # endpoint تولید درس (نیازمند احراز هویت)
├── components/
│   ├── TeacherForm.tsx         # فرم آپلود (paste/txt) + فراخوانی API
│   ├── LessonView.tsx          # نمایش درس
│   ├── QuizCard.tsx            # تمرین چهارگزینه‌ای تعاملی
│   └── ShareLink.tsx           # کپی لینک عمومی درس
├── lib/
│   ├── types.ts                # قرارداد داده‌ی درس
│   ├── sample-lesson.ts        # داده‌ی نمونه‌ی مرحله ۱
│   ├── anthropic.ts            # کلاینت Claude + منطق تولید درس
│   ├── validate.ts             # اعتبارسنجی خروجی مدل
│   └── supabase/
│       ├── server.ts           # کلاینت‌های سمت‌سرور (service role + session)
│       ├── client.ts           # کلاینت مرورگر
│       └── middleware.ts       # منطق refresh session
└── supabase/
    └── schema.sql              # اسکیمای جدول lessons + RLS
```
