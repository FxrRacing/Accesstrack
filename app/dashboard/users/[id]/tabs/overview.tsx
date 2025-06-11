    import { Department, User, Location } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, BadgeCheck, Mail } from "lucide-react";
import { UserIcon } from "lucide-react";


export default function Overview({user}: {user: User&{Department: Department | null, Location: Location | null, reportsTo: User | null, headedDepartments: Department[]}}) {
    return (
        <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-fade-in-up stagger-1">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 hover-scale transition-transform duration-300">
                <UserIcon className="h-4 w-4 text-neutral-600" /> 
              </div>
              Overview
            </h2>
            <p className="text-neutral-500 text-sm mt-1">Employee profile information</p>
          </div>
        
         
        </div>

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="group animate-fade-in-up stagger-1">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Department</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all duration-300 text-xs font-medium hover-scale">
                    <Building2 className="h-3 w-3 mr-1.5" />
                    {user.Department?.name}
                  </Badge>
                </div>
              </div>
              <div className="group animate-fade-in-up stagger-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Location</label>
                <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="text-neutral-900 font-medium text-sm">{user.Location?.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group animate-fade-in-up stagger-3">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Type</label>
                <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-violet-50 border border-violet-200 transition-all duration-300 group-hover:bg-violet-100 hover-lift">
                  <BadgeCheck className="h-4 w-4 text-violet-600" />
                  <p className="text-neutral-900 font-medium text-sm">{user.type}</p>
                </div>
              </div>
              <div className="group animate-fade-in-up stagger-4">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Email</label>
                <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-orange-50 border border-orange-200 transition-all duration-300 group-hover:bg-orange-100 hover-lift">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <p className="text-neutral-900 font-medium text-sm">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
      
      </div>
    )
}