import instance from "./instance"; // your axios instance
import type { Chat, CreateChatPayload, UpdateChatPayload } from "@/types/Chat";

// Get chat by ID
export const getChatById = async (id: string): Promise<Chat> => {
  const res = await instance.get<Chat>(`/chats/${id}`);
  return res.data;
};

// Get all chats for current logged-in user
export const getChatsForUser = async (): Promise<Chat[]> => {
  const res = await instance.get<Chat[]>("/chats"); // assumes your backend uses auth to get user
  return res.data;
};

// Create a new chat
export const createChat = async (payload: CreateChatPayload): Promise<Chat> => {
  const res = await instance.post<Chat>("/chats", payload);
  return res.data;
};

// Update an existing chat by id
export const updateChat = async (id: string, payload: UpdateChatPayload): Promise<Chat> => {
  const res = await instance.put<Chat>(`/chats/${id}`, payload);
  return res.data;
};

// Delete a chat by id
export const deleteChat = async (id: string): Promise<{ message: string }> => {
  const res = await instance.delete<{ message: string }>(`/chats/${id}`);
  return res.data;
};
