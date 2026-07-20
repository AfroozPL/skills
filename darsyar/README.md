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

## نقشه‌ی راه (مرحله‌به‌مرحله)

- [x] **مرحله ۱ — اسکلت با داده‌ی تستی:** صفحه‌ی معلم (paste/آپلود txt) + صفحه‌ی درس با داده‌ی نمونه‌ی هاردکد، طراحی RTL.
- [x] **مرحله ۲ — مغز AI:** endpoint تولید درس با Claude، validate خروجی JSON + یک retry، ذخیره در Supabase.
- [ ] **مرحله ۳ — کاربران:** ورود معلم با Supabase Auth، RLS، لینک عمومی درس برای دانشجو.
- [ ] **مرحله ۴ — صیقل:** حالت لودینگ، پیام‌های خطای فارسی، دکمه‌ی «تولید صوت (به‌زودی)».

## ساختار

```
darsyar/
├── app/
│   ├── layout.tsx              # چیدمان RTL + هدر/فوتر
│   ├── page.tsx                # صفحه‌ی معلم (فرم آپلود)
│   ├── lesson/[id]/page.tsx    # صفحه‌ی درس (از Supabase می‌خواند)
│   └── api/generate/route.ts   # endpoint تولید درس (Claude + validate + retry + ذخیره)
├── components/
│   ├── TeacherForm.tsx         # فرم آپلود (paste/txt) + فراخوانی API
│   ├── LessonView.tsx          # نمایش درس
│   └── QuizCard.tsx            # تمرین چهارگزینه‌ای تعاملی
├── lib/
│   ├── types.ts                # قرارداد داده‌ی درس
│   ├── sample-lesson.ts        # داده‌ی نمونه‌ی مرحله ۱
│   ├── anthropic.ts            # کلاینت Claude + منطق تولید درس
│   ├── validate.ts             # اعتبارسنجی خروجی مدل
│   └── supabase/server.ts      # کلاینت سمت‌سرور Supabase
└── supabase/
    └── schema.sql              # اسکیمای جدول lessons
```
