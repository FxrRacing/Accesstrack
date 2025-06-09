import { assignSoftware } from "@/actions/sharedAccount_actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import History from "./history";
import Link from "next/link";

import { notFound, redirect } from "next/navigation";
import Users from "./users";
import DeleteButton from "./delete-button";
import { Suspense } from "react";
import UnassignSoftwareButton from "./unassign-software-button";
import PermissionsProvider from "@/utils/providers/permissions";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusTypes } from "@/types/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { retrieveLogo } from "@/utils/image-service";

import { CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

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
  const alreadyAssignedSoftware = await prisma.sharedAccountSoftware.findMany({
    where: {
      sharedAccountId: sharedAccount.id,
    },
    include: {
      software: true,
    },
  });
  const alreadyAssignedSoftwareIds = alreadyAssignedSoftware.map(
    (s) => s.softwareId
  );

  const availableSoftware = await prisma.software.findMany({
    where: {
      id: {
        notIn: alreadyAssignedSoftwareIds,
      },
    },
  });
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
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium ">
                    Overview
                  </CardTitle>
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-1 text-muted-foreground">Name</p>
                    <p className="text-sm">{sharedAccount.name}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Email <Mail className="w-4 h-4" />
                    </p>
                    <p className="text-sm">{sharedAccount.email}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Type{" "}
                    </p>
                    <p className="text-sm">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {sharedAccount.type}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Location <MapPin className="w-4 h-4" />
                    </p>
                    <p className="text-sm">{sharedAccount.location}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Created At <Calendar className="w-4 h-4" />
                    </p>
                    <p className="text-sm">
                      {sharedAccount.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground flex items-center gap-1">
                      Last Updated <Calendar className="w-4 h-4" />
                    </p>
                    <p className="text-sm">
                      {sharedAccount.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="software">
            <Card className=" border shadow-sm md:col-span-2 ">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium ">
                    Software
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-4 p-3">
                  <h1 className="text-xl font-bold">Software</h1>
                  <div className="flex flex-col gap-4">
                    {alreadyAssignedSoftware.map((software) => (
                      <div key={software.id}>
                        <Link
                          href={`/dashboard/software/${software.softwareId}`}
                          prefetch={true}
                        >
                          {software.software.name}
                        </Link>
                        <p>{software.accessLevel}</p>
                        <p>{software.role}</p>
                        <UnassignSoftwareButton
                          id={software.id}
                          sharedAccountId={sharedAccount.id}
                          authId={data.user.id}
                          softwareId={software.softwareId}
                        />
                      </div>
                    ))}
                    {availableSoftware.length === 0 && (
                      <p>
                        There are no available software to assign to this shared
                        account
                      </p>
                    )}
                  </div>
                  <br />
                  =================
                  <p className="text-xl font-bold">Assign Software</p>
                  =================
                  <form action={assignSoftware} className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="sharedAccountId"
                      readOnly
                      value={sharedAccount.id}
                      hidden
                    />
                    <label>Software</label>
                    <select name="softwareId">
                      {availableSoftware.map((software) => (
                        <option key={software.id} value={software.id}>
                          {software.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="grantedById"
                      readOnly
                      value={data.user.id}
                      hidden
                    />
                    <label>Access Level</label>
                    <input
                      type="text"
                      name="accessLevel"
                      defaultValue="admin"
                    />
                    <label>Role</label>
                    <input type="text" name="role" defaultValue="admin" />
                    <button type="submit">Assign</button>
                  </form>
                </div>
              </CardContent>
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
      <div className="flex flex-col gap-4 p-3">
        <PermissionsProvider requiredPermission="delete" replaceWith={<p></p>}>
          <Suspense fallback={<div>Loading Delete Button...</div>}>
            <DeleteButton id={id} />
          </Suspense>
        </PermissionsProvider>

        <h1>Shared Account: {id}</h1>
        <p>Name: {sharedAccount.name}</p>
        <p>Email: {sharedAccount.email}</p>
        <p>Location: {sharedAccount.location}</p>

        <p>Type: {sharedAccount.type}</p>
        <p>Status: {sharedAccount.status}</p>
        <p>Created At: {sharedAccount.createdAt.toLocaleDateString()}</p>
        <p>Updated At: {sharedAccount.updatedAt.toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col gap-4 p-3">
        <h1>Users</h1>
      </div>
      <br />
      ===============
    </>
  );
}
