function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-2xl font-bold text-slate-100">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;