function Panel({ children, className = "" }) {
  return (
    <section
      className={`glass rounded-xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300 hover:shadow-black/60 sm:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default Panel;
