import { useQuery } from "@tanstack/react-query";

import { getSessions } from "../api/f1Api";

export const useSessions = (meetingKey) => {
  return useQuery({
    queryKey: ["sessions", meetingKey],
    queryFn: () => getSessions(meetingKey),
    enabled: Boolean(meetingKey),
    staleTime: 1000 * 60 * 10,
  });
};