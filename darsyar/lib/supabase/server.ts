import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * کلاینت سمت‌سرور با کلید service role.
 * فقط در کدِ سرور (API routes / Server Components) استفاده شود —
 * این کلید هرگز نباید به کلاینت نشت کند.
 *
 * در مرحله ۳، برای اعمال RLS، یک کلاینت مبتنی بر session کاربر هم اضافه می‌شود.
 */
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "تنظیمات Supabase ناقص است. NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY را در .env.local قرار دهید.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
