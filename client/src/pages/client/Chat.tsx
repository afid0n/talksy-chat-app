import { useEffect, useState } from "react";
import socket from "@/socket";
import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

import type { Message } from "@/services/messageService";
import { fetchMessagesForChat } from "@/services/messageService";

import { getChatsForUser } from "@/services/chatService";
import type { Chat } from "@/types/Chat";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

const ChatWrapper = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    getChatsForUser()
      .then(setConversations)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    // Join socket room
    socket.emit("joinRoom", selectedChatId);

    // Fetch existing messages
    fetchMessagesForChat(selectedChatId)
      .then(setMessages)
      .catch(console.error);

    // Handle incoming real-time messages
    const handleIncomingMessage = (message: Message & { chat: string }) => {
      if (message.chat === selectedChatId) {
        if (!message.sender) {
          message.sender = { _id: currentUser.id || "unknown_id", fullName: currentUser.fullName || "Unknown" };
        }

        setMessages((prev) => {
          const index = prev.findIndex((msg) => msg._id === message._id);

          if (index !== -1) {
            const updatedMessages = [...prev];
            updatedMessages[index] = message;
            return updatedMessages;
          }
          return [...prev, message];
        });
      }
    };



    socket.on("receiveMessage", handleIncomingMessage);

    return () => {
      socket.emit("leaveRoom", selectedChatId);
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [selectedChatId, currentUser.id]);

  return (
    <div className="flex min-h-screen w-full h-full">
      <Messages
        conversations={conversations.map((chat) => ({
          id: chat._id,
          name: chat.name || "Unnamed Chat",
          lastMessage: chat.lastMessage?.content || "",
          lastMessageTime: chat.updatedAt
            ? new Date(chat.updatedAt).toLocaleTimeString()
            : "",
          unreadCount: 0,
          initials: chat.name
            ? chat.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
            : "C",
          isGroup: chat.isGroup,
        }))}
        selectedId={selectedChatId}
        onSelect={setSelectedChatId}
        searchQuery=""
        onSearchChange={() => { }}
      />

      <ChatPage
        selectedId={selectedChatId}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatWrapper;
