function TableSkeleton({ title = "Loading data...", rows = 6, columns = 5 }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="mt-3 h-7 w-72 rounded bg-slate-800" />
        <p className="mt-3 text-sm text-slate-500">{title}</p>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[700px] rounded-xl bg-slate-950 p-4">
            <div
              className="grid gap-4 border-b border-slate-800 pb-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="h-4 rounded bg-slate-800" />
              ))}
            </div>

            <div className="space-y-4 pt-4">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <div key={colIndex} className="h-4 rounded bg-slate-800/80" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableSkeleton;