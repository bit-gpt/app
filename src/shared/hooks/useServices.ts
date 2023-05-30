import { useQuery } from "@tanstack/react-query";
import { getServices } from "modules/service/api";
import { SERVICE_CHECK_REFETCH_INTERVAL } from "shared/helpers/utils";

export const SERVICES_KEY = "getServices";

const useServices = () => {
  return useQuery([SERVICES_KEY], getServices, { refetchInterval: SERVICE_CHECK_REFETCH_INTERVAL });
};

export default useServices;
