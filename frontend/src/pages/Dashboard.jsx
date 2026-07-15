import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import DashboardFilters from "../components/filters/DashboardFilters";
import FastestLapLeaderboard from "../components/laps/FastestLapLeaderboard";
import RaceControlPanel from "../components/race-control/RaceControlPanel";
import DriverComparisonPanel from "../components/comparison/DriverComparisonPanel";
import SessionOverview from "../components/overview/SessionOverview";
import EmptyDashboardState from "../components/common/EmptyDashboardState";
import DashboardTabs from "../components/navigation/DashboardTabs";

import { useHealth } from "../hooks/useHealth";
import { useRaces } from "../hooks/useRaces";
import { useSessions } from "../hooks/useSessions";
import { useDriverComparison } from "../hooks/useDriverComparison";
import { useRaceClassification } from "../hooks/useRaceClassification";
import { useAiSummary } from "../hooks/useAiSummary";
import { getBulkAnalytics } from "../api/f1Api";
import RaceClassificationTable from "../components/results/RaceClassificationTable";

import SkeletonCardGrid from "../components/common/SkeletonCardGrid";
import TableSkeleton from "../components/common/TableSkeleton";

import AiSessionSummary from "../components/summary/AiSessionSummary";

const currentYear = new Date().getFullYear();
const availableYears = Array.from(
  { length: currentYear - 1950 + 1 },
  (_, i) => 1950 + i
);

const VALID_DASHBOARD_TABS = [
  "overview",
  "classification",
  "fastest-laps",
  "compare",
  "race-control",
];

