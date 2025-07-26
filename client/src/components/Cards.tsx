import { useEffect, useState } from "react";
import { UserRoundPlus, MessageCircle } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import type { User } from "@/types/User";
import { sendFriendRequest, removeFriend } from "@/services/userService"; 
import { useNavigate } from "react-router-dom";
import { getPrivateChat } from "@/services/chatService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button"; // adjust import if needed

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
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [localRequestedIds, setLocalRequestedIds] = useState<string[]>([]);
  const [localFriends, setLocalFriends] = useState<{ [userId: string]: boolean }>({});

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<string | null>(null);

  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);


  // Load likes and local requested friend requests from localStorage on mount
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedUsers") || "[]");
    setLikedIds(storedLikes);

    const storedRequests = JSON.parse(localStorage.getItem("localRequestedIds") || "[]");
    setLocalRequestedIds(storedRequests);

    // Build local friends map for quick lookup
    const friendsMap: { [userId: string]: boolean } = {};
    currentUser.friends?.forEach((fId) => {
      friendsMap[fId] = true;
    });
    setLocalFriends(friendsMap);
  }, [currentUser.friends]);

  const handleLike = (id: string) => {
    const updatedLikes = likedIds.includes(id)
      ? likedIds.filter((likeId) => likeId !== id)
      : [...likedIds, id];
    setLikedIds(updatedLikes);
    localStorage.setItem("likedUsers", JSON.stringify(updatedLikes));
  };

  const handleSendRequest = async (targetId: string) => {
    if (loadingIds.includes(targetId) || localRequestedIds.includes(targetId)) return;
    setLoadingIds((prev) => [...prev, targetId]);
    try {
      const res = await sendFriendRequest(targetId);
      enqueueSnackbar(res.message || "Request sent", { variant: "success" });

      setLocalRequestedIds((prev) => {
        const updated = [...prev, targetId];
        localStorage.setItem("localRequestedIds", JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar("Failed to send friend request", { variant: "error" });
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== targetId));
    }
  };

  const confirmRemoveFriend = (friendId: string) => {
    setFriendToRemove(friendId);
    setOpenDialog(true);
  };

  const handleUnconnect = async () => {
    if (!friendToRemove) return;
    setLoadingIds((prev) => [...prev, friendToRemove]);
    try {
      await removeFriend(friendToRemove);
      enqueueSnackbar("Friend removed successfully", { variant: "success" });

      setLocalFriends((prev) => {
        const copy = { ...prev };
        delete copy[friendToRemove];
        return copy;
      });

      setLocalRequestedIds((prev) => {
        const updated = prev.filter((id) => id !== friendToRemove);
        localStorage.setItem("localRequestedIds", JSON.stringify(updated));
        return updated;
      });

      setOpenDialog(false);
      setFriendToRemove(null);
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar("Failed to remove friend", { variant: "error" });
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== friendToRemove));
    }
  };

  const handleStartChat = async (targetUserId: string) => {
    try {
      const chat = await getPrivateChat(targetUserId);
      if (chat && chat.chatId) {
        navigate(`/chat/${chat.chatId}`);
      } else {
        enqueueSnackbar("Failed to open chat.", { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to open chat:", error);
      enqueueSnackbar("Something went wrong while starting the chat.", {
        variant: "error",
      });
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
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sortedUsers.map((user) => {
          const liked = likedIds.includes(user.id);
          const isCurrentUser = user.id === currentUserId;
          const isFriend = !!localFriends[user.id];
          const isRequested =
            user.friendRequests.includes(currentUserId) || localRequestedIds.includes(user.id);
          const hasReceivedRequest = currentUser.friendRequests?.includes(user.id);
          const isLoading = loadingIds.includes(user.id);

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
                  <strong>Country:</strong> {user.location?.country || "N/A"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>City:</strong> {user.location?.city || "N/A"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                  {user.bio || "This user has no bio yet."}
                </p>
              </div>

              {!isCurrentUser && (
                <div className="flex justify-between mt-4 items-center">
                  {/* Like button */}
                  <button
                    className={`text-sm flex items-center gap-1 px-4 py-1.5 rounded-md transition ${
                      liked
                        ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700"
                        : "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800"
                    }`}
                    onClick={() => handleLike(user.id)}
                  >
                    <UserRoundPlus size={13} />
                    {liked ? "Liked" : "Like"}
                  </button>

                  {/* Friend Request or Connected */}
                  {isFriend ? (
                    <button
                      onClick={() => confirmRemoveFriend(user.id)}
                      disabled={isLoading}
                      className="text-sm flex items-center gap-1 px-4 py-1.5 rounded-md bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700 cursor-pointer"
                      title="Click to unconnect"
                    >
                      <UserRoundPlus size={13} />
                      Connected
                    </button>
                  ) : isRequested ? (
                    <span className="text-sm flex items-center gap-1 px-4 py-1.5 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
                      <UserRoundPlus size={13} />
                      Requested
                    </span>
                  ) : hasReceivedRequest ? (
                    <span className="text-sm flex items-center gap-1 px-4 py-1.5 rounded-md bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 cursor-default">
                      <UserRoundPlus size={13} />
                      Request Received
                    </span>
                  ) : (
                    <button
                      className="text-sm flex items-center gap-1 px-4 py-1.5 rounded-md bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 cursor-pointer"
                      onClick={() => handleSendRequest(user.id)}
                      disabled={isLoading}
                    >
                      <UserRoundPlus size={13} />
                      Connect
                    </button>
                  )}

                  {/* Show Message button only if connected */}
                  {isFriend && (
                    <button
                      className="ml-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 px-3 py-1 rounded-md flex items-center gap-1"
                      onClick={() => handleStartChat(user.id)}
                    >
                      <MessageCircle size={14} />
                      Message
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shadcn UI dialog for remove friend */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unconnect</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this friend? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnconnect}
              disabled={!friendToRemove || loadingIds.includes(friendToRemove)}
            >
              Yes, Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cards;
