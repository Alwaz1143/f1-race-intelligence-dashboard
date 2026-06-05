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

import SectionHeader from "../common/SectionHeader";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

function DriverComparisonPanel({
  drivers,
  selectedDriver1,
  selectedDriver2,
  setSelectedDriver1,
  setSelectedDriver2,
  comparisonData,
  comparisonChartData,
  isComparisonLoading,
  isComparisonError,
  comparisonError,
}) {
  if (!drivers || drivers.length === 0) {
    return null;
  }

  return (
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
  );
}

export default DriverComparisonPanel;