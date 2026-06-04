import { useState } from "react";
import { useHealth } from "../hooks/useHealth";
import { useRaces } from "../hooks/useRaces";
import { useSessions } from "../hooks/useSessions";

const availableYears = [2023, 2024, 2025];

function Dashboard() {
  const [year, setYear] = useState(2024);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState("");
  const [selectedSessionKey, setSelectedSessionKey] = useState("");

  const {
    data: healthData,
    isLoading: isHealthLoading,
    isError: isHealthError,
  } = useHealth();

  const {
    data: racesData,
    isLoading: isRacesLoading,
    isError: isRacesError,
    error: racesError,
  } = useRaces(year);

  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    error: sessionsError,
  } = useSessions(selectedMeetingKey);

  const races = racesData?.races || [];

  const selectedRace = races.find(
    (race) => String(race.meeting_key) === String(selectedMeetingKey)
  );

  const sessions = sessionsData?.sessions || [];

  const selectedSession = sessions.find(
    (session) => String(session.session_key) === String(selectedSessionKey)
  );

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
    setSelectedMeetingKey("");
    setSelectedSessionKey("");
  };

  const handleRaceChange = (event) => {
    setSelectedMeetingKey(event.target.value);
    setSelectedSessionKey("");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Race Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              F1 Race Intelligence Dashboard
            </h1>
            <p className="mt-3 text-slate-400">
              Select a season and Grand Prix to start analyzing race sessions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
            {isHealthLoading && <span className="text-slate-400">Checking API...</span>}

            {!isHealthLoading && !isHealthError && (
              <span className="text-green-400">
                API Status: {healthData?.status}
              </span>
            )}

            {isHealthError && (
              <span className="text-red-400">
                API Offline
              </span>
            )}
          </div>
        </div>

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
              onChange={(event) => setSelectedSessionKey(event.target.value)}
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



        {isRacesLoading && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
            Loading races for {year}...
          </div>
        )}

        {isRacesError && (
          <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
            Failed to load races: {racesError?.message}
          </div>
        )}

        {!isRacesLoading && !isRacesError && races.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">Available Races</h2>
            <p className="mt-2 text-slate-400">
              Found {racesData?.count} races for the {year} season.
            </p>
          </div>
        )}

        {selectedMeetingKey && isSessionsLoading && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
            Loading sessions...
          </div>
        )}

        {selectedMeetingKey && isSessionsError && (
          <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
            Failed to load sessions: {sessionsError?.message}
          </div>
        )}

        {selectedRace && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">
              {selectedRace.meeting_name}
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Country</p>
                <p className="mt-1 font-semibold">{selectedRace.country_name}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Circuit</p>
                <p className="mt-1 font-semibold">
                  {selectedRace.circuit_short_name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Location</p>
                <p className="mt-1 font-semibold">{selectedRace.location}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Meeting Key: {selectedRace.meeting_key}
            </p>
          </section>
        )}

        {selectedSession && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">
              Selected Session: {selectedSession.session_name}
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Session Type</p>
                <p className="mt-1 font-semibold">{selectedSession.session_type}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Circuit</p>
                <p className="mt-1 font-semibold">
                  {selectedSession.circuit_short_name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Start</p>
                <p className="mt-1 font-semibold">
                  {selectedSession.date_start
                    ? new Date(selectedSession.date_start).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Session Key</p>
                <p className="mt-1 font-semibold">{selectedSession.session_key}</p>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

export default Dashboard;