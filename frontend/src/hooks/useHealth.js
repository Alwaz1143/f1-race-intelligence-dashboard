import { useQuery } from "@tanstack/react-query";

import { getHealth } from "../api/f1Api";

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};