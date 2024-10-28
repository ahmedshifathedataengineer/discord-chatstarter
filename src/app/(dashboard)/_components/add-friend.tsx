import React, { useState } from "react"; 
import {
    Dialog, 
    DialogContent,
    DialogDescription,
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AddFriend() {
    const [open, setOpen] = useState(false); 
    const [username, setUsername] = useState(""); 
    const createFriendRequest = useMutation(api.functions.friend.createFriendRequest);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createFriendRequest({ username });
            toast.success("Friend request sent");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to send friend request", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            });
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
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
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
