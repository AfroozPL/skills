import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "درسیار — دستیار هوشمند درس زبان",
  description:
    "جزوه‌ی متنی جلسه را آپلود کنید؛ درسیار آن را به یک درس تعاملی برای دانشجو تبدیل می‌کند.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-bold text-brand-700">درسیار</span>
            </a>
            <span className="text-xs text-slate-400">MVP · نسخه‌ی آزمایشی</span>
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
