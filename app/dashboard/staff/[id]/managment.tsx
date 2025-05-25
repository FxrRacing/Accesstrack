import Link from "next/link"
import { ArrowLeft, BadgeInfo, Calendar, Clock, KeyRound, Mail, Shield, UserIcon, Phone } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { TooltipProvider } from "@/components/ui/tooltip"

import { UserActionButtons } from "./user-action-buttons"
import { RoleSelector } from "./role-selector"
import { FeatureAccessToggles } from "./feature-access-toggles"
import { AdminNotesEditor } from "./admin-notes-editor"
import { SaveChangesButton } from "./save-changes-buttons"

// Define the type for the authUser prop based on your data structure
import { type User } from "@supabase/supabase-js"

interface StaffDetailsProps {
  authUser: User // Or create a specific type that matches your Prisma users table
}

export default function UserManagement({ authUser }: StaffDetailsProps) {
  const isActive = !authUser.is_anonymous
  const raw_user_meta_data = authUser.user_metadata as Record<string, string>
  const displayName = raw_user_meta_data?.full_name || authUser.email || "Unknown User"
  const userRole = authUser.user_metadata?.role || "user"

  const getInitials = () => {
    const fullName = raw_user_meta_data?.full_name
    if (fullName) {
      return fullName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
    }
    return authUser.email?.[0] || "U"
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
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
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-500">
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
              <span>Last login {formatDate(new Date(authUser.last_sign_in_at || ""))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex justify-center">
        <UserActionButtons userId={authUser.id} email={authUser.email || ""} />
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

              <RoleSelector initialRole={userRole} userId={authUser.id} />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-1">
                Feature Access
                <TooltipProvider>
                  <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipProvider>
              </Label>
              <FeatureAccessToggles userId={authUser.id} />
            </div>
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
            <AdminNotesEditor userId={authUser.id} initialNotes={authUser.user_metadata?.admin_notes || ""} />
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
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{authUser.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Confirmed</p>
                  <p className="text-sm">
                    {authUser.email_confirmed_at ? formatDate(new Date(authUser.email_confirmed_at)) : "Not confirmed"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">{formatDate(new Date(authUser.created_at || ""))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(new Date(authUser.updated_at || ""))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Authentication</p>
                  <p className="text-sm">{authUser.app_metadata.provider || "Email/Password"}</p>
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
                      <p className="text-sm text-muted-foreground">User logged in to the system</p>
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
                      <p className="text-sm text-muted-foreground">User confirmed their email address</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(authUser.email_confirmed_at || ""))}
                    </p>
                  </div>
                )}
                {authUser.created_at && (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Account created</p>
                      <p className="text-sm text-muted-foreground">User account was created</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(new Date(authUser.created_at || ""))}</p>
                  </div>
                )}
                {!authUser.last_sign_in_at && !authUser.email_confirmed_at && !authUser.created_at && (
                  <p className="text-sm text-muted-foreground">No activity logs available</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
