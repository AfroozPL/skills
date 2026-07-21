"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = getBrowserSupabase();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          // تأیید ایمیل غیرفعال است → مستقیم وارد شد
          router.push("/dashboard");
          router.refresh();
        } else {
          setInfo(
            "ثبت‌نام انجام شد. اگر تأیید ایمیل فعال باشد، لینک تأیید به ایمیل شما ارسال شده است.",
          );
          setMode("login");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ورود/ثبت‌نام ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-2 rounded-xl bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={
              "flex-1 rounded-lg py-2 font-medium transition " +
              (mode === "login"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500")
            }
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={
              "flex-1 rounded-lg py-2 font-medium transition " +
              (mode === "signup"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500")
            }
          >
            ثبت‌نام
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {loading
              ? "لطفاً صبر کنید…"
              : mode === "login"
                ? "ورود"
                : "ساخت حساب"}
          </button>
        </form>

        {info && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
            {info}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠️ {error}
          </p>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        این صفحه فقط برای معلم‌هاست. دانشجو برای دیدن درس به ورود نیازی ندارد.
      </p>
    </div>
  );
}
