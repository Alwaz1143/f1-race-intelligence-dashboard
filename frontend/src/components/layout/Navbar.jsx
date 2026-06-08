import { Link, NavLink } from "react-router";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/" className="text-lg font-bold text-slate-100">
          F1<span className="text-red-500">Intel</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-red-400" : "text-slate-400 hover:text-slate-100"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-red-400" : "text-slate-400 hover:text-slate-100"
            }
          >
            Dashboard
          </NavLink>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-900"
          >
            API Docs
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;