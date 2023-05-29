import { useQuery } from "@tanstack/react-query";
import getService from "modules/service-detail/api/getService";

export const SERVICE_KEY = "getService";

const useService = (id: string) => {
  return useQuery([SERVICE_KEY, id], () => getService(id));
};

export default useService;
