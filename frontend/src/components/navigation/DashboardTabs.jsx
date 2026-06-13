const tabs = [
  {
    id: "overview",
    label: "Overview",
    description: "Race summary and AI insights",
  },
  {
    id: "fastest-laps",
    label: "Fastest Laps",
    description: "Leaderboard and chart",
  },
  {
    id: "drivers",
    label: "Session Drivers",
    description: "Driver list and teams",
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
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          Analysis Sections
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-100">
          Explore Session Data
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Switch between different analysis views without losing the selected
          race session.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-xl border p-4 text-left transition ${isActive
                  ? "border-red-500 bg-red-950/40"
                  : "border-slate-800 bg-slate-950 hover:border-slate-600"
                }`}
            >
              <p
                className={`font-semibold ${isActive ? "text-red-300" : "text-slate-100"
                  }`}
              >
                {tab.label}
              </p>

              <p className="mt-1 text-sm text-slate-500">
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