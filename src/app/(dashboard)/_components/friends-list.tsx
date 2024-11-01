import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, MessageCircleIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function PendingFriendsList() {
  const friends = useQuery(api.functions.friend.listPending);
  // cspell:ignore updateStatus
  const updateStatus = useMutation(api.functions.friend.updateStatus);

  return (
    <div className="flex flex-col divide-y">
      <h2 className="text-xs font-medium text-muted-foreground p-2.5">
        Pending Friends
      </h2>
      {friends?.length === 0 ? (
        <FriendsListEmpty>
          You don't have any pending friend requests.
        </FriendsListEmpty>
      ) : (
        friends?.map((friend) => (
          <FriendItem
            key={friend._id}
            username={friend.user.username}
            image={friend.user.image}
          >
            <IconButton
              title="Accept"
              icon={<CheckIcon />}
              className="bg-green-100"
              onClick={() =>
                updateStatus({ id: friend._id, status: "accepted" })
              }
            />
            <IconButton
              title="Reject"
              icon={<XIcon />}
              className="bg-red-100"
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))
      )}
    </div>
  );
}

export function AcceptedFriendsList() {
  const friends = useQuery(api.functions.friend.listAccepted);
  // cspell:ignore updateStatus
  const updateStatus = useMutation(api.functions.friend.updateStatus);

  return (
    <div className="flex flex-col divide-y">
      <h2 className="text-xs font-medium text-muted-foreground p-2.5">
        Accepted Friends
      </h2>
      {friends?.length === 0 ? (
        <FriendsListEmpty>You don't have any friends yet.</FriendsListEmpty>
      ) : (
        friends?.map((friend) => (
          <FriendItem
            key={friend._id}
            username={friend.user.username}
            image={friend.user.image}
          >
            <IconButton
              title="Start DM"
              icon={<MessageCircleIcon />}
              onClick={() => {}}
              className={""}
            />
            <IconButton
              title="Remove Friend"
              icon={<XIcon />}
              className="bg-red-100"
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))
      )}
    </div>
  );
}

function FriendsListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function IconButton({
  title,
  className,
  icon,
  onClick,
}: {
  title: string;
  className: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full", className)}
          variant="outline"
          size="icon"
          onClick={onClick}
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="bg-black text-white p-1 rounded-md shadow-lg"
        side="top"
        align="center"
      >
        {title}
      </TooltipContent>
    </Tooltip>
  );
}

function FriendItem({
  username,
  image,
  children,
}: {
  username: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 gap-2.5">
      <div className="flex items-center gap-2.5">
        <Avatar className="w-9 h-9 border">
          <AvatarImage
            src={image || "/default-avatar.png"}
            alt={`${username}'s avatar`}
          />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{username}</p>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}
