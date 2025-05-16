import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import {  Building } from 'lucide-react'

import { GradientCard } from '@/components/ui/gradient-card'




import AddLocation from './addLocation'

import LocationsMinimal from './test/locations'

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
           
           

<LocationsMinimal locations={locations} />
        </div>
    </main>
    </>
}