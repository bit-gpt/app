import { useQuery } from "@tanstack/react-query";
import { getServices } from "modules/service/api";

const useServices = () => {
  return useQuery(["getServices"], getServices)
};

export default useServices;
