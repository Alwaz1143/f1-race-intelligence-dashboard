function RaceDetails({ selectedRace }) {
  if (!selectedRace) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold">
        {selectedRace.meeting_name}
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Country</p>
          <p className="mt-1 font-semibold">{selectedRace.country_name}</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Circuit</p>
          <p className="mt-1 font-semibold">
            {selectedRace.circuit_short_name}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Location</p>
          <p className="mt-1 font-semibold">{selectedRace.location}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Meeting Key: {selectedRace.meeting_key}
      </p>
    </section>
  );
}

export default RaceDetails;