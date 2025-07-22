import { Phone, Video } from "lucide-react";
import { useState } from "react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const messages = [
    { from: "me", text: "salam canim", time: "10:34 AM" },
    { from: "me", text: "ncsn", time: "10:35 AM" },
    { from: "me", text: "gorusek?", time: "10:36 AM" },
    { from: "alex", text: "😊 That sounds awesome! 🎉", time: "10:37 AM" },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50/80 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Design Team</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last seen recently</p>
        </div>
        <div className="flex gap-4 text-black dark:text-white">
          <button><Phone /></button>
          <button><Video /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
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
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
