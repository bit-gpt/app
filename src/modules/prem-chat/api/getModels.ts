import api from "shared/api/v1";

const getModels = async () => {
  return api.get(`${import.meta.env.VITE_BACKEND_NEW_URL}/v1/models`);
};

export default getModels;
