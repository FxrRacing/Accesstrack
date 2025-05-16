"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin, Users, Star,  Share, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { offices } from "./data/offices"
import OfficeMapAirbnb from "./office-map-airbnb"
import OfficeDetailsAirbnb from "./office-details-airbnb"
import type { Office } from "./types/office"
//import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function OfficeLocationsAirbnb() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [favoriteOffices, setFavoriteOffices] = useState<number[]>([])

  const filteredOffices = offices.filter((office) => {
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
          isFavorite={favoriteOffices.includes(selectedOffice.id)}
          onToggleFavorite={(e) => toggleFavorite(selectedOffice.id, e)}
        />
      ) : (
        <div className="flex flex-col">
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-rose-500" />
                <span className="text-xl font-bold">WorkSpaces</span>
              </div>

              <div className="hidden md:flex items-center rounded-full border border-gray-200 shadow-sm">
                <Button variant="ghost" className="rounded-l-full px-4 py-2 text-sm font-medium">
                  Location
                </Button>
                <div className="h-5 w-px bg-gray-200"></div>
                <Button variant="ghost" className="px-4 py-2 text-sm font-medium">
                  Office Type
                </Button>
                <div className="h-5 w-px bg-gray-200"></div>
                <Button variant="ghost" className="rounded-r-full pl-4 pr-2 py-2">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" className="hidden md:flex gap-2 text-sm font-medium">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                
              </div>
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

            <div className="border-t border-accent px-4 py-3 overflow-x-auto scrollbar-hide">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
                <TabsList className="bg-transparent p-0 h-auto flex gap-6 w-max">
                  <TabsTrigger
                    value="all"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
                  >
                    All Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="headquarters"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
                  >
                    Headquarters
                  </TabsTrigger>
                  <TabsTrigger
                    value="regional"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
                  >
                    Regional Offices
                  </TabsTrigger>
                  <TabsTrigger
                    value="satellite"
                    className="px-1 py-2 h-auto data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black rounded-none"
                  >
                    Satellite Offices
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px]">
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
                      
                        <p className="text-gray-500">
                          {office.city}, {office.country}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-black text-black" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div></CardDescription>
                    </CardHeader>
                    
                   <CardContent>
                   <div className="mt-1 flex items-center text-gray-500 text-sm">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{office.employees} employees</span>
                      <span className="mx-1">•</span>
                      <span>{office.doors.length} access points</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{office.type}</span> • {office.hours}
                    </p>
                   </CardContent>
                  </Card>
                ))}
              </div>
            </main>

            <aside className="hidden lg:block h-[calc(100vh-9rem)] sticky top-[9rem]">
              <OfficeMapAirbnb
                offices={filteredOffices}
                onSelectOffice={setSelectedOffice}
                favoriteOffices={favoriteOffices}
              />
            </aside>
          </div>

          <div className="lg:hidden p-4 md:p-6 border-t">

            <OfficeMapAirbnb
              offices={filteredOffices}
              onSelectOffice={setSelectedOffice}
              favoriteOffices={favoriteOffices}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  )
}
