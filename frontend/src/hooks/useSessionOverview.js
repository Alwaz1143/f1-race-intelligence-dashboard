import { useQuery } from "@tanstack/react-query";

import { getSessionOverview } from "../api/f1Api";

export const useSessionOverview = (sessionKey) => {
  return useQuery({
    queryKey: ["session-overview", sessionKey],
    queryFn: () => getSessionOverview(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};