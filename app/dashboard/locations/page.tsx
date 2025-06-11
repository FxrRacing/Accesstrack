import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

import { GradientCard } from '@/components/ui/gradient-card'
import { Building } from 'lucide-react'




import AddLocation from './addLocation'

import LocationsMinimal from './test/locations'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Track - Locations",
  description: "View and manage locations in Access Track.",
}


export default async function LocationsPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
    const locations = await prisma.location.findMany({
        
      include: {
        _count: { select: { employees: true } },
        employees: true,
        doors: true,
        operatingHours: true,
        
     }
    })
    return <>
     <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Locations</h2>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <GradientCard
                title="Add Location"
                description="Add a new location to your organization."
                badge="New"
                gradientFrom="from-green-800"
                gradientTo="to-emerald-600"
                icon={<Building className="h-20 w-20" strokeWidth={1.5} />}
                >
                    <AddLocation />
                </GradientCard>
            </div>
           

            {/* <div className="grid grid-cols-5 gap-4 h-[calc(100vh-20rem)]">
              <div className="col-span-3 ">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
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
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${
                location.type === "Headquarters"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : location.type === "Regional"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-zinc-500/20 text-zinc-400"
              }`}
            >
              {location.type}
            </div>

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
              </div>
              <div className="col-span-2 h-full">
              <GlobalMap locations={locations} />
              </div>
            </div> */}



<LocationsMinimal locations={locations} />
        </div>
    </main>
    </>
}