import { Link } from "react-router";

import Panel from "../components/ui/Panel";

function Home() {
  const capabilities = [
    "Race session overview",
    "Fastest lap intelligence",
    "Driver pace comparison",
    "Race control event tracking",
    "AI-generated session briefing",
    "Shareable race dashboard views",
  ];

  const useCases = [
    "Understand a race session at a glance",
    "Compare driver pace across laps",
    "Identify the fastest moments of a session",
    "Track race control messages and incidents",
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] px-4 py-8 text-slate-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-400">
              Formula 1 Race Intelligence
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Understand every race session faster.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Race Intelligence turns Formula 1 session data into clear,
              interactive insights. Explore pace trends, fastest laps, driver
              comparisons, race control activity, and AI-assisted race briefings
              from one focused dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600"
              >
                Open Race Dashboard
              </Link>

              <a
                href="#capabilities"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                View Capabilities
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">5</p>
                <p className="mt-1 text-sm text-slate-400">
                  Analysis views
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">Live</p>
                <p className="mt-1 text-sm text-slate-400">
                  Race intelligence
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">AI</p>
                <p className="mt-1 text-sm text-slate-400">
                  Session briefings
                </p>
              </div>
            </div>
          </div>

          <Panel className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/20 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
                    Race Snapshot
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Session intelligence in one view
                  </h2>
                </div>

                <span className="rounded-full border border-green-900 bg-green-950/60 px-3 py-1 text-xs font-semibold text-green-300">
                  Online
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Fastest Lap</p>
                    <p className="text-sm font-semibold text-green-300">
                      01:20:47
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-4/5 rounded-full bg-red-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Drivers</p>
                    <p className="mt-2 text-3xl font-black">20</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Race Events</p>
                    <p className="mt-2 text-3xl font-black">111</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Race Briefing</p>
                  <p className="mt-2 leading-7 text-slate-200">
                    Pace, lap records, race control activity, and driver
                    comparisons are summarized into a clear session briefing.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section
          id="capabilities"
          className="mt-10 grid gap-6 lg:grid-cols-2"
        >
          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Capabilities
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Everything needed to analyze a race session
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300"
                >
                  {capability}
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Race Analysis
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Built for fast race understanding
            </h2>

            <div className="mt-6 space-y-3">
              {useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300"
                >
                  {useCase}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-4">
              <p className="text-sm leading-7 text-slate-300">
                Designed for fans, analysts, and race-data explorers who want a
                cleaner way to understand what happened across a Formula 1
                session.
              </p>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

export default Home;