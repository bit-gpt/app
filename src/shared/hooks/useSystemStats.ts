import { useQuery } from "@tanstack/react-query";
import getSystemStats from "modules/service/api/getSystemStats";

const useSystemStats = () => {
  return useQuery(["getSystemStats"], getSystemStats);
};

export default useSystemStats;
