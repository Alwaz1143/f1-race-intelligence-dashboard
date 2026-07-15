import { Link, NavLink } from "react-router";

function Navbar() {
  const getNavLinkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
    }`;

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700/40 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
        <Link to="/" className="group flex items-center gap-3 hover-lift">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-lg font-black text-white shadow-lg shadow-red-600/40 group-hover:shadow-red-600/60 transition-all duration-300">
            F1
          </div>

          <div>
            <p className="text-base font-black tracking-tight text-white">
              Race Intelligence
            </p>
            <p className="hidden text-xs text-slate-400 sm:block">
              F1 Session Analysis
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
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
