import { type FC } from "react";

interface Conversation {
  id: string;
  fullName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  initials: string;
  isGroup?: boolean;
  avatar?: string;
  chatId: string ;
  
}

interface MessagesProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (friendId: string, chatId: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

const Messages: FC<MessagesProps> = ({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="border-r p-4 overflow-y-auto bg-white/70 dark:bg-zinc-700/70 dark:border-gray-700 min-h-screen w-80">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Messages
      </h2>

      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
      />

      <ul>
        {conversations.map((c) => (
          <li
            key={c.id}
            onClick={() => onSelect(c.id, c.chatId)}
            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all ${selectedId === c.id
                ? "bg-yellow-100 dark:bg-yellow-800"
                : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
          >
            <div className="flex items-center gap-3">
              {c.avatar ? (
                <img
                  src={c.avatar}
                  alt={c.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500 text-white font-bold">
                  {c.initials}
                </div>
              )}

              <div className="w-40">
                <h4 className="font-medium text-gray-800 dark:text-white flex items-center">
                  {c.fullName}
                  {c.isGroup && <span className="ml-1 text-sm">👥</span>}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {c.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <p>{c.lastMessageTime || ""}</p>
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
