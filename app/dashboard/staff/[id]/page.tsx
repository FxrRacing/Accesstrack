import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { banAccess, grantAccess } from "../actions";
import { revokeAccess } from "../actions";
import { deleteStaff } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TEAM_OPTIONS } from "@/utils/constants";
import PermissionsProvider from "@/utils/providers/permissions";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-card";
import { Label } from "@/components/ui/label";
//import StaffDetails from "./staff-details";

import { serviceRoleClient } from "@/utils/supabase/admin";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeInfo,
  Calendar,
  Clock,
  KeyRound,
  Mail,
  Shield,
  UserIcon,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { TooltipProvider } from "@/components/ui/tooltip";

import { UserActionButtons } from "./user-action-buttons";
import { RoleSelector } from "./role-selector";
//import { FeatureAccessToggles } from "./feature-access-toggles"
import { AdminNotesEditor } from "./admin-notes-editor";
import { SaveChangesButton } from "./save-changes-buttons";
import { User } from "@supabase/supabase-js";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staffUser = await serviceRoleClient.auth.admin.getUserById(id);
  const staff = await prisma.userProfiles.findUnique({
    where: {
      id: id,
    },
  });
  if (!staffUser) {
    return notFound();
  }
  if (!staff) {
    return notFound();
  }

  const revokeAccessWithId = revokeAccess.bind(null, id);
  const grantAccessWithId = grantAccess.bind(null, id);
  const deleteStaffWithId = deleteStaff.bind(null, id);
  const banAccessWithId = banAccess.bind(null, id);
  const authUser = staffUser.data.user as User;
  async function RevokeUser() {
    //select a time frame to revoke the user for
    return (
      <Suspense fallback={<SkeletonCard />}>
        <Label>Select a time frame to revoke the user for</Label>
        <form action={banAccessWithId}>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Hour</SelectItem>
              <SelectItem value="2">2 Hours</SelectItem>
              <SelectItem value="3">3 Hours</SelectItem>
              <SelectItem value="4">4 Hours</SelectItem>
              <SelectItem value="5">5 Hours</SelectItem>
            </SelectContent>
          </Select>
          <button type="submit">Revoke Access</button>
        </form>
      </Suspense>
    );
  }

  const isActive = authUser.user_metadata?.is_active;
  const raw_user_meta_data = authUser.user_metadata as Record<string, string>;
  const displayName =
    raw_user_meta_data?.full_name || authUser.email || "Unknown User";

  const getInitials = () => {
    const fullName = raw_user_meta_data?.full_name;
    if (fullName) {
      return fullName
        .split(" ")
        .map((name: string) => name[0])
        .join("");
    }
    return authUser.email?.[0] || "U";
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex flex-row gap-4">
        <form action={revokeAccessWithId}>
          <Button type="submit">Revoke Access</Button>
        </form>
        <form action={grantAccessWithId}>
          <Button type="submit">Grant Access</Button>
        </form>
        <p>Role: {raw_user_meta_data?.role}</p>
        <form action={deleteStaffWithId}>
          <Button type="submit">Delete Staff</Button>
        </form>

        <PermissionsProvider requiredPermission="grant">
          <GrantRole />
        </PermissionsProvider>
        <form action={banAccessWithId}>
          <Button type="submit">Revoke/Ban Access</Button>
        </form>
        {/* <PermissionsProvider requiredPermission="view"> */}
        <RevokeUser />
        {/* </PermissionsProvider> */}
      </div>

      <div className="container mx-auto max-w-3xl py-8">
        {/* Sticky header with save button */}
        <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/staff"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to users</span>
              </Link>
              <h1 className="text-xl font-medium">Manage User</h1>

              {isActive ? (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-gray-200 bg-gray-50 text-gray-500"
                >
                  Access Revoked
                </Badge>
              )}
            </div>
            <SaveChangesButton userId={authUser.id} />
          </div>
        </div>

        {/* User profile summary */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-slate-400 to-slate-600 text-xl font-medium text-white">
            {getInitials()}
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-medium">{displayName} </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{authUser.email || "No email"}</span>
              </div>
              {authUser.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{authUser.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {formatDate(new Date(authUser.created_at))}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Last login{" "}
                  {formatDate(new Date(authUser.last_sign_in_at || ""))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex justify-center">
          <UserActionButtons
            userId={authUser.id}
            email={authUser.email || ""}
          />
        </div>

        <div className="space-y-8">
          {/* Role & Permissions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Role & Permissions</h2>
            </div>
            <Separator />
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-1">
                  User Role
                  <TooltipProvider>
                    <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipProvider>
                </Label>

                <RoleSelector
                  initialRole={authUser.user_metadata?.role}
                  userId={authUser.id}
                />
              </div>

              {/* <div className="space-y-3">
              <Label className="flex items-center gap-1">
                Feature Access
                <TooltipProvider>
                  <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipProvider>
              </Label>
              <FeatureAccessToggles userId={authUser.id} />
            </div> */}
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Admin Notes</h2>
            </div>
            <Separator />
            <div className="space-y-2 pt-2">
              <Label htmlFor="notes" className="flex items-center gap-1">
                Private Notes
                <TooltipProvider>
                  <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipProvider>
              </Label>
              <AdminNotesEditor
                userId={authUser.id}
                initialNotes={authUser.user_metadata?.admin_notes || ""}
              />
            </div>
          </section>

          {/* Account Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Account Details</h2>
            </div>
            <Separator />
            <div className="space-y-4 pt-2">
              <div className="rounded-md border bg-card p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      User ID
                    </p>
                    <p className="font-mono text-sm">{authUser.id}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Confirmed
                    </p>
                    <p className="text-sm">
                      {authUser.email_confirmed_at
                        ? formatDate(new Date(authUser.email_confirmed_at))
                        : "Not confirmed"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created At
                    </p>
                    <p className="text-sm">
                      {formatDate(new Date(authUser.created_at || ""))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="text-sm">
                      {formatDate(new Date(authUser.updated_at || ""))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Authentication
                    </p>
                    <p className="text-sm">
                      {authUser.app_metadata.provider || "Email/Password"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Logs */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Security Logs</h2>
            </div>
            <Separator />
            <div className="space-y-2 pt-2">
              <div className="rounded-md border bg-card p-4 shadow-sm">
                <h3 className="mb-3 font-medium">Recent Activity</h3>
                <div className="space-y-3">
                  {authUser.last_sign_in_at && (
                    <div className="flex items-start justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Last sign in</p>
                        <p className="text-sm text-muted-foreground">
                          User logged in to the system
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(authUser.last_sign_in_at || ""))}
                      </p>
                    </div>
                  )}
                  {authUser.email_confirmed_at && (
                    <div className="flex items-start justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Email confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          User confirmed their email address
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(
                          new Date(authUser.email_confirmed_at || "")
                        )}
                      </p>
                    </div>
                  )}
                  {authUser.created_at && (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Account created</p>
                        <p className="text-sm text-muted-foreground">
                          User account was created
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(authUser.created_at || ""))}
                      </p>
                    </div>
                  )}
                  {!authUser.last_sign_in_at &&
                    !authUser.email_confirmed_at &&
                    !authUser.created_at && (
                      <p className="text-sm text-muted-foreground">
                        No activity logs available
                      </p>
                    )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Separator />
      {/* <StaffDetails authUser={authUser.data.user as User} /> */}
      {/* 
            <h1 className="text-2xl font-bold">Staff Details</h1>
            <h1>staff details for {authUser.user_metadata?.full_name}</h1>
            <p>email: {authUser.email}</p>
            <p>phone: {authUser.user_metadata?.phone || "N/A"}</p>
==========
<p>auth user details </p>
<p>first name: {raw_user_meta_data?.first_name}</p>
<p>last name: {raw_user_meta_data?.last_name}</p>
<p>email: {authUser.email}</p>
<p>email confirmed at: {new Date(authUser.email_confirmed_at || "").toISOString() || "N/A"}</p>
<p>created at: {new Date(authUser.created_at || "").toISOString() || "N/A"}</p>
<p>updated at: {new Date(authUser.updated_at || "").toISOString() || "N/A"}</p>
-------
<p>last sign in at: {new Date(authUser.last_sign_in_at || "").toISOString()}</p>
<p>has access should be bool: {raw_user_meta_data?.is_active?.toString()}</p>
<p>is active: {raw_user_meta_data?.is_active ? 'true' : 'false'}</p> */}

      {/* json: <pre>{JSON.stringify(authUser, null, 2)}</pre> */}

      <div className="flex flex-row gap-4"></div>
    </div>
  );
}

async function GrantRole() {
  return (
    <>
      <form>
        <label htmlFor="role">Role</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {TEAM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button type="submit">Grant Role</button>
      </form>
    </>
  );
}

// const removeAssignedSoftwareWithIds = removeAssignedSoftware.bind(null, id, software.software.id);
//         const grantedBy= await findRealUser(software.grantedById);

//         return (
//           <div key={software.id}>
//             <Link href={`/dashboard/software/${software.software.id}`} prefetch={true}>
//               <h2>{`---> ${software.software.name}`}</h2>
//             </Link>
//             <p className="text-green-700">{software.software.description}</p>
//             <p className="text-green-700">Granted By: {grantedBy.email}</p>
//             <p className="text-green-700">Access Level: {software.accessLevel}</p>
//             <p className="text-green-700">Role: {software.role}</p>

//             <form action={removeAssignedSoftwareWithIds} className="flex flex-col gap-4">
//               <button type="submit">Remove</button>
//             </form>
//           </div>
