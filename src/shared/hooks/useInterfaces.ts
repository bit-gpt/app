import { useQuery } from "@tanstack/react-query";
import getInterfaces from "modules/service/api/getInterfaces";

const useInterfaces = () => {
  return useQuery(["getApps"], getInterfaces);
};

export default useInterfaces;
