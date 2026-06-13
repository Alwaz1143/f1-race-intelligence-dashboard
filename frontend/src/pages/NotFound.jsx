import { Link } from "react-router";

function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-4 text-slate-400">
          The page you are looking for does not exist. Return to the dashboard
          to continue exploring Formula 1 analytics.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;