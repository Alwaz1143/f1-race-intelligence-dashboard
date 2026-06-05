import { Link } from "react-router";

function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
          Formula 1 Analytics
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          F1 Race Intelligence Dashboard
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Analyze Formula 1 race sessions using OpenF1 data, backend analytics,
          lap-time comparison, race control events, and dashboard-ready insights.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/dashboard"
            className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Start Analysis
          </Link>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            View API Docs
          </a>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="font-semibold text-slate-100">FastAPI Backend</h2>
            <p className="mt-2 text-sm text-slate-400">
              Clean API layer with OpenF1 integration, caching, and analytics.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="font-semibold text-slate-100">Race Analytics</h2>
            <p className="mt-2 text-sm text-slate-400">
              Fastest laps, driver comparison, lap trends, and race control data.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="font-semibold text-slate-100">React Dashboard</h2>
            <p className="mt-2 text-sm text-slate-400">
              Frontend built with React, Tailwind, TanStack Query, and Recharts.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;