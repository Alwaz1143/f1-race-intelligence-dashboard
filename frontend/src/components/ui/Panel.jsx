function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export default Panel;