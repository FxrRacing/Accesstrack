"use client"

import type React from "react"

import { useActionState } from "react"
import { useEffect, useState, useRef } from "react"
import { assignRoles, type FormState,} from "@/actions/sharedAccount_actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Role, AccessLevel } from "@/lib/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { User } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialState: FormState = {
  message: "",
  success: false,
}

const roleOptions: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "contributor", label: "Contributor" },
  { value: "viewer", label: "Viewer" },
]

const accessLevelOptions: { value: AccessLevel; label: string; description: string }[] = [
  { value: "view-only", label: "View Only", description: "Can view resources but cannot make changes" },
  { value: "edit", label: "Edit", description: "Can view and edit resources" },
  { value: "full-access", label: "Full Access", description: "Can view, edit, and manage all resources" },
]

interface AddUsersDialogProps {
  users: User[]
  sharedAccountId: string
  authId: string
  isLoading?: boolean
  triggerButton?: React.ReactNode
  onSuccess?: (assignments: UserRoleAssignment[]) => void
}

export type UserRoleAssignment = {
  userId: string
  role: Role
  accessLevel: AccessLevel
}

export function AddUsersDialog({ users, sharedAccountId, authId, isLoading = false, triggerButton, onSuccess }: AddUsersDialogProps) {
  const [state, formAction, pending] = useActionState(assignRoles, initialState)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role>("viewer")
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<AccessLevel>("view-only")
  const [open, setOpen] = useState(false)

  // Use ref to store the previous success state to avoid infinite loops
  const prevSuccessRef = useRef<boolean>(false)

  // Reset form when state changes to success
  useEffect(() => {
    if (state?.success && !prevSuccessRef.current) {
      prevSuccessRef.current = true

      setOpen(false)
      setSelectedUserIds([])
      setSearchQuery("")
      setSelectedRole("viewer")
      setSelectedAccessLevel("view-only")

      // Call onSuccess callback if provided
      if (onSuccess && state.assignments) {
        onSuccess(state.assignments)
      }
    } else if (!state?.success) {
      prevSuccessRef.current = false
    }
  }, [state?.success, state?.assignments, onSuccess])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId])
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
    }
  }

  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedUserIds.includes(user.id))
  const isIndeterminate = selectedUserIds.length > 0 && !isAllSelected

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const selectedAccessLevelOption = accessLevelOptions.find((option) => option.value === selectedAccessLevel)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton || <Button>Add Users</Button>}</DialogTrigger>
      <DialogContent className="p-0 sm:p-6 w-[95vw] sm:max-w-[700px] max-h-[90vh] sm:max-h-[80vh]">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Add Users</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">Select users to add and assign them a role and access level.</p>
            </div>
          </div>
        </DialogHeader>

        <form action={formAction} className="flex flex-col h-full">
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
                disabled={isLoading || pending}
              />
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={isLoading || pending || filteredUsers.length === 0}
                  className={isIndeterminate ? "data-[state=checked]:bg-blue-600" : ""}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </label>
              </div>
              <span className="text-sm text-gray-500">{selectedUserIds.length} selected</span>
            </div>

            {/* Users List */}
            <ScrollArea className="h-[200px] border rounded-md p-2">
            <div className="border rounded-lg bg-white">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center p-4 hover:bg-gray-50">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                        disabled={pending}
                        className="mr-3"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {user.department}
                        </Badge>
                      </div>
                      {/* Hidden input to include selected user IDs in form submission */}
                      {sharedAccountId && <input type="hidden" name="sharedAccountId"  readOnly value={sharedAccountId} />}
                      {authId && <input type="hidden" name="authId" readOnly value={authId} />}
                      {selectedUserIds.includes(user.id) && <input type="hidden" name="userId" value={user.id} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            </ScrollArea>
            {/* Role and Access Level Selection */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Select
                  name="role"
                  value={selectedRole}
                  onValueChange={(value: Role) => setSelectedRole(value)}
                  disabled={pending}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Access Level</label>
                <Select
                  name="accessLevel"
                  value={selectedAccessLevel}
                  onValueChange={(value: AccessLevel) => setSelectedAccessLevel(value)}
                  disabled={pending}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevelOptions.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Access Level Description */}
            {selectedAccessLevelOption && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedAccessLevelOption.label}:</span>{" "}
                {selectedAccessLevelOption.description}
              </p>
            )}

            {/* Status Messages */}
            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"}>
                {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || selectedUserIds.length === 0}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Users...
                </>
              ) : (
                `Add ${selectedUserIds.length} User${selectedUserIds.length === 1 ? "" : "s"}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
