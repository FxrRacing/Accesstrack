"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROLE_OPTIONS } from "@/utils/constants"

interface RoleSelectorProps {
  initialRole: string
  userId: string
}

// const permissionsByRole: Record<Role, (PermissionType | "*")[]> = {
//   super_admin: ["*"],

//   admin:       ["view", "create", "edit", "delete", "revoke", "grant"],
//   editor:      ["view", "create", "edit"],
//   viewer:      ["view"],

//   management:  ["view", "approve"],
//   sales:       ["view", "create"],
//   marketing:   ["view", "create"],
//   engineering: ["view", "edit"],
//   it:          ["view", "edit", "create"],
//   hr:          ["view"],
//   accounting:  ["view"],
//   support:     ["view", "edit"],

//   other:       [],   // no permissions by default
// };

export function RoleSelector({ initialRole, userId }: RoleSelectorProps) {
    console.log({initialRole, userId})
  const [userRole, setUserRole] = useState(initialRole)
  //initial state changes 
  useEffect(() => {
    setUserRole(initialRole)
  }, [initialRole])
  //console.log(userId)
  return (
    <>
      <Select value={userRole} onValueChange={setUserRole}>
        <SelectTrigger id="role" className="w-full sm:w-1/3">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
         {Object.values(ROLE_OPTIONS).map((role) => (
          <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
         ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {userRole === "editor" && "Can create and edit content but cannot manage users"}
        {userRole === "viewer" && "Can view content but cannot create or edit"}
        {userRole === "accountant" && "Can view financial data but cannot modify it"}
        {userRole === "sales" && "Can view sales data but cannot modify it"}
        {userRole === "marketing" && "Can view marketing data but cannot modify it"}
        {userRole === "it" && "Can create and edit IT data but cannot delete it"}
        {userRole === "hr" && "Can view HR data but cannot create or edit it"}
        {userRole === "accounting" && "Can view accounting data but cannot create or edit it"}
       
        {userRole === "other" && "No permissions"}
        {userRole === "super_admin" && "Full access to all system features and settings"}
      </p>
    </>
  )
}
