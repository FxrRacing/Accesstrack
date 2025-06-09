
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import History from "./history";


import { notFound, redirect } from "next/navigation";
import Users from "./users";
import { User } from "@supabase/supabase-js";

import { Suspense } from "react";


import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusTypes } from "@/types/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { retrieveLogo } from "@/utils/image-service";
import EditableOverview from "./editable-overview";

import { CardTitle } from "@/components/ui/card";
import { BadgeCheck, Calendar, Info, Mail, MapPin,  } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Card } from "@/components/ui/card";

import { CardContent } from "@/components/ui/card";
import PermissionsProvider from "@/utils/providers/permissions";
import SoftwareTab from "./tabs/software";



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
  const sharedAccount = await prisma.sharedAccount.findUnique({
    where: {
      id: id,
    },
  });
  if (!sharedAccount) {
    return notFound();
  }
  const locations = await prisma.location.findMany(
    {
      orderBy: {
        name: "asc",
      },
    }
  )
  
 

 
  const iconUrl = await retrieveLogo(sharedAccount?.type || "");

  return (
    <>
      <div className="container mx-auto py-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <Suspense fallback={<div>Loading Image...</div>}>
              <Avatar className="rounded-sm w-10 h-10 bg-muted-foreground">
                <AvatarImage src={iconUrl || ""} />
                <AvatarFallback className="rounded-sm bg-muted-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </Suspense>
            <div>
              <h1 className="text-2xl font-bold">{sharedAccount.name}</h1>
              <p className="text-muted-foreground">{sharedAccount.email}</p>
            </div>
            <StatusBadge status={sharedAccount.status as StatusTypes} />
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              {sharedAccount.type}
            </Badge>
          </div>

          <div className="flex gap-2">
            <History id={id} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="">
          <TabsList className="w-full rounded-full">
            <TabsTrigger value="overview" className="rounded-full">
              Overview
            </TabsTrigger>

            <TabsTrigger value="users" className="rounded-full">
              Users
            </TabsTrigger>
            <TabsTrigger value="software" className="rounded-full">
              Software
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className=" border shadow-sm md:col-span-2 ">
<PermissionsProvider requiredPermission="edit" 
replaceWith={
<>
  <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Overview
                  </CardTitle>
                  
                </div>
              </CardHeader>
              <CardContent className="pt-0">
               
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
              </CardContent>
  </>}>
              <EditableOverview sharedAccount={sharedAccount} authUser={data.user as  User} locations={locations} /> 
              </PermissionsProvider>

              
            </Card>
          </TabsContent>

          <TabsContent value="software">
            <Card className=" border shadow-sm md:col-span-2 ">
            <SoftwareTab sharedAccount={sharedAccount} data={data} />
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card className=" border shadow-sm md:col-span-2 ">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium ">Users</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Users id={id} authId={data.user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
    </>
  );
}
