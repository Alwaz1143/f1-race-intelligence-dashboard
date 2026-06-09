import { useQuery } from "@tanstack/react-query";

import { getFastestLaps } from "../api/f1Api";

export const useFastestLaps = (sessionKey) => {
  return useQuery({
    queryKey: ["fastest-laps", sessionKey],
    queryFn: () => getFastestLaps(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};