import { useQuery } from "@tanstack/react-query";

import { compareDrivers } from "../api/f1Api";

export const useDriverComparison = (sessionKey, driver1, driver2) => {
  return useQuery({
    queryKey: ["driver-comparison", sessionKey, driver1, driver2],
    queryFn: () => compareDrivers(sessionKey, driver1, driver2),
    enabled: Boolean(sessionKey && driver1 && driver2 && driver1 !== driver2),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};