import { Lock, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Change Password</h3>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Current Password */}
        <div className="space-y-1 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <Lock size={16} className="text-gray-500 dark:text-gray-400" /> Current Password
          </label>
          <input
            type={showCurrent ? "text" : "password"}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 dark:text-gray-400"
            onClick={() => setShowCurrent(!showCurrent)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="space-y-1 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <Key size={16} className="text-gray-500 dark:text-gray-400" /> New Password
          </label>
          <input
            type={showNew ? "text" : "password"}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 dark:text-gray-400"
            onClick={() => setShowNew(!showNew)}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1 relative">
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
            <Key size={16} className="text-gray-500 dark:text-gray-400" /> Confirm New Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 dark:text-gray-400"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Update Password
      </button>
    </div>
  );
};

export default ChangePassword;
