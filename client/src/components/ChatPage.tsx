import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Phone, Video } from "lucide-react";
import socket from "../socket";
import { Grid } from "@giphy/react-components";
import { gf } from "@/giphy/config";
import instance from "@/services/instance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

interface Message {
  _id?: string;
  from: "me" | "other";
  text: string;
  time: string;
  isGif?: boolean;
  conversationId?: string;
}

const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [message, setMessage] = useState("");
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser?.id || "";

  const mapMessages = (apiMessages: any[]): Message[] =>
    apiMessages.map((msg) => {
      const senderId =
        typeof msg.sender === "object" && msg.sender?._id
          ? msg.sender._id
          : msg.sender;

      return {
        _id: msg._id || msg.id,
        from: String(senderId) === String(currentUserId) ? "me" : "other",
        text: msg.content || msg.text || "",
        time: msg.createdAt || msg.time || new Date().toISOString(),
        isGif: msg.type === "gif",
        conversationId: msg.chat || userId || "",
      };
    });

  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      try {
        const res = await instance.get(`/chats/${userId}/messages`);
        setMessages(mapMessages(res.data));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    if (userId) socket.emit("joinRoom", userId);
    return () => {
      if (userId) socket.emit("leaveRoom", userId);
    };
  }, [userId]);

  useEffect(() => {
    const handleReceiveMessage = (msg: Message) => {
      setMessages(prev => {
        // Avoid duplicate messages by _id
        if (prev.find(m => m._id === msg._id)) {
          return prev; // message already exists, do nothing
        }
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [userId]);


  const sendMessage = async (text: string, isGif = false) => {
    if (!text.trim() || !userId) return;

    const tempId = `temp-${Date.now()}`;

    const tempMessage: Message = {
      _id: tempId,
      from: "me",
      text,
      time: new Date().toISOString(),
      isGif,
      conversationId: userId,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessage("");
    setGifPickerOpen(false);
    setGifSearchTerm("");

    try {
      const savedMessageRes = await instance.post(`/chats/${userId}/messages`, {
        sender: currentUserId,
        content: text,
        type: isGif ? "gif" : "text",
        chat: userId,
        createdAt: new Date().toISOString(),
      });

      const savedMessage = mapMessages([savedMessageRes.data])[0];
      savedMessage.from = "me";

      // Replace temp message with the saved message
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? savedMessage : msg))
      );

      socket.emit("sendMessage", {
        chatId: userId,
        senderId: currentUserId,
        content: text,
        type: isGif ? "gif" : "text",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  const fetchGifs = (offset: number) =>
    gifSearchTerm.trim()
      ? gf.search(gifSearchTerm, { offset, limit: 20 })
      : gf.trending({ offset, limit: 20 });

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50/80 dark:bg-zinc-900/80 relative">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {userId ? `Chat with #${userId}` : "Select a conversation"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last seen recently</p>
        </div>
        <div className="flex gap-4 text-black dark:text-white">
          <button aria-label="Call">
            <Phone />
          </button>
          <button aria-label="Video call">
            <Video />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No messages yet.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg._id ?? `${msg.time}-${index}`}
            className={`max-w-xs p-2 rounded-lg text-sm ${msg.from === "me"
                ? "bg-green-500 text-white self-end"
                : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white self-start"
              }`}
          >
            {msg.isGif ? (
              <img
                src={msg.text}
                alt="gif"
                className="rounded max-w-[200px] max-h-[200px] object-contain"
              />
            ) : (
              <p>{msg.text}</p>
            )}

            <span className="block text-xs mt-1 text-right opacity-70">
              {(() => {
                const date = new Date(msg.time);
                return isNaN(date.getTime())
                  ? "Invalid time"
                  : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              })()}
            </span>
          </div>
        ))}


        <div ref={messagesEndRef} />
      </div>

      {/* Input + GIF Picker */}
      <div className="p-4 border-t bg-white dark:bg-zinc-800 flex flex-col relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage(message)}
            disabled={!userId}
          />
          <button
            onClick={() => sendMessage(message)}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!userId || message.trim() === ""}
          >
            Send
          </button>
          <button
            onClick={() => setGifPickerOpen((prev) => !prev)}
            className="bg-yellow-400 text-black px-4 py-2 rounded"
            disabled={!userId}
          >
            GIF
          </button>
        </div>

        {gifPickerOpen && (
          <div
            style={{
              width: 410,
              height: 360,
              position: "absolute",
              bottom: 70,
              right: 20,
              background: "white",
              zIndex: 1000,
              borderRadius: 8,
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="text"
              value={gifSearchTerm}
              onChange={(e) => setGifSearchTerm(e.target.value)}
              placeholder="Search GIFs"
              className="mb-2 p-2 border rounded"
              autoFocus
            />
            <Grid
              width={384}
              columns={3}
              fetchGifs={fetchGifs}
              noLink
              hideAttribution
              onGifClick={(gif, e) => {
                e.preventDefault();
                sendMessage(gif.images.fixed_height.url, true);
              }}
              key={gifSearchTerm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
