function Badge({ children, variant = "default" }) {
  const variants = {
    default: "border-slate-700 bg-slate-900 text-slate-300",
    red: "border-red-900 bg-red-950/60 text-red-300",
    green: "border-green-900 bg-green-950/60 text-green-300",
    yellow: "border-yellow-900 bg-yellow-950/60 text-yellow-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;