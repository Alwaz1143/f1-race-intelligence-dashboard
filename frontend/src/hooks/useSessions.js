import { useQuery } from "@tanstack/react-query";

import { getSessions } from "../api/f1Api";

export const useSessions = (meetingKey, raceKey) => {
  return useQuery({
    queryKey: ["sessions", meetingKey, raceKey],
    queryFn: () => getSessions(meetingKey, raceKey),
    enabled: Boolean(meetingKey) || Boolean(raceKey),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
