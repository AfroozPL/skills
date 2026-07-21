import { NextResponse } from "next/server";
import { generateLesson } from "@/lib/anthropic";
import { getServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
// تولید درس ممکن است چند ده ثانیه طول بکشد.
export const maxDuration = 60;

export async function POST(request: Request) {
  let text: string;
  try {
    const body = await request.json();
    text = typeof body?.text === "string" ? body.text : "";
  } catch {
    return NextResponse.json(
      { error: "بدنه‌ی درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  if (text.trim().length < 20) {
    return NextResponse.json(
      { error: "متن جزوه خیلی کوتاه است. لطفاً متن کامل‌تری وارد کنید." },
      { status: 400 },
    );
  }

  // ۰) احراز هویت — فقط معلمِ واردشده می‌تواند درس بسازد
  let supabase;
  let userId: string;
  try {
    supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "برای ساخت درس ابتدا وارد شوید." },
        { status: 401 },
      );
    }
    userId = user.id;
  } catch (err) {
    console.error("بررسی احراز هویت ناموفق بود:", err);
    return NextResponse.json(
      { error: "خطای پیکربندی سرور. لطفاً بعداً تلاش کنید." },
      { status: 500 },
    );
  }

  // ۱) تولید درس با Claude (شامل validate + یک retry)
  let generated;
  try {
    generated = await generateLesson(text);
  } catch (err) {
    console.error("تولید درس ناموفق بود:", err);
    return NextResponse.json(
      {
        error:
          "تولید درس با هوش مصنوعی ناموفق بود. لطفاً چند لحظه بعد دوباره تلاش کنید.",
      },
      { status: 502 },
    );
  }

  // ۲) ذخیره در Supabase (RLS تضمین می‌کند owner_id باید برابر کاربر باشد)
  try {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        owner_id: userId,
        title: generated.title,
        source_text: text,
        content: { keyPoints: generated.keyPoints, terms: generated.terms },
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("ذخیره‌ی درس ناموفق بود:", err);
    return NextResponse.json(
      { error: "ذخیره‌ی درس در پایگاه داده ناموفق بود." },
      { status: 500 },
    );
  }
}
