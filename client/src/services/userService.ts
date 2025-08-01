import type {
  LoginPayload,
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
): Promise<{ message: string , token:string}> => {
  try {
    const response = await instance.post<{
      message: string;
      token: string;
    }>("/users/login", credentials);

    // Store token in localStorage for future requests
    localStorage.setItem("token", response.data.token);
    return { message: response.data.message, token: response.data.token };
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
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token found");

  try {
    const res = await instance.get<User>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch current user");
  }
};



export const sendFriendRequest = async (targetId: string) => {
  const res = await instance.post(`/users/send-request/${targetId}`, {});
  return res.data;
};

export const acceptFriendRequest = async (requesterId: string) => {
  const res = await instance.post(`/users/accept-request/${requesterId}`, {});
  return res.data;
};

export const fetchAllUsers = async () => {
  const response = await instance.get('/users');
  return response.data; // all users
};

export const getUserById = async (id: string) => {
  const res = await instance.get(`/users/${id}`);
  return res.data;
};

export const cancelFriendRequest = async (requesterId: string) => {
  const res = await instance.post(`/users/cancel-request/${requesterId}`, {}, );
  return res.data;
};

export const getChatPreviewsForUser = async () => {
  const res = await instance.get("/users/chat-previews"); 
 return res.data;
 

};

export const removeFriend = async (friendId: string): Promise<void> => {
  await instance.delete(`/users/friends/${friendId}`);
};

export const logout = async () => {
  return await instance.post("/users/logout");
};

export const deleteAccount = async () => {
  return await instance.delete("/users/delete-account", );
};
