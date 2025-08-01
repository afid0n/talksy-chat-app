import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cake,
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
} from "lucide-react";
import { useEffect, useState } from "react";
import NotificationsPanel from "@/components/NotificationsPanel";
import PrivacySettings from "@/components/PrivacySettings";
import PersonalInformation from "@/components/PersonalInformation";
import ChangePassword from "@/components/ChangePassword";
import moment from "moment";
import { useAppSelector } from "@/redux/store/hooks";
import type { UserState } from "@/types/User";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { acceptFriendRequest, cancelFriendRequest, deleteAccount, logout } from "@/services/userService";
import { t } from "i18next";
import i18n from "@/i18n/config";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/redux/userSlice";
import instance from "@/services/instance";

const Profile = () => {
  const { setTheme } = useTheme();
  const [userr, setUserr] = useState<any>(null);
  const user = useAppSelector((state) => state.user) as UserState;

  // Initialize language from localStorage i18nextLng or default to 'en'
  const [language, setLanguage] = useState(() => localStorage.getItem("i18nextLng") || "en");
   const [messageCount, setMessageCount] = useState(0);

  // State for likedUsers count (Favorites)
  const [favoritesCount,] = useState(() => {
    try {
      const liked = JSON.parse(localStorage.getItem("likedUsers") || "[]");
      return Array.isArray(liked) ? liked.length : 0;
    } catch {
      return 0;
    }
  });

  function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "";
    return moment(dateStr).locale("az").format("LL");
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
    dispatch(logoutUser()); 
    enqueueSnackbar(t("sidebar.logout_success"), { variant: "success" });
    navigate("/auth/login");
  } catch (error) {
    enqueueSnackbar(t("sidebar.logout_failed"), { variant: "error" });
    console.error("Logout failed", error);
  }
};

const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
    return;
  }

  try {
    await deleteAccount();
    dispatch(logoutUser()); 
    navigate("/auth/register"); 
    enqueueSnackbar("Your account has been deleted.", { variant: "success" });
  } catch (error) {
    enqueueSnackbar("Failed to delete account. Try again.", { variant: "error" });
    console.error("Delete account error:", error);
  }
};

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get(`/users/${user.id}`);
        setUserr(res.data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    fetchUser();
  }, [user.id]);

useEffect(() => {
  const fetchMessages = async () => {
    try {
      if (!user.id) return;
      const res = await instance.get(`/messages`);
      const userMessages = res.data.filter((msg: any) => msg.sender === user.id);
      setMessageCount(userMessages.length);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  fetchMessages();
}, [user.id]);


  const handleThemeChange = (theme: "light" | "dark") => {
    setTheme(theme);
    localStorage.setItem("vite-ui-theme", theme);
    window.dispatchEvent(new Event("vite-ui-theme-change"));
  };

const handleAccept = async (requesterId: string) => {
  try {
    const res = await acceptFriendRequest(requesterId);
    enqueueSnackbar(res.message || "Request accepted", { variant: "success" });

    setUserr((prev: any) => {
      if (!prev) return prev;

      const acceptedUser = prev.friendRequests.find(
        (u: any) => u.id === requesterId || u._id === requesterId
      );

      return {
        ...prev,
        friendRequests: prev.friendRequests.filter(
          (u: any) => u.id !== requesterId && u._id !== requesterId
        ),
        friends: acceptedUser ? [...(prev.friends || []), acceptedUser] : prev.friends
      };
    });
  } catch (error) {
    enqueueSnackbar("Error accepting request", { variant: "error" });
  }
};


  const handleCancel = async (requesterId: string) => {
    try {
      const res = await cancelFriendRequest(requesterId);
      enqueueSnackbar(res.message || "Request cancelled", { variant: "info" });

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
          <div className="w-20 h-20 bg-yellow-600 font-bold flex items-center justify-center rounded-full">
            <img
              src={
                user.avatar?.url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.fullName}</h2>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md mx-auto md:mx-0">
            {user?.bio}
          </p>
          <div className="flex items-center gap-4 mt-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400">
            <span>{user?.location?.country}</span>
            <span className="flex items-center gap-1">
              <span><Cake size={17}/></span>
               {formatDate(user?.birthday)}</span>
          </div>
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
            {[
              {
                count: messageCount,
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
                count: favoritesCount,
                label: t("favorites"),
                icon: Heart,
                color: "purple",
              },
            ].map(({ count, label, icon: Icon, color }, idx) => (
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
            ))}
          </div>

          {/* Friend Requests */}
          <div className=" mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4">{t("friend_requests")}</h2>
            {!userr?.friendRequests || userr.friendRequests.length === 0 ? (
              <p className="text-gray-500">{t("no_friend_requests")}</p>
            ) : (
              userr.friendRequests.map((req: any) => (
                <div
                  key={req.id || req._id}
                  className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 mb-3 rounded-xl shadow"
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
        </TabsContent>

        {/* Settings */}
        <TabsContent className="flex flex-col gap-5" value="settings">
         <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-sm">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
    {t("language_region")}
  </h3>
  <div className="flex flex-wrap gap-4 justify-between items-center">
    {[
      { code: "en", label: "English", region: "US" },
      { code: "az", label: "Azərbaycan", region: "AZ" },
      { code: "ru", label: "Русский", region: "RU" },
      { code: "tr", label: "Türkçe", region: "TR" },
    ].map((lang) => (
      <button
        key={lang.code}
        onClick={() => changeLanguage(lang.code)}
        className={`
          flex items-center justify-center gap-2 border rounded-lg transition
          px-4 py-3
          sm:px-8 sm:py-5
          w-full
          sm:w-auto
          ${
            language === lang.code
              ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-yellow-500"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 border-transparent"
          }
        `}
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
                    <Sun className="h-[1.2rem] w-[1.2rem] transition dark:hidden" />
                    <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:inline-block" />
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
          <PrivacySettings />
        </TabsContent>

        {/* Account */}
        <TabsContent className="flex flex-col justify-center gap-5" value="account">
          <PersonalInformation userr={userr} />
          <ChangePassword />
          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-400 rounded-xl p-4 sm:p-6 mt-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">{t("danger_zone")}</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 border border-red-200 dark:border-red-400 font-medium py-2 px-4 rounded-md transition">
                <LogOut size={18} />
                {t("sign_out")}
              </button>
              <button onClick={handleDeleteAccount} className="flex items-center justify-center w-full gap-2 text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 border border-red-300 dark:border-red-400 font-semibold py-2 px-4 rounded-md transition">
                <X size={18} />
                {t("delete_account")}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
