import SectionHeader from "../common/SectionHeader";
import { formatSeconds, formatSecondsWithUnit } from "../../utils/formatters";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function FastestLapLeaderboard({ fastestLaps }) {
  if (!fastestLaps || fastestLaps.length === 0) {
    return null;
  }
  const chartData = fastestLaps.slice(0, 10).map((item) => ({
    driver: item.name_acronym || `#${item.driver_number}`,
    lapTime: Number(item.lap_duration),
    lapTimeLabel: item.lap_time_formatted || formatSecondsWithUnit(item.lap_duration),
    team: item.team_name || "N/A",
    position: item.position,
  }));

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <SectionHeader
        eyebrow="Fastest Lap Leaderboard"
        title="Top Fastest Laps"
      />

      <div className="mt-5 rounded-2xl bg-slate-950 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Fastest Lap Comparison
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Top 10 drivers ranked by their fastest valid lap. Lower lap time means faster performance.
          </p>
        </div>

        <div className="h-[300px] w-full sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis
                dataKey="driver"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                domain={["dataMin - 1", "dataMax + 1"]}
                tickFormatter={(value) => Number(value).toFixed(1)}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#e5e7eb",
                }}
                formatter={(value) => [
                  formatSecondsWithUnit(value),
                  "Fastest Lap",
                ]}
                labelFormatter={(label) => `Driver: ${label}`}
              />

              <Bar
                dataKey="lapTime"
                name="Fastest Lap"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Fastest Lap</th>
              <th className="px-4 py-3">Lap</th>
              <th className="px-4 py-3">S1</th>
              <th className="px-4 py-3">S2</th>
              <th className="px-4 py-3">S3</th>
            </tr>
          </thead>

          <tbody>
            {fastestLaps.map((item) => (
              <tr
                key={item.driver_number}
                className="border-b border-slate-800/70 transition hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 font-bold text-red-400">
                  P{item.position}
                </td>

                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-100">
                      {item.name_acronym ||
                        item.full_name ||
                        `Driver ${item.driver_number}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      #{item.driver_number}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {item.team_name || "N/A"}
                </td>

                <td className="px-4 py-3 font-semibold text-green-400">
                  {item.lap_time_formatted || "N/A"}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {item.lap_number || "N/A"}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {formatSeconds(item.duration_sector_1)}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {formatSeconds(item.duration_sector_2)}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {formatSeconds(item.duration_sector_3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FastestLapLeaderboard;