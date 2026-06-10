import { useQuery } from "@tanstack/react-query";

import { getFastestLaps } from "../api/f1Api";

export const useFastestLaps = (sessionKey) => {
  return useQuery({
    queryKey: ["fastest-laps", sessionKey],
    queryFn: () => getFastestLaps(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};