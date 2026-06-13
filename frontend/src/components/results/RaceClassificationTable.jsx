import SectionHeader from "../common/SectionHeader";
import Badge from "../ui/Badge";
import Panel from "../ui/Panel";

function formatPosition(position) {
    if (!position) return "N/A";
    if (position === "R") return "NC";
    return position;
}

function getPositionBadgeVariant(position) {
    if (position === "1") return "green";
    if (position === "2" || position === "3") return "red";
    if (position === "R" || position === "NC") return "yellow";
    return "default";
}

function RaceClassificationTable({
    classificationData,
    selectedRound,
    isRaceSession,
}) {
    if (!isRaceSession) {
        return (
            <Panel className="mt-6">
                <SectionHeader
                    eyebrow="Classification"
                    title="Race result available for Race sessions"
                    description="Select the Race session to view the final classification, laps completed, finishing status, and points."
                />
            </Panel>
        );
    }
    if (!selectedRound) {
        return (
            <Panel className="mt-6">
                <SectionHeader
                    eyebrow="Classification"
                    title="Classification unavailable for this event"
                    description="Race classification is available for Grand Prix race sessions. Testing sessions and unsupported events do not have official race results."
                />
            </Panel>
        );
    }

    if (!classificationData) {
        return null;
    }

    const results = classificationData.results || [];

    if (!results.length) {
        return (
            <Panel className="mt-6">
                <SectionHeader
                    eyebrow="Classification"
                    title="No race result available yet"
                    description="The final classification may become available after the race result is published."
                />
            </Panel>
        );
    }

    return (
        <div className="mt-6 space-y-5">
            <Panel>
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <SectionHeader
                        eyebrow="Classification"
                        title={classificationData.race_name || "Race Result"}
                        description={`${classificationData.circuit_name || "Circuit"} • ${classificationData.location || "Location"
                            }, ${classificationData.country || "Country"}`}
                    />

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="red">Round {selectedRound}</Badge>
                        <Badge>{classificationData.year}</Badge>
                        <Badge>{results.length} Classified</Badge>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {results.slice(0, 3).map((result, index) => (
                        <div
                            key={`${result.driver_number}-${index}`}
                            className={`rounded-2xl border p-5 ${index === 0
                                    ? "border-green-900/70 bg-green-950/30"
                                    : "border-slate-800 bg-slate-900/70"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <Badge variant={getPositionBadgeVariant(result.position)}>
                                    P{formatPosition(result.position)}
                                </Badge>

                                <p className="text-sm text-slate-500">
                                    {result.points} pts
                                </p>
                            </div>

                            <h3 className="mt-4 text-xl font-black text-white">
                                {result.driver_name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                {result.team_name}
                            </p>

                            <p className="mt-5 text-lg font-bold text-green-300">
                                {result.time_or_status}
                            </p>
                        </div>
                    ))}
                </div>
            </Panel>

            <Panel>
                <SectionHeader
                    eyebrow="Race Result"
                    title="Final classification"
                    description="Official-style race result with finishing position, laps completed, race time or status, and points."
                />

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Pos.
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        No.
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Driver
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Team
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Laps
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Time / Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Pts.
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                                {results.map((result, index) => (
                                    <tr
                                        key={`${result.driver_number}-${result.position}-${index}`}
                                        className="transition hover:bg-slate-900/80"
                                    >
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <Badge variant={getPositionBadgeVariant(result.position)}>
                                                {formatPosition(result.position)}
                                            </Badge>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-300">
                                            {result.driver_number || "N/A"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <p className="text-sm font-semibold text-white">
                                                {result.driver_name}
                                            </p>

                                            {result.driver_code && (
                                                <p className="text-xs text-slate-500">
                                                    {result.driver_code}
                                                </p>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                                            {result.team_name}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                                            {result.laps || "N/A"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-200">
                                            {result.time_or_status || "N/A"}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-black text-green-300">
                                            {result.points || "0"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                    Race results may be unavailable until the final classification is
                    published after the session.
                </p>
            </Panel>
        </div>
    );
}

export default RaceClassificationTable;