function SkeletonCardGrid({ cards = 6 }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="mt-3 h-7 w-64 rounded bg-slate-800" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="rounded-xl bg-slate-950 p-4">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="mt-4 h-8 w-20 rounded bg-slate-800" />
              <div className="mt-3 h-3 w-32 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkeletonCardGrid;