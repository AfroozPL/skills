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

-- ============================================================
-- مرحله ۳ — امنیت سطح ردیف (RLS)
-- این بخش را روی جدول موجود هم می‌توانید دوباره اجرا کنید (idempotent).
-- ============================================================

alter table public.lessons enable row level security;

-- هر معلم فقط ردیف‌های خودش را می‌بیند/می‌سازد/ویرایش/حذف می‌کند.
drop policy if exists "teachers manage own lessons" on public.lessons;
create policy "teachers manage own lessons"
  on public.lessons
  for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- توجه: صفحه‌ی عمومی درس (لینک دانشجو) از سمت سرور با کلید service role
-- خوانده می‌شود که RLS را دور می‌زند، پس نیازی به policy عمومی SELECT نیست.
-- به همین دلیل، فهرست درس‌های یک معلم برای بقیه قابل مشاهده نیست.
