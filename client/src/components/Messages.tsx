import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Conversation {
  id: string | number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  initials: string;
  isGroup?: boolean;
}

interface MessagesProps {
  conversations: Conversation[];
}

const Messages: FC<MessagesProps> = ({ conversations }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id: selectedId } = useParams<{ id: string }>();

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border-r p-4 overflow-y-auto bg-white/70 dark:bg-zinc-700/70 dark:border-gray-700 min-h-screen w-80">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Messages
      </h2>

      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
      />

      <ul>
        {filteredConversations.map((c) => (
          <li
            key={c.id}
            onClick={() => navigate(`/chat/${c.id}`)}
            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all ${
              selectedId === String(c.id)
                ? "bg-yellow-100 dark:bg-yellow-800"
                : "hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {c.initials}
              </div>

              <div className="w-40">
                <h4 className="font-medium text-gray-800 dark:text-white flex items-center">
                  {c.name}
                  {c.isGroup && <span className="ml-1 text-sm">👥</span>}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {c.lastMessage}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <p>{c.lastMessageTime}</p>
              {c.unreadCount > 0 && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                  {c.unreadCount}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
