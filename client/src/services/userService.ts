import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse
} from "@/types/Auth";
import instance from "./instance";
import type { AxiosError } from "axios";
import type {User } from "@/types/User";

// Register user
export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    console.log("📦 Sending register payload:", payload);
    const response = await instance.post<RegisterResponse>("/users/register", payload);
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

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await instance.post<{ success: boolean; message: string }>("/users/resend-verification-email", { email });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to resend verification email.");
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const res = await instance.get<User>("/users/me", {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch current user");
  }
};
