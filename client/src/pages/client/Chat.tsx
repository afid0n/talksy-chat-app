import { useEffect, useState } from "react";
import socket from "@/socket";
import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

import type { Message } from "@/services/messageService";
import { fetchMessagesForChat } from "@/services/messageService";
import { getPrivateChat } from "@/services/chatService"; // Your service to get/create chat by friendId

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
  chatId?: string; // optional, you can add it if backend returns it
};

const ChatWrapper = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  // Load chat previews on mount
  useEffect(() => {
    getChatPreviewsForUser()
      .then(setConversations)
      .catch(console.error);
  }, []);

  // When conversations load, select first friend (user id)
  useEffect(() => {
    if (conversations.length > 0 && !selectedFriendId) {
      const firstFriendId = conversations[0].friendId;
      setSelectedFriendId(firstFriendId);
    }
  }, [conversations, selectedFriendId]);

  // When selectedFriendId changes, get or create the private chat and set selectedChatId (chat._id)
  useEffect(() => {
    if (!selectedFriendId) {
      setSelectedChatId(null);
      setMessages([]);
      return;
    }

    getPrivateChat(selectedFriendId)
      .then((chat) => {
        setSelectedChatId(chat._id);
      })
      .catch((err) => {
        console.error("Failed to get private chat:", err);
        setSelectedChatId(null);
      });
  }, [selectedFriendId]);

  // Load messages & handle socket on selectedChatId change
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

      // Update conversations preview last message based on friendId matching
      setConversations((prev) =>
        prev.map((chat) =>
          chat.friendId === selectedFriendId
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
  }, [selectedChatId, currentUser.id, selectedFriendId]);

  return (
    <div className="flex min-h-screen w-full h-full">
      <Messages
        conversations={conversations.map((chat) => ({
          id: chat.friendId,
          name: chat.fullName || "Unnamed Chat",
          username: chat.username,
          avatarUrl: chat.avatar?.url || "",
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
        selectedId={selectedFriendId}
        onSelect={(friendId) => setSelectedFriendId(friendId)}
        searchQuery=""
        onSearchChange={() => {}}
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
