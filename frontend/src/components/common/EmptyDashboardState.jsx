function EmptyDashboardState() {
  return (
    <section className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          Getting Started
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100">
          Select a race session to begin analysis
        </h2>

        <p className="mt-3 text-slate-400">
          Choose a season, Grand Prix, and session to load dashboard insights
          such as overview cards, fastest laps, driver comparison, and race
          control messages.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xl font-bold text-red-400">01</p>
            <p className="mt-2 font-semibold text-slate-100">Season</p>
            <p className="mt-1 text-sm text-slate-500">
              Pick the F1 season year.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xl font-bold text-red-400">02</p>
            <p className="mt-2 font-semibold text-slate-100">Grand Prix</p>
            <p className="mt-1 text-sm text-slate-500">
              Select the race weekend.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xl font-bold text-red-400">03</p>
            <p className="mt-2 font-semibold text-slate-100">Session</p>
            <p className="mt-1 text-sm text-slate-500">
              Choose Race, Qualifying, or Practice.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xl font-bold text-red-400">04</p>
            <p className="mt-2 font-semibold text-slate-100">Analyze</p>
            <p className="mt-1 text-sm text-slate-500">
              View analytics and comparisons.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmptyDashboardState;