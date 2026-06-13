import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
          <section className="max-w-xl rounded-2xl border border-red-900/70 bg-red-950/30 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Something went wrong
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              The dashboard crashed unexpectedly
            </h1>

            <p className="mt-4 text-slate-400">
              This may be caused by a temporary API issue or unexpected data.
              You can reload the page or go back to the home page.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
              >
                Go Home
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;