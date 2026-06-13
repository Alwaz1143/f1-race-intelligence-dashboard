import { Link } from "react-router";

import Badge from "../components/ui/Badge";
import Panel from "../components/ui/Panel";

function Home() {
  const features = [
    "Session overview analytics",
    "Fastest lap leaderboard",
    "Driver comparison charts",
    "Race control event analysis",
    "AI-generated session summary",
    "Redis-backed API caching",
  ];

  const techStack = [
    "React",
    "Vite",
    "FastAPI",
    "Redis",
    "OpenF1 API",
    "TanStack Query",
    "Recharts",
    "Tailwind CSS",
    "Gemini API",
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] px-4 py-8 text-slate-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="red">MVP Deployed</Badge>
              <Badge variant="green">Live Analytics</Badge>
              <Badge>F1 Data Intelligence</Badge>
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-red-400">
              Formula 1 Analytics Platform
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              F1 Race Intelligence Dashboard
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              A full-stack Formula 1 analytics dashboard that transforms
              OpenF1 race data into interactive insights, lap-time comparisons,
              race control analysis, and AI-generated session summaries.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600"
              >
                Open Live Dashboard
              </Link>

              <a
                href="https://f1-race-intelligence-api.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                View API Docs
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">5</p>
                <p className="mt-1 text-sm text-slate-400">
                  Analysis sections
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">Redis</p>
                <p className="mt-1 text-sm text-slate-400">
                  Production caching
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-3xl font-black text-red-400">AI</p>
                <p className="mt-1 text-sm text-slate-400">
                  Session summaries
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
                    Race Control
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Intelligence Snapshot
                  </h2>
                </div>

                <Badge variant="green">Online</Badge>
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
                  <p className="text-sm text-slate-400">AI Takeaway</p>
                  <p className="mt-2 leading-7 text-slate-200">
                    Late-race pace, race control activity, and driver
                    comparison data are combined into a concise session
                    intelligence summary.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Features
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Built for race-session analysis
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300"
                >
                  {feature}
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Tech Stack
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Full-stack engineering stack
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm leading-7 text-slate-400">
                Frontend deployed on Vercel, backend deployed on Render, Redis
                caching powered by Upstash, and live Formula 1 data served
                through the OpenF1 API.
              </p>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

export default Home;