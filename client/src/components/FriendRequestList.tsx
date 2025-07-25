import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import type { User } from "@/types/User";
import type { RootState } from "@/redux/store/store";
import { acceptFriendRequest } from "@/services/commonRequest";

interface FriendRequestListProps {
  requests: User[];
  onRefresh: () => void;
}

const FriendRequestList = ({ requests, onRefresh }: FriendRequestListProps) => {
  const token = useSelector((state: RootState) => state.user.token);
  if (!token) {
    return <p className="text-red-500">You need to log in to see friend requests.</p>;
  }

  const handleAccept = async (requesterId: string) => {
    try {
      const res = await acceptFriendRequest(requesterId, token);
      enqueueSnackbar(res.message, { variant: "success" });
      onRefresh();
    } catch (err: any) {
      enqueueSnackbar("Error accepting request", { variant: "error" });
    }
  };

  const handleCancel = async (requesterId: string) => {
    try {
      // TODO: implement cancelFriendRequest(requesterId, token)
      enqueueSnackbar("Request cancelled (not implemented)", { variant: "info" });
      onRefresh();
    } catch (err: any) {
      enqueueSnackbar("Error cancelling request", { variant: "error" });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3">Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No friend requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-4 border rounded-md dark:border-zinc-700"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{user.fullName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(user.id)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleCancel(user.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestList;
