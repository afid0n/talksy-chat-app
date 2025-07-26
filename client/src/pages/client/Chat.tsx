import { useEffect, useState } from "react";
import socket from "@/socket";
import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

import type { Message } from "@/services/messageService";
import { fetchMessagesForChat } from "@/services/messageService";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { getChatPreviewsForUser } from "@/services/userService";

type ChatPreview = {
  friendId: string;
  fullName: string;
  username: string;
  avatar: { url: string };
  isGroup: boolean;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  updatedAt?: string;
};


const ChatWrapper = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  // Load chat previews
  useEffect(() => {
    getChatPreviewsForUser()
      .then(setConversations)
      .catch(console.error);
  }, []);

  // Automatically select first chat if none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedChatId) {
      setSelectedChatId(conversations[0].friendId);
    }
  }, [conversations, selectedChatId]);

  // Load messages and handle socket events when chat changes
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    socket.emit("joinRoom", selectedChatId);

    fetchMessagesForChat(selectedChatId)
      .then(setMessages)
      .catch(console.error);

    const handleIncomingMessage = (message: Message & { chat: string }) => {
      if (message.chat === selectedChatId) {
        if (!message.sender) {
          message.sender = {
            _id: currentUser.id || "unknown_id",
            fullName: currentUser.fullName || "Unknown",
          };
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

      // Update conversations preview with new last message
      setConversations((prev) =>
        prev.map((chat) =>
          chat.friendId === message.chat
            ? {
              ...chat,
              lastMessage: {
                content: message.content,
                createdAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
            : chat
        )
      );
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
          id: chat.friendId,
          name: chat.fullName || "Unnamed Chat",
          username: chat.username,
          avatarUrl: chat.avatar?.url || "",   // pass avatar url here
          lastMessage: chat.lastMessage?.content || "",
          lastMessageTime: chat.lastMessage?.createdAt
            ? new Date(chat.lastMessage.createdAt).toLocaleTimeString()
            : "",
          unreadCount: 0,
          initials: chat.fullName
            ? chat.fullName
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
