import { useEffect, useState } from "react";
import socket from "@/socket";
import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

import { fetchMessagesForChat } from "@/services/messageService";
import { getChatPreviewsForUser } from "@/services/userService";
import { getOrCreateChatWithUser } from "@/services/chatService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { Message } from "@/types/MessagesTypes";

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
  chatId?: string; // Might be undefined here
};

const ChatWrapper = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("userConnected", currentUser.id);
    }
  }, [currentUser?.id]);


  // Debug log currentUser
  useEffect(() => {
    console.log("Current user from Redux:", currentUser);
  }, [currentUser]);

  // Load all conversations for sidebar
  useEffect(() => {
    getChatPreviewsForUser()
      .then((data) => {
        console.log("Fetched chat previews:", data);
        setConversations(data);
      })
      .catch((err) => {
        console.error("Failed to fetch chat previews:", err);
      });
  }, []);

  // Debug conversations update
  useEffect(() => {
    console.log("Updated conversations state:", conversations);
  }, [conversations]);
  ;

  // Handle socket join and message fetch on selectedChatId change
  useEffect(() => {
    if (!selectedChatId) {
      console.log("No selectedChatId yet, skipping socket join and fetch");
      return;
    }

    console.log(`Joining socket room: ${selectedChatId}`);
    socket.emit("joinRoom", selectedChatId);

    fetchMessagesForChat(selectedChatId)
      .then((msgs) => {
        console.log(`Fetched messages for chat ${selectedChatId}:`, msgs);
        setMessages(msgs);
      })
      .catch((err) => {
        console.error(`Failed to fetch messages for chat ${selectedChatId}:`, err);
      });

    const handleIncomingMessage = (message: Message & { chat: string }) => {
      console.log("Received socket message:", message);

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
            const updated = [...prev];
            updated[index] = message;
            return updated;
          }
          return [...prev, message];
        });
      }

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
      console.log(`Leaving socket room: ${selectedChatId}`);
      socket.emit("leaveRoom", selectedChatId);
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [selectedChatId, currentUser.id, selectedFriendId]);
  
  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const handleUserOnline = (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    };

    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, []);
  // Debug selectedFriendId and selectedChatId changes
  useEffect(() => {
    console.log("Selected friend ID:", selectedFriendId);
    console.log("Selected chat ID:", selectedChatId);
  }, [selectedFriendId, selectedChatId]);

     // Extract chatPartnerId from messages or fallback to selectedFriendId
    const getChatPartnerId = (): string | null => {
      if (!messages.length || !currentUser?.id) return selectedFriendId;

      // Find first message sender who is NOT current user
      const firstMsg = messages.find((m) => {
        const senderId = typeof m.sender === "string" ? m.sender : m.sender?._id;
        return senderId !== currentUser.id;
      });

      if (firstMsg) {
        const senderId = typeof firstMsg.sender === "string" ? firstMsg.sender : firstMsg.sender?._id;
        return senderId || selectedFriendId;
      }

      return selectedFriendId;
    };

    const chatPartnerId = getChatPartnerId();
    const isPartnerOnline = chatPartnerId ? onlineUsers.includes(chatPartnerId) : false;

  return (
    <div className="flex min-h-screen w-full h-full">
      {/* Sidebar Messages */}
      <Messages
        conversations={conversations.map((chat) => ({
          id: chat.friendId,
          chatId: chat.chatId || undefined,
          fullName: chat.fullName || "Unnamed Chat",
          avatar: chat.avatar?.url || "",
          lastMessage: chat.lastMessage?.content || "",
          lastMessageTime: chat.lastMessage?.createdAt
            ? new Date(chat.lastMessage.createdAt).toLocaleTimeString()
            : "",
          unreadCount: 0,
          initials: chat.fullName
            ? chat.fullName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
            : "C",
          isGroup: chat.isGroup,
          isOnline: onlineUsers.includes(chat.friendId),
        }))}
        selectedId={selectedFriendId}
        onSelect={async (friendId, chatId) => {
          console.log("Messages onSelect called with:", { friendId, chatId });

          setSelectedFriendId(friendId);

          try {
            let chat;

            if (chatId) {
              console.log("Using existing chatId:", chatId);
              chat = { _id: chatId };
            } else {
              console.log("No chatId, calling getOrCreateChatWithUser for friendId:", friendId);
              chat = await getOrCreateChatWithUser(friendId);
              console.log("getOrCreateChatWithUser returned chat:", chat);
            }

            if (!chat || !chat._id) {
              console.error("Invalid chat returned:", chat);
              setSelectedChatId(null);
              return;
            }

            setSelectedChatId(chat._id);
          } catch (error) {
            console.error("Failed to get or create chat:", error);
            setSelectedChatId(null);
          }
        }}
        searchQuery=""
        onSearchChange={() => { }}
      />

      {/* ChatPage or placeholder */}
      <div className="flex-1 border-l dark:border-zinc-700">
        {selectedChatId ? (
          <ChatPage
            selectedId={selectedChatId}
            messages={messages}
            isPartnerOnline={isPartnerOnline}
            setMessages={setMessages}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-zinc-400">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWrapper;
