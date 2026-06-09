function ErrorState({ message = "Something went wrong", error, onRetry }) {
  const apiErrorMessage =
    error?.response?.data?.detail ||
    error?.message ||
    "Please try again.";

  return (
    <div className="mt-4 rounded-2xl border border-red-900/70 bg-red-950/30 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-red-300">{message}</p>

          <p className="mt-1 text-sm text-red-200/80">
            {apiErrorMessage}
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-red-800 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-900/50"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;