import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

export function AddFriend() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const createFriendRequest = useMutation(
    api.functions.friend.createFriendRequest
  );

  // Ref for focusing the input when dialog opens
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting friend request:", username);

    try {
      await createFriendRequest({ username });
      toast.success("Friend request sent");
      setOpen(false);
      setUsername(""); // Reset username field after submission
    } catch (error) {
      console.error("Error sending friend request:", error);

      if (error instanceof Error) {
        // Provide specific error messages based on status code
        if (error.message.includes("404")) {
          toast.error("User not found", {
            description: "Please check the username and try again.",
          });
        } else {
          toast.error("Failed to send friend request", {
            description: error.message,
          });
        }
      } else {
        toast.error("Failed to send friend request", {
          description: "An unknown error occurred",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Friend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            You can add a friend by their username.
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              ref={inputRef} // Attach ref for auto-focus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username for adding a friend"
              placeholder="Enter friend's username"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Send Friend Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
