import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  Key,
  LogOut,
  MessageCircle,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,

  Users,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import NotificationsPanel from "@/components/NotificationsPanel"
import PrivacySettings from "@/components/PrivacySettings"
import PersonalInformation from "@/components/PersonalInformation"
import ChangePassword from "@/components/ChangePassword"

import moment from "moment"
import { useAppSelector } from "@/redux/store/hooks"
import type { UserState } from "@/types/User"
import axios from "axios"
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store/store"
import { acceptFriendRequest, cancelFriendRequest } from "@/services/userService"
import { t } from "i18next"
import i18n from "@/i18n/config"


const Profile = () => {
  const { setTheme } = useTheme();
  const [userr, setUserr] = useState<any>(null);
  const user = useAppSelector((state) => state.user) as UserState;
  const [language, setLanguage] = useState("en");
  const token = useSelector((state: RootState) => state.user.token);
  function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "";
    return moment(dateStr).locale("az").format("LL, HH:mm");
  }
  const changeLanguage = (langCode: string) => {
  setLanguage(langCode);
  i18n.changeLanguage(langCode);
};

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7070/users/${user.id}`
        );
        setUserr(res.data);
        console.log("User:", res.data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    fetchUser();
  }, []);

  console.log("userr:", userr);

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    localStorage.setItem("vite-ui-theme", theme)
    window.dispatchEvent(new Event("vite-ui-theme-change"))
  }



  const handleAccept = async (requesterId: string) => {
    try {
      const res = await acceptFriendRequest(requesterId);
      enqueueSnackbar(res.message || "Request accepted", { variant: "success" });

      // Remove accepted request locally
      setUserr((prev: any) =>
        prev
          ? {
              ...prev,
              friendRequests: prev.friendRequests.filter(
                (u: any) => u.id !== requesterId && u._id !== requesterId
              ),
            }
          : prev
      );
    } catch (error) {
      enqueueSnackbar("Error accepting request", { variant: "error" });
    }
  };

  const handleCancel = async (requesterId: string) => {
    try {
      const res = await cancelFriendRequest(requesterId);
      enqueueSnackbar(res.message || "Request cancelled", { variant: "info" });

      // Remove cancelled request locally
      setUserr((prev: any) =>
        prev
          ? {
              ...prev,
              friendRequests: prev.friendRequests.filter(
                (u: any) => u.id !== requesterId && u._id !== requesterId
              ),
            }
          : prev
      );
    } catch (error) {
      enqueueSnackbar("Error cancelling request", { variant: "error" });
    }
  };


  return (
    <div className="px-2 sm:px-4 md:px-8 lg:px-20 py-8 sm:py-12 md:py-14">
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-yellow-600 text-white font-bold text-2xl flex items-center justify-center rounded-full">
            {user?.fullName
              ? user.fullName
                .split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase()
              : ""}
          </div>
          <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-900 p-1 rounded-full shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a9 9 0 11-12.728 0A9 9 0 0117 11z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.fullName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md mx-auto md:mx-0">
            {user?.bio}
          </p>
          <div className="flex xs:flex-row items-center gap-2 xs:gap-4 mt-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">{user?.location?.country}</span>
            <span className="flex items-center gap-1">📅 {formatDate(user?.createdAt)}</span>
          </div>
        </div>

        <div className="self-start md:self-center w-full md:w-auto flex justify-center md:justify-end">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-semibold w-full md:w-auto">
            ✏️ Edit Profile {t("edit_profile")}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between h-auto gap-2 sm:gap-0">
          {[
            { value: "overview", icon: Star, label: t("overview") },
            { value: "settings", icon: Settings, label: t("settings") },
            { value: "privacy", icon: Shield, label: t("privacy") },
            { value: "account", icon: Key, label: t("account") },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <Icon size={16} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {/* Overview Cards */}
            {[
              {
                count: 154,
                label: t("total_messages"),
                icon: MessageCircle,
                color: "yellow",
              },
              {
                count: userr?.friends?.length || 0,
                label: t("connections"),
                icon: Users,
                color: "blue",
              },
              {
                count: 12,
                label: t("favorites"),
                icon: Heart,
                color: "purple",
              },
            ].map(({ count, label, icon: Icon, color }, idx) => (
              <div>
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 sm:p-6 flex items-center gap-4"
              >
                <div className={`bg-${color}-100 dark:bg-${color}-900 p-3 rounded-full`}>
                  <Icon className={`text-${color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
                </div>
              </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-sm mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {t("quick_actions")}
            </h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: MessageCircle, label: t("New_Chat"), color: "yellow" },
                { icon: Users, label: t("friend_requests"), color: "blue" },
                { icon: Settings, label: t("preferences"), color: "purple" },
                { icon: Shield, label: t("Privacy"), color: "orange" },
              ].map(({ icon: Icon, label, color }, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center bg-${color}-50 dark:bg-${color}-900 hover:bg-${color}-100 dark:hover:bg-${color}-800 transition rounded-lg p-3 sm:p-4`}
                >
                  <Icon className={`text-${color}-600 mb-2`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent className="flex flex-col gap-5" value="settings">
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {t("language_region")}
            </h3>
            <div className="flex justify-between items-center">
              {[
                { code: "en", label: "English", region: "US" },
                { code: "az", label: "Azərbaycan", region: "AZ" },
                { code: "ru", label: "Русский", region: "RU" },
                { code: "tr", label: "Türkçe", region: "TR" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center justify-center gap-2 border px-8 sm:px-12 py-3 sm:py-5 rounded-lg transition ${language === lang.code
                    ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-yellow-500"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                >
                  <span className="text-xs font-medium">{lang.region}</span>
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Appearance Theme Toggle */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {t("appearance")}
              Appearance
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg gap-3">
              <div className="flex items-center gap-3">
                <Sun className="text-gray-500 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {t("dark_mode")}
                    </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("switch_theme")}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">
                      {t("toggle_theme")}
                      </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                    {t("light_mode")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                    {t("dark_mode")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div>
            <NotificationsPanel />
          </div>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <div>
            <PrivacySettings />
          </div>
        </TabsContent>

        {/* Account */}
        <TabsContent className="flex flex-col justify-center gap-5" value="account">
          <div>
            <PersonalInformation userr={userr}/>
          </div>
          <div className="w-full">
            <ChangePassword />
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-400 rounded-xl p-4 sm:p-6 mt-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">{t("danger_zone")}</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <button className="flex items-center justify-center w-full gap-2 text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 border border-red-200 dark:border-red-400 font-medium py-2 px-4 rounded-md transition">
                <LogOut size={18} />
                {t("sign_out")}
              </button>
              <button className="flex items-center justify-center w-full gap-2 text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 border border-red-300 dark:border-red-400 font-semibold py-2 px-4 rounded-md transition">
                <X size={18} />
                {t("delete_account")}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

 <div className="max-w-2xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">
          {t("friend_requests")}
          </h2>
        {!userr?.friendRequests || userr.friendRequests.length === 0 ? (
          <p className="text-gray-500">
            {t("no_friend_requests")}
            </p>
        ) : (
          userr.friendRequests.map((req: any) => (
            <div
              key={req.id || req._id}
              className="flex items-center justify-between bg-white dark:bg-zinc-800 p-4 mb-3 rounded shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={req.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={req.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{req.fullName}</p>
                  <p className="text-sm text-gray-500">@{req.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.id || req._id)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {t("accept")}
                  
                </button>
                <button
                  onClick={() => handleCancel(req.id || req._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile
