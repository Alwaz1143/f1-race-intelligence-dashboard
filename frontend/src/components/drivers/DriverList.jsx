import SectionHeader from "../common/SectionHeader";

function DriverList({ drivers, driversCount }) {
  if (!drivers || drivers.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <SectionHeader
        eyebrow="Driver List"
        title="Session Drivers"
        description={`${driversCount} drivers found for this session.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <div
            key={driver.driver_number}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-red-500/60"
          >
            <div className="flex items-center gap-4">
              {driver.headshot_url ? (
                <img
                  src={driver.headshot_url}
                  alt={driver.full_name || driver.name_acronym}
                  className="h-14 w-14 rounded-full bg-slate-800 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-lg font-bold text-slate-300">
                  {driver.name_acronym || "DRV"}
                </div>
              )}

              <div>
                <p className="text-lg font-bold text-slate-100">
                  {driver.name_acronym || `#${driver.driver_number}`}
                </p>
                <p className="text-sm text-slate-400">
                  {driver.full_name || "Unknown Driver"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="text-slate-500">Number</p>
                <p className="mt-1 font-semibold text-slate-100">
                  #{driver.driver_number}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-3">
                <p className="text-slate-500">Country</p>
                <p className="mt-1 font-semibold text-slate-100">
                  {driver.country_code || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-slate-900 p-3 text-sm">
              <p className="text-slate-500">Team</p>
              <div className="mt-1 flex items-center gap-2">
                {driver.team_colour && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: `#${driver.team_colour}` }}
                  />
                )}
                <p className="font-semibold text-slate-100">
                  {driver.team_name || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DriverList;