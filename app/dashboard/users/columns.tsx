"use client"

import {
    CaretSortIcon,
    
  } from "@radix-ui/react-icons"
  import {
    ColumnDef,
   
  } from "@tanstack/react-table"
  
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@prisma/client"

type UserWithReportsTo = User & { reportsTo: User | null }



  export const columns: ColumnDef<UserWithReportsTo>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("status") ? "Active" : "Inactive"}</div>,
        filterFn: (row, id, filterValue) => {
          // If no filter value is selected, show all rows
          if (!filterValue.length) return true
    
          // Check if the row's status is in the selected filter values
          return filterValue.includes(row.getValue(id))
        },
        meta: {
          filterVariant: "select",
        },
      },
     
      
        {
            accessorKey: "name",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Name
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            enableGlobalFilter: true,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Email
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
            enableGlobalFilter: true,
          },
            {
                accessorKey: "jobTitle",
                header: "Job Title",
                cell: ({ row }) => <div>{row.getValue("jobTitle")}</div>,
                enableGlobalFilter: true,
            },
            {
              accessorKey: "reportsTo",
              header: "Reports To",
              cell: ({ row }) => {
                return row.original.reportsTo?.name || "None"
              },
              enableGlobalFilter: false,
          },
            {
              accessorKey: "type",
              header: "Type",
              filterFn: (row, columnId, filterValue: string[]) => {
                return filterValue.length ? filterValue.includes(row.getValue(columnId)) : true;
              },
              enableGlobalFilter: false,
            
            },
          {
            accessorKey: "location",
            header: "Location",
            filterFn: (row, columnId, filterValue: string[]) => {
              return filterValue.length ? filterValue.includes(row.getValue(columnId)) : true;
            },
            cell: ({ row }) => <div>{row.getValue("location")}</div>,
            enableGlobalFilter: false,
        },
       
       
  ]