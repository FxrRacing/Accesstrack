import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import AddDoor from "./addDoor";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  Clock,
  DoorOpen,
  MapPin,
  Settings,
  Shield,
 
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapWithMarker } from "../test/office-map";
import { TableBody, TableCell, Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";

function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const { id } = await params;
  if (!isValidUUID(id)) {
    return notFound();
  }
  const location = await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: {
      _count: { select: { employees: true } },
      employees: true,
      doors: {
        include: {
          KeyCardDoor: {
            include: {
              keyCard: {
                include: {
                  user: true,
                },
              },
            },
          },
          Key: {
            include: {
              user: true,
            },
          },
        },
      },
      operatingHours: true,
    },
  });
  if (!location) {
    return notFound();
  }
  const departments = await prisma.department.findMany({});
  
  const isFavorite = false;
  return (
    <>
      <div>
        <header className="sticky  bg-background top-0 z-50 flex h-16 items-center gap-4 border-b border-secondary  px-4 md:px-6">
          <Link href="/dashboard/locations" prefetch={true}>
          <Button variant="ghost" size="icon" className="rounded-full" >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Locations</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 rounded-full">
              <Heart
                className={`h-4 w-4 
                ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"}
                `}
              />
              <span className="hidden md:inline">Save</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-col gap-2 px-4 md:px-6">
          <div className="flex flex-row gap-2 mt-2">
            <h1 className="text-2xl font-bold">{location.name}</h1>

            <Badge
              className={`capitalize text-sm ${
                location.type === "Headquarters"
                  ? "border-rose-500 text-rose-500"
                  : location.type === "Regional"
                  ? "border-orange-500 text-orange-500"
                  : "border-gray-500 "
              }`}
            >
              {location.type}
            </Badge>
          </div>
          <p className="text-sm"> {location.address}</p>
          <div></div>

          <div className="flex flex-col gap-2 w-full lg:flex-row">
            <div className="flex flex-col gap-2 w-full lg:w-2/3">
              {" "}
              <Tabs defaultValue="overview" className="">
                <TabsList className="w-full rounded-full">
                  <TabsTrigger value="overview" className="rounded-full">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="access-points" className="rounded-full">
                    Access Points
                  </TabsTrigger>
                  <TabsTrigger value="users" className="rounded-full">
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="amenities" className="rounded-full" disabled={true}>
                    Amenities
                  </TabsTrigger>
                 
                </TabsList>
                <TabsContent value="overview">
                  <Card className=" border shadow-sm md:col-span-2 ">
                    <CardHeader className="pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className=" ">Overview</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2  hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm mt-0">
                        <div>
                          <p className="mb-1 text-muted-foreground">Type</p>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1.5" />
                              <p className="font-medium  capitalize">{location.type}</p>
                            </div>
                          </Badge>
                        </div>

                        <div>
                          <p className="mb-1 text-muted-foreground">Address</p>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4  mr-1.5" />
                            <p className="font-medium ">{location.address}</p>
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-muted-foreground">Hours</p>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4  mr-1.5" />
                            <p className="font-medium ">
                              {" "}
                              {location.operatingHours
                                .map(
                                  (hour) =>
                                    `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`
                                )
                                .join(" • ") ||
                                "8:00 AM - 5:00 PM Monday - Friday"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* <TabsContent value="access-points">
                  <p>Access Points</p>
                </TabsContent> */}
                <TabsContent value="access-points" className="space-y-6 mt-0">
                <Card className=" border shadow-sm md:col-span-2 ">
                    <CardHeader className="pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className=" ">Access Points</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2  hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        This office has {location.doors.length} access points with varying security levels and
                        access permissions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                   

                  <div className="overflow-hidden rounded-xl border border-secondary ">
                    <Table>
                      <TableHeader className="text-primary">
                        <TableRow className="hover:bg-gray-50">
                         
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden md:table-cell">Access Level</TableHead>
                          <TableHead className="hidden md:table-cell">Floor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {location.doors.map((door) => (
                          <TableRow key={door.id} className="hover:bg-gray-50">
                           
                            <TableCell>{door.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  door.type === "Main Entry"
                                    ? "bg-rose-100 text-rose-800 hover:bg-rose-100"
                                    : door.type === "Emergency Exit"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : door.type === "Secure Door"
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {door.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{door.accessLevel}</TableCell>
                            <TableCell className="hidden md:table-cell">{door.floor}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  door.status === "Active"
                                    ? "border-green-500 text-green-600"
                                    : "border-amber-500 text-amber-600"
                                }
                              >
                                {door.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
<Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-secondary ">
                      <div className="flex items-center gap-2 mb-2">
                        <DoorOpen className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold">Door Types</h3>
                      </div>
                      <div className="space-y-2">
                        {Array.from(new Set(location.doors.map((door) => door.type))).map((type) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <Badge variant="outline">{location.doors.filter((door) => door.type === type).length}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-secondary ">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold">Access Levels</h3>
                      </div>
                      <div className="space-y-2">
                        {Array.from(new Set(location.doors.map((door) => door.accessLevel))).map((level) => (
                          <div key={level} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{level}</span>
                            <Badge variant="outline">
                              {location.doors.filter((door) => door.accessLevel === level).length}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                   
                  </div>
                        </CardContent>
                        </Card>
                       
                        
                </TabsContent>
                <TabsContent value="amenities">
                  <p>Amenities</p>
                </TabsContent>
                <TabsContent value="users">
                <Card className=" border shadow-sm md:col-span-2 ">
                    <CardHeader className="pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className=" ">Users</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2  hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                    <Table>
                      <TableHeader className="text-primary">
                        <TableRow className="hover:bg-gray-50">
                        
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="hidden md:table-cell">Job Title</TableHead>
                          
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {location.employees.map((employee) => (
                          <TableRow key={employee.id} className="hover:bg-gray-50">
                           
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.jobTitle}</TableCell>
                            
                            <TableCell>{employee.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-1/3 bg-red-100 p-0 rounded-lg ">
              {" "}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm ">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{location._count.employees} employees</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DoorOpen className="h-4 w-4" />
                      <span>{location.doors.length} access points</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="h-96 rounded-2xl">
                    <MapWithMarker
                      lat={location.latitude!}
                      lng={location.longitude!}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <p className="text-sm">
            Employees:{" "}
            {location.employees.map((employee) => (
              <p key={employee.id}>{employee.name}</p>
            ))}
          </p>
          <AddDoor locationId={location.id} departments={departments} />

          <Separator className="my-4" />
          <h2 className="text-lg font-bold">Doors</h2>
          <div>
            {location.doors.map((door) => (
              <div key={door.id} className="flex flex-col gap-2">
                <p className="text-md font-bold">{door.name}</p>
                {door.KeyCardDoor.map((keyCard) => (
                  <p key={keyCard.id}>
                    {" "}
                    - {keyCard.keyCard.name} assigned to{" "}
                    {keyCard.keyCard.user?.name}
                  </p>
                ))}
                {door.Key.map((key) => (
                  <p key={key.id}>
                    {" "}
                    - {key.name} - {key.user?.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// floor: formData.get('floor'),
//         type: formData.get('type'),
//         locationId: formData.get('locationId'),
