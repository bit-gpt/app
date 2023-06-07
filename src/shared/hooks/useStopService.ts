import { useMutation } from "@tanstack/react-query";
import stopService from "modules/service/api/stopService";

const useStopService = () => {
  return useMutation((id: string) => stopService(id));
};

export default useStopService;
