function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-950/40",
    secondary:
      "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800",
    ghost:
      "text-slate-300 hover:bg-slate-900 hover:text-white",
  };

  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;