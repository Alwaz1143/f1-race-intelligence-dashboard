import SectionHeader from "../common/SectionHeader";

function FastestLapLeaderboard({ fastestLaps }) {
  if (!fastestLaps || fastestLaps.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <SectionHeader
        eyebrow="Fastest Lap Leaderboard"
        title="Top Fastest Laps"
      />

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
                  {item.duration_sector_1?.toFixed?.(3) || "N/A"}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {item.duration_sector_2?.toFixed?.(3) || "N/A"}
                </td>

                <td className="px-4 py-3 text-slate-300">
                  {item.duration_sector_3?.toFixed?.(3) || "N/A"}
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