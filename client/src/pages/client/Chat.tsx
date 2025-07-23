import { useState } from "react";
import ChatPage from "@/components/ChatPage";
import Messages from "@/components/Messages";

const Chat = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
   const [messages, setMessages] = useState<[]>([
    // example messages for the selected conversation
  ]);
  return (
    <div className="flex min-h-screen w-full h-full">
      <Messages selectedId={selectedId} onSelect={setSelectedId} messages={messages} />
      <ChatPage selectedId={selectedId} />
    </div>
  );
};

export default Chat;
