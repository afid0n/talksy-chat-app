import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationToggle = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition">
    <div className="flex items-start gap-3">
      <Bell className="mt-1 text-gray-500 dark:text-gray-300" />
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div
        className={`w-12 h-6 flex items-center rounded-full px-0.5 peer transition-colors duration-300 ${
          checked ? "bg-yellow-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full  shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  </div>
);

const NotificationsPanel = () => {
  const [messageNotif, setMessageNotif] = useState(true);
  const [connectionNotif, setConnectionNotif] = useState(true);
  const [appUpdatesNotif, setAppUpdatesNotif] = useState(false);

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>

      <NotificationToggle
        title="Message Notifications"
        description="Get notified when you receive new messages"
        checked={messageNotif}
        onChange={() => setMessageNotif(!messageNotif)}
      />
      <NotificationToggle
        title="Connection Requests"
        description="Get notified when someone wants to connect"
        checked={connectionNotif}
        onChange={() => setConnectionNotif(!connectionNotif)}
      />
      <NotificationToggle
        title="App Updates"
        description="Get notified about new features and updates"
        checked={appUpdatesNotif}
        onChange={() => setAppUpdatesNotif(!appUpdatesNotif)}
      />
    </div>
  );
};

export default NotificationsPanel;
