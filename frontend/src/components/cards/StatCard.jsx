function StatCard({ label, value, helper, valueClassName = "text-white" }) {
  return (
    <div className="card-gradient rounded-lg border p-5 hover-lift group transition-all duration-300 animate-slide-in-up">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 group-hover:text-slate-300">
        {label}
      </p>

      <p className={`mt-3 text-3xl font-black ${valueClassName}`}>
        {value ?? "N/A"}
      </p>

      {helper && (
        <p className="mt-2 text-xs text-slate-500 group-hover:text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
}

export default StatCard;
