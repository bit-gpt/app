import api from "./api";

export const fetchStatus = async () => {
  return api.get("/v1/status/");
};
