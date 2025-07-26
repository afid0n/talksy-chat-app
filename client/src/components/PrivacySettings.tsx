import { t } from "i18next";
import { Eye, MessageSquare } from "lucide-react";
import { useState } from "react";

const PrivacySettings = () => {
    const [profileVisibility, setProfileVisibility] = useState("Public");
    const [messagePrivacy, setMessagePrivacy] = useState("Everyone");

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("privacy_settings")}</h3>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700 rounded-xl p-4 transition">
                <div className="flex items-start gap-3">
                    <Eye className="mt-1 text-gray-500 dark:text-gray-300" />
                    <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {t("profile_visibility")}

                            </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("profile_visibility_description")}
                            </p>
                    </div>
                </div>
                <select
                    className="border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                >
                    <option value="Public">{t("public")}</option>
                    <option value="Friends">{t("friends")}</option>
                    <option value="Only Me">{t("only_me")}</option>
                </select>
            </div>

            {/* Message Privacy */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700 rounded-xl p-4 transition">
                <div className="flex items-start gap-3">
                    <MessageSquare className="mt-1 text-gray-500 dark:text-gray-300" />
                    <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{t("message_privacy")}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("message_privacy_desc")}</p>
                    </div>
                </div>
                <select
                    className="border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={messagePrivacy}
                    onChange={(e) => setMessagePrivacy(e.target.value)}
                >
                    <option value="Everyone">{t("everyone")}</option>
                    <option value="Friends">{t("friends_only")}</option>
                    <option value="No One">{t("no_one")}</option>
                </select>
            </div>
        </div>
    );
};

export default PrivacySettings;
