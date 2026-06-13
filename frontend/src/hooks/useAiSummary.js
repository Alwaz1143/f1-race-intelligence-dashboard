import { useQuery } from "@tanstack/react-query";

import { getAiSummary } from "../api/f1Api";

function shouldRetryRequest(failureCount, error) {
  const status = error?.response?.status;

  if (!status) {
    return failureCount < 3;
  }

  const retryableStatuses = [408, 429, 500, 502, 503, 504];

  return retryableStatuses.includes(status) && failureCount < 3;
}

export function useAiSummary(sessionKey, enabled = true) {
  return useQuery({
    queryKey: ["ai-summary", sessionKey],
    queryFn: () => getAiSummary(sessionKey),
    enabled: Boolean(sessionKey) && enabled,
    retry: shouldRetryRequest,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 8000),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}