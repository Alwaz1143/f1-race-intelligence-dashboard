import SectionHeader from "../common/SectionHeader";
import StatCard from "../cards/StatCard";

function SessionOverview({ overviewData }) {
  if (!overviewData) {
    return null;
  }

  return (
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
  );
}

export default SessionOverview;