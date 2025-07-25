import axios from "axios";
import { API_BASE_URL } from "./api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { "api-key": "code_academy" },
});

axios.interceptors.request.use(config => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default instance;