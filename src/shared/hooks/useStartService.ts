import { useMutation } from "@tanstack/react-query";
import startService from "modules/service/api/startService";

const useStartService = () => {
  return useMutation((id: string) => startService(id));
};

export default useStartService;
