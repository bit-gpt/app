import axios from "axios";
import { ImageGeneration } from "../types";

const generateImage = async (data: ImageGeneration) => {
  return axios.post("https://api.openai.com/v1/images/generations", data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
};

export default generateImage;
