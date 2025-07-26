import type { AxiosError } from "axios";
import instance from "./instance";

export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    fullName: string;
    // add more sender fields if needed
  };
  type: "text" | "image" | "video" | "gif";
  content: string;
  status: "sent" | "delivered" | "read";
  replyTo?: string | null;
  deleted: boolean;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all messages for a chat
export const fetchMessagesForChat = async (chatId: string): Promise<Message[]> => {
  try {
    const res = await instance.get<Message[]>(`/messages/${chatId}`);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch messages");
  }
};

// Send a new message
export const sendMessage = async (messageData: Partial<Message>): Promise<Message> => {
  try {
    const res = await instance.post<Message>("/messages", messageData);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to send message");
  }
};

// Update a message
export const updateMessage = async (messageId: string, updateData: Partial<Message>): Promise<Message> => {
  try {
    const res = await instance.put<Message>(`/messages/${messageId}`, updateData);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to update message");
  }
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<{ message: string }> => {
  try {
    const res = await instance.delete<{ message: string }>(`/messages/${messageId}`);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(err.response?.data?.message || err.message || "Failed to delete message");
  }
};
