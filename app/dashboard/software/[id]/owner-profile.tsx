import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Eye } from "lucide-react";

import { Software, UserProfiles,  } from "@prisma/client";

import {  PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PermissionsProvider from "@/utils/providers/permissions";
import { prisma } from "@/lib/prisma";

import { TeamOwnerDialog } from "./components/team-owner";
import RemoveOwner from "./components/remove-owner";



export type SoftwareWithTeamOwner = Software & {
    teamOwner: UserProfiles
}
export default async function OwnerProfile({software, authId}: {software: SoftwareWithTeamOwner, authId: string}) {
  const potentialOwners = await prisma.userProfiles.findMany({
    where: software.teamOwner
      ? { id: { not: software.teamOwner.id } }
      : undefined
  });



   if (!software.teamOwner) {
// 
return (
  <TeamOwnerDialog
      software={software}
      potentialOwners={potentialOwners}
      authId={authId}
    />
);
   }
   const userNameInitials = software.teamOwner.fullName?.split(" ").map((name) => name[0]).join("");
   
   return (
    <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="justify-start p-4 rounded-full hover:bg-muted select-none">
        <Avatar className="h-8 w-8 mr-2 bg-green-800">
          <AvatarFallback className="">{userNameInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">{software.teamOwner.fullName}</span>
          <span className="text-xs text-muted-foreground">Team Owner</span>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 p-0" align="start">
      <div className="grid gap-1 p-1">
       <PermissionsProvider requiredPermission="view">
        <Button variant="ghost" className="justify-start text-sm" >
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        </PermissionsProvider>
        <PermissionsProvider requiredPermission="edit" replaceWith={<p></p>}>
        <TeamOwnerDialog
      software={software}
      potentialOwners={potentialOwners}
      authId={authId}
    />
        
        
        </PermissionsProvider>
        <PermissionsProvider requiredPermission="delete" replaceWith={<p></p>}>
        <RemoveOwner software={software} authId={authId} />
        </PermissionsProvider>
      </div>
    </PopoverContent>   
  </Popover>
   )
    
}