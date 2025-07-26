import { useEffect, useState } from "react";
import { UserRoundPlus, MessageCircle } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import type { User } from "@/types/User";
import { sendFriendRequest } from "@/services/userService";
import { useNavigate } from "react-router-dom";

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
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const navigate = useNavigate();

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

  const handleSendRequest = async (targetId: string) => {
    if (loadingIds.includes(targetId) || requestedIds.includes(targetId)) return;
    setLoadingIds((prev) => [...prev, targetId]);
    try {
      const res = await sendFriendRequest(targetId);
      enqueueSnackbar(res.message || "Request sent", { variant: "success" });
      setRequestedIds((prev) => [...prev, targetId]);
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar("Failed to send friend request", { variant: "error" });
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== targetId));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry =
      countriesFilter.length === 0 ||
      (user.location?.country !== undefined &&
        countriesFilter.includes(user.location.country));

    return matchesSearch && matchesCountry;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return 0;
  });

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {sortedUsers.map((user) => {
        const liked = likedIds.includes(user.id);
        const isCurrentUser = user.id === currentUserId;
        const isRequested = requestedIds.includes(user.id);
        const isLoading = loadingIds.includes(user.id);

        const isFriend = Array.isArray(user.friends)
          ? user.friends.some((friend) => {
            if (typeof friend === "string") return friend === currentUserId;
            // Tell TS friend is an object with possible _id or id
            const f = friend as { _id?: string; id?: string };
            return f._id === currentUserId || f.id === currentUserId;
          })
          : false;


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
                {/* Like button */}
                <button
                  className={`text-sm flex items-center gap-1 px-4 py-1.5 rounded-md transition ${liked
                    ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
                    : "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800"
                    }`}
                  onClick={() => handleLike(user.id)}
                >
                  <UserRoundPlus size={13} />
                  {liked ? "Liked" : "Like"}
                </button>

                {/* Friendship button */}
                {isFriend ? (
                  <span className="text-sm flex items-center gap-1 px-4 py-1.5 rounded-md bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 cursor-default">
                    <UserRoundPlus size={13} />
                    Connected
                  </span>
                ) : (
                  <button
                    className={`text-sm flex items-center gap-1 px-4 py-1.5 rounded-md transition ${isRequested
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 cursor-pointer"
                      }`}
                    onClick={() => handleSendRequest(user.id)}
                    disabled={isRequested || isLoading}
                  >
                    <UserRoundPlus size={13} />
                    {isLoading
                      ? "Sending..."
                      : isRequested
                        ? "Requested"
                        : "Connect"}
                  </button>
                )}

                {/* Message button */}
                <button
                  className="mt-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 px-3 py-1 rounded-md flex items-center gap-1"
                  onClick={() => navigate(`/chat/${user.id}`)}
                >
                  <MessageCircle size={14} />
                  Message
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
