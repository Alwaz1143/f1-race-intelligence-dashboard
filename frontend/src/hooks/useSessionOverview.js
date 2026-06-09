import { useQuery } from "@tanstack/react-query";

import { getSessionOverview } from "../api/f1Api";

export const useSessionOverview = (sessionKey) => {
  return useQuery({
    queryKey: ["session-overview", sessionKey],
    queryFn: () => getSessionOverview(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};