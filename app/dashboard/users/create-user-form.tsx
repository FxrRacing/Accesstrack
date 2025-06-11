'use client'

import { createUser } from "@/actions/user_actions"
import { User } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Location, Department } from "@prisma/client";
import { EMPLOYMENT_TYPE_OPTIONS, EMPLOYMENT_STATUS_OPTIONS } from "@/utils/constants";
import { PlusCircle, X, UserPlus, Loader2 } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";


  



export default function CreateUserForm({users, locations, departments,authId}: {users: User[], locations: Location[], departments: Department[],authId: string} ) {
    const [additionalEmails, setAdditionalEmails] = useState<string[]>([""])

    const addEmailField = () => {
      setAdditionalEmails([...additionalEmails, ""])
    }
  
    const removeEmailField = (index: number) => {
      const newEmails = [...additionalEmails]
      newEmails.splice(index, 1)
      setAdditionalEmails(newEmails)
    }
  
    const handleEmailChange = (index: number, value: string) => {
      const newEmails = [...additionalEmails]
      newEmails[index] = value
      setAdditionalEmails(newEmails)
    }


    const [state, formAction, isPending] = useActionState(createUser, {
        message: "",
        success: false
    })
    useEffect(() => {
        if (state.success && state.message) {
            
            toast.success(state.message)
        }
        if (!state.success && state.message) {
            toast.error(state.message)
        }
    }, [state])
  return(<>
  <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
    <UserPlus className="mr-2 h-4 w-4" />
    Add User
  </Button>
  </DialogTrigger>
  <DialogContent className=" sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create User</DialogTitle>
      <DialogDescription>
      Create a new user in the system. Fields marked with * are required.
      </DialogDescription>

    </DialogHeader>
    <form action={formAction} className='flex flex-col gap-4'>
    <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="hidden" name="authId"  id="authId" value={authId} />
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select name="departmentId" defaultValue={departments.length > 0 ? departments[0].id : ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                  
                    <Select name="locationId" defaultValue={locations.length > 0 ? locations[0].id : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
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
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Employment Details</h3>
            <div className="space-y-2">
              <Label htmlFor="type">Employee Type*</Label>
              <Select name="type" defaultValue={EMPLOYMENT_TYPE_OPTIONS[0].value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="reportsTo">Reports To</Label>
              <Select name="reportsTo"  >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">None</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select name="status" defaultValue="active">
                <SelectTrigger className="w-full">
                  <SelectValue   placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> 

            <div className="space-y-2">
              <Label htmlFor="onboardingDate">Onboarding Date</Label>
              <Input id="onboardingDate" name="onboardingDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offboardingDate">Offboarding Date</Label>
              <Input id="offboardingDate" name="offboardingDate" type="date" />
              <p className="text-sm text-muted-foreground">Leave blank if the user is still active</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
               <Label htmlFor="personalEmail">Email*</Label>
                <Input id="personalEmail" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personalEmail">Personal Email</Label>
                <Input id="personalEmail" name="personalEmail" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Additional Emails</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEmailField} className="h-8 px-2">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Email
                </Button>
              </div>

              <div className="space-y-2">
                {additionalEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder={`Additional Email ${index + 1}`}
                      type="email"
                    />
                    {additionalEmails.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmailField(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

                


               
              
                
                <Button type="submit" disabled={isPending}> {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : ""} Create User +</Button>
            </form>
  </DialogContent>
</Dialog>

    
            </>
  )
}

