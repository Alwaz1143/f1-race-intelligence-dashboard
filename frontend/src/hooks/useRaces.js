import { useQuery } from "@tanstack/react-query";

import { getRaces } from "../api/f1Api";

export const useRaces = (year) => {
  return useQuery({
    queryKey: ["races", year],
    queryFn: () => getRaces(year),
    enabled: Boolean(year),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};