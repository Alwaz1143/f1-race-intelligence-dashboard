import Panel from "../ui/Panel";

function DashboardFilters({
  year,
  availableYears,
  races,
  sessions,
  selectedRaceKey,
  selectedSessionKey,
  selectedRaceHasSessions,
  isRacesLoading,
  isSessionsLoading,
  handleYearChange,
  handleRaceChange,
  handleSessionChange,
}) {
  const selectedRace = races.find((r) => r.race_key === selectedRaceKey);

  return (
    <Panel className="mb-4 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            Race Selection
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            {selectedRaceHasSessions
              ? "Choose a session to analyze"
              : "View race data"}
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[680px]">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Season
            </label>

            <select
              value={year}
              onChange={handleYearChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>
                  {availableYear}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Grand Prix
            </label>

            <select
              value={selectedRaceKey}
              onChange={handleRaceChange}
              disabled={isRacesLoading || races.length === 0}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 focus:ring-2 focus:ring-red-950"
            >
              <option value="">
                {isRacesLoading ? "Loading races..." : "Select Grand Prix"}
              </option>

              {races.map((race) => (
                <option key={race.race_key} value={race.race_key}>
                  {race.meeting_name || `${race.location}, ${race.country_name}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Session
            </label>

            {selectedRaceHasSessions ? (
              <select
                value={selectedSessionKey}
                onChange={handleSessionChange}
                disabled={
                  !selectedRaceKey || isSessionsLoading || sessions.length === 0
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 focus:ring-2 focus:ring-red-950"
              >
                <option value="">
                  {isSessionsLoading ? "Loading sessions..." : "Select Session"}
                </option>

                {sessions.map((session) => (
                  <option key={session.session_key} value={session.session_key}>
                    {session.session_name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-500">
                {selectedRace
                  ? `${selectedRace.meeting_name || "Race"} — ${year}`
                  : "Select a Grand Prix first"}
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default DashboardFilters;
