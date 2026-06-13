import { useQuery } from "@tanstack/react-query";

import { getAiSummary } from "../api/f1Api";

export function useAiSummary(sessionKey, enabled = true) {
  return useQuery({
    queryKey: ["ai-summary", sessionKey],
    queryFn: () => getAiSummary(sessionKey),
    enabled: Boolean(sessionKey) && enabled,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}