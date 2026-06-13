import ErrorState from "../common/ErrorState";
import SectionHeader from "../common/SectionHeader";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function AiSessionSummary({
    summaryData,
    isLoading,
    isError,
    error,
    onRetry,
}) {
    return (
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
            <SectionHeader
                eyebrow="AI Summary"
                title="Session Intelligence Summary"
                description="AI-generated explanation based on the selected session analytics."
            />

            {isLoading && (
                <div className="mt-4 animate-pulse rounded-2xl bg-slate-950 p-5">
                    <div className="h-4 w-40 rounded bg-slate-800" />
                    <div className="mt-4 h-4 w-full rounded bg-slate-800" />
                    <div className="mt-3 h-4 w-11/12 rounded bg-slate-800" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-slate-800" />
                </div>
            )}

            {isError && (
                <ErrorState
                    message="Failed to generate AI summary"
                    error={error}
                    onRetry={onRetry}
                />
            )}

            {summaryData?.summary && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Model: {summaryData.model}</span>

                        {summaryData.cached && (
                            <span className="rounded-full bg-green-950 px-2 py-1 text-green-300">
                                Cached
                            </span>
                        )}
                    </div>

                    <div className="max-w-none text-slate-200">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="mb-4 mt-6 text-2xl font-bold text-slate-100">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="mb-3 mt-5 text-xl font-bold text-red-300">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="mb-2 mt-4 text-lg font-semibold text-slate-100">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="mb-3 leading-7 text-slate-300">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-300">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-300">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="leading-7">
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold text-slate-100">
                                        {children}
                                    </strong>
                                ),
                                code: ({ children }) => (
                                    <code className="rounded bg-slate-900 px-1.5 py-0.5 text-sm text-red-300">
                                        {children}
                                    </code>
                                ),
                            }}
                        >
                            {summaryData.summary}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AiSessionSummary;