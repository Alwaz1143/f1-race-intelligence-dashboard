import { Link } from "react-router";

import Badge from "../components/ui/Badge";
import Panel from "../components/ui/Panel";

function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-89px)] items-center justify-center px-4 py-10 text-slate-100 sm:px-6">
      <Panel className="max-w-xl text-center">
        <Badge variant="red">404</Badge>

        <h1 className="mt-5 text-3xl font-black text-white">
          Page Not Found
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          The page you are looking for does not exist. Return to the dashboard
          to continue exploring Formula 1 race intelligence.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Go Home
          </Link>
        </div>
      </Panel>
    </main>
  );
}

export default NotFound;