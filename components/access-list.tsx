"use client"

import { SetStateAction, useCallback, useState } from "react"
import { Search, UserPlus, Filter, MoreHorizontal, X, ArrowDown, ArrowUp } from "lucide-react"
import { debounce } from "lodash"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

// Define a type for valid access levels
type AccessLevel = "View Only" | "Edit" | "Delete" | "Manage" | "No Access";

// Add this after imports
interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  lastUpdated: string;
  grantedBy: string;
  accessLevel: string;
}
    
// Mock data for users and their access level
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    lastUpdated: "2023-04-10",
    grantedBy: "System Admin",
    accessLevel: "Manage",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastUpdated: "2023-03-22",
    grantedBy: "Alex Johnson",
    accessLevel: "Edit",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Viewer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastUpdated: "2023-02-15",
    grantedBy: "Alex Johnson",
    accessLevel: "View Only",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastUpdated: "2023-04-11",
    grantedBy: "Sarah Williams",
    accessLevel: "Edit",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    role: "Billing",
    avatar: "/placeholder.svg?height=40&width=40",
    lastUpdated: "2023-01-30",
    grantedBy: "System Admin",
    accessLevel: "View Only",
  },
]

export default function UserManagement() {
  // Basic state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [searchField, setSearchField] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedAccessLevels, setSelectedAccessLevels] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof MockUser>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([])
  const [addUserSearchQuery, setAddUserSearchQuery] = useState("")
  const [selectedRoleForNewUsers, setSelectedRoleForNewUsers] = useState("Viewer")
  const [selectedAccessLevelForNewUsers, setSelectedAccessLevelForNewUsers] = useState("View Only")
  const usersPerPage = 4

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchQuery(value)
      setCurrentPage(1) // Reset to first page when search changes
    }, 300),
    []
  )

  // Format date to be more readable
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Helper function to highlight matched text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return text
    const parts = text.split(new RegExp(`(${highlight.trim()})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={i} className="bg-yellow-100">{part}</span> : part
    )
  }

  // Toggle sort direction
  const toggleSort = (field: keyof MockUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter users based on search query, selected roles, and selected access levels
  const filteredUsers = mockUsers.filter((user) => {
    // Text search filter with field selection
    let matchesSearch = true

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      
      switch (searchField) {
        case "name":
          matchesSearch = user.name.toLowerCase().includes(query)
          break
        case "email":
          matchesSearch = user.email.toLowerCase().includes(query)
          break
        case "role":
          matchesSearch = user.role.toLowerCase().includes(query)
          break
        case "accessLevel":
          matchesSearch = user.accessLevel.toLowerCase().includes(query)
          break
        case "grantedBy":
          matchesSearch = user.grantedBy.toLowerCase().includes(query)
          break
        default: // "all"
          matchesSearch =
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            user.accessLevel.toLowerCase().includes(query) ||
            user.grantedBy.toLowerCase().includes(query)
      }
    }

    // Role filter
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role)

    // Access level filter
    const matchesAccessLevel = selectedAccessLevels.length === 0 || selectedAccessLevels.includes(user.accessLevel)

    return matchesSearch && matchesRole && matchesAccessLevel
  })

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0
    
    if (sortField === "lastUpdated") {
      // Special case for date comparison
      comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
    } else {
      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      } else {
        comparison = Number(aValue) - Number(bValue)
      }
    }
    
    return sortDirection === "asc" ? comparison : -comparison
  })

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)

  // Handle page change
  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber)
  }

  // View user details
  const handleViewUser = (user: MockUser) => {
    setSelectedUser(user)
  }

  // Toggle role selection
  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Toggle access level selection
  const toggleAccessLevel = (level: string) => {
    setSelectedAccessLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedRoles([])
    setSelectedAccessLevels([])
    setCurrentPage(1)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setDebouncedSearchQuery("")
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters = selectedRoles.length > 0 || selectedAccessLevels.length > 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Access Management</h1>
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

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 pr-8 w-full md:w-72"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                debouncedSearch(e.target.value)
              }}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1.5 h-6 w-6 p-0" 
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Select 
            value={searchField} 
            onValueChange={setSearchField}
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="accessLevel">Access Level</SelectItem>
              <SelectItem value="grantedBy">Granted By</SelectItem>
            </SelectContent>
          </Select>
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
              <TableHead 
                onClick={() => toggleSort("name")}
                className="cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  User
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => toggleSort("role")}
                className="cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  Role
                  {sortField === "role" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => toggleSort("accessLevel")}
                className="cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  Access Level
                  {sortField === "accessLevel" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => toggleSort("lastUpdated")}
                className="hidden md:table-cell cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  Last Updated
                  {sortField === "lastUpdated" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => toggleSort("grantedBy")}
                className="hidden md:table-cell cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  Granted By
                  {sortField === "grantedBy" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
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
                        <p className="font-medium">
                          {searchQuery ? getHighlightedText(user.name, searchQuery) : user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? getHighlightedText(user.email, searchQuery) : user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Developer" ? "secondary" : "outline"}
                    >
                      {searchQuery ? getHighlightedText(user.role, searchQuery) : user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={accessLevelConfig[user.accessLevel as AccessLevel]?.color || "bg-gray-50"}
                    >
                      {searchQuery ? getHighlightedText(user.accessLevel, searchQuery) : user.accessLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(user.lastUpdated)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {searchQuery ? getHighlightedText(user.grantedBy, searchQuery) : user.grantedBy}
                  </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewUser(user as MockUser)}>View details</DropdownMenuItem>
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
                                    className={`${accessLevelConfig[selectedUser.accessLevel as AccessLevel]?.color || "bg-gray-50"} w-fit`}
                                  >
                                    {selectedUser.accessLevel}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">
                                    {accessLevelConfig[selectedUser.accessLevel as AccessLevel]?.description || "Custom access level"}
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
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
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
        </div>
      )}
    </div>
  )
}
