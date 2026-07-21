import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** کلاینت مرورگر برای کامپوننت‌های کلاینتی (فرم ورود/ثبت‌نام). */
export function getBrowserSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "تنظیمات Supabase ناقص است. متغیرهای NEXT_PUBLIC_SUPABASE_* را تنظیم کنید.",
    );
  }
  return createBrowserClient(url, key);
}
