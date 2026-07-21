import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="text-4xl">🔍</div>
      <h1 className="mt-4 text-lg font-bold text-slate-800">درس پیدا نشد</h1>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        این درس وجود ندارد یا لینک اشتباه است. لطفاً لینک را دوباره بررسی کنید.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
