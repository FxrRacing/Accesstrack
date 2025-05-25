"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoleSelectorProps {
  initialRole: string
  userId: string
}

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
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {userRole === "admin" && "Full access to all system features and settings"}
        {userRole === "manager" && "Can manage users and content but cannot modify system settings"}
        {userRole === "editor" && "Can create and edit content but cannot manage users"}
        {userRole === "user" && "Basic access to use the application features"}
      </p>
    </>
  )
}
