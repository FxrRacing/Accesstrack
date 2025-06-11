"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Users,
  Monitor,
  Mail,
  Key,
  Shield,
  ChevronRight,
  Pencil,
  MapPin,
  User,
  BadgeCheck,
  Clock,
  Save,
  X,
  UserCircle,
  Briefcase,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EmployeeProfile() {
  const [isLoaded, setIsLoaded] = useState(false)

  // This would typically come from an API or database
  const [employee, setEmployee] = useState({
    id: "EMP12345",
    name: "Sarah Johnson",
    position: "Senior Marketing Specialist",
    department: "Marketing",
    joinDate: "March 15, 2021",
    location: "New York Office",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    type: "Employee",
    reportsTo: {
      name: "Michael Chen",
      position: "Marketing Director",
      email: "michael.chen@company.com",
    },
    software: [
      { name: "Adobe Creative Suite", licenseType: "Premium", expiryDate: "Dec 31, 2023" },
      { name: "Salesforce", licenseType: "Enterprise", expiryDate: "Jun 30, 2024" },
      { name: "HubSpot", licenseType: "Professional", expiryDate: "Mar 15, 2024" },
      { name: "Microsoft 365", licenseType: "Business", expiryDate: "Jan 01, 2024" },
    ],
    sharedEmails: [
      { address: "marketing@company.com", accessLevel: "Contributor" },
      { address: "campaigns@company.com", accessLevel: "Admin" },
      { address: "social@company.com", accessLevel: "Viewer" },
    ],
    accessCodes: [
      { type: "Building Access", code: "B-2345", location: "Main Office", expiryDate: "Permanent" },
      { type: "Conference Room", code: "CR-789", location: "4th Floor", expiryDate: "Permanent" },
      { type: "Parking Garage", code: "PG-456", location: "Basement Level", expiryDate: "Dec 31, 2023" },
    ],
    keycards: [{ id: "KC-9876", issueDate: "Mar 15, 2021", accessLevel: "Level 2" }],
  })

  // Edit mode states
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingReporting, setEditingReporting] = useState(false)
  const [editingSoftware, setEditingSoftware] = useState(false)
  const [editingEmails, setEditingEmails] = useState(false)
  const [editingAccess, setEditingAccess] = useState(false)
  const [editingKeycards, setEditingKeycards] = useState(false)

  // Temporary states for editing
  const [tempProfile, setTempProfile] = useState({ ...employee })
  const [tempReporting, setTempReporting] = useState({ ...employee.reportsTo })
  const [tempSoftware, setTempSoftware] = useState([...employee.software])
  const [tempEmails, setTempEmails] = useState([...employee.sharedEmails])
  const [tempAccess, setTempAccess] = useState([...employee.accessCodes])
  const [tempKeycards, setTempKeycards] = useState([...employee.keycards])

  // Trigger animations on mount
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle profile save
  const handleProfileSave = () => {
    setEmployee({ ...employee, ...tempProfile })
    setEditingProfile(false)
    toast("Employee profile information has been updated successfully.")
  }

  // Handle reporting save
  const handleReportingSave = () => {
    setEmployee({ ...employee, reportsTo: tempReporting })
    setEditingReporting(false)
    toast("Reporting information has been updated successfully.")
  }

  // Handle software save
  const handleSoftwareSave = () => {
    setEmployee({ ...employee, software: tempSoftware })
    setEditingSoftware(false)
    toast("Software access information has been updated successfully.")
  }

  // Handle emails save
  const handleEmailsSave = () => {
    setEmployee({ ...employee, sharedEmails: tempEmails })
    setEditingEmails(false)
    toast("Shared email access has been updated successfully.")
  }

  // Handle access save
  const handleAccessSave = () => {
    setEmployee({ ...employee, accessCodes: tempAccess })
    setEditingAccess(false)
    toast("Access code information has been updated successfully.")
  }

  // Handle keycards save
  const handleKeycardsSave = () => {
    setEmployee({ ...employee, keycards: tempKeycards })
    setEditingKeycards(false)
    toast("Keycard information has been updated successfully.")
  }

  // Handle cancel for any edit
  const handleCancel = (section: string) => {
    switch (section) {
      case "profile":
        setTempProfile({ ...employee })
        setEditingProfile(false)
        break
      case "reporting":
        setTempReporting({ ...employee.reportsTo })
        setEditingReporting(false)
        break
      case "software":
        setTempSoftware([...employee.software])
        setEditingSoftware(false)
        break
      case "emails":
        setTempEmails([...employee.sharedEmails])
        setEditingEmails(false)
        break
      case "access":
        setTempAccess([...employee.accessCodes])
        setEditingAccess(false)
        break
      case "keycards":
        setTempKeycards([...employee.keycards])
        setEditingKeycards(false)
        break
    }
  }

  // Handle software item update
  const handleSoftwareUpdate = (index: number, field: string, value: string) => {
    const updatedSoftware = [...tempSoftware]
    updatedSoftware[index] = { ...updatedSoftware[index], [field]: value }
    setTempSoftware(updatedSoftware)
  }

  // Handle email item update
  const handleEmailUpdate = (index: number, field: string, value: string) => {
    const updatedEmails = [...tempEmails]
    updatedEmails[index] = { ...updatedEmails[index], [field]: value }
    setTempEmails(updatedEmails)
  }

  // Handle access code item update
  const handleAccessUpdate = (index: number, field: string, value: string) => {
    const updatedAccess = [...tempAccess]
    updatedAccess[index] = { ...updatedAccess[index], [field]: value }
    setTempAccess(updatedAccess)
  }

  // Handle keycard item update
  const handleKeycardUpdate = (index: number, field: string, value: string) => {
    const updatedKeycards = [...tempKeycards]
    updatedKeycards[index] = { ...updatedKeycards[index], [field]: value }
    setTempKeycards(updatedKeycards)
  }

  return (
    <div className="min-h-screen vercel-gradient-subtle">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className={`flex items-center justify-between ${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-16 w-16 border-2 border-white shadow-vercel-lg ring-1 ring-neutral-200 transition-all duration-500 group-hover:ring-blue-300 group-hover:shadow-vercel-xl hover-lift animate-pulse-glow">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt={employee.name} />
                <AvatarFallback className="text-lg gradient-blue-subtle text-white font-medium">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 gradient-emerald-subtle rounded-full p-1 shadow-vercel animate-bounce-subtle">
                <Sparkles className="h-3 w-3 text-black animate-rotate-gentle" />
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-gradient-primary">{employee.name}</h1>
                <Badge className="bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 transition-all duration-300 text-xs font-medium hover-scale">
                  {employee.id}
                </Badge>
              </div>
              <p className="text-neutral-600 font-medium">{employee.position}</p>
              <p className="text-sm text-neutral-500">{employee.department}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 ${isLoaded ? "animate-fade-in-scale stagger-2" : "opacity-0"}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Add Owner
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce"
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card
          className={`border border-neutral-200 shadow-vercel-lg bg-white rounded-lg overflow-hidden hover-lift transition-all duration-500 ${isLoaded ? "animate-fade-in-scale stagger-3" : "opacity-0"}`}
        >
          <div className="p-8">
            {/* Profile Overview Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="animate-fade-in-up stagger-1">
                  <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 hover-scale transition-transform duration-300">
                      <User className="h-4 w-4 text-neutral-600" />
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
                      setTempProfile({ ...employee })
                      setEditingProfile(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {!editingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group animate-fade-in-up stagger-1">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Department</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all duration-300 text-xs font-medium hover-scale">
                          <Building2 className="h-3 w-3 mr-1.5" />
                          {employee.department}
                        </Badge>
                      </div>
                    </div>
                    <div className="group animate-fade-in-up stagger-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Location</label>
                      <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300 group-hover:bg-blue-100 hover-lift">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <p className="text-neutral-900 font-medium text-sm">{employee.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group animate-fade-in-up stagger-3">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Type</label>
                      <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-violet-50 border border-violet-200 transition-all duration-300 group-hover:bg-violet-100 hover-lift">
                        <BadgeCheck className="h-4 w-4 text-violet-600" />
                        <p className="text-neutral-900 font-medium text-sm">{employee.type}</p>
                      </div>
                    </div>
                    <div className="group animate-fade-in-up stagger-4">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Email</label>
                      <div className="flex items-center gap-2 mt-1 p-3 rounded-lg bg-orange-50 border border-orange-200 transition-all duration-300 group-hover:bg-orange-100 hover-lift">
                        <Mail className="h-4 w-4 text-orange-600" />
                        <p className="text-neutral-900 font-medium text-sm">{employee.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-scale">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 animate-fade-in-up stagger-1">
                      <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-up stagger-2">
                      <Label htmlFor="position" className="text-sm font-medium text-neutral-700">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={tempProfile.position}
                        onChange={(e) => setTempProfile({ ...tempProfile, position: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-up stagger-3">
                      <Label htmlFor="department" className="text-sm font-medium text-neutral-700">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={tempProfile.department}
                        onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-up stagger-4">
                      <Label htmlFor="location" className="text-sm font-medium text-neutral-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={tempProfile.location}
                        onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-up stagger-5">
                      <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={tempProfile.email}
                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-in-up stagger-5">
                      <Label htmlFor="phone" className="text-sm font-medium text-neutral-700">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={tempProfile.phone}
                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                        className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 animate-slide-in-right">
                    <Button
                      variant="outline"
                      onClick={() => handleCancel("profile")}
                      className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfileSave}
                      className="gradient-blue-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-8 bg-neutral-200" />

            {/* Tabs for different sections */}
            <Tabs defaultValue="reporting" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-neutral-100 p-1 rounded-lg border border-neutral-200 animate-fade-in-up stagger-4">
                <TabsTrigger
                  value="reporting"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-vercel rounded-md transition-all duration-300 hover-scale"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Reporting
                </TabsTrigger>
                <TabsTrigger
                  value="software"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-vercel rounded-md transition-all duration-300 hover-scale"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Software
                </TabsTrigger>
                <TabsTrigger
                  value="emails"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-vercel rounded-md transition-all duration-300 hover-scale"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Emails
                </TabsTrigger>
                <TabsTrigger
                  value="access"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-vercel rounded-md transition-all duration-300 hover-scale"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Access
                </TabsTrigger>
              </TabsList>

              {/* Reporting Structure Tab */}
              <TabsContent value="reporting" className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 hover-scale transition-transform duration-300">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      Reporting Structure
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Manager and team information</p>
                  </div>
                  {!editingReporting && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-2"
                      onClick={() => {
                        setTempReporting({ ...employee.reportsTo })
                        setEditingReporting(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-900 flex items-center gap-2 animate-fade-in-up stagger-2">
                    <div className="p-1.5 rounded-lg bg-violet-100 border border-violet-200 hover-scale transition-transform duration-300">
                      <Briefcase className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    Reports To
                  </h4>
                  {!editingReporting ? (
                    <div className="group cursor-pointer animate-fade-in-up stagger-3">
                      <Card className="p-4 border border-neutral-200 shadow-vercel bg-white rounded-lg hover:shadow-vercel-lg transition-all duration-500 hover:border-neutral-300 hover-lift">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-vercel ring-1 ring-neutral-200 hover-scale transition-all duration-300">
                            <AvatarFallback className="gradient-violet-subtle text-white font-medium">
                              {employee.reportsTo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900">{employee.reportsTo.name}</p>
                            <p className="text-neutral-600 text-sm">{employee.reportsTo.position}</p>
                            <p className="text-blue-600 text-sm font-medium">{employee.reportsTo.email}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <Card className="p-4 border border-neutral-200 shadow-vercel rounded-lg animate-fade-in-scale">
                      <div className="space-y-4">
                        <div className="space-y-2 animate-fade-in-up stagger-1">
                          <Label htmlFor="manager-name" className="text-sm font-medium text-neutral-700">
                            Manager Name
                          </Label>
                          <Input
                            id="manager-name"
                            value={tempReporting.name}
                            onChange={(e) => setTempReporting({ ...tempReporting, name: e.target.value })}
                            className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                          />
                        </div>
                        <div className="space-y-2 animate-fade-in-up stagger-2">
                          <Label htmlFor="manager-position" className="text-sm font-medium text-neutral-700">
                            Position
                          </Label>
                          <Input
                            id="manager-position"
                            value={tempReporting.position}
                            onChange={(e) => setTempReporting({ ...tempReporting, position: e.target.value })}
                            className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                          />
                        </div>
                        <div className="space-y-2 animate-fade-in-up stagger-3">
                          <Label htmlFor="manager-email" className="text-sm font-medium text-neutral-700">
                            Email
                          </Label>
                          <Input
                            id="manager-email"
                            type="email"
                            value={tempReporting.email}
                            onChange={(e) => setTempReporting({ ...tempReporting, email: e.target.value })}
                            className="border-neutral-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 focus-ring"
                          />
                        </div>
                        <div className="flex justify-end gap-2 animate-slide-in-right">
                          <Button
                            variant="outline"
                            onClick={() => handleCancel("reporting")}
                            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleReportingSave}
                            className="gradient-blue-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Software Tab */}
              <TabsContent value="software" className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-200 hover-scale transition-transform duration-300">
                        <Monitor className="h-4 w-4 text-emerald-600" />
                      </div>
                      Software Access
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Software licenses and access details</p>
                  </div>
                  {!editingSoftware && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-2"
                      onClick={() => {
                        setTempSoftware([...employee.software])
                        setEditingSoftware(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {!editingSoftware ? (
                  <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-3">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-emerald-50 hover:bg-emerald-50 border-b border-emerald-200">
                          <TableHead className="font-semibold text-neutral-900 py-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-emerald-100 border border-emerald-200 hover-scale transition-transform duration-300">
                                <Monitor className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              Software
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">License Type</TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Expiry Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employee.software.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                          >
                            <TableCell className="font-medium py-3 text-sm">{item.name}</TableCell>
                            <TableCell className="py-3 text-sm text-neutral-600">{item.licenseType}</TableCell>
                            <TableCell className="py-3 text-sm text-neutral-600">{item.expiryDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <div className="space-y-4 animate-fade-in-scale">
                    <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-emerald-50 hover:bg-emerald-50 border-b border-emerald-200">
                            <TableHead className="font-semibold text-neutral-900 py-3">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-emerald-100 border border-emerald-200">
                                  <Monitor className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                                Software
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">License Type</TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Expiry Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tempSoftware.map((item, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-neutral-50 transition-colors duration-200 border-b border-neutral-100"
                            >
                              <TableCell className="py-3">
                                <Input
                                  value={item.name}
                                  onChange={(e) => handleSoftwareUpdate(index, "name", e.target.value)}
                                  className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 font-medium text-sm focus-ring"
                                />
                              </TableCell>
                              <TableCell className="py-3">
                                <Input
                                  value={item.licenseType}
                                  onChange={(e) => handleSoftwareUpdate(index, "licenseType", e.target.value)}
                                  className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                />
                              </TableCell>
                              <TableCell className="py-3">
                                <Input
                                  value={item.expiryDate}
                                  onChange={(e) => handleSoftwareUpdate(index, "expiryDate", e.target.value)}
                                  className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                    <div className="flex justify-end gap-2 animate-slide-in-right">
                      <Button
                        variant="outline"
                        onClick={() => handleCancel("software")}
                        className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSoftwareSave}
                        className="gradient-emerald-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Shared Emails Tab */}
              <TabsContent value="emails" className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 border border-orange-200 hover-scale transition-transform duration-300">
                        <Mail className="h-4 w-4 text-orange-600" />
                      </div>
                      Shared Email Accounts
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Email accounts this employee has access to</p>
                  </div>
                  {!editingEmails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-2"
                      onClick={() => {
                        setTempEmails([...employee.sharedEmails])
                        setEditingEmails(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {!editingEmails ? (
                  <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-3">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-orange-50 hover:bg-orange-50 border-b border-orange-200">
                          <TableHead className="font-semibold text-neutral-900 py-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-orange-100 border border-orange-200 hover-scale transition-transform duration-300">
                                <Mail className="h-3.5 w-3.5 text-orange-600" />
                              </div>
                              Email Address
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Access Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employee.sharedEmails.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                          >
                            <TableCell className="font-medium py-3 text-sm">{item.address}</TableCell>
                            <TableCell className="py-3 text-sm text-neutral-600">{item.accessLevel}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <div className="space-y-4 animate-fade-in-scale">
                    <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-orange-50 hover:bg-orange-50 border-b border-orange-200">
                            <TableHead className="font-semibold text-neutral-900 py-3">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-orange-100 border border-orange-200">
                                  <Mail className="h-3.5 w-3.5 text-orange-600" />
                                </div>
                                Email Address
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Access Level</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tempEmails.map((item, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-neutral-50 transition-colors duration-200 border-b border-neutral-100"
                            >
                              <TableCell className="py-3">
                                <Input
                                  value={item.address}
                                  onChange={(e) => handleEmailUpdate(index, "address", e.target.value)}
                                  className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 font-medium text-sm focus-ring"
                                />
                              </TableCell>
                              <TableCell className="py-3">
                                <Select
                                  value={item.accessLevel}
                                  onValueChange={(value) => handleEmailUpdate(index, "accessLevel", value)}
                                >
                                  <SelectTrigger className="border-0 shadow-none p-0 h-auto focus:ring-0 text-sm focus-ring">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Contributor">Contributor</SelectItem>
                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                    <div className="flex justify-end gap-2 animate-slide-in-right">
                      <Button
                        variant="outline"
                        onClick={() => handleCancel("emails")}
                        className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEmailsSave}
                        className="gradient-orange-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Access & Keys Tab */}
              <TabsContent value="access" className="space-y-8 animate-fade-in-up">
                {/* Access Codes Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="animate-fade-in-up stagger-1">
                      <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-100 border border-violet-200 hover-scale transition-transform duration-300">
                          <Shield className="h-4 w-4 text-violet-600" />
                        </div>
                        Access Codes
                      </h3>
                      <p className="text-neutral-500 text-sm mt-1">Building and facility access codes</p>
                    </div>
                    {!editingAccess && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-2"
                        onClick={() => {
                          setTempAccess([...employee.accessCodes])
                          setEditingAccess(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {!editingAccess ? (
                    <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-3">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-violet-50 hover:bg-violet-50 border-b border-violet-200">
                            <TableHead className="font-semibold text-neutral-900 py-3">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-violet-100 border border-violet-200 hover-scale transition-transform duration-300">
                                  <Shield className="h-3.5 w-3.5 text-violet-600" />
                                </div>
                                Type
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Code</TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Location</TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Expiry</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employee.accessCodes.map((item, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                            >
                              <TableCell className="font-medium py-3 text-sm">{item.type}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.code}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.location}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.expiryDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    <div className="space-y-4 animate-fade-in-scale">
                      <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-violet-50 hover:bg-violet-50 border-b border-violet-200">
                              <TableHead className="font-semibold text-neutral-900 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 rounded bg-violet-100 border border-violet-200">
                                    <Shield className="h-3.5 w-3.5 text-violet-600" />
                                  </div>
                                  Type
                                </div>
                              </TableHead>
                              <TableHead className="font-semibold text-neutral-900 py-3">Code</TableHead>
                              <TableHead className="font-semibold text-neutral-900 py-3">Location</TableHead>
                              <TableHead className="font-semibold text-neutral-900 py-3">Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tempAccess.map((item, index) => (
                              <TableRow
                                key={index}
                                className="hover:bg-neutral-50 transition-colors duration-200 border-b border-neutral-100"
                              >
                                <TableCell className="py-3">
                                  <Input
                                    value={item.type}
                                    onChange={(e) => handleAccessUpdate(index, "type", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 font-medium text-sm focus-ring"
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <Input
                                    value={item.code}
                                    onChange={(e) => handleAccessUpdate(index, "code", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <Input
                                    value={item.location}
                                    onChange={(e) => handleAccessUpdate(index, "location", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <Input
                                    value={item.expiryDate}
                                    onChange={(e) => handleAccessUpdate(index, "expiryDate", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                      <div className="flex justify-end gap-2 animate-slide-in-right">
                        <Button
                          variant="outline"
                          onClick={() => handleCancel("access")}
                          className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAccessSave}
                          className="gradient-violet-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Keycards Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="animate-fade-in-up stagger-4">
                      <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 hover-scale transition-transform duration-300">
                          <Key className="h-4 w-4 text-blue-600" />
                        </div>
                        Keycards
                      </h3>
                      <p className="text-neutral-500 text-sm mt-1">Physical access cards and keys</p>
                    </div>
                    {!editingKeycards && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-300 hover-scale micro-bounce animate-fade-in-up stagger-5"
                        onClick={() => {
                          setTempKeycards([...employee.keycards])
                          setEditingKeycards(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {!editingKeycards ? (
                    <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-5">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50 hover:bg-blue-50 border-b border-blue-200">
                            <TableHead className="font-semibold text-neutral-900 py-3">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-blue-100 border border-blue-200 hover-scale transition-transform duration-300">
                                  <Key className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                ID
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Issue Date</TableHead>
                            <TableHead className="font-semibold text-neutral-900 py-3">Access Level</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employee.keycards.map((item, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                            >
                              <TableCell className="font-medium py-3 text-sm">{item.id}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.issueDate}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.accessLevel}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    <div className="space-y-4 animate-fade-in-scale">
                      <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-blue-50 hover:bg-blue-50 border-b border-blue-200">
                              <TableHead className="font-semibold text-neutral-900 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 rounded bg-blue-100 border border-blue-200">
                                    <Key className="h-3.5 w-3.5 text-blue-600" />
                                  </div>
                                  ID
                                </div>
                              </TableHead>
                              <TableHead className="font-semibold text-neutral-900 py-3">Issue Date</TableHead>
                              <TableHead className="font-semibold text-neutral-900 py-3">Access Level</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tempKeycards.map((item, index) => (
                              <TableRow
                                key={index}
                                className="hover:bg-neutral-50 transition-colors duration-200 border-b border-neutral-100"
                              >
                                <TableCell className="py-3">
                                  <Input
                                    value={item.id}
                                    onChange={(e) => handleKeycardUpdate(index, "id", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 font-medium text-sm focus-ring"
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <Input
                                    value={item.issueDate}
                                    onChange={(e) => handleKeycardUpdate(index, "issueDate", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <Input
                                    value={item.accessLevel}
                                    onChange={(e) => handleKeycardUpdate(index, "accessLevel", e.target.value)}
                                    className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-sm focus-ring"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                      <div className="flex justify-end gap-2 animate-slide-in-right">
                        <Button
                          variant="outline"
                          onClick={() => handleCancel("keycards")}
                          className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 micro-bounce"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleKeycardsSave}
                          className="gradient-blue-subtle text-white border-0 shadow-vercel hover:shadow-vercel-lg transition-all duration-300 hover-glow micro-bounce"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}
