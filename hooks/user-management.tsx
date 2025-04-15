"use client"

import { useState } from "react"
import { Search, UserPlus , MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
//   DropdownMenuGroup,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuPortal,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
// } from "@/components/ui/dropdown-menu"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"


// Access level types and their corresponding colors
const accessLevelConfig = {
  "View Only": { color: "bg-green-50", description: "Can view resources but cannot make changes" },
  Edit: { color: "bg-blue-50", description: "Can view and edit resources" },
  Delete: { color: "bg-amber-50", description: "Can view, edit, and delete resources" },
  Manage: { color: "bg-purple-50", description: "Full access to view, edit, delete, and manage resources" },
  "No Access": { color: "bg-gray-50", description: "No access to resources" },
}

// Available roles
const availableRoles = ["Admin", "Developer", "Viewer", "Billing"]

// Mock data for users and their access level
// const mockUsers = [
//   {
//     id: 1,
//     name: "Alex Johnson",
//     email: "alex.johnson@example.com",
//     role: "Admin",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastUpdated: "2023-04-10",
//     grantedBy: "System Admin",
//     accessLevel: "Manage",
//   },
//   {
//     id: 2,
//     name: "Sarah Williams",
//     email: "sarah.williams@example.com",
//     role: "Developer",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastUpdated: "2023-03-22",
//     grantedBy: "Alex Johnson",
//     accessLevel: "Edit",
//   },
//   {
//     id: 3,
//     name: "Michael Brown",
//     email: "michael.brown@example.com",
//     role: "Viewer",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastUpdated: "2023-02-15",
//     grantedBy: "Alex Johnson",
//     accessLevel: "View Only",
//   },
//   {
//     id: 4,
//     name: "Emily Davis",
//     email: "emily.davis@example.com",
//     role: "Developer",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastUpdated: "2023-04-11",
//     grantedBy: "Sarah Williams",
//     accessLevel: "Edit",
//   },
//   {
//     id: 5,
//     name: "David Wilson",
//     email: "david.wilson@example.com",
//     role: "Billing",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastUpdated: "2023-01-30",
//     grantedBy: "System Admin",
//     accessLevel: "View Only",
//   },
// ]

// Mock data for potential users to add
const potentialUsers = [
  {
    id: 101,
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 102,
    name: "Robert Chen",
    email: "robert.chen@example.com",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 103,
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    department: "Product",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 104,
    name: "James Miller",
    email: "james.miller@example.com",
    department: "Sales",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 105,
    name: "Patricia Garcia",
    email: "patricia.garcia@example.com",
    department: "Customer Support",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 106,
    name: "Thomas Wright",
    email: "thomas.wright@example.com",
    department: "Finance",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 107,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function UserList() {

  
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<number[]>([])
  const [addUserSearchQuery, setAddUserSearchQuery] = useState("")
  const [selectedRoleForNewUsers, setSelectedRoleForNewUsers] = useState("Viewer")
  const [selectedAccessLevelForNewUsers, setSelectedAccessLevelForNewUsers] = useState("View Only")
  // const usersPerPage = 4

  // // Format date to be more readable
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString)
  //   return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  // }

  // // Filter users based on search query, selected roles, and selected access levels
  // const filteredUsers = users.filter((user) => {
  //   // Text search filter
  //   const matchesSearch =
  //     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.accessLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.grantedBy.toLowerCase().includes(searchQuery.toLowerCase())

  //   // Role filter
  //   const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role)

  //   // Access level filter
  //   const matchesAccessLevel = selectedAccessLevels.length === 0 || selectedAccessLevels.includes(user.accessLevel)

  //   return matchesSearch && matchesRole && matchesAccessLevel
  // })

  // // Filter potential users for the add user dialog
  const filteredPotentialUsers = potentialUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(addUserSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(addUserSearchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(addUserSearchQuery.toLowerCase()),
  )

  // Calculate pagination
  // const indexOfLastUser = currentPage * usersPerPage
  // const indexOfFirstUser = indexOfLastUser - usersPerPage
  // const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  // const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // // Handle page change
  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber)
  // }

  // // View user details
  // const handleViewUser = (user) => {
  //   setSelectedUser(user)
  // }

  // // Toggle role selection
  // const toggleRole = (role) => {
  //   setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  //   setCurrentPage(1) // Reset to first page when filter changes
  // }

  // // Toggle access level selection
  // const toggleAccessLevel = (level) => {
  //   setSelectedAccessLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  //   setCurrentPage(1) // Reset to first page when filter changes
  // }

  // // Clear all filters
  // const clearFilters = () => {
  //   setSelectedRoles([])
  //   setSelectedAccessLevels([])
  //   setCurrentPage(1)
  // }

  // // Toggle user selection for adding
  const toggleUserSelection = (userId: number) => {
    setSelectedUsersToAdd((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  } 

  // Select all users in the filtered list
  const selectAllUsers = () => {
    if (selectedUsersToAdd.length === filteredPotentialUsers.length) {
      setSelectedUsersToAdd([])
    } else {
      setSelectedUsersToAdd(filteredPotentialUsers.map((user) => user.id))
    }
  }

  // Add selected users to the main user list
  const addSelectedUsers = () => {
    // const today = new Date().toISOString().split("T")[0]
    // const currentUser = "Alex Johnson" 

    // const newUsers = selectedUsersToAdd
    //   .map((userId) => {
    //     const user = potentialUsers.find((u) => u.id === userId)
    //     if (!user) return null
    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       role: selectedRoleForNewUsers,
    //       avatar: user.avatar,
    //       lastUpdated: today,
    //       grantedBy: currentUser,
    //       accessLevel: selectedAccessLevelForNewUsers,
    //     }
    //   })
    //   .filter((user): user is NonNullable<typeof user> => user !== null) // Filter out null values

    //setUsers((prev) => [...prev, ...newUsers])
    setSelectedUsersToAdd([])
    setAddUserDialogOpen(false)
    setAddUserSearchQuery("")
  }

  // Reset add user dialog state when closing
  const handleAddUserDialogOpenChange = (open:boolean) => {
    setAddUserDialogOpen(open)
    if (!open) {
      setSelectedUsersToAdd([])
      setAddUserSearchQuery("")
      setSelectedRoleForNewUsers("Viewer")
      setSelectedAccessLevelForNewUsers("View Only")
    }
  }

  // Check if any filters are active
  // const hasActiveFilters = selectedRoles.length > 0 || selectedAccessLevels.length > 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold">User Access Management</h1> */}
        <Dialog open={addUserDialogOpen} onOpenChange={handleAddUserDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Users</DialogTitle>
              <DialogDescription>
                Select users to add to the software and assign them a role and access level.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={addUserSearchQuery}
                    onChange={(e) => setAddUserSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    filteredPotentialUsers.length > 0 && selectedUsersToAdd.length === filteredPotentialUsers.length
                  }
                  onCheckedChange={selectAllUsers}
                />
                <Label htmlFor="select-all">Select All</Label>
                <span className="text-sm text-muted-foreground ml-auto">{selectedUsersToAdd.length} selected</span>
              </div>

              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {filteredPotentialUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-md">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsersToAdd.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.department}
                      </Badge>
                    </div>
                  ))}
                  {filteredPotentialUsers.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No users found</div>
                  )}
                </div>
              </ScrollArea>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedRoleForNewUsers}
                        <MoreHorizontal className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuRadioGroup
                        value={selectedRoleForNewUsers}
                        onValueChange={setSelectedRoleForNewUsers}
                      >
                        {availableRoles.map((role) => (
                          <DropdownMenuRadioItem key={role} value={role}>
                            {role}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedAccessLevelForNewUsers}
                        <MoreHorizontal className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuRadioGroup
                        value={selectedAccessLevelForNewUsers}
                        onValueChange={setSelectedAccessLevelForNewUsers}
                      >
                        {Object.keys(accessLevelConfig).map((level) => (
                          <DropdownMenuRadioItem key={level} value={level}>
                            {level}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSelectedUsers} disabled={selectedUsersToAdd.length === 0}>
                Add {selectedUsersToAdd.length} {selectedUsersToAdd.length === 1 ? "User" : "Users"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
{/* 
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={hasActiveFilters ? "bg-slate-100" : ""}>
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 px-1 rounded-full">
                    {selectedRoles.length + selectedAccessLevels.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Role</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {availableRoles.map((role) => (
                        <DropdownMenuCheckboxItem
                          key={role}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => toggleRole(role)}
                        >
                          {role}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Access Level</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {Object.keys(accessLevelConfig).map((level) => (
                        <DropdownMenuCheckboxItem
                          key={level}
                          checked={selectedAccessLevels.includes(level)}
                          onCheckedChange={() => toggleAccessLevel(level)}
                        >
                          {level}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters} disabled={!hasActiveFilters}>
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedRoles.map((role) => (
            <Badge key={role} variant="secondary" className="flex items-center gap-1">
              {role}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleRole(role)} />
            </Badge>
          ))}
          {selectedAccessLevels.map((level) => (
            <Badge key={level} variant="secondary" className="flex items-center gap-1">
              {level}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAccessLevel(level)} />
            </Badge>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead className="hidden md:table-cell">Granted By</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Developer" ? "secondary" : "outline"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={accessLevelConfig[user.accessLevel]?.color || "bg-gray-50"}>
                      {user.accessLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(user.lastUpdated)}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.grantedBy}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => handleViewUser(user)}>View details</DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>Change access level</DropdownMenuItem>
                          <DropdownMenuItem>Reset password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Revoke access</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        {selectedUser && (
                          <>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>Detailed information about {selectedUser.name}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    src={selectedUser.avatar || "/placeholder.svg"}
                                    alt={selectedUser.name}
                                  />
                                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                                  <p className="text-muted-foreground">{selectedUser.email}</p>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <h4 className="font-medium">Role</h4>
                                <Badge
                                  variant={
                                    selectedUser.role === "Admin"
                                      ? "default"
                                      : selectedUser.role === "Developer"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="w-fit"
                                >
                                  {selectedUser.role}
                                </Badge>
                              </div>
                              <div className="grid gap-2">
                                <h4 className="font-medium">Access Level</h4>
                                <div className="flex flex-col gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`${accessLevelConfig[selectedUser.accessLevel]?.color || "bg-gray-50"} w-fit`}
                                  >
                                    {selectedUser.accessLevel}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">
                                    {accessLevelConfig[selectedUser.accessLevel]?.description || "Custom access level"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <h4 className="font-medium">Access Information</h4>
                                <div className="grid grid-cols-2 gap-y-2">
                                  <span className="text-sm font-medium">Last Updated:</span>
                                  <span className="text-sm">{formatDate(selectedUser.lastUpdated)}</span>
                                  <span className="text-sm font-medium">Granted By:</span>
                                  <span className="text-sm">{selectedUser.grantedBy}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users match the current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )} */}
    </div>
  )
}
