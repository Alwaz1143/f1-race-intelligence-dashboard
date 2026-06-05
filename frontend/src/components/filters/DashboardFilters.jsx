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
    <section className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Select Season
        </label>

        <select
          value={year}
          onChange={handleYearChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-red-500"
        >
          {availableYears.map((seasonYear) => (
            <option key={seasonYear} value={seasonYear}>
              {seasonYear}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Select Grand Prix
        </label>

        <select
          value={selectedMeetingKey}
          onChange={handleRaceChange}
          disabled={isRacesLoading || races.length === 0}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            {isRacesLoading ? "Loading races..." : "Choose a race"}
          </option>

          {races.map((race) => (
            <option key={race.meeting_key} value={race.meeting_key}>
              {race.meeting_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Select Session
        </label>

        <select
          value={selectedSessionKey}
          onChange={handleSessionChange}
          disabled={!selectedMeetingKey || isSessionsLoading || sessions.length === 0}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            {!selectedMeetingKey
              ? "Choose a race first"
              : isSessionsLoading
              ? "Loading sessions..."
              : "Choose a session"}
          </option>

          {sessions.map((session) => (
            <option key={session.session_key} value={session.session_key}>
              {session.session_name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default DashboardFilters;