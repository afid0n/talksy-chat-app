import type { AxiosResponse } from "axios";
import instance from "./instance";


export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const getAllUsers = async <T = any>(): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.get("/users");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch users.");
  }
};

export const registerUser = async <T = any>(payload: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.post("/users/register", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to register.");
  }
};

export const loginUser = async <T = any>(credentials: { email: string; password: string; }): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.post("/users/login", credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to login.");
  }
};
