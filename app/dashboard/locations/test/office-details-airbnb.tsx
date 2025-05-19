"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  MapPin,
  
  Users,
  Clock,
  Building,
  Heart,
  
  DoorOpen,
  Shield,
  
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Office } from "./locations"
//import Image from "next/image"
import { MapWithMarker } from "./office-map"
interface OfficeDetailsAirbnbProps {
  office: Office
  onBack: () => void
  isFavorite: boolean
  onToggleFavorite: (e: React.MouseEvent) => void
}

export default function OfficeDetailsAirbnb({
  office,
  onBack,
  isFavorite,
  onToggleFavorite,
}: OfficeDetailsAirbnbProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky  bg-background top-0 z-50 flex h-16 items-center gap-4 border-b border-secondary  px-4 md:px-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Locations</h1>
        </div>
        <div className="flex items-center gap-2">
          
          <Button variant="ghost" size="sm" className="gap-2 rounded-full" onClick={onToggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
            <span className="hidden md:inline">Save</span>
          </Button>
        </div>
      </header>

      <div className="relative">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 md:p-6">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <Image src="/office-exterior.jpeg" alt={office.name} className="h-full w-full object-cover" width={1000} height={1000} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <Image src="/office-workspace.jpeg" alt="Workspace" className="h-full w-full object-cover" width={1000} height={1000} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <Image src="/office-meeting-room.jpeg" alt="Meeting Room" className="h-full w-full object-cover" width={1000} height={1000} />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/office-workspace.jpeg"
                alt="Workspace"
                className="h-full w-full object-cover transform scale-110"
                width={1000}
                height={1000}
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/office-meeting-room.jpeg"
                alt="Meeting Room"
                className="h-full w-full object-cover transform scale-125"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div> */}

        <div className="p-4 md:p-6">
          <div className="flex flex-col  bg-background md:flex-row md:items-center md:justify-between gap-4 border-b border-secondary pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{office.name}</h1>
                <Badge
                  variant="outline"
                  className={
                    office.type === "Headquarters"
                      ? "border-rose-500 text-rose-500"
                      : office.type === "Regional"
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-500 text-gray-500"
                  }
                >
                  {office.type}
                </Badge>
              </div>
              <p className="">
                {office.city}, {office.country}
              </p>
            </div>
            
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8 py-6">
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className=" p-0 h-auto flex gap-6 w-max border-b  mb-6 s">
                  <TabsTrigger
                    value="overview"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]: data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="doors"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Access Points
                  </TabsTrigger>
                  <TabsTrigger
                    value="amenities"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Amenities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                  <div className="space-y-4">
                   
                    <div className="flex items-center gap-4 text-sm ">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{office._count.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DoorOpen className="h-4 w-4" />
                        <span>{office.doors.length} access points</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{office.operatingHours.map((hour) => `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`).join(" • ")}</span>
                      </div>
                    </div>
                  </div>

                  

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="">{office.address}</p>
                          <p className="">
                            {office.city}, {office.country}
                          </p>
                        </div>
                      </div>
                      
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Office Hours</p>
                          <p className="">Office Hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="doors" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Access Points</h2>
                    <p className="">
                      This office has {office.doors.length} access points with varying security levels and access
                      permissions.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-secondary ">
                    <Table>
                      <TableHeader className="text-primary">
                        <TableRow className="hover:bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden md:table-cell">Access Level</TableHead>
                          <TableHead className="hidden md:table-cell">Floor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {office.doors.map((door) => (
                          <TableRow key={door.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{door.id}</TableCell>
                            <TableCell>{door.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  door.type === "Main Entry"
                                    ? "bg-rose-100 text-rose-800 hover:bg-rose-100"
                                    : door.type === "Emergency Exit"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : door.type === "Secure Door"
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {door.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{door.accessLevel}</TableCell>
                            <TableCell className="hidden md:table-cell">{door.floor}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  door.status === "Active"
                                    ? "border-green-500 text-green-600"
                                    : "border-amber-500 text-amber-600"
                                }
                              >
                                {door.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-secondary ">
                      <div className="flex items-center gap-2 mb-2">
                        <DoorOpen className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold">Door Types</h3>
                      </div>
                      <div className="space-y-2">
                        {Array.from(new Set(office.doors.map((door) => door.type))).map((type) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <Badge variant="outline">{office.doors.filter((door) => door.type === type).length}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-secondary ">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold">Access Levels</h3>
                      </div>
                      <div className="space-y-2">
                        {Array.from(new Set(office.doors.map((door) => door.accessLevel))).map((level) => (
                          <div key={level} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{level}</span>
                            <Badge variant="outline">
                              {office.doors.filter((door) => door.accessLevel === level).length}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-secondary ">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold">Departments</h3>
                      </div>
                      <div className="space-y-2">
                        {/* {Array.from(new Set(office.doors.map((door) => door.department))).map((dept) => (
                          <div key={dept} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{dept}</span>
                            <Badge variant="outline">
                              {office.doors.filter((door) => door.department === dept).length}
                            </Badge>
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">What this office offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* {office.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {amenity.includes("Coffee") ? (
                              <Coffee className="h-5 w-5 text-rose-500" />
                            ) : amenity.includes("WiFi") ? (
                              <Wifi className="h-5 w-5 text-rose-500" />
                            ) : (
                              <Building className="h-5 w-5 text-rose-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{amenity}</p>
                            <p className="text-sm text-gray-500">Available to all employees</p>
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <div className="sticky top-24 rounded-xl border border-secondary p-6 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Office Summary</h3>
                    
                  </div>
                  <p className="capitalize">
                    {office.type} in {office.city}
                  </p>
                </div>

                <div className="space-y-4 border-t border-b border-secondary py-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Employees</span>
                    <span>{office._count.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Access Points</span>
                    <span>{office.doors.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amenities</span>
                    <span>Amenities</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Hours</span>
                    <span>{office.operatingHours.map((hour) => `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`).join(" • ")}</span>
                  </div>
                </div>
                <div className="h-96">
                  <MapWithMarker lat={office.latitude!} lng={office.longitude!} />
                </div>
                {/* <div className="mt-4">
                
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">Contact Office Managers</Button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
