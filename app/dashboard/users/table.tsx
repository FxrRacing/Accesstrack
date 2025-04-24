"use client"

import { useState, useMemo } from "react"
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
    type FilterFn,

} from "@tanstack/react-table"
import { ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { columns } from "./columns"
import { User } from "@prisma/client"
import Link from "next/link"

interface UsersTableProps {
  data: (User & { reportsTo: User | null })[]
}
const fuzzyFilter: FilterFn<User & { reportsTo: User | null }> = (row, columnId, value, addMeta) => {
    // If no search value, return all rows
    if (!value || value === "") return true
   
    const searchValue = (value as string).toLowerCase()
   
    // Handle name column - highest priority
    if (columnId === "name") {
      const nameValue = row.getValue(columnId) as string
      if (nameValue?.toLowerCase().includes(searchValue)) {
        addMeta({ score: 1000 }) // Higher score for name matches
        return true
      }
    }

    // Handle standard string columns
    const itemValue = row.getValue(columnId)
    if (typeof itemValue === "string") {
      const stringValue = itemValue.toLowerCase()
      if (stringValue.includes(searchValue)) {
        addMeta({ score: 3 }) // Lower score for other field matches
        return true
      }
    }
   
    // Special handling for reportsTo relation
    if (columnId === "reportsTo.name" && row.original.reportsTo) {
      const nameValue = row.original.reportsTo.name.toLowerCase()
      if (nameValue.includes(searchValue)) {
        addMeta({ score: 1 }) // low score for reports to
        return true
      }
    }
   
    // For other columns, do a standard search
   
    return false
  }

export function UsersTable({ data }: UsersTableProps) {
   
    const [sorting, setSorting] = useState<SortingState>([
        {
          id: "name",
          desc: false,
        },
      ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  

  // Extract unique locations and types for filters
  const uniqueLocations = useMemo(
    () => Array.from(new Set(data.map((item) => item.location).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [data],
  )
  
  const uniqueTypes = useMemo(
    () => Array.from(new Set(data.map((item) => item.type).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [data],
  )
  
  const uniqueReportsTo = useMemo(
    () => Array.from(new Set(
      data
        .filter(item => item.reportsTo !== null)
        .map(item => item.reportsTo?.name)
        .filter(Boolean)
    )).sort((a, b) => a!.localeCompare(b!)),
    [data],
  )
  

  // Status options are fixed (active/inactive)
  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ]

  // Selected filter values
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedReportsTo, setSelectedReportsTo] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["ACTIVE"])

  // Apply filters to the table
  const applyFilters = () => {
    const filters = []

    if (selectedLocations.length > 0) {
      filters.push({
        id: "location",
        value: selectedLocations,
      })
    }

    if (selectedTypes.length > 0) {
      filters.push({
        id: "type",
        value: selectedTypes,
      })
    }

    if (selectedReportsTo.length > 0) {
      filters.push({
        id: "reportsTo",
        value: selectedReportsTo,
      })
    }

    if (selectedStatus.length > 0) {
      filters.push({
        id: "status",
        value: selectedStatus,
      })
    }

    setColumnFilters(filters)
  }


  // Effect to apply filters when selections change
  useMemo(() => {
    applyFilters()
  }, [selectedLocations, selectedTypes, selectedReportsTo, selectedStatus])

  // Helper function to get status label from value
  const getStatusLabel = (status: string) => {
    return status === "ACTIVE" ? "Active" : "Inactive"
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedLocations([])
    setSelectedTypes([])
    setSelectedReportsTo([])
    setSelectedStatus(["ACTIVE"])
  }

  // Remove a specific filter
  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case "location":
        setSelectedLocations(selectedLocations.filter((item) => item !== value))
        break
      case "type":
        setSelectedTypes(selectedTypes.filter((item) => item !== value))
        break
      case "reportsTo":
        setSelectedReportsTo(selectedReportsTo.filter((item) => item !== value))
        break
      case "status":
        setSelectedStatus(selectedStatus.filter((item) => item !== value))
        break
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
        fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
      },
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      
  
        pagination: {
          pageSize: 25,
        },
      },
      
  })


  

// Check if any filters are applied
const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedTypes.length > 0 ||
    selectedReportsTo.length > 0 ||
    selectedStatus.length > 0

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center py-4 gap-3">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Status
                {selectedStatus.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {selectedStatus.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {statusOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.label}
                  checked={selectedStatus.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatus([...selectedStatus, option.value])
                    } else {
                      setSelectedStatus(selectedStatus.filter((s) => s !== option.value))
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Locations
                {selectedLocations.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {selectedLocations.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <ScrollArea className="h-[300px]">
                {uniqueLocations.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={selectedLocations.includes(location || '')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLocations([...selectedLocations, location || ''])
                      } else {
                        setSelectedLocations(selectedLocations.filter((l) => l !== location))
                      }
                    }}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Types
                {selectedTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {selectedTypes.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <ScrollArea className="h-[300px] sm:h-auto">
                {uniqueTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedTypes.includes(type || '')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, type || ''])
                      } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== type))
                      }
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reports To Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Reports To
                {selectedReportsTo.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {selectedReportsTo.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <ScrollArea className="h-[300px]">
                {uniqueReportsTo.map((manager) => (
                  <DropdownMenuCheckboxItem
                    key={manager}
                    checked={selectedReportsTo.includes(manager || '')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedReportsTo([...selectedReportsTo, manager || ''   ])
                      } else {
                        setSelectedReportsTo(selectedReportsTo.filter((m) => m !== manager))
                      }
                    }}
                  >
                    {manager}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Active Filters:</h3>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStatus.map((status, index) => (
              <Badge key={`status-${status}-${index}`} variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span className="font-medium">Status:</span> {getStatusLabel(status)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("status", status)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}

            {selectedLocations.map((location, index) => (
              <Badge
                key={`location-${location}-${index}`}
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                <span className="font-medium">Location:</span> {location}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("location", location)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}

            {selectedTypes.map((type, index) => (
              <Badge key={`type-${type}-${index}`} variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span className="font-medium">Type:</span> {type}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("type", type)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}

            {selectedReportsTo.map((manager, index) => (
              <Badge
                key={`manager-${manager}-${index}`}
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                <span className="font-medium">Reports To:</span> {manager}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("reportsTo", manager)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
  <TableCell key={cell.id} >
    <Link href={`/dashboard/users/${cell.row.original.id}` }>
      {flexRender(
        cell.column.columnDef.cell,
        cell.getContext() // Directly use `getContext` without modifying `key`
      )}
    </Link>
  </TableCell>
))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getCoreRowModel().rows.length}  user(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

