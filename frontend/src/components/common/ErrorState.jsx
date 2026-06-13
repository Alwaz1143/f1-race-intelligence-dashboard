import OpenF1RestrictedState from "./OpenF1RestrictedState";

import {
  getApiErrorDetail,
  isOpenF1LiveSessionRestrictedError,
} from "../../utils/apiErrorUtils";

function ErrorState({ message = "Something went wrong", error, onRetry }) {
  if (isOpenF1LiveSessionRestrictedError(error)) {
    return <OpenF1RestrictedState onRetry={onRetry} />;
  }

  const errorDetail = getApiErrorDetail(error);

  return (
    <div className="mt-6 rounded-2xl border border-red-900/60 bg-red-950/30 p-5 text-red-100">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
            Error
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {message}
          </h3>

          {errorDetail && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-red-200/80">
              {errorDetail}
            </p>
          )}
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;