"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SharedAccount, SharedAccountSoftware, User } from "@prisma/client"
import { DataTableColumnHeader } from "@/components/data-table-column-header"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface SharedAccountSoftwareWithRelations extends SharedAccountSoftware {    
  sharedAccount: SharedAccount;
  createdBy: User;
}


export const columns: ColumnDef<SharedAccountSoftwareWithRelations>[] = [
  {
    accessorKey: "sharedAccount.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
  },
  {
    accessorKey: "sharedAccount.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "accessLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Access Level" />
    ),
  },
  {
    accessorKey:"assignedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned At" />
    ),
  },
  {accessorKey:"createdBy.fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
  }
]
