import instance from "./instance";
import type { AxiosError } from "axios";

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  userId: string,
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await instance.patch<ChangePasswordResponse>(
      `/users/password/${userId}`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to change password.");
  }
};
