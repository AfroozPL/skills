"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="text-4xl">😔</div>
      <h1 className="mt-4 text-lg font-bold text-slate-800">
        متأسفانه مشکلی پیش آمد
      </h1>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        خطای غیرمنتظره‌ای رخ داد. می‌توانید دوباره تلاش کنید؛ اگر مشکل ادامه
        داشت، چند دقیقه بعد سر بزنید.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          تلاش دوباره
        </button>
        <a
          href="/"
          className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          بازگشت به خانه
        </a>
      </div>
    </div>
  );
}
