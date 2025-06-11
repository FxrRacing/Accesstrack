'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserProfiles, Software } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { assignOwner } from "../actions/owner"; // adjust path as needed
import { useActionState } from "react";
import { ArrowLeftRight, Loader2, Plus } from "lucide-react";

const initialState = { message: "", success: false };

export function TeamOwnerDialog({
  software,
  potentialOwners,
  authId,
}: {
  software: Software & { teamOwner: UserProfiles | null };
  potentialOwners: UserProfiles[];
  authId: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(assignOwner,initialState);

  // Filter owners by search
  const filteredOwners = potentialOwners.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // Reset selectedUserId when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedUserId(null);
    }
  }, [open]);

  // Show toast on result
 
  useEffect(() => {
    if (state?.message) {
        if (state.success) {
            toast.success(state.message)
            
        } else {
            toast.error(state.message)
        }
        
    }
}, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {software.teamOwner ? (
          <Button variant="ghost" className="justify-start text-sm">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Change IT Ownership
          </Button>
        ) : (
          <Button variant="outline" className="rounded-full px-4 py-2 flex items-center gap-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Owner
            <span className="text-xs text-muted-foreground ml-2">No owner set</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a new owner</DialogTitle>
          <DialogDescription>Choose a team member to be the new owner of this software.</DialogDescription>
        </DialogHeader>
        <input
          type="text"
          placeholder="Search users..."
          className="mb-2 px-2 py-1 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <form
          action={formAction}
          className="flex flex-col gap-2 max-h-64 overflow-y-auto"
        >
          <input type="hidden" name="softwareId" value={software.id} />
          <input type="hidden" name="authId" value={authId} />
          <input type="hidden" name="userId" value={selectedUserId ?? ""} />
          {filteredOwners.length === 0 && (
            <div className="text-muted-foreground text-sm px-2">No users found.</div>
          )}
          {filteredOwners.map((user) => (
            <Button
              key={user.id}
              type="button"
              variant={selectedUserId === user.id ? "secondary" : "ghost"}
              className={`justify-start ${selectedUserId === user.id ? "ring-1 ring-accent" : "ring-0"}`}
              onClick={() => setSelectedUserId(user.id)}
              disabled={pending}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>
                  {user.fullName?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span>{user.fullName}</span>
              {selectedUserId === user.id && (
                <span className="ml-auto text-xs text-primary">Selected</span>
              )}
            </Button>
          ))}
          <Button
            type="submit"
            className="mt-4"
            disabled={!selectedUserId || pending}
          >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Assign Owner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}