import { useQuery } from "@tanstack/react-query";

import { getRaceClassification } from "../api/f1Api";

export function useRaceClassification(year, round, enabled = true) {
  return useQuery({
    queryKey: ["race-classification", year, round],
    queryFn: () => getRaceClassification(year, round),
    enabled: Boolean(year) && Boolean(round) && enabled,
    retry: 1,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}