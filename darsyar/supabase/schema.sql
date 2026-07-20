-- درسیار — اسکیمای دیتابیس (مرحله ۲)
-- این فایل را در Supabase SQL Editor اجرا کنید.

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- در مرحله ۳ به مالک (معلم) گره می‌خورد؛ فعلاً nullable است.
  owner_id uuid references auth.users (id) on delete cascade,
  title text not null,
  -- متن اصلی جزوه که معلم آپلود کرده
  source_text text not null,
  -- خروجی ساختاریافته‌ی AI: { keyPoints: string[], terms: Term[] }
  content jsonb not null
);

create index if not exists lessons_owner_id_idx on public.lessons (owner_id);
create index if not exists lessons_created_at_idx on public.lessons (created_at desc);

-- توجه: RLS (امنیت سطح ردیف) در مرحله ۳ اضافه می‌شود.
-- فعلاً دسترسی فقط از سمت سرور با کلید service role انجام می‌شود.
