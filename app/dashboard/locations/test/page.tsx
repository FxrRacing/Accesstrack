import { Metadata } from "next"
//import OfficeLocationsAirbnb from "./office-locations-airbnb"
       
import { MapWithMarker} from "./office-map";
import Locations from "./locations";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "FXR Locations - Office Location Explorer",
    description: "Discover and explore FXR's global office locations",
  }
  
export default async function Test() {
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
    return (
        <div className="flex flex-col gap-4">
          <Locations locations={locations} />
            {/* <OfficeLocationsAirbnb /> */}
            <div className="h-[500px] w-[500px]">
            <MapWithMarker lat={53.54992} lng={10.00678}  />
            </div>


        </div>
    )
}

