import { Link } from "react-router";

import Badge from "../ui/Badge";
import Panel from "../ui/Panel";

function OpenF1RestrictedState({ onRetry }) {
  return (
    <Panel className="mt-6 overflow-hidden">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Badge variant="yellow">Temporary API Restriction</Badge>
        </div>

        <h2 className="mt-5 text-3xl font-black tracking-tight text-white">
          Live F1 Session Access Restricted
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          OpenF1 is currently restricting public API access because a live
          Formula 1 session is in progress. During this time, even requests for
          past sessions can return a 401 Unauthorized response.
        </p>

        <div className="mt-6 rounded-2xl border border-yellow-900/60 bg-yellow-950/20 p-5 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            What this means
          </p>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>
              • The dashboard and backend are working correctly.
            </li>
            <li>
              • OpenF1 temporarily blocks unauthenticated global access during
              live sessions.
            </li>
            <li>
              • The dashboard should work again once the live session ends.
            </li>
          </ul>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600"
            >
              Try Again
            </button>
          )}

          <Link
            to="/"
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Go Home
          </Link>

          <a
            href="https://f1-race-intelligence-api.onrender.com/api/health"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Check API Health
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          This is a temporary OpenF1 access limitation, not an application crash.
        </p>
      </div>
    </Panel>
  );
}

export default OpenF1RestrictedState;