import Panel from "../ui/Panel";

function DashboardFilters({
  year,
  availableYears,
  races,
  sessions,
  selectedMeetingKey,
  selectedSessionKey,
  isRacesLoading,
  isSessionsLoading,
  handleYearChange,
  handleRaceChange,
  handleSessionChange,
}) {
  return (
    <Panel className="mb-6 p-6 sm:p-7 animate-slide-in-up">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            Race Selection
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Choose a session to analyze
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[720px]">
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Season
            </label>

            <select
              value={year}
              onChange={handleYearChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none transition duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 hover:border-slate-600"
            >
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>
                  {availableYear}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Grand Prix
            </label>

            <select
              value={selectedMeetingKey}
              onChange={handleRaceChange}
              disabled={isRacesLoading || races.length === 0}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none transition duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-600"
            >
              <option value="">
                {isRacesLoading ? "Loading races..." : "Select Grand Prix"}
              </option>

              {races.map((race) => (
                <option key={race.meeting_key} value={race.meeting_key}>
                  {race.meeting_name || `${race.location}, ${race.country_name}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Session
            </label>

            <select
              value={selectedSessionKey}
              onChange={handleSessionChange}
              disabled={
                !selectedMeetingKey || isSessionsLoading || sessions.length === 0
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none transition duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-600"
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
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default DashboardFilters;
