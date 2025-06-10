import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Eye } from "lucide-react";
import { ArrowLeftRight } from "lucide-react";
import { Software, UserProfiles,  } from "@prisma/client";
import { UserMinus } from "lucide-react";
import {  PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PermissionsProvider from "@/utils/providers/permissions";


export type SoftwareWithTeamOwner = Software & {
    teamOwner: UserProfiles
}
export default function OwnerProfile({software, authId}: {software: SoftwareWithTeamOwner, authId: string}) {
   if (!software.teamOwner) {
    console.log(authId)
    return <p>No team owner</p>
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
        <Button variant="ghost" className="justify-start text-sm" >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Change IT Ownership
        </Button>
        </PermissionsProvider>
        <PermissionsProvider requiredPermission="delete" replaceWith={<p></p>}>
        <Button variant="ghost" className="justify-start text-sm text-destructive" >
          <UserMinus className="mr-2 h-4 w-4" />
          Remove IT Owner
        </Button>
        </PermissionsProvider>
      </div>
    </PopoverContent>   
  </Popover>
   )
    
}