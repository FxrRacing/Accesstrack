"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { toast } from "sonner" // or your toast library
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  CalendarMinus,
  CalendarPlus,
  Mail,
  MapPin,
  Pencil,
  Save,
  UserIcon,
  X,
  BadgeCheck,
} from "lucide-react"
import { editUser } from "@/actions/user_actions" // Assuming this is where your action is defined
import type { User, Department, Location } from "@prisma/client"
import ClientPermissionsWrapper from "@/utils/client-permissions-wrapper"

const initialState = {
  message: "",
  success: false,
  
}
export default function Details({
  user,
  locations = [],
  departments = [],
  authId = "",
  users = [],
}: {
  user?: User & {
    Department?: Department | null
    Location?: Location | null
    reportsTo?: User | null
    headedDepartments?: Department[]
  }
  locations?: Location[]
  departments?: Department[]
  authId?: string
  users?: User[]
}) {
  const [editingProfile, setEditingProfile] = useState(false)
  const [state, formAction, pending] = useActionState(editUser, initialState)

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        setEditingProfile(false)
      } else {
        toast.error(state.message)
      }
    }
  }, [state, pending, user?.id])

  // Check if user exists before proceeding
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    )
  }

  if (!user.name || !user.email) {
    console.error("User not Loaded properly", { user })
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold">An Error Occured</h1>
      </div>
    )
  }

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
<ClientPermissionsWrapper requiredPermission="edit">
        {/* edit button */}
        
        {!editingProfile && (
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-2"
            onClick={() => {
              setEditingProfile(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          )}
          </ClientPermissionsWrapper>
      </div>

      {!editingProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group animate-fade-in-up">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Department</label>
            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
              <Building2 className="h-4 w-4 text-blue-600" />
              <p className="text-neutral-900 font-medium text-sm">
                {user?.Department?.name || <span className="">No department</span>}
              </p>
            </div>
          </div>
          <div className="group animate-fade-in-up">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Location</label>
            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
              <MapPin className="h-4 w-4 text-blue-600" />
              <p className="text-neutral-900 font-medium text-sm">
                {user?.Location?.name || <span className="">No location</span>}
              </p>
            </div>
          </div>
          <div className="group animate-fade-in-up">
            <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Type</Label>
            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-violet-50 border border-violet-200 transition-all duration-300 group-hover:bg-violet-100 hover-lift">
              <BadgeCheck className="h-4 w-4 text-violet-600" />
              <p className="text-neutral-900 font-medium text-sm capitalize">
                {user?.type || <span className="">No type</span>}
              </p>
            </div>
          </div>
          <div className="group animate-fade-in-up">
            <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Email</Label>
            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-orange-50 border border-orange-200 transition-all duration-300 group-hover:bg-orange-100 hover-lift">
              <Mail className="h-4 w-4 text-orange-600" />
              <p className="text-neutral-900 font-medium text-sm">{user?.email}</p>
            </div>
          </div>
          {user?.onboardingDate && (
            <div className="group animate-fade-in-up">
              <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Onboarding Date</Label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-green-50 border border-green-200 transition-all duration-300 group-hover:bg-green-100 hover-lift">
                <CalendarPlus className="h-4 w-4 text-green-600" />
                <p className="text-neutral-900 font-medium text-sm">
                  {user?.onboardingDate ? new Date(user?.onboardingDate).toLocaleDateString() : ""}
                </p>
              </div>
            </div>
          )}

          {user?.offboardingDate && (
            <div className="group animate-fade-in-up">
              <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Offboarding Date</Label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-red-50 border border-red-200 transition-all duration-300 group-hover:bg-red-100 hover-lift">
                <CalendarMinus className="h-4 w-4 text-red-600" />
                <p className="text-neutral-900 font-medium text-sm">
                  {user?.offboardingDate ? new Date(user?.offboardingDate).toLocaleDateString() : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form action={formAction} className="space-y-6 animate-fade-in-scale">
          {/* Hidden inputs for user ID and auth ID */}
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="authId" value={authId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 animate-fade-in-up stagger-1">
              <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-neutral-700">
                Position
              </Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                defaultValue={user.jobTitle || ""}
                className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-3">
              <Label htmlFor="department" className="text-sm font-medium text-neutral-700">
                Department
              </Label>
              <Select defaultValue={user?.Department?.name} name="department">
                <SelectTrigger className=" w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-4">
              <Label htmlFor="location" className="text-sm font-medium text-neutral-700">
                Location
              </Label>
              <Select defaultValue={user?.Location?.name} name="locationId" >
                <SelectTrigger className="w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-5">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                defaultValue={user.email}
                className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-6">
              <Label htmlFor="onboardingDate" className="text-sm font-medium text-neutral-700">
                Onboarding Date
              </Label>
              <Input
                id="onboardingDate"
                name="onboardingDate"
                type="date"
                defaultValue={user?.onboardingDate ? new Date(user?.onboardingDate).toISOString().split("T")[0] : ""}
                className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-7">
              <Label htmlFor="offboardingDate" className="text-sm font-medium text-neutral-700">
                Offboarding Date
              </Label>
              <Input
                id="offboardingDate"
                name="offboardingDate"
                type="date"
                defaultValue={user?.offboardingDate ? new Date(user?.offboardingDate).toISOString().split("T")[0] : ""}
                className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
              />
            </div>
            {/* reports to */}
            <div className="space-y-2 animate-fade-in-up stagger-8">
              <Label htmlFor="reportsToId" className="text-sm font-medium text-neutral-700">
                Reports To
              </Label>
              <Select defaultValue={user?.reportsToId || "N/A"} name="reportsToId">
                <SelectTrigger className=" w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring">
                  <SelectValue placeholder="Select a reports to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={`${user.id}-${user.name}`} value={"N/A"}>
                    N/A
                  </SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 animate-slide-in-right">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditingProfile(false)}
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-blue-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
              disabled={pending}
            >
              <Save className="h-4 w-4 mr-2" />
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
