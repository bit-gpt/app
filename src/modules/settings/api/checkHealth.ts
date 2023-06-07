import axios, { AxiosResponse } from "axios";
import { Health } from "../types";

const checkHealth = async (url: string): Promise<AxiosResponse<Health>> => axios.get(`${url}/v1/`);

export default checkHealth;
