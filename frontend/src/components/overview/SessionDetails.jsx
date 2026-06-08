import { formatDateTime } from "../../utils/formatters";

function SessionDetails({ selectedSession }) {
  if (!selectedSession) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold">
        Selected Session: {selectedSession.session_name}
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Session Type</p>
          <p className="mt-1 font-semibold">{selectedSession.session_type}</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Circuit</p>
          <p className="mt-1 font-semibold">
            {selectedSession.circuit_short_name}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Start</p>
          <p className="mt-1 font-semibold">
            {formatDateTime(selectedSession.date_start)} 
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Session Key</p>
          <p className="mt-1 font-semibold">{selectedSession.session_key}</p>
        </div>
      </div>
    </section>
  );
}

export default SessionDetails;