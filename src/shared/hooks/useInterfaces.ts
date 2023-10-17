import { useQuery } from "@tanstack/react-query";
import getInterfaces from "modules/service/api/getInterfaces";

// TODO: Move interfaces to Rust
const useInterfaces = () => {
  return useQuery(["getApps"], getInterfaces);
};

export default useInterfaces;
