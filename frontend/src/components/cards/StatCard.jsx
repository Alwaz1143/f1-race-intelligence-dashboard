function StatCard({ label, value, helper, valueClassName = "text-slate-100" }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>
        {value ?? "N/A"}
      </p>

      {helper && (
        <p className="mt-1 text-sm text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}

export default StatCard;