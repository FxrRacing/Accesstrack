'use client'

import { CardHeader } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Info, Settings, Mail, BadgeCheck, MapPin, Calendar } from "lucide-react"
import { useState } from "react"
import { SharedAccount } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

export default function EditableOverview({sharedAccount}: {sharedAccount: SharedAccount}) {
    const [isEditing, setIsEditing] = useState(false)
    return (
        <>
        <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Overview
                  </CardTitle>
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
                <div className="flex flex-col gap-4">
                   
                    <Input type="text" placeholder="Name" value={sharedAccount.name} />
                    <Input type="text" placeholder="Email" value={sharedAccount.email} />
                    <Input type="text" placeholder="Location" defaultValue={sharedAccount.location || ""} />
                    <Input type="text" placeholder="Type" value={sharedAccount.type || ""} />
                    <Input type="text" placeholder="Created At" value={sharedAccount.createdAt.toLocaleDateString()} />
                    <Button type="submit">Save</Button>
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
                    <p className="text-sm flex items-center gap-1"> <Calendar className="w-4 h-4" /> {sharedAccount.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Last Updated 
                    </p>
                    <p className="text-sm flex items-center gap-1"> <Calendar className="w-4 h-4" /> {sharedAccount.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
               )}
              </CardContent>
        </>
    )
}