"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SharedAccount, SharedAccountSoftware, User } from "@prisma/client"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import UnassignSoftwareButton from "../unassign-shared-accounts";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface SharedAccountSoftwareWithRelations extends SharedAccountSoftware {    
  sharedAccount: SharedAccount;
  createdBy: User;
}


export const columns = (authId: string): ColumnDef<SharedAccountSoftwareWithRelations>[] => [
  {
    id: "name",
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
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <UnassignSoftwareButton
          id={record.id}
          sharedAccountId={record.sharedAccount.id}
          softwareId={record.softwareId}
          authId={authId}
        />
      );
    },
  },
]
