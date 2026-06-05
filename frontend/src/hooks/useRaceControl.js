import { useQuery } from "@tanstack/react-query";

import { getRaceControl } from "../api/f1Api";

export const useRaceControl = (sessionKey) => {
  return useQuery({
    queryKey: ["race-control", sessionKey],
    queryFn: () => getRaceControl(sessionKey),
    enabled: Boolean(sessionKey),
    staleTime: 1000 * 60 * 10,
  });
};