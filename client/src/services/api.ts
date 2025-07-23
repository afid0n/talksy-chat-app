export const API_BASE_URL: string = import.meta.env.VITE_SERVER_URL || "";

type endpointType = {
  users: string;
  chats: string;
  messages: string;
};

export const endpoints: endpointType = {
  users: "/users",
  chats: "/chats",
 messages: "/messages"
}