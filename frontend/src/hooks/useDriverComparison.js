import { useQuery } from "@tanstack/react-query";

import { getDriverComparison } from "../api/f1Api";

function shouldRetryRequest(failureCount, error) {
  const status = error?.response?.status;

  if (!status) {
    return failureCount < 3;
  }

  const retryableStatuses = [408, 429, 500, 502, 503, 504];

  return retryableStatuses.includes(status) && failureCount < 2;
}

export function useDriverComparison(
  sessionKey,
  driver1,
  driver2,
  enabled = true
) {
  return useQuery({
    queryKey: ["driver-comparison", sessionKey, driver1, driver2],
    queryFn: () => getDriverComparison(sessionKey, driver1, driver2),
    enabled:
      Boolean(sessionKey) &&
      Boolean(driver1) &&
      Boolean(driver2) &&
      driver1 !== driver2 &&
      enabled,
    retry: shouldRetryRequest,
    retryDelay: (attemptIndex) =>
      Math.min(700 * 2 ** attemptIndex, 4000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}