import type { FC } from "react";

const conversations = [
  { id: 1, name: "Alex Chen", message: "Hey! How’s the project going?", time: "2 min", unread: 3, initials: "AC" },
  { id: 2, name: "Design Team", message: "Meeting at 3 PM tomorrow", time: "5 min", unread: 0, initials: "DT", group: true },
  { id: 3, name: "Maria Garcia", message: "Thanks for the help yesterday!", time: "1 hour", unread: 1, initials: "MG" },
  { id: 4, name: "Dev Squad", message: "New feature is ready for review", time: "3 hours", unread: 0, initials: "DS", group: true },
  { id: 5, name: "Yuki Tanaka", message: "Let’s catch up soon 😊", time: "1 day", unread: 0, initials: "YT" },
];

interface MessagesProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const Messages: FC<MessagesProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="border-r p-4 overflow-y-auto bg-white/70 dark:bg-zinc-700/70 dark:border-gray-700 min-h-screen w-80">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Messages</h2>

      <input
        type="text"
        placeholder="Search conversations..."
        className="w-full p-2 mb-4 border rounded dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
      />

      <ul>
        {conversations.map((c) => (
          <li
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all ${
              selectedId === c.id ? "bg-yellow-100 dark:bg-yellow-800" : "hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {c.initials}
              </div>

              <div className="w-40">
                <h4 className="font-medium text-gray-800 dark:text-white flex items-center">
                  {c.name}
                  {c.group && <span className="ml-1 text-sm">👥</span>}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{c.message}</p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <p>{c.time}</p>
              {c.unread > 0 && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                  {c.unread}
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
