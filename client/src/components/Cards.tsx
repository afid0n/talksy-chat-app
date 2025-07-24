import {  useState } from "react";
import {
  MapPin,
  Users,
  MessageCircle,
  UserRoundPlus,
  Heart,
} from "lucide-react";
import type { User } from "@/types/User";

interface CardsProps {
  city?: string;
  searchQuery?: string;
  countriesFilter?: string[];
  users: User[]; // Add this
}

const Cards = ({ city, searchQuery, countriesFilter, users }: CardsProps) => {

  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter((user) => {
    const locationStr = user.location?.country?.toLowerCase() || "";

    const matchesCity = city
      ? locationStr.includes(city.toLowerCase())
      : true;

    const matchesSearch = searchQuery
      ? user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCountry =
      countriesFilter && countriesFilter.length > 0
        ? countriesFilter.some((country) =>
            locationStr.endsWith(country.toLowerCase())
          )
        : true;

    return matchesCity && matchesSearch && matchesCountry;
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => {
          const liked = likedIds.includes(user.id);
          const fullLocation = user.location?.country || "Unknown";

          return (
            <div
              key={user.id}
              className="relative group bg-white dark:bg-zinc-900 shadow-md dark:shadow-zinc-800 rounded-2xl p-4 flex flex-col justify-between transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-xl"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                <Heart
                  size={15}
                  className={`cursor-pointer transition ${
                    liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                  fill={liked ? "currentColor" : "none"}
                  onClick={() => toggleLike(user.id)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {user.fullName[0]}
                  </span>
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-zinc-900 rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {user.fullName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin size={14} /> {fullLocation}
                </p>
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Users size={14} /> {user.friends} mutuals
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {user.bio}
              </p>

              {user.interests && user.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.interests.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-xs text-gray-700 dark:text-gray-200 rounded-full"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button className="text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition px-4 py-1.5 rounded-md">
                  <UserRoundPlus size={13} /> Connect
                </button>
                <button className="text-sm flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition px-4 py-1.5 rounded-md">
                  <MessageCircle size={13} /> Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;
