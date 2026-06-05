import { useState } from "react";

import SectionHeader from "../components/common/SectionHeader";
import StatCard from "../components/cards/StatCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import DashboardFilters from "../components/filters/DashboardFilters";
import DriverList from "../components/drivers/DriverList";
import FastestLapLeaderboard from "../components/laps/FastestLapLeaderboard";
import RaceControlPanel from "../components/race-control/RaceControlPanel";

import { useHealth } from "../hooks/useHealth";
import { useRaces } from "../hooks/useRaces";
import { useSessions } from "../hooks/useSessions";
import { useSessionOverview } from "../hooks/useSessionOverview";
import { useFastestLaps } from "../hooks/useFastestLaps";
import { useDrivers } from "../hooks/useDrivers";
import { useRaceControl } from "../hooks/useRaceControl";
import { useDriverComparison } from "../hooks/useDriverComparison";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";


const availableYears = [2023, 2024, 2025];

function Dashboard() {
  const [year, setYear] = useState(2024);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState("");
  const [selectedSessionKey, setSelectedSessionKey] = useState("");
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");
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

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
  } = useSessionOverview(selectedSessionKey);

  const {
    data: fastestLapsData,
    isLoading: isFastestLapsLoading,
    isError: isFastestLapsError,
    error: fastestLapsError,
  } = useFastestLaps(selectedSessionKey);

  const {
    data: driversData,
    isLoading: isDriversLoading,
    isError: isDriversError,
    error: driversError,
  } = useDrivers(selectedSessionKey);

  const {
    data: raceControlData,
    isLoading: isRaceControlLoading,
    isError: isRaceControlError,
    error: raceControlError,
  } = useRaceControl(selectedSessionKey);

  const {
    data: comparisonData,
    isLoading: isComparisonLoading,
    isError: isComparisonError,
    error: comparisonError,
  } = useDriverComparison(selectedSessionKey, selectedDriver1, selectedDriver2);

  const comparisonChartData =
    comparisonData?.lap_by_lap_comparison?.map((lap) => ({
      lap_number: lap.lap_number,
      driver1: lap.driver1_lap_duration,
      driver2: lap.driver2_lap_duration,
      difference: lap.difference,
    })) || [];

  const raceControlMessages = raceControlData?.messages || [];
  const raceControlCategoryCounts = raceControlData?.event_counts?.by_category || {};
  const raceControlFlagCounts = raceControlData?.event_counts?.by_flag || {};

  const drivers = driversData?.drivers || [];

  const fastestLaps = fastestLapsData?.leaderboard || [];

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
    setSelectedDriver1("");
    setSelectedDriver2("");
  };

  const handleRaceChange = (event) => {
    setSelectedMeetingKey(event.target.value);
    setSelectedSessionKey("");
    setSelectedDriver1("");
    setSelectedDriver2("");
  };

  const handleSessionChange = (event) => {
    setSelectedSessionKey(event.target.value);
    setSelectedDriver1("");
    setSelectedDriver2("");
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

        <DashboardFilters
          year={year}
          availableYears={availableYears}
          races={races}
          sessions={sessions}
          selectedMeetingKey={selectedMeetingKey}
          selectedSessionKey={selectedSessionKey}
          isRacesLoading={isRacesLoading}
          isSessionsLoading={isSessionsLoading}
          handleYearChange={handleYearChange}
          handleRaceChange={handleRaceChange}
          handleSessionChange={handleSessionChange}
        />



        {isRacesLoading && (
          <LoadingState message={`Loading races for ${year}...`} />
        )}

        {isRacesError && (
          <ErrorState message="Failed to load races" error={racesError} />
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
          <LoadingState message="Loading sessions..." />
        )}

        {selectedMeetingKey && isSessionsError && (
          <ErrorState message="Failed to load sessions" error={sessionsError} />
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


        {selectedSessionKey && isOverviewLoading && (
          <LoadingState message="Loading session overview..." />
        )}

        {selectedSessionKey && isOverviewError && (
          <ErrorState message="Failed to load session overview" error={overviewError} />
        )}

        {overviewData && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <SectionHeader
              eyebrow="Session Overview"
              title={`${overviewData.session?.session_name} Summary`}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                label="Total Drivers"
                value={overviewData.overview?.total_drivers}
              />

              <StatCard
                label="Total Lap Records"
                value={overviewData.overview?.total_lap_records}
              />

              <StatCard
                label="Valid Laps"
                value={overviewData.overview?.valid_lap_count}
              />

              <StatCard
                label="Max Lap Number"
                value={overviewData.overview?.max_lap_number}
              />

              <StatCard
                label="Fastest Lap"
                value={overviewData.fastest_lap?.lap_time_formatted || "N/A"}
                valueClassName="text-green-400"
                helper={
                  overviewData.fastest_lap
                    ? `Driver ${overviewData.fastest_lap.driver_number}, Lap ${overviewData.fastest_lap.lap_number}`
                    : null
                }
              />

              <StatCard
                label="Race Control Events"
                value={overviewData.overview?.race_control_event_count}
              />
            </div>
          </section>
        )}

        {selectedSessionKey && isFastestLapsLoading && (
          <LoadingState message="Loading fastest lap leaderboard..." />
        )}

        {selectedSessionKey && isFastestLapsError && (
          <ErrorState message="Failed to load fastest laps" error={fastestLapsError} />
        )}

        <FastestLapLeaderboard fastestLaps={fastestLaps} />

        {selectedSessionKey && isDriversLoading && (
          <LoadingState message="Loading drivers..." />
        )}

        {selectedSessionKey && isDriversError && (
          <ErrorState message="Failed to load drivers" error={driversError} />
        )}

        <DriverList
          drivers={drivers}
          driversCount={driversData?.count}
        />



        {drivers.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <SectionHeader
              eyebrow="Driver Comparison"
              title="Compare Two Drivers"
              description="Select two drivers from this session to compare lap-time performance."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Driver 1
                </label>

                <select
                  value={selectedDriver1}
                  onChange={(event) => setSelectedDriver1(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-red-500"
                >
                  <option value="">Choose first driver</option>

                  {drivers.map((driver) => (
                    <option key={driver.driver_number} value={driver.driver_number}>
                      {driver.name_acronym || driver.full_name} #{driver.driver_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Driver 2
                </label>

                <select
                  value={selectedDriver2}
                  onChange={(event) => setSelectedDriver2(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-red-500"
                >
                  <option value="">Choose second driver</option>

                  {drivers.map((driver) => (
                    <option key={driver.driver_number} value={driver.driver_number}>
                      {driver.name_acronym || driver.full_name} #{driver.driver_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedDriver1 && selectedDriver2 && selectedDriver1 === selectedDriver2 && (
              <div className="mt-4 rounded-xl border border-yellow-900 bg-yellow-950/40 p-4 text-sm text-yellow-300">
                Please select two different drivers.
              </div>
            )}

            {isComparisonLoading && (
              <LoadingState message="Loading driver comparison..." />
            )}

            {isComparisonError && (
              <ErrorState message="Failed to compare drivers" error={comparisonError} />
            )}

            {comparisonData && (
              <div className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <h3 className="text-xl font-bold text-slate-100">
                      {comparisonData.drivers?.driver1?.name_acronym ||
                        comparisonData.drivers?.driver1?.full_name ||
                        `Driver ${selectedDriver1}`}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {comparisonData.drivers?.driver1?.team_name || "N/A"}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Fastest Lap</span>
                        <span className="font-semibold text-green-400">
                          {comparisonData.stats?.driver1?.fastest_lap?.lap_time_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Average Lap</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver1?.average_lap_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Median Lap</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver1?.median_lap_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Std Deviation</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver1?.standard_deviation ?? "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Consistency</span>
                        <span className="font-semibold text-red-400">
                          {comparisonData.stats?.driver1?.consistency_score ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <h3 className="text-xl font-bold text-slate-100">
                      {comparisonData.drivers?.driver2?.name_acronym ||
                        comparisonData.drivers?.driver2?.full_name ||
                        `Driver ${selectedDriver2}`}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {comparisonData.drivers?.driver2?.team_name || "N/A"}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Fastest Lap</span>
                        <span className="font-semibold text-green-400">
                          {comparisonData.stats?.driver2?.fastest_lap?.lap_time_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Average Lap</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver2?.average_lap_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Median Lap</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver2?.median_lap_formatted || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Std Deviation</span>
                        <span className="font-semibold">
                          {comparisonData.stats?.driver2?.standard_deviation ?? "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between rounded-xl bg-slate-900 p-3">
                        <span className="text-slate-400">Consistency</span>
                        <span className="font-semibold text-red-400">
                          {comparisonData.stats?.driver2?.consistency_score ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {comparisonChartData.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-100">
                        Lap-Time Comparison Chart
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Lower lap time means faster performance.
                      </p>
                    </div>

                    <div className="h-[360px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                          <XAxis
                            dataKey="lap_number"
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            label={{
                              value: "Lap Number",
                              position: "insideBottom",
                              offset: -5,
                              fill: "#94a3b8",
                            }}
                          />

                          <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            domain={["dataMin - 1", "dataMax + 1"]}
                            label={{
                              value: "Lap Time (seconds)",
                              angle: -90,
                              position: "insideLeft",
                              fill: "#94a3b8",
                            }}
                          />

                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#020617",
                              border: "1px solid #334155",
                              borderRadius: "12px",
                              color: "#e5e7eb",
                            }}
                            labelFormatter={(label) => `Lap ${label}`}
                            formatter={(value, name) => [
                              `${Number(value).toFixed(3)}s`,
                              name === "driver1" ? "Driver 1" : "Driver 2",
                            ]}
                          />

                          <Legend />

                          <Line
                            type="monotone"
                            dataKey="driver1"
                            name="Driver 1"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                          />

                          <Line
                            type="monotone"
                            dataKey="driver2"
                            name="Driver 2"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold">Performance Differences</h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-900 p-4">
                      <p className="text-sm text-slate-400">Fastest Lap Difference</p>
                      <p className="mt-2 text-xl font-bold">
                        {comparisonData.differences?.fastest_lap_difference ?? "N/A"}s
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-4">
                      <p className="text-sm text-slate-400">Average Lap Difference</p>
                      <p className="mt-2 text-xl font-bold">
                        {comparisonData.differences?.average_lap_difference ?? "N/A"}s
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-4">
                      <p className="text-sm text-slate-400">Median Lap Difference</p>
                      <p className="mt-2 text-xl font-bold">
                        {comparisonData.differences?.median_lap_difference ?? "N/A"}s
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Negative value means Driver 1 was faster. Positive value means Driver 2 was faster.
                  </p>
                </div>

                {comparisonData.lap_by_lap_comparison?.length > 0 && (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[750px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="px-4 py-3">Lap</th>
                          <th className="px-4 py-3">Driver 1</th>
                          <th className="px-4 py-3">Driver 2</th>
                          <th className="px-4 py-3">Difference</th>
                          <th className="px-4 py-3">Faster</th>
                        </tr>
                      </thead>

                      <tbody>
                        {comparisonData.lap_by_lap_comparison.slice(0, 30).map((lap) => (
                          <tr
                            key={lap.lap_number}
                            className="border-b border-slate-800/70 transition hover:bg-slate-800/50"
                          >
                            <td className="px-4 py-3 text-slate-300">
                              {lap.lap_number}
                            </td>

                            <td className="px-4 py-3 text-slate-300">
                              {lap.driver1_lap_time_formatted}
                            </td>

                            <td className="px-4 py-3 text-slate-300">
                              {lap.driver2_lap_time_formatted}
                            </td>

                            <td className="px-4 py-3 font-semibold">
                              {lap.difference}s
                            </td>

                            <td className="px-4 py-3 text-red-400">
                              {lap.faster_driver === "equal"
                                ? "Equal"
                                : `Driver ${lap.faster_driver}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {comparisonData.lap_by_lap_comparison.length > 30 && (
                      <p className="mt-3 text-sm text-slate-500">
                        Showing first 30 common laps out of{" "}
                        {comparisonData.lap_by_lap_comparison.length}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
        {selectedSessionKey && isRaceControlLoading && (
          <LoadingState message="Loading race control messages..." />
        )}

        {selectedSessionKey && isRaceControlError && (
          <ErrorState
            message="Failed to load race control messages"
            error={raceControlError}
          />
        )}

        <RaceControlPanel
          raceControlData={raceControlData}
          raceControlMessages={raceControlMessages}
          raceControlCategoryCounts={raceControlCategoryCounts}
          raceControlFlagCounts={raceControlFlagCounts}
        />

      </div>
    </main>
  );
}

export default Dashboard;