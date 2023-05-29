import { useQuery } from "@tanstack/react-query";
import getGPUStats from "modules/service/api/getGPUStats";

const useSystemStats = () => {
  return useQuery(["getGPUStats"], getGPUStats);
};

export default useSystemStats;
