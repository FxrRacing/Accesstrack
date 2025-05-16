"use client"

import type React from "react"

import { useState } from "react"
import { Search, Users,   ChevronDown} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
//import { offices } from "./data/offices"

import OfficeDetailsAirbnb from "./office-details-airbnb"
import type { Door, Location, User, OperatingHour } from "@prisma/client"
//import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
          <header className="sticky top-0 z-50 border-b ">
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
                <TabsList className="bg-transparent p-0 h-auto flex gap-6 w-max">
                  <TabsTrigger
                    value="all"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:rounded-full  data-[state=active]:border-b-black rounded-none"
                  >
                    All Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="headquarters"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:rounded-full  data-[state=active]:border-b-black rounded-none"
                  >
                    Headquarters
                  </TabsTrigger>
                  <TabsTrigger
                    value="warehouse"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:rounded-full  data-[state=active]:border-b-black rounded-none"
                  >
                    Warehouse
                  </TabsTrigger>
                  <TabsTrigger
                    value="regional"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:rounded-full  data-[state=active]:border-b-black rounded-none"
                  >
                    Regional Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="satellite"
                    className="px-2 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:rounded-full  data-[state=active]:border-b-black rounded-none"
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
                {filteredOffices.map((office) => (
                  <Card key={office.id} onClick={() => setSelectedOffice(office)} className="group cursor-pointer">
                    {/* <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
                      <Image
                        src={office.id === 1 ? "/office-exterior.jpeg" : "/office-workspace.jpeg"}
                        alt={office.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        width={1000}
                        height={1000}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90"
                        onClick={(e) => toggleFavorite(office.id, e)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favoriteOffices.includes(office.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"
                          }`}
                        />
                        <span className="sr-only">Favorite</span>
                      </Button>
                    </div> */}
                    <CardHeader>
                      <CardTitle>{office.name}</CardTitle>
                      <CardDescription><div className="flex justify-between">
                      <div>
                      
                        <p className="">
                           {office.address}, {office.state}, {office.city}, {office.country}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className="w-fit bg-emerald-700/30 text-emerald-400 hover:bg-emerald-700/30 hover:text-emerald-400 capitalize">{office.type}</Badge>
                      </div>
                    </div></CardDescription>
                    </CardHeader>
                    
                   <CardContent>
                   <div className="mt-1 flex items-center  text-sm">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{office._count.employees} employees</span>
                      <span className="mx-1">•</span>
                      <span>{office.doors.length} access point(s)</span>
                    </div>
                    <p className="mt-1 text-sm ">
                      <span className="font-medium capitalize">{office.type}</span> • {office.operatingHours.length > 0 ? office.operatingHours.map((hour) => `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`).join(" • ") : "Monday - Friday: 8:00 AM - 5:00 PM"}
                    </p>
                   </CardContent>
                  </Card>
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
map goes here

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
