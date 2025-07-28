export const API_BASE_URL: string = import.meta.env.VITE_SERVER_URL || "http://localhost:7070";

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