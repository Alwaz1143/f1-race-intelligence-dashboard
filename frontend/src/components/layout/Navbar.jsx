import { Link, NavLink } from "react-router";

import Badge from "../ui/Badge";

function Navbar() {
  const getNavLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-red-950/70 text-red-300 ring-1 ring-red-900/70"
        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-900/70 bg-red-950/50 text-lg font-black text-red-300 shadow-lg shadow-red-950/30 transition group-hover:bg-red-900/70">
              F1
            </div>

            <div>
              <p className="text-base font-black tracking-tight text-white">
                Race Intelligence
              </p>
              <p className="text-xs text-slate-500">
                Analytics Dashboard
              </p>
            </div>
          </Link>

          <div className="hidden sm:block lg:hidden">
            <Badge variant="green">Live</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>

          <a
            href="https://f1-race-intelligence-api.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            API Docs
          </a>

          <a
            href="https://f1live.alwaz.tech"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600 sm:inline-flex"
          >
            Live Site
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;