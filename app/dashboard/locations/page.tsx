import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import {  Building, Building2, ChevronRight, Clock,  MapPin, Users } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GradientCard } from '@/components/ui/gradient-card'
import Link from 'next/link'


import AddLocation from './addLocation'

export default async function LocationsPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
    const locations = await prisma.location.findMany({
        
        include: {
           _count: { select: { employees: true } },
           employees: true
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
           
            <div className="grid gap-4 md:grid-cols-3 mb-8">
            {locations.map((location) => (
                <Link  key={location.id} href={`/dashboard/locations/${location.id}`}>
                  <Card  className="w-full max-w-md bg-zinc-900 text-white border-none">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-emerald-700/30 text-emerald-400 hover:bg-emerald-700/30 hover:text-emerald-400 capitalize">
                  {location.type}
                  </Badge>
                  <h2 className="text-2xl font-bold mt-4">{location.name}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300">{location.city}, {location.state}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300">{location._count.employees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300">Mon-Fri: 8:00 AM - 6:00 PM</span>
                  </div>
                </CardContent>
                <div className="mx-6 h-px bg-zinc-800" />
                <CardFooter className="justify-between py-4">
                  <span className="text-zinc-300">5 access points</span>
                  <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </CardFooter>
              </Card>   
                </Link>
            ))}
            </div>
        </div>
    </main>
    </>
}