function Dashboard() {




  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDriver1, setSelectedDriver1] = useState("");
  const [selectedDriver2, setSelectedDriver2] = useState("");
  const yearFromUrl = Number(searchParams.get("year"));


  const [year, setYear] = useState(
    Number.isFinite(yearFromUrl) && yearFromUrl > 0 ? yearFromUrl : currentYear
  );

  const [selectedRaceKey, setSelectedRaceKey] = useState(
    searchParams.get("race_key") || ""
  );

  const [selectedSessionKey, setSelectedSessionKey] = useState(
    searchParams.get("session_key") || ""
  );

  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get("tab");

    return VALID_DASHBOARD_TABS.includes(tabFromUrl)
      ? tabFromUrl
      : "overview";
  });

  useEffect(() => {
    const nextYear = Number(searchParams.get("year"));
    const nextRaceKey = searchParams.get("race_key") || "";
    const nextSessionKey = searchParams.get("session_key") || "";
    const tabFromUrl = searchParams.get("tab");

    if (Number.isFinite(nextYear) && nextYear > 0) {
      setYear(nextYear);
    }

    setSelectedRaceKey(nextRaceKey);
    setSelectedSessionKey(nextSessionKey);

    if (VALID_DASHBOARD_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setSelectedDriver1("");
    setSelectedDriver2("");
  }, [selectedSessionKey]);


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

  const selectedRace = races.find(
    (race) => race.race_key === selectedRaceKey
  );

  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    error: sessionsError,
    refetch: refetchSessions,
  } = useSessions(
    selectedRace?.meeting_key || null,
    selectedRace?.race_key || null
  );

  const {
    data: sessionData,
    isLoading: isSessionDataLoading,
    isError: isSessionDataError,
    error: sessionDataError,
    refetch: refetchSessionData,
  } = useQuery({
    queryKey: ["session-data", selectedSessionKey],
    queryFn: () => getBulkAnalytics(selectedSessionKey),
    enabled: Boolean(selectedSessionKey),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const overviewData = sessionData?.overview;
  const fastestLapsData = sessionData?.fastest_laps;
  const driversData = sessionData?.drivers;
  const raceControlData = sessionData?.race_control;

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

  const {
    data: aiSummaryData,
    isLoading: isAiSummaryLoading,
    isError: isAiSummaryError,
    error: aiSummaryError,
    refetch: refetchAiSummary,
  } = useAiSummary(selectedSessionKey, Boolean(selectedSessionKey));



  const raceControlMessages = raceControlData?.messages || [];
  const raceControlCategoryCounts = raceControlData?.event_counts?.by_category || {};
  const raceControlFlagCounts = raceControlData?.event_counts?.by_flag || {};

  const drivers = driversData?.drivers || [];

  const fastestLaps = fastestLapsData?.leaderboard || [];

  const races = racesData?.races || [];


  const sessions = sessionsData?.sessions || [];

  const selectedSession = sessions.find(
    (session) => String(session.session_key) === String(selectedSessionKey)
  );

const selectedRound = selectedRace?.round || null;



  const isRaceSession =
    selectedSession?.session_name?.toLowerCase() === "race";

  const showHistoricalClassification =
    Boolean(selectedRaceKey) &&
    selectedRace &&
    !selectedRace.has_sessions;

  const {
    data: raceClassificationData,
    isLoading: isRaceClassificationLoading,
    isError: isRaceClassificationError,
    error: raceClassificationError,
    refetch: refetchRaceClassification,
  } = useRaceClassification(
    year,
    selectedRound,
    (isRaceSession || showHistoricalClassification) && Boolean(selectedRound)
  );


  const handleYearChange = (event) => {
    const nextYear = Number(event.target.value);

    setYear(nextYear);
    setSelectedRaceKey("");
    setSelectedSessionKey("");
    setSelectedDriver1("");
    setSelectedDriver2("");
    setActiveTab("overview");

    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("year", String(nextYear));
    nextParams.delete("race_key");
    nextParams.delete("session_key");
    nextParams.set("tab", "overview");

    setSearchParams(nextParams);
  };

  const handleRaceChange = (event) => {
    const raceKey = event.target.value;

    setSelectedRaceKey(raceKey);

    const race = races.find((r) => r.race_key === raceKey);

    if (race && race.has_sessions) {
      setSelectedSessionKey("");
      setActiveTab("overview");
    } else if (race) {
      setSelectedSessionKey(raceKey);
      setActiveTab("classification");
    }

    setSelectedDriver1("");
    setSelectedDriver2("");

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("year", String(year));

    if (raceKey) {
      nextParams.set("race_key", raceKey);
    } else {
      nextParams.delete("race_key");
    }

    if (race && race.has_sessions) {
      nextParams.delete("session_key");
    } else if (race) {
      nextParams.set("session_key", raceKey);
    }

    nextParams.set("tab", race && !race.has_sessions ? "classification" : "overview");

    setSearchParams(nextParams);
  };

  const handleSessionChange = (event) => {
    const sessionKey = event.target.value;

    setSelectedSessionKey(sessionKey);
    setSelectedDriver1("");
    setSelectedDriver2("");
    setActiveTab("overview");

    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("year", String(year));

    if (selectedRaceKey) {
      nextParams.set("race_key", String(selectedRaceKey));
    }

    if (sessionKey) {
      nextParams.set("session_key", sessionKey);
    } else {
      nextParams.delete("session_key");
    }

    nextParams.set("tab", "overview");

    setSearchParams(nextParams);
  };

  const handleTabChange = (tabId) => {
    if (!VALID_DASHBOARD_TABS.includes(tabId)) {
      return;
    }

    setActiveTab(tabId);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", tabId);

    setSearchParams(nextParams);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
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
          selectedRaceKey={selectedRaceKey}
          selectedSessionKey={selectedSessionKey}
          selectedRaceHasSessions={selectedRace?.has_sessions ?? true}
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

        {selectedRaceKey && !selectedRace?.has_sessions && isSessionsLoading && (
          <LoadingState message="Loading session data..." />
        )}

        {selectedRaceKey && !selectedRace?.has_sessions && isSessionsError && (
          <ErrorState
            message="Failed to load session data"
            error={sessionsError}
            onRetry={refetchSessions}
          />
        )}

        {selectedRaceKey && selectedRace?.has_sessions && isSessionsLoading && (
          <LoadingState message="Loading sessions..." />
        )}

        {selectedRaceKey && selectedRace?.has_sessions && isSessionsError && (
          <ErrorState
            message="Failed to load sessions"
            error={sessionsError}
            onRetry={refetchSessions}
          />
        )}

        {!selectedSessionKey && !showHistoricalClassification && <EmptyDashboardState />}

        {selectedSessionKey && (
          <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {selectedSessionKey && activeTab === "overview" && (
          <>
            {isSessionDataLoading && <SkeletonCardGrid cards={6} />}

            {isSessionDataError && (
              <ErrorState
                message="Failed to load session overview"
                error={sessionDataError}
                onRetry={refetchSessionData}
              />
            )}

            <SessionOverview
              overviewData={overviewData}
              selectedRace={selectedRace}
              selectedSession={selectedSession}
            />

            <AiSessionSummary
              summaryData={aiSummaryData}
              isLoading={isAiSummaryLoading}
              isError={isAiSummaryError}
              error={aiSummaryError}
              onRetry={refetchAiSummary}
            />
          </>
        )}

        {(selectedSessionKey || showHistoricalClassification) && activeTab === "classification" && (
          <>
            {(isRaceSession || showHistoricalClassification) && isRaceClassificationLoading && (
              <TableSkeleton
                title="Loading race classification..."
                rows={10}
                columns={7}
              />
            )}

            {(isRaceSession || showHistoricalClassification) && isRaceClassificationError && (
              <ErrorState
                message="Failed to load race classification"
                error={raceClassificationError}
                onRetry={refetchRaceClassification}
              />
            )}

            <RaceClassificationTable
              classificationData={raceClassificationData}
              selectedRound={selectedRound}
              isRaceSession={isRaceSession || showHistoricalClassification}
            />
          </>
        )}

        {selectedSessionKey && activeTab === "fastest-laps" && (
          <>
            {isSessionDataLoading && (
              <TableSkeleton
                title="Loading fastest lap leaderboard..."
                rows={8}
                columns={8}
              />
            )}

            {isSessionDataError && (
              <ErrorState
                message="Failed to load fastest laps"
                error={sessionDataError}
                onRetry={refetchSessionData}
              />
            )}

            <FastestLapLeaderboard fastestLaps={fastestLaps} />
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
            {isSessionDataLoading && (
              <TableSkeleton
                title="Loading race control messages..."
                rows={8}
                columns={6}
              />
            )}

            {isSessionDataError && (
              <ErrorState
                message="Failed to load race control messages"
                error={sessionDataError}
                onRetry={refetchSessionData}
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