import SectionHeader from "../common/SectionHeader";
import StatCard from "../cards/StatCard";
import { formatTimeOnly } from "../../utils/formatters";

function RaceControlPanel({
  raceControlData,
  raceControlMessages,
  raceControlCategoryCounts,
  raceControlFlagCounts,
}) {
  if (!raceControlData) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <SectionHeader
        eyebrow="Race Control"
        title="Official Session Messages"
        description={`${raceControlData.count} race control messages found for this session.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Events" value={raceControlData.count} />

        <StatCard
          label="Categories"
          value={Object.keys(raceControlCategoryCounts).length}
        />

        <StatCard
          label="Flag Types"
          value={Object.keys(raceControlFlagCounts).length}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-950 p-4">
          <h3 className="font-semibold text-slate-100">Category Counts</h3>

          <div className="mt-3 space-y-2">
            {Object.keys(raceControlCategoryCounts).length > 0 ? (
              Object.entries(raceControlCategoryCounts).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 text-sm"
                >
                  <span className="text-slate-300">{category}</span>
                  <span className="font-semibold text-red-400">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No category data available.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <h3 className="font-semibold text-slate-100">Flag Counts</h3>

          <div className="mt-3 space-y-2">
            {Object.keys(raceControlFlagCounts).length > 0 ? (
              Object.entries(raceControlFlagCounts).map(([flag, count]) => (
                <div
                  key={flag}
                  className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 text-sm"
                >
                  <span className="text-slate-300">{flag}</span>
                  <span className="font-semibold text-yellow-400">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No flag data available.
              </p>
            )}
          </div>
        </div>
      </div>

      {raceControlMessages.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Lap</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>

            <tbody>
              {raceControlMessages.slice(0, 50).map((message, index) => (
                <tr
                  key={`${message.date}-${index}`}
                  className="border-b border-slate-800/70 transition hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 text-slate-300">
                    {formatTimeOnly(message.date)}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {message.lap_number || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {message.category || "N/A"}
                  </td>

                  <td className="px-4 py-3 font-semibold text-yellow-400">
                    {message.flag || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {message.driver_number ? `#${message.driver_number}` : "N/A"}
                  </td>

                  <td className="px-4 py-3 text-slate-200">
                    {message.message || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {raceControlMessages.length > 50 && (
            <p className="mt-3 text-sm text-slate-500">
              Showing first 50 messages out of {raceControlMessages.length}.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-950 p-4 text-sm text-slate-500">
          No race control messages found for this session.
        </div>
      )}
    </section>
  );
}

export default RaceControlPanel;