import { Phone, Video } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import socket from "../socket"; // adjust path if needed

interface Message {
  from: string;
  text: string;
  time: string;
}

interface ChatPageProps {
  selectedId: number | null;
}

const ChatPage: FC<ChatPageProps> = ({ selectedId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "alex", text: "😊 That sounds awesome! 🎉", time: "10:37 AM" },
  ]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      from: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Emit to server
    socket.emit("send-message", newMessage);

    // Optimistically update UI
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50/80 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {selectedId
              ? `Chat with conversation #${selectedId}`
              : "Select a conversation"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last seen recently</p>
        </div>
        <div className="flex gap-4 text-black dark:text-white">
          <button>
            <Phone />
          </button>
          <button>
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
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-2 rounded-lg text-sm ${
              msg.from === "me"
                ? "bg-green-500 text-white self-end"
                : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white self-start"
            }`}
          >
            <p>{msg.text}</p>
            <span className="block text-xs mt-1 text-right opacity-70">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!selectedId} 
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={!selectedId || message.trim() === ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
