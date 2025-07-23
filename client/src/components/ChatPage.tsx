import { useEffect, useState, type FC } from "react";
import { Phone, Video } from "lucide-react";
import socket from "../socket"; // adjust path if needed
import { Gif, Grid } from '@giphy/react-components';
import { gf } from "@/giphy/config";

interface Message {
  from: string;
  text: string;
  time: string;
  isGif?: boolean;
}

interface ChatPageProps {
  selectedId: number | null;
}

const ChatPage: FC<ChatPageProps> = ({ selectedId }) => {
  const [message, setMessage] = useState("");
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "alex", text: "😊 That sounds awesome! 🎉", time: "10:37 AM" },
  ]);

  useEffect(() => {
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = (text: string, isGif = false) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isGif,
    };

    socket.emit("send-message", newMessage);

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setGifPickerOpen(false);
    setGifSearchTerm(""); // clear search when closed
  };

  // The fetchGifs function for Grid component handles offset + search term
  const fetchGifs = (offset: number) => {
    if (gifSearchTerm.trim() === "") {
      return gf.trending({ offset, limit: 20 });
    } else {
      return gf.search(gifSearchTerm, { offset, limit: 20 });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50/80 dark:bg-zinc-900/80 relative">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {selectedId ? `Chat with conversation #${selectedId}` : "Select a conversation"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last seen recently</p>
        </div>
        <div className="flex gap-4 text-black dark:text-white">
          <button><Phone /></button>
          <button><Video /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No messages yet.</p>
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
            {msg.isGif ? (
              <img
                src={msg.text}
                alt="gif"
                className="rounded"
                style={{ maxWidth: 200 }}
              />
            ) : (
              <p>{msg.text}</p>
            )}
            <span className="block text-xs mt-1 text-right opacity-70">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-zinc-800 flex flex-col">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage(message, false)}
            disabled={!selectedId}
          />
          <button
            onClick={() => sendMessage(message, false)}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={!selectedId || message.trim() === ""}
          >
            Send
          </button>
          <button
            onClick={() => setGifPickerOpen((prev) => !prev)}
            className="bg-yellow-400 text-black px-4 py-2 rounded"
            disabled={!selectedId}
            aria-label="Toggle GIF picker"
          >
            GIF
          </button>
        </div>

        {/* GIF Picker */}
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
              overflowX: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search input inside GIF picker */}
            <input
              type="text"
              value={gifSearchTerm}
              onChange={(e) => setGifSearchTerm(e.target.value)}
              placeholder="Search GIFs"
              className="mb-2 p-2 border rounded"
            />

            {/* Grid shows GIFs based on search or trending */}
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
              key={gifSearchTerm} // to reset grid when search term changes
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
