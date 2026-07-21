import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * کلاینت سمت‌سرور با کلید service role.
 * فقط در کدِ سرور استفاده شود — این کلید هرگز نباید به کلاینت نشت کند.
 * RLS را دور می‌زند؛ برای صفحه‌ی عمومی درس (لینک دانشجو) استفاده می‌شود
 * تا هر درس با id قابل خواندن باشد بدون نیاز به ورود.
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

/**
 * کلاینت سمت‌سرورِ مبتنی بر session کاربر (کوکی).
 * RLS اعمال می‌شود، پس هر معلم فقط ردیف‌های خودش را می‌بیند/می‌نویسد.
 * برای داشبورد و endpoint تولید درس استفاده می‌شود.
 */
export async function getServerSupabase(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "تنظیمات Supabase ناقص است. NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY را در .env.local قرار دهید.",
    );
  }
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // در Server Componentها نوشتن کوکی خطا می‌دهد؛ middleware آن را مدیریت می‌کند.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // نادیده گرفته می‌شود — refresh در middleware انجام می‌شود.
        }
      },
    },
  });
}
