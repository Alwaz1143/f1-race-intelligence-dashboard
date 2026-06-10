import { useState } from "react";

// import SectionHeader from "../components/common/SectionHeader";
// import StatCard from "../components/cards/StatCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import DashboardFilters from "../components/filters/DashboardFilters";
import DriverList from "../components/drivers/DriverList";
import FastestLapLeaderboard from "../components/laps/FastestLapLeaderboard";
import RaceControlPanel from "../components/race-control/RaceControlPanel";
import DriverComparisonPanel from "../components/comparison/DriverComparisonPanel";
import SessionOverview from "../components/overview/SessionOverview";
import RaceDetails from "../components/overview/RaceDetails";
import SessionDetails from "../components/overview/SessionDetails";
import EmptyDashboardState from "../components/common/EmptyDashboardState";
import DashboardTabs from "../components/navigation/DashboardTabs";

import { useHealth } from "../hooks/useHealth";
import { useRaces } from "../hooks/useRaces";
import { useSessions } from "../hooks/useSessions";
import { useSessionOverview } from "../hooks/useSessionOverview";
import { useFastestLaps } from "../hooks/useFastestLaps";
import { useDrivers } from "../hooks/useDrivers";
import { useRaceControl } from "../hooks/useRaceControl";
import { useDriverComparison } from "../hooks/useDriverComparison";


import SkeletonCardGrid from "../components/common/SkeletonCardGrid";
import TableSkeleton from "../components/common/TableSkeleton";

const availableYears = [2023, 2024, 2025];

function Dashboard() {
  const [year, setYear] = useState(2024);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState("");
  const [selectedSessionKey, setSelectedSessionKey] = useState("");
  const [activeTab, setActiveTab] = useState("fastest-laps");
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
    refetch: refetchRaces,
  } = useRaces(year);

  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    error: sessionsError,
    refetch: refetchSessions,
  } = useSessions(selectedMeetingKey);

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    refetch: refetchOverview,
  } = useSessionOverview(selectedSessionKey);

  const {
    data: fastestLapsData,
    isLoading: isFastestLapsLoading,
    isError: isFastestLapsError,
    error: fastestLapsError,
    refetch: refetchFastestLaps,
  } = useFastestLaps(selectedSessionKey);

  const {
    data: driversData,
    isLoading: isDriversLoading,
    isError: isDriversError,
    error: driversError,
    refetch: refetchDrivers,
  } = useDrivers(selectedSessionKey);

  const {
    data: raceControlData,
    isLoading: isRaceControlLoading,
    isError: isRaceControlError,
    error: raceControlError,
    refetch: refetchRaceControl,
  } = useRaceControl(selectedSessionKey);

  const {
    data: comparisonData,
    isLoading: isComparisonLoading,
    isError: isComparisonError,
    error: comparisonError,
    refetch: refetchComparison,
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
    const sessionKey = event.target.value;

    setSelectedSessionKey(sessionKey);
    setSelectedDriver1("");
    setSelectedDriver2("");

    if (sessionKey) {
      setActiveTab("fastest-laps");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
                Race Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                F1 Race Intelligence Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-slate-400">
                Select a season, Grand Prix, and session to explore lap-time analytics,
                fastest laps, driver comparisons, and race control messages.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
              {isHealthLoading && (
                <span className="text-slate-400">Checking API...</span>
              )}

              {!isHealthLoading && !isHealthError && (
                <span className="text-green-400">
                  API Status: {healthData?.status}
                </span>
              )}

              {isHealthError && (
                <span className="text-red-400">API Offline</span>
              )}
            </div>
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
          <ErrorState
            message="Failed to load races"
            error={racesError}
            onRetry={refetchRaces}
          />
        )}

        {!isRacesLoading && !isRacesError && races.length > 0 && (
          <div className="mt-4 text-sm text-slate-500">
            Found {racesData?.count} races for the {year} season.
          </div>
        )}

        {selectedMeetingKey && isSessionsLoading && (
          <LoadingState message="Loading sessions..." />
        )}

        {selectedMeetingKey && isSessionsError && (
          <ErrorState
            message="Failed to load sessions"
            error={sessionsError}
            onRetry={refetchSessions}
          />
        )}

        <RaceDetails selectedRace={selectedRace} />

        <SessionDetails selectedSession={selectedSession} />
        {!selectedSessionKey && <EmptyDashboardState />}

        {selectedSessionKey && isOverviewLoading && <SkeletonCardGrid cards={6} />}

        {selectedSessionKey && isOverviewError && (
          <ErrorState message="Failed to load session overview"
            error={overviewError}
            onRetry={refetchOverview} />
        )}

        <SessionOverview overviewData={overviewData} />

        {selectedSessionKey && (
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {selectedSessionKey && activeTab === "fastest-laps" && (
          <>
            {isFastestLapsLoading && (
              <TableSkeleton
                title="Loading fastest lap leaderboard..."
                rows={8}
                columns={8}
              />
            )}

            {isFastestLapsError && (
              <ErrorState
                message="Failed to load fastest laps"
                error={fastestLapsError}
                onRetry={refetchFastestLaps}
              />
            )}

            <FastestLapLeaderboard fastestLaps={fastestLaps} />
          </>
        )}

        {selectedSessionKey && activeTab === "drivers" && (
          <>
            {isDriversLoading && <SkeletonCardGrid cards={6} />}

            {isDriversError && (
              <ErrorState
                message="Failed to load drivers"
                error={driversError}
                onRetry={refetchDrivers}
              />
            )}

            <DriverList drivers={drivers} driversCount={driversData?.count} />
          </>
        )}

        {selectedSessionKey && activeTab === "compare" && (
          <DriverComparisonPanel
            drivers={drivers}
            selectedDriver1={selectedDriver1}
            selectedDriver2={selectedDriver2}
            setSelectedDriver1={setSelectedDriver1}
            setSelectedDriver2={setSelectedDriver2}
            comparisonData={comparisonData}
            comparisonChartData={comparisonChartData}
            isComparisonLoading={isComparisonLoading}
            isComparisonError={isComparisonError}
            comparisonError={comparisonError}
            onRetryComparison={refetchComparison}
          />
        )}

        {selectedSessionKey && activeTab === "race-control" && (
          <>
            {isRaceControlLoading && (
              <TableSkeleton
                title="Loading race control messages..."
                rows={8}
                columns={6}
              />
            )}

            {isRaceControlError && (
              <ErrorState
                message="Failed to load race control messages"
                error={raceControlError}
                onRetry={refetchRaceControl}
              />
            )}

            <RaceControlPanel
              raceControlData={raceControlData}
              raceControlMessages={raceControlMessages}
              raceControlCategoryCounts={raceControlCategoryCounts}
              raceControlFlagCounts={raceControlFlagCounts}
            />
          </>
        )}

      </div>
    </main>
  );
}

export default Dashboard;