import { Button } from "@/components/ui/button";
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
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { FormEvent } from "react";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export function NewDirectMessage() {
  const [username, setUsername] = useState("");
  const createDM = useMutation(api.functions.dm.create);
  const router = useRouter();
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault(); // Prevent page reload on submit
    console.log(`Starting a DM with ${username}`);
    // Add logic to initiate the DM here
    const id = await createDM({ username });
    router.push(`/dm/${id}`);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PlusIcon />
        <span className="sr-only">New Direct Message</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Direct Message</DialogTitle>
          <DialogDescription>
            Enter a username to start a new direct message.
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
            <Button type="submit">Start Direct Message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
