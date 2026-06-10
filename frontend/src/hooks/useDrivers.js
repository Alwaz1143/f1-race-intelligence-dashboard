import { useQuery } from "@tanstack/react-query";

import { getDrivers } from "../api/f1Api";

export const useDrivers = (sessionKey) => {
  return useQuery({
    queryKey: ["drivers", sessionKey],
    queryFn: () => getDrivers(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};