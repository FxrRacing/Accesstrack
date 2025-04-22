"use client"

import { useState } from "react"
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
  Calendar,
  MapPin,
  Phone,
  ChevronRight,
  Pencil,
  Save,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EmployeeProfile() {
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

  // Handle profile save
  const handleProfileSave = () => {
    setEmployee({ ...employee, ...tempProfile })
    setEditingProfile(false)
    toast( "Employee profile information has been updated successfully.",
    )
  }

  // Handle reporting save
  const handleReportingSave = () => {
    setEmployee({ ...employee, reportsTo: tempReporting })
    setEditingReporting(false)
    toast( "Reporting information has been updated successfully.",
   )
  }

  // Handle software save
  const handleSoftwareSave = () => {
    setEmployee({ ...employee, software: tempSoftware })
    setEditingSoftware(false)
    toast( "Software access information has been updated successfully.",
    )
  }

  // Handle emails save
  const handleEmailsSave = () => {
    setEmployee({ ...employee, sharedEmails: tempEmails })
    setEditingEmails(false)
    toast(
     
      "Shared email access has been updated successfully.",
    )
  }

  // Handle access save
  const handleAccessSave = () => {
    setEmployee({ ...employee, accessCodes: tempAccess })
    setEditingAccess(false)
    toast(
      "Access code information has been updated successfully.",
    )
  }

  // Handle keycards save
  const handleKeycardsSave = () => {
    setEmployee({ ...employee, keycards: tempKeycards })
    setEditingKeycards(false)
    toast(
     "Keycard information has been updated successfully.",
    )
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
    <div>
     
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
        {/* Card Header with Employee Profile */}
        <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
          {!editingProfile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => {
                setTempProfile({ ...employee })
                setEditingProfile(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative px-6 pb-6">
          <Avatar className="h-28 w-28 absolute -top-14 ring-4 ring-white dark:ring-zinc-800 shadow-md">
            <AvatarImage src="/placeholder.svg?height=112&width=112" alt={employee.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="pt-16 space-y-2">
            {!editingProfile ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <Badge className="w-fit bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30 border-none">
                    {employee.id}
                  </Badge>
                </div>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">{employee.position}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Department</p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Joined</p>
                      <p className="font-medium">{employee.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/30 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Location</p>
                      <p className="font-medium">{employee.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300 group-hover:bg-sky-500/20 dark:group-hover:bg-sky-500/30 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Phone</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={tempProfile.position}
                      onChange={(e) => setTempProfile({ ...tempProfile, position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={tempProfile.department}
                      onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={tempProfile.location}
                      onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleCancel("profile")}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProfileSave}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Tabs for different sections */}
        <Tabs defaultValue="reporting" className="px-6 pb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-zinc-100/80 dark:bg-zinc-800/50 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="reporting"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reporting</span>
              <span className="sm:hidden">Reporting</span>
            </TabsTrigger>
            <TabsTrigger
              value="software"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Monitor className="h-4 w-4 mr-2" />
              <span>Software</span>
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              <span>Emails</span>
            </TabsTrigger>
            <TabsTrigger
              value="access"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Key className="h-4 w-4 mr-2" />
              <span>Access</span>
            </TabsTrigger>
          </TabsList>

          {/* Reporting Structure Tab */}
          <TabsContent value="reporting">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                  Reporting Structure
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Manager and team information</p>
              </div>
              {!editingReporting && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
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
              <h4 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">Reports To</h4>
              {!editingReporting ? (
                <div className="flex items-center gap-4 p-5 border border-zinc-100 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors group cursor-pointer">
                  <Avatar className="h-14 w-14 border-2 border-white dark:border-zinc-800 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {employee.reportsTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{employee.reportsTo.name}</p>
                    <p className="text-zinc-500 dark:text-zinc-400">{employee.reportsTo.position}</p>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400">{employee.reportsTo.email}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-500 transition-colors" />
                </div>
              ) : (
                <div className="space-y-4 p-5 border border-zinc-100 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800">
                  <div className="space-y-2">
                    <Label htmlFor="manager-name">Manager Name</Label>
                    <Input
                      id="manager-name"
                      value={tempReporting.name}
                      onChange={(e) => setTempReporting({ ...tempReporting, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager-position">Position</Label>
                    <Input
                      id="manager-position"
                      value={tempReporting.position}
                      onChange={(e) => setTempReporting({ ...tempReporting, position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager-email">Email</Label>
                    <Input
                      id="manager-email"
                      type="email"
                      value={tempReporting.email}
                      onChange={(e) => setTempReporting({ ...tempReporting, email: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => handleCancel("reporting")}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReportingSave}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Software Tab */}
          <TabsContent value="software">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                  Software Access
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Software licenses and access details</p>
              </div>
              {!editingSoftware && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
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
              <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <TableHead className="w-[300px]">
                        <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                          <span className="text-cyan-600 dark:text-cyan-400">
                            <Monitor className="h-4 w-4" />
                          </span>
                          Software
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">License Type</div>
                      </TableHead>
                      <TableHead>
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">Expiry Date</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employee.software.map((item, index) => (
                      <TableRow
                        key={index}
                        className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.licenseType}</TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <TableHead className="w-[300px]">
                          <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                            <span className="text-cyan-600 dark:text-cyan-400">
                              <Monitor className="h-4 w-4" />
                            </span>
                            Software
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-medium text-zinc-800 dark:text-zinc-200">License Type</div>
                        </TableHead>
                        <TableHead>
                          <div className="font-medium text-zinc-800 dark:text-zinc-200">Expiry Date</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tempSoftware.map((item, index) => (
                        <TableRow
                          key={index}
                          className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                        >
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={(e) => handleSoftwareUpdate(index, "name", e.target.value)}
                              className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.licenseType}
                              onChange={(e) => handleSoftwareUpdate(index, "licenseType", e.target.value)}
                              className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.expiryDate}
                              onChange={(e) => handleSoftwareUpdate(index, "expiryDate", e.target.value)}
                              className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleCancel("software")}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSoftwareSave}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Shared Emails Tab */}
          <TabsContent value="emails">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                  Shared Email Accounts
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Email accounts this employee has access to</p>
              </div>
              {!editingEmails && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
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
              <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <TableHead className="w-[300px]">
                        <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                          <span className="text-cyan-600 dark:text-cyan-400">
                            <Mail className="h-4 w-4" />
                          </span>
                          Email Address
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">Access Level</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employee.sharedEmails.map((item, index) => (
                      <TableRow
                        key={index}
                        className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <TableCell className="font-medium">{item.address}</TableCell>
                        <TableCell>{item.accessLevel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <TableHead className="w-[300px]">
                          <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                            <span className="text-cyan-600 dark:text-cyan-400">
                              <Mail className="h-4 w-4" />
                            </span>
                            Email Address
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-medium text-zinc-800 dark:text-zinc-200">Access Level</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tempEmails.map((item, index) => (
                        <TableRow
                          key={index}
                          className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                        >
                          <TableCell>
                            <Input
                              value={item.address}
                              onChange={(e) => handleEmailUpdate(index, "address", e.target.value)}
                              className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.accessLevel}
                              onValueChange={(value) => handleEmailUpdate(index, "accessLevel", value)}
                            >
                              <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 h-auto">
                                <SelectValue placeholder="Select access level" />
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
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleCancel("emails")}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEmailsSave}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Access & Keys Tab */}
          <TabsContent value="access">
            <div className="space-y-8">
              {/* Access Codes Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                      Access Codes
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Building and facility access codes</p>
                  </div>
                  {!editingAccess && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
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
                  <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <TableHead className="w-[200px]">
                            <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                              <span className="text-cyan-600 dark:text-cyan-400">
                                <Shield className="h-4 w-4" />
                              </span>
                              Type
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">Code</div>
                          </TableHead>
                          <TableHead>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">Location</div>
                          </TableHead>
                          <TableHead>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">Expiry</div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employee.accessCodes.map((item, index) => (
                          <TableRow
                            key={index}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                          >
                            <TableCell className="font-medium">{item.type}</TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.expiryDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <TableHead className="w-[200px]">
                              <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                                <span className="text-cyan-600 dark:text-cyan-400">
                                  <Shield className="h-4 w-4" />
                                </span>
                                Type
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">Code</div>
                            </TableHead>
                            <TableHead>
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">Location</div>
                            </TableHead>
                            <TableHead>
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">Expiry</div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tempAccess.map((item, index) => (
                            <TableRow
                              key={index}
                              className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                            >
                              <TableCell>
                                <Input
                                  value={item.type}
                                  onChange={(e) => handleAccessUpdate(index, "type", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.code}
                                  onChange={(e) => handleAccessUpdate(index, "code", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.location}
                                  onChange={(e) => handleAccessUpdate(index, "location", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.expiryDate}
                                  onChange={(e) => handleAccessUpdate(index, "expiryDate", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => handleCancel("access")}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAccessSave}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Keycards Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center">
                      <Key className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                      Keycards
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Physical access cards and keys</p>
                  </div>
                  {!editingKeycards && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
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
                  <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <TableHead className="w-[200px]">
                            <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                              <span className="text-cyan-600 dark:text-cyan-400">
                                <Key className="h-4 w-4" />
                              </span>
                              ID
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">Issue Date</div>
                          </TableHead>
                          <TableHead>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">Access Level</div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employee.keycards.map((item, index) => (
                          <TableRow
                            key={index}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                          >
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.issueDate}</TableCell>
                            <TableCell>{item.accessLevel}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <TableHead className="w-[200px]">
                              <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                                <span className="text-cyan-600 dark:text-cyan-400">
                                  <Key className="h-4 w-4" />
                                </span>
                                ID
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">Issue Date</div>
                            </TableHead>
                            <TableHead>
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">Access Level</div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tempKeycards.map((item, index) => (
                            <TableRow
                              key={index}
                              className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                            >
                              <TableCell>
                                <Input
                                  value={item.id}
                                  onChange={(e) => handleKeycardUpdate(index, "id", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.issueDate}
                                  onChange={(e) => handleKeycardUpdate(index, "issueDate", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.accessLevel}
                                  onChange={(e) => handleKeycardUpdate(index, "accessLevel", e.target.value)}
                                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => handleCancel("keycards")}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleKeycardsSave}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
