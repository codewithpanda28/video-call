import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests = { incomingRequests: [], acceptedRequests: [] }, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!friendRequests.incomingRequests.length) {
    return <NoNotificationsFound />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Friend Requests</h2>
      <div className="grid gap-4">
        {friendRequests.incomingRequests.map((request) => (
          <div key={request._id} className="card bg-base-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar w-12">
                  <img
                    src={request.sender.profilePicture}
                    alt={request.sender.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{request.sender.fullName}</h3>
                  <p className="text-sm opacity-70">
                    Wants to be your language partner
                  </p>
                </div>
                <button
                  className="btn btn-primary ml-auto"
                  onClick={() => acceptRequestMutation(request._id)}
                  disabled={isPending}
                >
                  <UserCheckIcon className="size-4" />
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
