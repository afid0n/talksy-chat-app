import { useEffect, useState } from "react";
import { UserRoundPlus, MessageCircle } from "lucide-react";
import type { User } from "@/types/User";
import { useSelector } from "react-redux";
import { sendFriendRequest } from "@/services/commonRequest";
import { enqueueSnackbar } from "notistack";
import type { RootState } from "@/redux/store/store";

interface CardsProps {
  city?: string;
  searchQuery?: string;
  countriesFilter?: string[];
  users: User[];
  currentUserId: string;
}

const Cards = ({
  users,
  searchQuery = "",
  countriesFilter = [],
  currentUserId,
}: CardsProps) => {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedUsers") || "[]");
    setLikedIds(storedLikes);
  }, []);

  const handleLike = (id: string) => {
    const updatedLikes = likedIds.includes(id)
      ? likedIds.filter((likeId) => likeId !== id)
      : [...likedIds, id];
    setLikedIds(updatedLikes);
    localStorage.setItem("likedUsers", JSON.stringify(updatedLikes));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry =
      countriesFilter.length === 0 ||
      (user.location?.country !== undefined && countriesFilter.includes(user.location.country));

    return matchesSearch && matchesCountry;
  });


  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return 0;
  });
  const token = useSelector((state: RootState) => state.user.token);
const [requestedIds, setRequestedIds] = useState<string[]>([]);

const handleSendRequest = async (targetId: string) => {
  try {
    const res = await sendFriendRequest(targetId, token);
    enqueueSnackbar(res.message || "Request sent", { variant: "success" });
    setRequestedIds((prev) => [...prev, targetId]);
  } catch (err: any) {
    console.error(err);
    enqueueSnackbar("Failed to send friend request", { variant: "error" });
  }
};
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {sortedUsers.map((user) => {
        const liked = likedIds.includes(user.id);
        const isCurrentUser = user.id === currentUserId;

        return (
          <div
            key={user.id}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatar?.url ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{user.username}
                </p>
                {isCurrentUser && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-300 font-semibold">
                    That's you
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Country:</strong> {user.location?.country}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>City:</strong> {user.location?.city}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                {user.bio || "This user has no bio yet."}
              </p>
            </div>

            {!isCurrentUser && (
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition px-4 py-1.5 rounded-md"
                  onClick={() => handleLike(user.id)}
                >
                  <UserRoundPlus size={13}
                  onClick={() => handleSendRequest(user.id)}
                  />
                  {liked ? "Liked" : "Connect"}
                </button>
                <button 
                className="text-sm flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition px-4 py-1.5 rounded-md"
                >
                  
                  <MessageCircle size={13} /> Message
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Cards;