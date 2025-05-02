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
import { Badge } from "@/components/ui/badge"


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
        cell: ({ row }) => 
        
        <div className="capitalize">
            
            
            {row.getValue("status")  == "ACTIVE"? <Badge className='rounded-full border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5'>
      <span className='size-1.5 rounded-full bg-green-600 dark:bg-green-400' aria-hidden='true' />
      Active
    </Badge> : <Badge className='rounded-full border-none bg-red-600/10 text-red-600 focus-visible:ring-red-600/20 focus-visible:outline-none dark:bg-red-400/10 dark:text-red-400 dark:focus-visible:ring-red-400/40 [a&]:hover:bg-red-600/5 dark:[a&]:hover:bg-red-400/5'>
      <span className='size-1.5 rounded-full bg-red-600 dark:bg-red-400' aria-hidden='true' />
      <p className="capitalize">Inactive</p>
    </Badge>}
            
            </div>,
        filterFn: (row, id, filterValue) => {
          // If no filter value is selected, show all rows
          if (!filterValue.length) return true
    
          // Get the row's status value and normalize it
          const rowStatus = String(row.getValue(id)).toUpperCase()
          
          // Check if any of the selected filter values (normalized) match the row's status
          return filterValue.some((value: string) => String(value).toUpperCase() === rowStatus)
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