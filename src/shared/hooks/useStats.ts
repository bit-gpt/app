import { useQuery } from "@tanstack/react-query";
import getStats from "modules/service/api/getStats";

const useStats = () => {
  return useQuery(["getStats"], getStats);
};

export default useStats;
