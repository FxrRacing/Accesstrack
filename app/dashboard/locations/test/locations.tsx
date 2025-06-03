"use client"

import type React from "react"

import { useState } from "react"
import { Search, Users,   ChevronDown, ArrowUpRight, MapPin, Building2, Clock} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
//import { offices } from "./data/offices"

import OfficeDetailsAirbnb from "./office-details-airbnb"
import type { Door, Location, User, OperatingHour } from "@prisma/client"
//import Image from "next/image"


import {  GlobalMap } from "./office-map"

export type Office = Location & {
  _count: {
    employees: number
  }
  employees: User[]
  doors: Door[]
  operatingHours: OperatingHour[]
}


export default function LocationsMinimal( {locations}: {locations: Office[]}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [favoriteOffices, setFavoriteOffices] = useState<number[]>([])

  const filteredOffices = locations.filter((office) => {
    const matchesSearch =
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.country.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    return matchesSearch && office.type.toLowerCase() === activeFilter.toLowerCase()
  })

  const toggleFavorite = (officeId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavoriteOffices((prev) => (prev.includes(officeId) ? prev.filter((id) => id !== officeId) : [...prev, officeId]))
  }

  return (
    <div className="min-h-screen ">
      {selectedOffice ? (
        <OfficeDetailsAirbnb
          office={selectedOffice}
          onBack={() => setSelectedOffice(null)}
          isFavorite={favoriteOffices.includes(Number(selectedOffice.id))}
          onToggleFavorite={(e) => toggleFavorite(Number(selectedOffice.id), e)}
        />
      ) : (
        <div className="flex flex-col">
          <header className="sticky top-0 z-50 border-b border-secondary bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              

              

              {/* <div className="flex items-center gap-4">
                <Button variant="ghost" className="hidden md:flex gap-2 text-sm font-medium">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                
              </div> */}
            </div>

            <div className="flex md:hidden px-4 py-3 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search locations..."
                  className="pl-9 border-gray-200 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full border-gray-200">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className=" px-4 py-3 overflow-x-auto scrollbar-hide">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
                <TabsList className="bg-background p-0 h-auto flex gap-6 w-max">
                  <TabsTrigger
                    value="all"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border data-[state=active]:rounded-full  data-[state=active]:border-black rounded-none"
                  >
                    All Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="headquarters"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border data-[state=active]:rounded-full  data-[state=active]:border-black rounded-none"
                  >
                    Headquarters
                  </TabsTrigger>
                  <TabsTrigger
                    value="warehouse"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border data-[state=active]:rounded-full  data-[state=active]:border-black rounded-none"
                  >
                    Warehouse
                  </TabsTrigger>
                  <TabsTrigger
                    value="regional"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border data-[state=active]:rounded-full  data-[state=active]:border-black rounded-none"
                  >
                    Regional Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="satellite"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border data-[state=active]:rounded-full  data-[state=active]:border-black rounded-none"
                  >
                    Satellite Offices
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px]">
            <main className="p-4 md:p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {filteredOffices.map((location) => (
                   <Link href={`/dashboard/locations/${location.id}`} prefetch={true} key={location.id}>
                   <div
                     
                     className="group relative overflow-hidden rounded-xl bg-zinc-800 border-2 border-zinc-700 transition-all hover:border-emerald-400/50 hover:border-2"
                   >
                     <div className="absolute top-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                       <Button
                         variant="outline"
                         size="icon"
                         className="h-8 w-8 rounded-full bg-zinc-800/90 border-zinc-600 text-zinc-100 hover:bg-emerald-500 hover:text-zinc-900"
                         
                       >
                         <ArrowUpRight className="h-4 w-4" />
                         <span className="sr-only">View details</span>
                       </Button>
                     </div>
           
                     <div className="p-6">
                       <Badge
                         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${
                           location.type === "Headquarters"
                             ? "bg-emerald-500/20 text-emerald-400"
                             : location.type === "Regional"
                               ? "bg-amber-500/20 text-amber-400"
                               : "bg-zinc-500/20 text-zinc-400"
                         }`}
                       >
                         {location.type}
                       </Badge>
           
                       <h3 className="text-lg font-semibold text-zinc-100 mb-1">{location.name}</h3>
                       <div className="flex items-center text-zinc-400 mb-4">
                         <MapPin className="h-3.5 w-3.5 mr-1" />
                         <p className="text-sm">
                           {location.city}, {location.country}
                         </p>
                       </div>
           
                       <div className="space-y-3 text-sm">
                         <div className="flex items-center text-zinc-300">
                           <Building2 className="h-4 w-4 text-zinc-500 mr-2" />
                           <span>{location.address}</span>
                         </div>
                         <div className="flex items-center text-zinc-300">
                           <Users className="h-4 w-4 text-zinc-500 mr-2" />
                           <span>{location._count.employees} employees</span>
                         </div>
                         <div className="flex items-center text-zinc-300">
                           <Clock className="h-4 w-4 text-zinc-500 mr-2" />
                           <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
                         </div>
                       </div>
           
                       <div className="mt-6 pt-4 border-t border-zinc-700">
                         <div className="flex items-center justify-between">
                           <div className="text-sm text-zinc-400">{location.doors.length} access points</div>
                           <Button
                             variant="ghost"
                             size="sm"
                             className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                             
                           >
                             View Details
                           </Button>
                         </div>
                       </div>
                     </div>
                   </div>
                   </Link>
                ))}
              </div>
            </main>

            <aside className="hidden lg:block h-[calc(100vh-9rem)] sticky top-[9rem] rounded-lg">
               
                <GlobalMap locations={filteredOffices} />
                {/* <MapWithMarkers
                locations={filteredOffices}
                onSelectLocation={setSelectedOffice}
                favoriteLocations={favoriteOffices}
              /> */}
              {/* <OfficeMapAirbnb
                offices={filteredOffices}
                onSelectOffice={setSelectedOffice}
                favoriteOffices={favoriteOffices}
              /> */}
            </aside>
          </div>

          <div className="lg:hidden p-4 md:p-6 border-t">


                <GlobalMap locations={filteredOffices} /> 
            {/* <OfficeMapAirbnb
              offices={filteredOffices}
              onSelectOffice={setSelectedOffice}
              favoriteOffices={favoriteOffices}
              height={300}
            /> */}
          </div>
        </div>
      )}
    </div>
  )
}
