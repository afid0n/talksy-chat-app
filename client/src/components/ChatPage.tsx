import { useEffect, useRef, useState } from "react";
import { Phone, SendHorizontal, Video } from "lucide-react";
import { Grid } from "@giphy/react-components";
import { gf } from "@/giphy/config";
import socket from "@/socket";
import instance from "@/services/instance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { Message } from "@/types/MessagesTypes";


const ChatPage = ({
  selectedId,
  messages,
  setMessages,
  isPartnerOnline,
   onBack,
}: {
  selectedId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isPartnerOnline: boolean;
  onBack: () => void;
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [text, setText] = useState("");
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = useSelector((state: RootState) => state.user.id) || "";

  // Join room on selectedId change
  useEffect(() => {
    if (!selectedId) return;
    socket.emit("joinRoom", selectedId);
    return () => {
      socket.emit("leaveRoom", selectedId);
    };
  }, [selectedId]);

  // Listen for new messages and avoid duplicates
  useEffect(() => {
    const handleReceiveMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [setMessages]);

  // Fetch messages when chat changes (with deduplication)
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      try {
        const res = await instance.get(`/messages/chat/${selectedId}`);

        // Deduplicate fetched messages by _id just in case
        const uniqueMessagesMap = new Map<string, Message>();
        res.data.forEach((msg: Message) => uniqueMessagesMap.set(msg._id, msg));

        setMessages(Array.from(uniqueMessagesMap.values()));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedId, setMessages]);

  // Scroll to bottom on message list update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Extract sender id helper function
  const getSenderId = (sender: string | { _id: string }) => {
    if (!sender) return "unknown";
    if (typeof sender === "object" && sender._id) return sender._id;
    if (typeof sender === "string") return sender;
    return "unknown";
  };

  // Send a text message
  const sendMessage = async () => {
    if (!text.trim() || !selectedId) return;

    const messageData = {
      chat: selectedId,
      sender: currentUserId,
      content: text.trim(),
      type: "text",
    };

    try {
      socket.emit("sendMessage", {
        chatId: selectedId,
        senderId: currentUserId,
        content: text.trim(),
        type: "text",
      });

      await instance.post("/messages", messageData);

      setText("");
      setGifPickerOpen(false);
      setGifSearchTerm("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Send a GIF message immediately when clicked (no text input)
  const sendGifMessage = async (gifUrl: string) => {
    if (!gifUrl || !selectedId) return;

    const messageData = {
      chat: selectedId,
      sender: currentUserId,
      content: gifUrl,
      type: "gif",
    };

    try {
      socket.emit("sendMessage", {
        chatId: selectedId,
        senderId: currentUserId,
        content: gifUrl,
        type: "gif",
      });

      await instance.post("/messages", messageData);

      setGifPickerOpen(false);
      setGifSearchTerm("");
    } catch (err) {
      console.error("Failed to send GIF message:", err);
    }
  };

  // Giphy fetch function
  const fetchGifs = (offset: number) =>
    gifSearchTerm.trim()
      ? gf.search(gifSearchTerm, { offset, limit: 20 })
      : gf.trending({ offset, limit: 20 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (!selectedId) return;

    socket.emit("typing", { chatId: selectedId, userId: currentUserId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedId, userId: currentUserId });
    }, 3000);
  };
  useEffect(() => {
    if (!selectedId) return;

    const handleTyping = ({ chatId, userId }: { chatId: string; userId: string }) => {
      if (chatId === selectedId && userId !== currentUserId) {
        setIsTyping(true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleStopTyping = ({ chatId, userId }: { chatId: string; userId: string }) => {
      if (chatId === selectedId && userId !== currentUserId) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedId, currentUserId]);


 return (
  <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-zinc-900">
    {/* Header */}
    <div className="p-4 py-6 border-b flex items-center justify-between bg-white dark:bg-zinc-800">
      <div className="flex items-center gap-4">
        {/* Back Button (mobile only) */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden text-yellow-600 dark:text-yellow-400 text-m font-medium"
          >
            ←
          </button>
        )}
        <div className="flex flex-col">
          <div className="font-semibold text-lg text-black dark:text-white flex items-center gap-2">
            Chat
            {isPartnerOnline ? (
              <span className="text-green-500 text-sm">● Online</span>
            ) : (
              <span className="text-gray-400 text-sm">● Offline</span>
            )}
          </div>
          {isTyping && (
            <div className="italic text-sm text-gray-600 dark:text-gray-400 ml-1">
              Typing...
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-black dark:text-white">
        <Phone className="cursor-pointer" />
        <Video className="cursor-pointer" />
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col gap-2">
      {messages.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No messages yet.
        </p>
      )}

      {messages.map((m) => {
        const senderId = getSenderId(m.sender);
        const isSentByCurrentUser = senderId === currentUserId;

        return (
          <div
            key={m._id}
            className={`p-2 rounded-lg break-words whitespace-pre-wrap max-w-[85%] sm:max-w-[75%]
            ${isSentByCurrentUser
                ? "ml-auto bg-amber-200 text-black dark:bg-yellow-800 dark:text-white"
                : "mr-auto bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
              }`}
          >
            {m.type === "gif" ? (
              <img
                src={m.content}
                alt="GIF"
                className="rounded max-w-[180px] sm:max-w-[220px] max-h-[200px] object-contain"
              />
            ) : (
              <span>{m.content}</span>
            )}
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>

  <div className="p-2 sm:p-4 border-t bg-white dark:bg-zinc-800 flex flex-col relative gap-2">
  <div className="flex flex-row gap-2 items-center">
    <input
      type="text"
      value={text}
      onChange={handleInputChange}
      placeholder="Type a message"
      className="flex-1 min-w-0 border rounded p-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      disabled={!selectedId}
    />
    <div className="flex gap-1">
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white flex items-center justify-center px-2 sm:px-3 py-2 rounded disabled:opacity-50 shrink-0"
        disabled={!text.trim() || !selectedId}
        aria-label="Send message"
      >
        <SendHorizontal size={16} />
      </button>
      <button
        onClick={() => setGifPickerOpen((prev) => !prev)}
        className="bg-yellow-400 text-black px-2 sm:px-3 py-2 rounded whitespace-nowrap shrink-0"
        aria-label="Toggle GIF picker"
        disabled={!selectedId}
      >
        GIF
      </button>
    </div>
  </div>

  {/* GIF Picker */}
  {gifPickerOpen && (
    <div
      className="absolute bottom-[70px] right-0 left-0 sm:right-2 sm:left-auto mx-2 sm:mx-0 z-50 rounded shadow-lg p-2 bg-white dark:bg-zinc-800 max-h-[350px] sm:w-[368px] overflow-y-auto"
      style={{ maxWidth: 'calc(100vw - 1rem)' }}
    >
      <input
        type="text"
        value={gifSearchTerm}
        onChange={(e) => setGifSearchTerm(e.target.value)}
        placeholder="Search GIFs"
        className="mb-2 p-2 border rounded w-full bg-white dark:bg-zinc-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        autoFocus
      />
      <Grid
        fetchGifs={fetchGifs}
        width={340}
        columns={3}
        gutter={6}
        key={gifSearchTerm}
        onGifClick={(gif, e) => {
          e.preventDefault();
          sendGifMessage(gif.images.fixed_height.url);
        }}
      />
    </div>
  )}
</div>

  </div>
);

};

export default ChatPage;
