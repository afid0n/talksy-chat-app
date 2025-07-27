import instance from "./instance"; 
import type { Chat, CreateChatPayload, UpdateChatPayload } from "@/types/Chat";

// Get chat by ID
export const getChatById = async (id: string): Promise<Chat> => {
  const res = await instance.get<Chat>(`/chats/${id}`);
  return res.data;
};

// Get all chats for current logged-in user
export const getChatsForUser = async (): Promise<Chat[]> => {
  const res = await instance.get<Chat[]>("/chats"); 
  console.log(res.data)
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

export const getPrivateChat = async (userId: string) => {
  try {
    const res = await instance.get(`/chats/with/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to get private chat:", error);
    throw error;
  }
};

// chatService.ts
export const getOrCreateChatWithUser = async (friendId: string) => {
  try {
    const response = await instance.post('/chats/with-user', { friendId });
    console.log("API response from getOrCreateChatWithUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in getOrCreateChatWithUser:", error);
    throw error;
  }
};


