import { Link, NavLink } from "react-router";

function Navbar() {
  const getNavLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-red-950/70 text-red-300 ring-1 ring-red-900/70"
        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-900/70 bg-red-950/50 text-lg font-black text-red-300 shadow-lg shadow-red-950/30 transition group-hover:bg-red-900/70">
            F1
          </div>

          <div>
            <p className="text-base font-black tracking-tight text-white">
              Race Intelligence
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Formula 1 session analysis
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;