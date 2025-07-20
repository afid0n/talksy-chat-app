import { Eye, MessageSquare } from "lucide-react";
import { useState } from "react";

const PrivacySettings = () => {
    const [profileVisibility, setProfileVisibility] = useState("Public");
    const [messagePrivacy, setMessagePrivacy] = useState("Everyone");

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Privacy Settings</h3>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition">
                <div className="flex items-start gap-3">
                    <Eye className="mt-1 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-800">Profile Visibility</p>
                        <p className="text-xs text-gray-500">Control who can see your profile</p>
                    </div>
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                >
                    <option value="Public">Public</option>
                    <option value="Friends">Friends</option>
                    <option value="Only Me">Only Me</option>
                </select>
            </div>

            {/* Message Privacy */}
            <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition">
                <div className="flex items-start gap-3">
                    <MessageSquare className="mt-1 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-800">Message Privacy</p>
                        <p className="text-xs text-gray-500">Control who can send you messages</p>
                    </div>
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={messagePrivacy}
                    onChange={(e) => setMessagePrivacy(e.target.value)}
                >
                    <option value="Everyone">Everyone</option>
                    <option value="Friends">Friends Only</option>
                    <option value="No One">No One</option>
                </select>
            </div>
        </div>
    );
};

export default PrivacySettings;
