import { useQuery } from "@tanstack/react-query";

import { compareDrivers } from "../api/f1Api";

export const useDriverComparison = (sessionKey, driver1, driver2) => {
  return useQuery({
    queryKey: ["driver-comparison", sessionKey, driver1, driver2],
    queryFn: () => compareDrivers(sessionKey, driver1, driver2),
    enabled: Boolean(sessionKey && driver1 && driver2 && driver1 !== driver2),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};