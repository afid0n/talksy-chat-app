import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/Auth";
import instance from "./instance";


// Register user
export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response = await instance.post<RegisterResponse>("/users/register", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to register.");
  }
};

// Login user
export const loginUser = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await instance.post<LoginResponse>("/users/login", credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to login.");
  }
};
