import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "درسیار — دستیار هوشمند درس زبان",
  description:
    "جزوه‌ی متنی جلسه را آپلود کنید؛ درسیار آن را به یک درس تعاملی برای دانشجو تبدیل می‌کند.",
};

async function getUserEmail(): Promise<string | null> {
  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getUserEmail();

  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* فونت فارسی وزیرمتن — در صورت نبود شبکه به فونت سیستمی برمی‌گردد */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
      </head>
      <body className="font-sans min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-bold text-brand-700">درسیار</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {email ? (
                <>
                  <Link
                    href="/dashboard"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    درس‌های من
                  </Link>
                  <span className="hidden text-xs text-slate-400 sm:inline">
                    {email}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
                    >
                      خروج
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  ورود معلم
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 py-8 text-center text-xs text-slate-400">
          ساخته‌شده با ❤️ برای معلم‌های زبان
        </footer>
      </body>
    </html>
  );
}
