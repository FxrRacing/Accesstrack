import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import { Drawer } from "./drawer";


import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

import UserManagement from "@/components/access-list";
import AssignForm from "./assign-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Suspense } from "react";

import { CalendarClock, Globe, Info, Plus, Settings, Shield, Tag, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatusTypes } from "@/types/types";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "date-fns";

import OwnerProfile, { SoftwareWithTeamOwner } from "./owner-profile";
import { BillingTab } from "./tabs/billing";
import Overview from "./tabs/overview";
import { columns, SharedAccountSoftwareWithRelations } from "./components/shared-accounts-table/columns";
import { DataTable } from "./components/shared-accounts-table/data-table";

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
  const software = await prisma.software.findUnique({
    where: {
      id: id,
    },
    include: {
      teamOwner: true,
    },
  });
  if (!software) {
    return notFound();
  }
  
  let editedBy;
  if (software.updatedById) {
    editedBy = await prisma.user.findUnique({
      where: {
        id: software.updatedById,
      },
    });
  }
  const users = await prisma.userSoftware.findMany({
    where: {
      softwareId: id,
    },
    include: {
      user: true,
      grantedBy: true,
      software: true,
    },
  });
  const assignedUsers = users.map((user) => ({
    id: user.user.id,
  }));
  const assignedUsersIds = assignedUsers.map((user) => user.id);
  const availableUsers = await prisma.user.findMany({
    where: {
      id: {
        notIn: assignedUsersIds,
      },
    },
  });
  //return the page with the software details

  const sharedAccounts = await prisma.sharedAccountSoftware.findMany({
    where: {
      softwareId: id,
    },
    include: {
      sharedAccount: true,
      createdBy: true,
     
    },
  });

  return (
    <>
      <div className="container mx-auto py-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <Suspense fallback={<div>Loading Image...</div>}>
              <Avatar className="rounded-sm w-10 h-10">
                <AvatarImage src={software.iconUrl || ""} />
                <AvatarFallback>{software.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Suspense>
            <div>
              <h1 className="text-2xl font-bold">{software.name}</h1>
              <p className="text-muted-foreground">{software.description}</p>
            </div>
            <StatusBadge status={software.status as StatusTypes} />
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              {software.category}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <OwnerProfile software={software as SoftwareWithTeamOwner} />
            
            <Drawer software={software} />
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4 " />
              Configure
            </Button>
           
           
          </div>
        </div>

        <Tabs defaultValue="overview" className="">
          <TabsList className="w-full rounded-full">
            <TabsTrigger value="overview" className="rounded-full">
              Overview
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-full">
              Billing
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-full">
              Users
            </TabsTrigger>
            <TabsTrigger value="shared-accounts" className="rounded-full">
              Shared Accounts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview software={software} />
            <Card className=" border shadow-sm md:col-span-2 ">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium ">Overview</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2  hover:bg-slate-50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-1 text-muted-foreground">Category</p>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1.5" />
                        <p className="font-medium text-slate-700">{software.category}</p>
                      </div>
                      </Badge>
                      
                    </div>

                    <div>
                      <p className="mb-1 text-muted-foreground">License Type</p>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4  mr-1.5" />
                        <p className="font-medium ">{software.licenseType || "Not specified"}</p>
                      </div>
                    </div>

                    <div>
                      <p className=" mb-1">Website</p>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-slate-400 mr-1.5" />
                        <a
                          href={`https://${software.website || "#"}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {software.website}
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className=" mb-1">Account Representative</p>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-slate-400 mr-1.5" />
                        <p className="font-medium ">{software.accountRep || "Not assigned"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1">Added On</p>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 text-slate-400 mr-1.5" />
                        <p className="font-medium ">{formatDate(software.createdAt, "MM/dd/yyyy")}</p>
                      </div>
                    </div>

                    <div>
                      <p className=" mb-1">Last Updated</p>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 text-slate-400 mr-1.5" />
                        <p className="font-medium text-slate-700">{formatDate( software.createdAt, "MM/dd/yyyy")}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <p className=" mb-2 text-sm">Notes</p>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm text-slate-700">
                      {software.notes || "No notes available."}
                    </div>
                  </div>
                </CardContent>
              </Card>

            {editedBy && <p>Edited By: {editedBy.name}</p>}
          </TabsContent>
          <TabsContent value="billing">
            <BillingTab software={software} />

            <Card className=" border shadow-sm md:col-span-2 ">
            <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium ">Billing</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2  hover:bg-slate-50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              <CardContent>
               
                <p>Amount: {software.amount}</p>
                <p>
                  Payment Due Date: {software.paymentDueDate?.toLocaleDateString()}
                </p>
                <p> License Type: {software.licenseType}</p>
                <p> Currency: {software.currency}</p>
              </CardContent>
            </Card>
           
          </TabsContent>
          <TabsContent value="users">
          <Card className="border shadow-sm md:col-span-2">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Users</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage software users
              </p>
            </div>
          </div>
          <Suspense fallback={<div>Loading Users...</div>}>
              {/* Assign software */}
            
              {availableUsers.length > 0 ? (
                <AssignForm
                  id={id}
                  availableUsers={availableUsers}
                  authId={data.user.id}
                  trigger={<Button variant="outline" size="sm"> <Plus className="h-4 w-4 mr-2" />Add Users</Button>}
                />
              ) : (
                <p>There are no available users to assign to this software</p>
              )}
              </Suspense>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
            <Suspense fallback={<div>Loading Users...</div>}>
              {/* Assign software */}
             
              
              <UserManagement users={users} />
            
              
            </Suspense>
            </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shared-accounts">
           
            <Card className="border shadow-sm md:col-span-2">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Shared Accounts</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage shared accounts
              </p>
            </div>
          </div>
          <Suspense fallback={<div>Loading Users...</div>}>
              {/* Assign software */}
            <p>Shared Accounts</p>
            
              </Suspense>
        </div>
      </CardHeader>
      <CardContent>
              <Suspense fallback={<div>Loading Shared Accounts...</div>}>
              <DataTable columns={columns} data={sharedAccounts as unknown as SharedAccountSoftwareWithRelations[]} />


             
             


              
                
              
            </Suspense>
              </CardContent>
            </Card>
           
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
