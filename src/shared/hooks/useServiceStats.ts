import { useQuery } from "@tanstack/react-query";
import getServiceStats from "modules/service/api/getServiceStats";

const useServiceStats = (serviceId: string) => {
  return useQuery(["getServiceStats", serviceId], () => getServiceStats(serviceId), {
    staleTime: 0,
  });
};

export default useServiceStats;
