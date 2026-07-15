const tabs = [
  {
    id: "overview",
    label: "Overview",
    description: "Race summary and AI insights",
  },
  {
    id: "classification",
    label: "Classification",
    description: "Final race result",
  },
  {
    id: "fastest-laps",
    label: "Fastest Laps",
    description: "Leaderboard and chart",
  },
  {
    id: "compare",
    label: "Compare Drivers",
    description: "Lap-time comparison",
  },
  {
    id: "race-control",
    label: "Race Control",
    description: "Messages and events",
  },
];
function DashboardTabs({ activeTab, onTabChange }) {
  return (
    <section className="card-gradient mt-8 rounded-xl border p-6 sm:p-7 animate-slide-in-up">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
          Analysis Sections
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Explore Session Data
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Switch between different analysis views without losing the selected
          race session.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg border p-4 text-left transition-all duration-300 hover-lift ${isActive
                ? "border-red-500/60 bg-gradient-to-br from-red-600/20 to-red-900/10 shadow-lg shadow-red-500/20 scale-105"
                : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
                }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <p
                className={`font-bold transition-colors duration-300 ${isActive ? "text-red-300" : "text-slate-200"
                  }`}
              >
                {tab.label}
              </p>

              <p className="mt-2 text-xs text-slate-400 transition-colors duration-300">
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardTabs;
