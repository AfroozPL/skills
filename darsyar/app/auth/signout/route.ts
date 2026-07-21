import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await getServerSupabase();
    await supabase.auth.signOut();
  } catch {
    // اگر Supabase تنظیم نشده باشد، فقط ریدایرکت می‌کنیم.
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
