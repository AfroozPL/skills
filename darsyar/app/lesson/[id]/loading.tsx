export default function LessonLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-6 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-100" />
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <div className="h-4 w-1/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>

      {[0, 1].map((i) => (
        <div
          key={i}
          className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5"
        >
          <div className="h-5 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
          <div className="h-16 w-full rounded bg-slate-50" />
        </div>
      ))}
    </div>
  );
}
