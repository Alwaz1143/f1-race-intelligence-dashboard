import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SectionHeader from "../common/SectionHeader";
import Badge from "../ui/Badge";
import Panel from "../ui/Panel";

function getDriverLabel(lap) {
  return (
    lap.full_name ||
    lap.driver_name ||
    lap.name_acronym ||
    lap.driver_acronym ||
    `Driver ${lap.driver_number}`
  );
}

function getTeamName(lap) {
  return lap.team_name || lap.team || "Unknown Team";
}

function getLapTime(lap) {
  return (
    lap.lap_time_formatted ||
    lap.lap_duration_formatted ||
    lap.formatted_lap_time ||
    "N/A"
  );
}

function getLapDuration(lap) {
  return Number(
    lap.lap_duration ||
      lap.lap_time_seconds ||
      lap.duration ||
      lap.fastest_lap_seconds ||
      0
  );
}

function FastestLapLeaderboard({ fastestLaps = [] }) {
  if (!fastestLaps.length) {
    return (
      <Panel className="mt-6">
        <SectionHeader
          eyebrow="Fastest Laps"
          title="No fastest lap data available"
          description="Select a completed session to view fastest lap analysis."
        />
      </Panel>
    );
  }

  const topThree = fastestLaps.slice(0, 3);

  const chartData = fastestLaps
    .slice(0, 10)
    .map((lap, index) => ({
      rank: index + 1,
      driver: getDriverLabel(lap),
      shortDriver:
        lap.name_acronym ||
        lap.driver_acronym ||
        `D${lap.driver_number}`,
      lapTime: getLapTime(lap),
      lapDuration: getLapDuration(lap),
    }))
    .filter((item) => item.lapDuration > 0);

  return (
    <div className="mt-6 space-y-5">
      <Panel>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <SectionHeader
            eyebrow="Fastest Laps"
            title="Pace leaderboard"
            description="Compare the quickest laps recorded during the selected session."
          />

          <Badge variant="red">
            {fastestLaps.length} Drivers
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {topThree.map((lap, index) => (
            <div
              key={`${lap.driver_number}-${lap.lap_number}-${index}`}
              className={`rounded-2xl border p-5 ${
                index === 0
                  ? "border-red-900/70 bg-red-950/30"
                  : "border-slate-800 bg-slate-900/70"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant={index === 0 ? "red" : "default"}>
                  P{index + 1}
                </Badge>

                <p className="text-sm text-slate-500">
                  Lap {lap.lap_number || "N/A"}
                </p>
              </div>

              <h3 className="mt-4 text-xl font-black text-white">
                {getDriverLabel(lap)}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {getTeamName(lap)}
              </p>

              <p className="mt-5 text-3xl font-black text-green-300">
                {getLapTime(lap)}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {chartData.length > 0 && (
        <Panel>
          <SectionHeader
            eyebrow="Top 10 Pace"
            title="Fastest lap comparison"
            description="Lower lap duration means stronger single-lap pace."
          />

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="shortDriver"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value, name, props) => [
                    props.payload.lapTime,
                    "Lap Time",
                  ]}
                  labelFormatter={(label) => `Driver: ${label}`}
                />
                <Bar
                  dataKey="lapDuration"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}

      <Panel>
        <SectionHeader
          eyebrow="Leaderboard"
          title="Fastest lap table"
          description="Detailed ranking of the fastest recorded laps."
        />

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Lap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                {fastestLaps.map((lap, index) => (
                  <tr
                    key={`${lap.driver_number}-${lap.lap_number}-${index}`}
                    className="transition hover:bg-slate-900/80"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-300">
                      P{index + 1}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <p className="text-sm font-semibold text-white">
                        {getDriverLabel(lap)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Driver {lap.driver_number || "N/A"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      {getTeamName(lap)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      {lap.lap_number || "N/A"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm font-black text-green-300">
                      {getLapTime(lap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default FastestLapLeaderboard;