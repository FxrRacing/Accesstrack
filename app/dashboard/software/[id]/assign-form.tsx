 'use client'

// import { useActionState } from "react";
 import { assignUserToSoftware } from "@/actions/software_actions";
 import { User } from "@prisma/client";



// const initialState = {
//   message: '',
// }

// export default function AssignForm({id, availableUsers,authId}: {id: string, availableUsers: User[],authId: string}) {
//     const [error, formAction, pending] = useActionState(assignUserToSoftware, initialState)
       
//     return (<>
//         <form action={formAction}>
//         <select name="userId">
//                 {availableUsers.map((user) => (
//                     <option key={user.id} value={user.id}>{user.name}</option>
//                 ))}
//             </select>
//             <input type="text" name="grantedById"  defaultValue={authId} hidden />
//             <input type="text" name="accessLevel" placeholder="Access Level*" />
//             <input type="text" name="role" placeholder="Role*" />
//             <input type="text" name="softwareId" value={id} readOnly hidden />
//             <button type="submit">{pending ? 'Assigning...' : 'Assign Software +'}</button>
//         </form>
//         {error && <p>{error.message}</p>}
//         </>
//     )
// }
import type React from "react"

import { useEffect, useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal } from "lucide-react"
import { toast } from "sonner";
import  ClientSidePermissionsProvider from "@/utils/client-permissions-wrapper";


  interface UserAssignment {
  userId: string
  role: string
  accessLevel: string
}

const initialState = {
  message: '',
  success: false,
}

const ROLE_OPTIONS = ["Viewer", "Editor", "Admin", "Owner", "Manager", "Contributor", "Custom..."]

const ACCESS_LEVEL_OPTIONS = ["View Only", "Read Write", "Full Access", "Limited Access", "Restricted", "Custom..."]

export default function AssignForm({
  id,
  availableUsers,
  authId,
  open,
  onOpenChange,
  trigger,
}: {
  id: string
  availableUsers: User[]
  authId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}) {
  const [state, formAction, pending] = useActionState(assignUserToSoftware, initialState)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userAssignments, setUserAssignments] = useState<Record<string, UserAssignment>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, { role: boolean; accessLevel: boolean }>>({})

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
       
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);


  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      const newSelectedUsers = filteredUsers.map((user) => user.id)
      setSelectedUsers(newSelectedUsers)

      // Initialize assignments for newly selected users
      const newAssignments = { ...userAssignments }
      newSelectedUsers.forEach((userId) => {
        if (!newAssignments[userId]) {
          newAssignments[userId] = {
            userId,
            role: "Viewer",
            accessLevel: "View Only",
          }
        }
      })
      setUserAssignments(newAssignments)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelected = prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]

      // Initialize assignment for newly selected user
      if (!prev.includes(userId)) {
        setUserAssignments((prevAssignments) => ({
          ...prevAssignments,
          [userId]: {
            userId,
            role: "Viewer",
            accessLevel: "View Only",
          },
        }))
      }

      return newSelected
    })
  }

  const handleRoleChange = (userId: string, value: string) => {
    if (value === "Custom...") {
      setCustomInputs((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], role: true },
      }))
      setUserAssignments((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], role: "" },
      }))
    } else {
      setCustomInputs((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], role: false },
      }))
      setUserAssignments((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], role: value },
      }))
    }
  }

  const handleAccessLevelChange = (userId: string, value: string) => {
    if (value === "Custom...") {
      setCustomInputs((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], accessLevel: true },
      }))
      setUserAssignments((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], accessLevel: "" },
      }))
    } else {
      setCustomInputs((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], accessLevel: false },
      }))
      setUserAssignments((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], accessLevel: value },
      }))
    }
  }

  const updateCustomValue = (userId: string, field: "role" | "accessLevel", value: string) => {
    setUserAssignments((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "marketing":
        return "bg-blue-100 text-blue-800"
      case "engineering":
        return "bg-green-100 text-green-800"
      case "product":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ClientSidePermissionsProvider requiredPermission="edit" replaceWith={null}>  
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      </ClientSidePermissionsProvider>
      <DialogContent className="p-0 sm:p-6 w-[95vw] sm:max-w-[700px] max-h-[90vh] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Users</DialogTitle>
          <DialogDescription>
            Select users to add to the software and assign them individual roles and access levels.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </Label>
            </div>
            <span className="text-sm text-gray-500">{selectedUsers.length} selected</span>
          </div>

          {/* User List */}
          <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.id)
              const assignment = userAssignments[user.id]
              const customInput = customInputs[user.id] || { role: false, accessLevel: false }

              return (
                <div key={user.id} className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox checked={isSelected} onCheckedChange={() => handleUserSelect(user.id)} />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-100 text-gray-600">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.jobTitle && (
                      <Badge variant="secondary" className={getRoleBadgeColor(user.jobTitle)}>
                        {user.jobTitle}
                      </Badge>
                    )}
                  </div>

                  {/* Individual Role and Access Level for selected users */}
                  {isSelected && (
                    <div className="ml-16 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Role</Label>
                        {customInput.role ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="Enter custom role..."
                              value={assignment?.role || ""}
                              onChange={(e) => updateCustomValue(user.id, "role", e.target.value)}
                              className="h-8"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => {
                                setCustomInputs((prev) => ({
                                  ...prev,
                                  [user.id]: { ...prev[user.id], role: false },
                                }))
                                setUserAssignments((prev) => ({
                                  ...prev,
                                  [user.id]: { ...prev[user.id], role: "Viewer" },
                                }))
                              }}
                            >
                              Back to options
                            </Button>
                          </div>
                        ) : (
                          <Select
                            value={assignment?.role || "Viewer"}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                              <MoreHorizontal className="h-4 w-4 ml-auto" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Access Level</Label>
                        {customInput.accessLevel ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="Enter custom access level..."
                              value={assignment?.accessLevel || ""}
                              onChange={(e) => updateCustomValue(user.id, "accessLevel", e.target.value)}
                              className="h-8"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => {
                                setCustomInputs((prev) => ({
                                  ...prev,
                                  [user.id]: { ...prev[user.id], accessLevel: false },
                                }))
                                setUserAssignments((prev) => ({
                                  ...prev,
                                  [user.id]: { ...prev[user.id], accessLevel: "View Only" },
                                }))
                              }}
                            >
                              Back to options
                            </Button>
                          </div>
                        ) : (
                          <Select
                            value={assignment?.accessLevel || "View Only"}
                            onValueChange={(value) => handleAccessLevelChange(user.id, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                              <MoreHorizontal className="h-4 w-4 ml-auto" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACCESS_LEVEL_OPTIONS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Error Message */}
         

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <form action={formAction}>
              {selectedUsers.map((userId) => {
                const assignment = userAssignments[userId]
                return (
                  <div key={userId}>
                    <input type="hidden" name="assignments" value={JSON.stringify(assignment)} />
                  </div>
                )
              })}
              <input type="hidden" name="grantedById" value={authId} />
              <input type="hidden" name="softwareId" value={id} />
              <Button
                type="submit"
                disabled={selectedUsers.length === 0 || pending}
                className="bg-gray-800 hover:bg-gray-900"
              >
                {pending ? "Adding..." : `Add ${selectedUsers.length} User${selectedUsers.length !== 1 ? "s" : ""}`}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}