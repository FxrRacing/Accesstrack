'use client'

import { CardHeader } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Info, Settings, Mail, BadgeCheck, MapPin, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { useActionState, useState, useEffect } from "react"
import { Location, SharedAccount } from "@prisma/client"
import { User } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { editSharedAccount } from "@/actions/sharedAccount_actions"
import { toast } from "sonner"
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { accountTypeOptions, statusOptions } from "@/lib/constants"
import { Suspense } from "react"


import DeleteButton from "./delete-button"

//import { toast } from "sonner"

const initialState = {
    message: '',
    success: false
}

export default function EditableOverview({sharedAccount, authUser, locations}: {sharedAccount: SharedAccount, authUser: User, locations: Location[]}) {
    const [isEditing, setIsEditing] = useState(false)
    const [state, formAction, pending] = useActionState(editSharedAccount, initialState)
   
    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message)
                setIsEditing(false)
            } else {
                toast.error(state.message)
            }
        }
    }, [state])
    return (
        <>
<CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Overview</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage shared account overview
              </p>
            </div>
          </div>
         
          <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2  hover:bg-slate-50"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
        </div>
      </CardHeader>

      
              <CardContent className="pt-0">
               {isEditing && (
                <div className="">
                    <form action={formAction} >
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <input type="hidden" name="id" value={sharedAccount.id} />
                    <input type="hidden" name="authId"  readOnly value={authUser.id} />
                    <div className="flex flex-col gap-1">
                    <Label>Name</Label>
                    <Input type="text" placeholder="Name" name="name" defaultValue={sharedAccount.name} />
                    </div>
                    <div className="flex flex-col gap-1">
                    <Label>Email </Label>
                    <Input type="text" placeholder="Email" name="email" defaultValue={sharedAccount.email} />
                    </div>
                    <div className="flex flex-col gap-1">
                    <Label>Location</Label>
                    <Select >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={locations.find((location) => location.id === sharedAccount.location)?.name || "Select Location"} />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                    <Label>Type</Label>
                    <Select defaultValue={sharedAccount.type || ""} name="type">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={accountTypeOptions.find((type) => type.value === sharedAccount.type)?.label || "Select Type"} />

                        </SelectTrigger>
                        <SelectContent>
                            {accountTypeOptions.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    </div>
                    <div className="flex flex-col gap-1">
                    <Label>Status</Label>
                    <Select defaultValue={sharedAccount.status} name="status">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={statusOptions.find((status) => status.value === sharedAccount.status)?.label || "Select Status"} />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </div>
                   
                    </div>
                    <Button type="submit" disabled={pending}> {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}</Button>

                    </form>
                </div>
               )}
               {!isEditing && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-1 text-muted-foreground">Name</p>
                    <p className="text-sm">{sharedAccount.name}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Email 
                    </p>
                    <p className="text-sm flex items-center gap-1"> <Mail className="w-4 h-4" />{sharedAccount.email}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Type{" "}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4" />
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"> 
                        {sharedAccount.type}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Location 
                    </p>
                    <p className="text-sm flex items-center gap-1"> <MapPin className="w-4 h-4" />{sharedAccount.location}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Created At 
                    </p>
                    <p className="text-sm flex items-center gap-1"> <CalendarIcon className="w-4 h-4" /> {sharedAccount.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Last Updated 
                    </p>
                    <p className="text-sm flex items-center gap-1"> <CalendarIcon className="w-4 h-4" /> {sharedAccount.updatedAt.toLocaleDateString()}</p>
                  </div>
                 
                </div>
               )}
               {isEditing && authUser.user_metadata.role === "admin" && (
                <div className="flex justify-end mt-4">
                   
                   <Suspense fallback={<div>Loading Delete Button...</div>}> 
                   <DeleteButton id={sharedAccount.id} />
               </Suspense>
              
            
             </div>
               )}
              </CardContent>
        </>
    )
}