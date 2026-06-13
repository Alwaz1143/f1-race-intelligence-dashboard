import SectionHeader from "../common/SectionHeader";
import StatCard from "../cards/StatCard";
import Badge from "../ui/Badge";
import Panel from "../ui/Panel";

import { formatDateTime } from "../../utils/formatters";

function SessionOverview({ overviewData, selectedRace, selectedSession }) {
  if (!overviewData) {
    return null;
  }

  const raceName =
    selectedRace?.meeting_name ||
    overviewData.session?.meeting_name ||
    "Selected Grand Prix";

  const sessionName =
    selectedSession?.session_name ||
    overviewData.session?.session_name ||
    "Selected Session";

  const sessionType =
    selectedSession?.session_type ||
    overviewData.session?.session_type ||
    "N/A";

  const shouldShowSessionType =
    sessionType &&
    sessionType !== "N/A" &&
    sessionType !== sessionName;

  const circuit =
    selectedSession?.circuit_short_name ||
    selectedRace?.circuit_short_name ||
    overviewData.session?.circuit_short_name ||
    "N/A";

  const country =
    selectedRace?.country_name ||
    overviewData.session?.country_name ||
    "N/A";

  const location =
    selectedRace?.location ||
    overviewData.session?.location ||
    "N/A";

  return (
    <Panel className="mt-6">
      <SectionHeader
        eyebrow="Session Overview"
        title="Race Summary"
        description="A compact summary of the selected race weekend and session analytics."
      />

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">{sessionName}</Badge>

              {shouldShowSessionType && <Badge>{sessionType}</Badge>}

              <Badge>{country}</Badge>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">
              {raceName}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {circuit} • {location}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
            <p className="text-slate-500">Session Start</p>
            <p className="mt-1 font-semibold text-slate-200">
              {formatDateTime(selectedSession?.date_start)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </Panel>
  );
}

export default SessionOverview;