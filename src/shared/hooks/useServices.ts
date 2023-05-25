import { useQuery } from "@tanstack/react-query";
import { getServices } from "modules/service/api";

export const SERVICES_KEY = "getServices";

const useServices = () => {
  return useQuery([SERVICES_KEY], getServices);
};

export default useServices;
