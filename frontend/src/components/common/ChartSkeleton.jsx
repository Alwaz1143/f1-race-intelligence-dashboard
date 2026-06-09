function ChartSkeleton({ title = "Loading chart..." }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="mt-3 h-7 w-72 rounded bg-slate-800" />
        <p className="mt-3 text-sm text-slate-500">{title}</p>

        <div className="mt-6 h-[300px] rounded-2xl bg-slate-950 p-5">
          <div className="flex h-full items-end gap-4">
            <div className="h-1/2 flex-1 rounded-t-lg bg-slate-800" />
            <div className="h-2/3 flex-1 rounded-t-lg bg-slate-800" />
            <div className="h-1/3 flex-1 rounded-t-lg bg-slate-800" />
            <div className="h-3/4 flex-1 rounded-t-lg bg-slate-800" />
            <div className="h-1/2 flex-1 rounded-t-lg bg-slate-800" />
            <div className="h-4/5 flex-1 rounded-t-lg bg-slate-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChartSkeleton;