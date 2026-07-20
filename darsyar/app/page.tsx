import TeacherForm from "@/components/TeacherForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          جزوه‌ات را به یک درس تعاملی تبدیل کن
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
          متن جلسه را بنویس یا آپلود کن؛ درسیار نکات کلیدی، مثال‌های متنوع و تمرین
          چهارگزینه‌ای می‌سازد. سپس فقط کافی است لینک درس را به دانشجو بدهی.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <TeacherForm />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "📝", title: "آپلود ساده", desc: "paste متن یا فایل txt" },
          { icon: "🧠", title: "ساخت خودکار", desc: "نکات، مثال و تمرین" },
          { icon: "🔗", title: "لینک درس", desc: "اشتراک با دانشجو" },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center"
          >
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-2 text-sm font-semibold text-slate-700">
              {f.title}
            </div>
            <div className="text-xs text-slate-400">{f.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
