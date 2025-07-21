import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Key, LogOut, MessageCircle, Moon, Settings, Shield, Sun, User, Users, X } from 'lucide-react';
import { useState } from "react";
import NotificationsPanel from "@/components/NotificationsPanel";
import PrivacySettings from "@/components/PrivacySettings";
import PersonalInformation from "@/components/PersonalInformation";
import ChangePassword from "@/components/ChangePassword";

const Profile = () => {
  const [language, setLanguage] = useState("en");
  const { setTheme } = useTheme();

  return (
    <div className="mx-56">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-green-600 text-white font-bold text-2xl flex items-center justify-center rounded-full">
            AJ
          </div>
          <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 p-1 rounded-full shadow">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alex Johnson</h2>
          <p className="text-gray-600 dark:text-gray-400">@alexj_2024</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md">
            Digital enthusiast, coffee lover, and ChatWave explorer! Always excited to connect with new people and share interesting conversations.
          </p>

          <div className="flex items-center gap-4 mt-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">📍 San Francisco, CA</span>
            <span className="flex items-center gap-1">📅 Joined January 2024</span>
          </div>
        </div>

        <div className="self-start md:self-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold">
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm flex justify-between h-15">
          {[
            { value: "overview", icon: <User size={16} />, label: "Overview" },
            { value: "settings", icon: <Settings size={16} />, label: "Settings" },
            { value: "privacy", icon: <Shield size={16} />, label: "Privacy" },
            { value: "account", icon: <Key size={16} />, label: "Account" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <MessageCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">154</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Messages</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Users className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Connections</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <Heart className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Favorites</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition rounded-lg p-4">
                <MessageCircle className="text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-white">New Chat</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition rounded-lg p-4">
                <Users className="text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-white">Find Friends</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 transition rounded-lg p-4">
                <Settings className="text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-white">Preferences</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 transition rounded-lg p-4">
                <Shield className="text-orange-600 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-white">Privacy</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent className="flex flex-col gap-5" value="settings">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Language & Region</h3>
            <div className="flex justify-between items-center gap-3">
              {[
                { code: "en", label: "English", region: "US" },
                { code: "az", label: "Azərbaycan", region: "AZ" },
                { code: "ru", label: "Русский", region: "RU" },
                { code: "tr", label: "Türkçe", region: "TR" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-center gap-2 border px-12 py-5 rounded-lg transition ${language === lang.code
                    ? "bg-green-50 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-500"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                >
                  <span className="text-xs font-medium">{lang.region}</span>
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Appearance</h3>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Sun className="text-gray-500 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <NotificationsPanel />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        <TabsContent className="flex flex-col justify-center gap-5" value="account">
          <PersonalInformation />
          <ChangePassword />

          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-400 rounded-xl p-6 mt-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
            <div className="flex items-center justify-between w-full">
              <button className="flex items-center justify-center w-full gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 border border-red-200 dark:border-red-500 font-medium py-2 px-4 rounded-md transition">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
            <div className="flex items-center justify-between w-full">
              <button className="flex items-center justify-center w-full gap-2 text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-800 border border-red-300 dark:border-red-500 font-semibold py-2 px-4 rounded-md transition">
                <X size={18} />
                Delete Account
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;