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
    <main className="min-h-[calc(100vh-73px)] px-4 py-12 text-slate-100 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="animate-slide-in-up">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              Formula 1 Race Intelligence
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
              Understand every race session faster.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Race Intelligence transforms Formula 1 session data into clear,
              interactive insights. Explore pace trends, fastest laps, driver
              comparisons, race control activity, and AI-assisted race briefings
              from one intelligent dashboard.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-8 py-4 font-semibold text-white shadow-xl shadow-red-600/40 transition-all duration-300 hover:shadow-red-600/60 hover:scale-105 active:scale-95"
              >
                <span className="relative">
                  Open Race Dashboard
                  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:animate-pulse-glow" />
                </span>
              </Link>

              <a
                href="#capabilities"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-600 bg-slate-900/50 px-8 py-4 font-semibold text-slate-200 transition-all duration-300 hover:border-red-500 hover:bg-slate-800/70 hover:text-white"
              >
                View Capabilities
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="card-gradient rounded-xl p-5 border hover-lift group">
                <p className="text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">5</p>
                <p className="mt-2 text-sm text-slate-300 group-hover:text-slate-200">
                  Analysis views
                </p>
              </div>

              <div className="card-gradient rounded-xl p-5 border hover-lift group">
                <p className="text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">Live</p>
                <p className="mt-2 text-sm text-slate-300 group-hover:text-slate-200">
                  Race intelligence
                </p>
              </div>

              <div className="card-gradient rounded-xl p-5 border hover-lift group">
                <p className="text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">AI</p>
                <p className="mt-2 text-sm text-slate-300 group-hover:text-slate-200">
                  Session briefings
                </p>
              </div>
            </div>
          </div>

          <Panel className="relative overflow-hidden animate-slide-in-down">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-500/20 blur-3xl animate-float" />
            <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                    Race Snapshot
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Session intelligence in one view
                  </h2>
                </div>

                <span className="rounded-full border border-green-600/50 bg-green-950/60 px-3 py-1 text-xs font-bold text-green-300 animate-pulse-glow">
                  Online
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="card-gradient rounded-xl p-5 border hover-lift group">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400 group-hover:text-slate-300">Fastest Lap</p>
                    <p className="text-sm font-bold text-green-400">
                      01:20:47
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800/50">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-red-600 to-red-500 group-hover:w-5/6 transition-all duration-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="card-gradient rounded-xl p-5 border hover-lift">
                    <p className="text-sm text-slate-400">Drivers</p>
                    <p className="mt-3 text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">20</p>
                  </div>

                  <div className="card-gradient rounded-xl p-5 border hover-lift">
                    <p className="text-sm text-slate-400">Race Events</p>
                    <p className="mt-3 text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">111</p>
                  </div>
                </div>

                <div className="card-gradient rounded-xl p-5 border hover-lift group">
                  <p className="text-sm text-slate-400 group-hover:text-slate-300">Race Briefing</p>
                  <p className="mt-3 leading-7 text-slate-300">
                    Pace, lap records, race control activity, and driver
                    comparisons are automatically summarized into a clear session briefing.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section
          id="capabilities"
          className="mt-16 grid gap-8 lg:grid-cols-2"
        >
          <Panel className="animate-slide-in-up">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              Capabilities
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Everything to analyze a race session
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability, idx) => (
                <div
                  key={capability}
                  className="card-gradient rounded-lg border px-5 py-4 text-sm text-slate-300 hover-lift hover:text-slate-100 group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="inline-block mr-2 text-red-500 font-bold">→</span>
                  {capability}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              Race Analysis
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Fast race understanding
            </h2>

            <div className="mt-8 space-y-3">
              {useCases.map((useCase, idx) => (
                <div
                  key={useCase}
                  className="card-gradient rounded-lg border px-5 py-4 text-sm text-slate-300 hover-lift hover:text-slate-100 transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="inline-block mr-3 text-red-500 font-bold">✓</span>
                  {useCase}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-red-600/40 bg-gradient-to-r from-red-950/40 to-red-900/20 p-5 hover-lift">
              <p className="text-sm leading-7 text-slate-300">
                Designed for fans, analysts, and race-data explorers who want a
                smarter way to understand what happened across a Formula 1
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
