import { useQuery } from "@tanstack/react-query";
import getService from "modules/service-detail/api/getService";
import { SERVICE_CHECK_REFETCH_INTERVAL } from "shared/helpers/utils";

export const SERVICE_KEY = "getService";

const useService = (id: string, refetchInterval = true) => {
  return useQuery([SERVICE_KEY, id], () => getService(id), {
    refetchInterval: refetchInterval ? SERVICE_CHECK_REFETCH_INTERVAL : false,
  });
};

export default useService;
