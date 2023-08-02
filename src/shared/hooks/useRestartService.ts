import { useMutation } from "@tanstack/react-query";
import restartService from "modules/service/api/restartService";

const useStartService = () => {
  return useMutation((id: string) => restartService(id));
};

export default useStartService;
