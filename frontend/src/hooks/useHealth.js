import { useQuery } from "@tanstack/react-query";

import { getHealth } from "../api/f1Api";

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 1000 * 60,
  });
};