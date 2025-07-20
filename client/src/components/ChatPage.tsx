import { Phone, Video } from "lucide-react";
import { useState } from "react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const messages = [
    { from: "me", text: "salam", time: "10:34 AM" },
    { from: "me", text: "🌶️", time: "10:35 AM" },
    { from: "me", text: "Sounds perfect! What time works for you?", time: "10:36 AM" },
    { from: "alex", text: "😊 That sounds awesome! 🎉", time: "10:37 AM" },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="bg-white">
          <h2 className="text-lg font-semibold">Design Team</h2>
          <p className="text-sm text-gray-500">Last seen recently</p>
        </div>
        <div className="flex gap-4">
          <button><Phone/></button>
          <button><Video/></button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-2 rounded-lg ${
              msg.from === "me"
                ? "bg-green-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <p>{msg.text}</p>
            <span className="block text-xs mt-1 text-right">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Send</button>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
