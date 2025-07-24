import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse
} from "@/types/Auth";
import instance from "./instance";
import type { AxiosError } from "axios";

// Register user
export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response = await instance.post<RegisterResponse>("/users/register", payload);
    console.log(response)
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to register.");
  }
};

// Login user
export const loginUser = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await instance.post<LoginResponse>("/users/login", credentials);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to login.");
  }
};
