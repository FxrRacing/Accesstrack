"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserSoftware, User, Software } from "@prisma/client"
import { Avatar, AvatarFallback,} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Helper function to highlight search terms
const getHighlightedText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? <span key={i} className="bg-yellow-200">{part}</span> : part
  );
};

// Format date helper
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const columns = (searchQuery: string = ""): ColumnDef<UserSoftware & {
  user: User;
  grantedBy: User;
  software: Software;
}>[] => [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            
            <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {searchQuery ? getHighlightedText(user.user.name, searchQuery) : user.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? getHighlightedText(user.user.email, searchQuery) : user.user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.original.user.department;
      return searchQuery ? getHighlightedText(department, searchQuery) : department;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant="outline">
          {searchQuery ? getHighlightedText(role, searchQuery) : role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "accessLevel",
    header: "Access Level",
    cell: ({ row }) => {
      const accessLevel = row.original.accessLevel;
      
      // You can customize the color based on access level
      const getAccessLevelColor = (level: string) => {
        switch(level.toLowerCase()) {
          case 'admin': return "bg-red-50 text-red-700 border-red-200";
          case 'edit': return "bg-blue-50 text-blue-700 border-blue-200";
          case 'view': return "bg-green-50 text-green-700 border-green-200";
          default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
      };
      
      return (
        <Badge variant="outline" className={getAccessLevelColor(accessLevel)}>
          {searchQuery ? getHighlightedText(accessLevel, searchQuery) : accessLevel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedAt",
    header: "Assigned Date",
    cell: ({ row }) => {
      return formatDate(row.original.assignedAt);
    },
  },
  {
    accessorKey: "grantedBy.name",
    header: "Granted By",
    cell: ({ row }) => {
      const grantedBy = row.original.grantedBy.email;
      return searchQuery ? getHighlightedText(grantedBy, searchQuery) : grantedBy;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
            <DropdownMenuItem>Revoke access</DropdownMenuItem>
            <DropdownMenuItem>Change role</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
