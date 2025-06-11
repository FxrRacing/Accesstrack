'use client'
import { Department, Location, User } from "@prisma/client";

import { Building2, MapPin, BadgeCheck, Mail, Pencil, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Save } from "lucide-react";
import { useActionState, useState } from "react";
import { editUser } from "@/actions/user_actions";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { useEffect } from "react";

const initialState = {
    message: '',
    success: false
}
export default function Details({user, locations, departments, authId, users}: {user: User&{Department: Department | null, Location: Location | null, reportsTo: User | null, headedDepartments: Department[]}, locations: Location[], departments: Department[], authId: string, users: User[]}) {
    const [editingProfile, setEditingProfile] = useState(false);

    
    const [form, setForm] = useState({
        name: user.name || "",
        jobTitle: user.jobTitle || "",
        department: user.Department?.name || "",
        location: user.Location?.name || "",
        email: user.email || "",
        type: user.type || "",
        reportsToId: user.reportsToId || "",
        onboardingDate: user.onboardingDate || "",
        offboardingDate: user.offboardingDate || "",

      
    });
    

    const [error, formAction, pending] = useActionState(editUser, initialState)
    useEffect(() => {
        if (error?.message) {
            if (error.success) {
                toast.success(error.message)
                setEditingProfile(false);
            } else {
                toast.error(error.message)
            }
        }
      
    }, [error, pending, user.id])

   
    if (!user.name || !user.email){
      console.error("User not Loaded properly", {user})
        return( <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold">An Error Occured</h1>
        </div>)
    }
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.set("authId", authId);
        formData.set("id", user.id);
        formData.set("name", form.name);
        formData.set("jobTitle", form.jobTitle);
        formData.set("email", form.email);
        formData.set("type", form.type);
        formData.set("department", form.department);
        formData.set("location", form.location);
        formData.set("reportsToId", form.reportsToId);
        formData.set("onboardingDate", form.onboardingDate.toString());
        formData.set("offboardingDate", form.offboardingDate.toString());
     
        formAction(formData);
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
        </div>

        {!editingProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group animate-fade-in-up">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Department</label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
                <Building2 className="h-4 w-4 text-blue-600" />
                <p className="text-neutral-900 font-medium text-sm">
                  {user.Department?.name || <span className="">No department</span>}
                </p>
              </div>
            </div>
            <div className="group animate-fade-in-up">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Location</label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
                <MapPin className="h-4 w-4 text-blue-600" />
                <p className="text-neutral-900 font-medium text-sm">
                  {user.Location?.name || <span className="">No location</span>}
                </p>
              </div>
            </div>
            <div className="group animate-fade-in-up">
              <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Type</Label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-violet-50 border border-violet-200 transition-all duration-300 group-hover:bg-violet-100 hover-lift">
                <BadgeCheck className="h-4 w-4 text-violet-600" />
                <p className="text-neutral-900 font-medium text-sm capitalize">
                  {user.type || <span className="">No type</span>}
                </p>
              </div>
            </div>
            <div className="group animate-fade-in-up">
              <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Email</Label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-orange-50 border border-orange-200 transition-all duration-300 group-hover:bg-orange-100 hover-lift">
                <Mail className="h-4 w-4 text-orange-600" />
                <p className="text-neutral-900 font-medium text-sm">{user.email}</p>
              </div>
            </div>
            
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-scale">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 animate-fade-in-up stagger-1">
                <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                  value={form.jobTitle}
                  onChange={handleChange}
                  className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                />
              </div>
              <div className="space-y-2 animate-fade-in-up stagger-3">
                <Label htmlFor="department" className="text-sm font-medium text-neutral-700">
                  Department
                </Label>
                <Select defaultValue={user.Department?.name} onValueChange={(value) => setForm({ ...form, department: value })}>
                    <SelectTrigger className=" w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring" >
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent> 
                        {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 animate-fade-in-up stagger-4">
                <Label htmlFor="location" className="text-sm font-medium text-neutral-700">
                  Location
                </Label>
                    <Select defaultValue={user.Location?.name} onValueChange={(value) => setForm({ ...form, location: value })}>
                        <SelectTrigger className=" w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
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
                  value={form.email}
                  onChange={handleChange}
                  className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                />
              </div>
              <div className="space-y-2 animate-fade-in-up stagger-6">
                <Label htmlFor="onboardingDate" className="text-sm font-medium text-neutral-700">
                  Onboarding Date
                </Label>
                <Input
                  id="onboardingDate"
                  type="date"
                  value={form.onboardingDate.toString()}
                  onChange={handleChange}
                  className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                />
              </div>
              <div className="space-y-2 animate-fade-in-up stagger-7">
                <Label htmlFor="offboardingDate" className="text-sm font-medium text-neutral-700">
                  Offboarding Date
                </Label>
                <Input
                  id="offboardingDate"
                  type="date"
                  value={form.offboardingDate.toString()}
                  onChange={handleChange}
                  className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                />
              </div>  
              {/* reports to */}
              <div className="space-y-2 animate-fade-in-up stagger-8">
                <Label htmlFor="reportsToId" className="text-sm font-medium text-neutral-700">
                  Reports To
                </Label>
                <Select defaultValue={user.reportsTo?.name} onValueChange={(value) => setForm({ ...form, reportsToId: value })}>
                    <SelectTrigger className=" w-full border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring" >
                        <SelectValue placeholder="Select a reports to" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem key={`${user.id}-${user.name}`} value={"N/A"}>N/A</SelectItem>
                        {users.map((user) => (
                         
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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