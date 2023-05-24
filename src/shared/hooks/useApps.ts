import { useQuery } from "@tanstack/react-query";
import { getApps } from "modules/dashboard/api";

const useApps = () => {
  return useQuery(["getApps"], getApps);
};

export default useApps;
