"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, ExternalLink, Settings,  ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog,  DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {  CardContent,} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UnassignSoftwareButton from "../unassign-software-button"
import { SharedAccount, SharedAccountSoftware, Software } from "@prisma/client"
import { User } from "@supabase/supabase-js"



interface SoftwareWithSoftware extends SharedAccountSoftware {
  software: Software
}

interface SoftwareTableProps {
  alreadyAssignedSoftware: SoftwareWithSoftware[]
  availableSoftware: Software[]
  sharedAccount: SharedAccount
  data: {user: User}
 
  
}

// Helper function to get access level badge variant
const getAccessLevelVariant = (level: string) => {
  switch (level.toLowerCase()) {
    case "admin":
      return "destructive"
    case "editor":
      return "default"
    case "user":
      return "secondary"
    default:
      return "outline"
  }
}

// Helper function to get role badge variant
const getRoleVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "manager":
    case "project manager":
      return "default"
    case "developer":
      return "secondary"
    case "designer":
      return "outline"
    default:
      return "secondary"
  }
}

// Helper function to get software icon
const getSoftwareIcon = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase()
  return firstLetter
}

export function SoftwareTable({
  alreadyAssignedSoftware,
  availableSoftware,
  sharedAccount,
  data,
}: SoftwareTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Filter software based on search term
  const filteredSoftware = useMemo(() => {
    return alreadyAssignedSoftware.filter(
      (software) =>
        
        software.software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        software.accessLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        software.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [alreadyAssignedSoftware, searchTerm])

  // Calculate pagination
  const totalItems = filteredSoftware.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = filteredSoftware.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, pageSize])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <>
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by software name, access level, or role..."
              className="pl-10 h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Show:
            </Label>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-20 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentItems.length > 0 ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Software</TableHead>
                    <TableHead className="font-semibold text-gray-700">Access Level</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((software) => (
                    <TableRow key={software.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                      <TableCell className="py-4">
                      <Link
                              href={`/dashboard/software/${software.softwareId}`}
                              prefetch={true}
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1 group cursor-pointer"
                            >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={software.software.iconUrl || "" } />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {getSoftwareIcon(software.software.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                           
                              {software.software.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                           
                          </div>
                        </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getAccessLevelVariant(software.accessLevel)} className="font-medium">
                          {software.accessLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(software.role)} className="font-normal">
                          {software.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <UnassignSoftwareButton
                          id={software.id}
                          sharedAccountId={sharedAccount.id}
                          authId={data.user.id}
                          softwareId={software.softwareId}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <div key={index}>
                        {page === "..." ? (
                          <span className="px-2 py-1 text-gray-500">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className="h-9 w-9 p-0"
                          >
                            {page}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching software found" : "No software assigned"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all software."
                : "Get started by assigning software to this shared account."}
            </p>
            {!searchTerm && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign First Software
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        )}

        {availableSoftware.length === 0 && alreadyAssignedSoftware.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <Settings className="h-4 w-4" />
              <p className="text-sm font-medium">All available software has been assigned to this account.</p>
            </div>
          </div>
        )}
      </CardContent>
    </>
  )
}
