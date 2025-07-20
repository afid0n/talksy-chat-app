import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    // TODO: Send API request to update password
    console.log("Password updated:", { currentPassword, newPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm space-y-6 w-full"
    >
      <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>

      {/* Current Password */}
      <div className="space-y-1 relative">
        <label className="text-sm text-gray-600 font-medium">Current Password</label>
        <input
          type={showCurrent ? "text" : "password"}
          placeholder="Enter your current password"
          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-[38px] text-gray-500"
          onClick={() => setShowCurrent(!showCurrent)}
        >
          {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* New Password */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">New Password</label>
        <input
          type="password"
          placeholder="Enter your new password"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm your new password"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        Update Password
      </button>
    </form>
  );
};

export default ChangePassword;
