import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";

interface LessonRow {
  id: string;
  title: string;
  created_at: string;
}

export default async function DashboardPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // RLS تضمین می‌کند فقط درس‌های همین معلم برگردند.
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  const lessons = (data ?? []) as LessonRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">درس‌های من</h1>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          ✨ ساخت درس جدید
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          ⚠️ خطا در خواندن درس‌ها: {error.message}
        </p>
      )}

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-3xl">📭</div>
          <p className="mt-3 text-sm text-slate-500">
            هنوز درسی نساخته‌اید. با «ساخت درس جدید» شروع کنید.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {lesson.title}
                </p>
                <p className="text-xs text-slate-400 tabular">
                  {new Date(lesson.created_at).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <Link
                href={`/lesson/${lesson.id}`}
                className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-50"
              >
                مشاهده / لینک درس ↗
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
