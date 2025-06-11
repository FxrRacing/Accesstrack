// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import {
//   ArrowLeft,
//   BadgeInfo,
//   Calendar,
//   Clock,
//   KeyRound,
//   Mail,
//   Save,
//   Shield,
//   User as UserIcon,
//   KeyboardOffIcon as KeyOff,
//   LogOut,
//   Trash,
//   Lock,
//   Phone,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "sonner"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Badge } from "@/components/ui/badge"
// import { User } from "@supabase/supabase-js"
// import BanAccessDialog from "./ban-access"


// // Define the type for the authUser prop based on your data structure

// interface StaffDetailsProps {
//   authUser: User; // Or create a specific type that matches your Prisma users table
// }

// export default function UserManagementClient({ authUser }: StaffDetailsProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const [userRole, setUserRole] = useState(authUser.user_metadata?.role || "user")
//   const [isActive, setIsActive] = useState(!authUser.is_anonymous)
//   const [adminNotes, setAdminNotes] = useState("")

//   const handleResetPassword = async () => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would call your API to send a password reset email
//       // await fetch(`/api/users/${authUser.id}/reset-password`, { method: 'POST' })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("Password reset email sent", {
//         description: "The user will receive instructions to reset their password.",
//       })
//     } catch (error) {
//       toast.error("Failed to send password reset email.", {
//         description: "Please try again later. " + error,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRevokeAccess = async () => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would call your API to revoke access
//       // await fetch(`/api/users/${authUser.id}/revoke-access`, { method: 'POST' })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       setIsActive(false)
//       toast.success("Access revoked", {
//         description: "The user's access has been revoked.",
//       })
//     } catch (error) {
//       toast.error("Failed to revoke access.", {
//         description: "Please try again later. " + error,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSignOutAllSessions = async () => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would call your API to sign out all sessions
//       // await fetch(`/api/users/${authUser.id}/sign-out-all`, { method: 'POST' })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("User signed out", {
//         description: "The user has been signed out from all devices.",
//       })
//     } catch (error) {
//       toast.error("Failed to sign out user from all devices.", {
//         description: "Please try again later. " + error,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would call your API to delete the user
//       // await fetch(`/api/users/${authUser.id}`, { method: 'DELETE' })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("User deleted", {
//         description: "The user account has been permanently deleted.",
//       })

//       // Redirect to users list after successful deletion
//       window.location.href = "/dashboard/staff"
//     } catch (error) {
//       toast.error("Failed to delete user account.", {
//         description: "Please try again later. " + error,
//       })
//       setIsLoading(false)
//     }
//   }

//   const handleSaveChanges = async () => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would call your API to update the user
//       // await fetch(`/api/users/${authUser.id}`, {
//       //   method: 'PATCH',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ role: userRole, notes: adminNotes }),
//       // })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("User updated successfully", {
//         description: "The user details have been updated.",
//       })
//     } catch (error) {
//       toast.error("Failed to update user details.",         {
//         description: "Please try again later. " + error,
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatDate = (date: Date | null | undefined) => {
//     if (!date) return "N/A"
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const raw_user_meta_data = authUser.user_metadata as Record<string, string>;
//   const displayName = raw_user_meta_data?.full_name || authUser.email || "Unknown User";

//   const getInitials = () => {
//     const fullName = raw_user_meta_data?.full_name;
//     if (fullName) {
//       return fullName
//         .split(" ")
//         .map((name: string) => name[0])
//         .join("");
//     }
//     return authUser.email?.[0] || "U";
//   }

//   return (
//     <div className="container mx-auto max-w-3xl py-8">
//       {/* Sticky header with save button */}
//       <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link href="/dashboard/staff" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
//               <ArrowLeft className="h-4 w-4" />
//               <span className="sr-only">Back to users</span>
//             </Link>
//             <h1 className="text-xl font-medium">Manage User</h1>
            
//             {isActive ? (
//               <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
//                 Active
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-500">
//                 Access Revoked
//               </Badge>
//             )}
//           </div>
//           <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-1.5">
//             <Save className="h-4 w-4" />
//             {isLoading ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>
//       </div>

//       {/* User profile summary */}
//       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
//         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-slate-400 to-slate-600 text-xl font-medium text-white">
//           {getInitials()}
//         </div>
//         <div className="flex-1 space-y-1">
//           <h2 className="text-xl font-medium">{displayName}</h2>
//           <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Mail className="h-3.5 w-3.5" />
//               <span>{authUser.email || "No email"}</span>
//             </div>
//             {authUser.phone && (
//               <div className="flex items-center gap-1">
//                 <Phone className="h-3.5 w-3.5" />
//                 <span>{authUser.phone}</span>
//               </div>
//             )}
//             <div className="flex items-center gap-1">
//               <Calendar className="h-3.5 w-3.5" />
//               <span>Joined {formatDate(new Date(authUser.created_at))}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Clock className="h-3.5 w-3.5" />
//               <span>Last login {formatDate(new Date(authUser.last_sign_in_at || ""))}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="mb-8 flex justify-center">
//         <div className="grid grid-cols-4 gap-6 sm:gap-10">
//           <div className="flex flex-col items-center">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-12 w-12 rounded-full"
//               onClick={handleResetPassword}
//               disabled={isLoading}
//             >
//               <Lock className="h-6 w-6 text-muted-foreground" />
//             </Button>
//             <span className="mt-2 text-center text-sm">Reset Password</span>
//           </div>
          
//           <div className="flex flex-col items-center">
           
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
//                   <KeyOff className="h-6 w-6 text-muted-foreground" />
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Revoke user access?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This will prevent the user from accessing the system until access is restored.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction onClick={handleRevokeAccess}>Revoke Access</AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//             <span className="mt-2 text-center text-sm">Revoke Access</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
//                   <LogOut className="h-6 w-6 text-muted-foreground" />
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Sign out from all devices?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This will terminate all active sessions for this user. They will need to log in again on all
//                     devices.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction onClick={handleSignOutAllSessions}>Sign Out All</AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//             <span className="mt-2 text-center text-sm">Sign Out All</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
//                   <Trash className="h-6 w-6 text-muted-foreground" />
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This action cannot be undone. This will permanently delete the user account and remove all
//                     associated data from our servers.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleDeleteUser}
//                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                   >
//                     Delete Account
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//             <span className="mt-2 text-center text-sm">Delete</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8">
//         {/* Role & Permissions */}
//         <section className="space-y-4">
//           <div className="flex items-center gap-2">
//             <Shield className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-medium">Role & Permissions</h2>
//           </div>
//           <Separator />
//           <div className="space-y-6 pt-2">
//             <div className="space-y-2">
//               <Label htmlFor="role" className="flex items-center gap-1">
//                 User Role
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>The role determines what permissions the user has</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </Label>
             
//               <Select value={userRole} onValueChange={setUserRole}>
//                 <SelectTrigger id="role" className="w-full sm:w-1/3">
//                   <SelectValue placeholder="Select a role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="admin">Admin</SelectItem>
//                   <SelectItem value="manager">Manager</SelectItem>
//                   <SelectItem value="editor">Editor</SelectItem>
//                   <SelectItem value="user">User</SelectItem>
//                 </SelectContent>
//               </Select>
//               <p className="text-sm text-muted-foreground">
//                 {userRole === "admin" && "Full access to all system features and settings"}
//                 {userRole === "manager" && "Can manage users and content but cannot modify system settings"}
//                 {userRole === "editor" && "Can create and edit content but cannot manage users"}
//                 {userRole === "user" && "Basic access to use the application features"}
//               </p>
//             </div>

//             <div className="space-y-3">
//               <Label className="flex items-center gap-1">
//                 Feature Access
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Toggle specific features this user can access</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </Label>
//               <div className="grid gap-3 sm:grid-cols-2">
//                 {[
//                   "Analytics Dashboard",
//                   "User Management",
//                   "Billing Management",
//                   "API Access",
//                   "Report Generation",
//                 ].map((feature) => (
//                   <div
//                     key={feature}
//                     className="flex items-center justify-between rounded-md border bg-card p-3 shadow-sm"
//                   >
//                     <span>{feature}</span>
//                     <Switch defaultChecked={["Analytics Dashboard", "Report Generation"].includes(feature)} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Notes */}
//         <section className="space-y-4">
//           <div className="flex items-center gap-2">
//             <UserIcon className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-medium">Admin Notes</h2>
//           </div>
//           <Separator />
//           <div className="space-y-2 pt-2">
//             <Label htmlFor="notes" className="flex items-center gap-1">
//               Private Notes
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Private notes only visible to administrators</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </Label>
//             <Textarea
//               id="notes"
//               placeholder="Add private notes about this user (only visible to admins)"
//               className="h-20 resize-none"
//               value={adminNotes}
//               onChange={(e) => setAdminNotes(e.target.value)}
//             />
//           </div>
//         </section>

//         {/* Account Details */}
//         <section className="space-y-4">
//           <div className="flex items-center gap-2">
//             <KeyRound className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-medium">Account Details</h2>
//           </div>
//           <Separator />
//           <div className="space-y-4 pt-2">
//             <div className="rounded-md border bg-card p-4 shadow-sm">
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">User ID</p>
//                   <p className="font-mono text-sm">{authUser.id}</p>
//                 </div>
               
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Email Confirmed</p>
//                   <p className="text-sm">
//                     {authUser.email_confirmed_at ? formatDate(new Date(authUser.email_confirmed_at)) : "Not confirmed"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Created At</p>
//                   <p className="text-sm">{formatDate(new Date(authUser.created_at || ""))}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
//                   <p className="text-sm">{formatDate(new Date(authUser.updated_at || ""))}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Authentication</p>
//                   <p className="text-sm">{authUser.app_metadata.provider || "Email/Password"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Security Logs */}
//         <section className="space-y-4">
//           <div className="flex items-center gap-2">
//             <Clock className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-medium">Security Logs</h2>
//           </div>
//           <Separator />
//           <div className="space-y-2 pt-2">
//             <div className="rounded-md border bg-card p-4 shadow-sm">
//               <h3 className="mb-3 font-medium">Recent Activity</h3>
//               <div className="space-y-3">
//                 {authUser.last_sign_in_at && (
//                   <div className="flex items-start justify-between border-b pb-2">
//                     <div>
//                       <p className="font-medium">Last sign in</p>
//                       <p className="text-sm text-muted-foreground">User logged in to the system</p>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{formatDate(new Date(authUser.last_sign_in_at || ""))}</p>
//                   </div>
//                 )}
//                 {authUser.email_confirmed_at && (
//                   <div className="flex items-start justify-between border-b pb-2">
//                     <div>
//                       <p className="font-medium">Email confirmed</p>
//                       <p className="text-sm text-muted-foreground">User confirmed their email address</p>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{formatDate(new Date(authUser.email_confirmed_at || ""))}</p>
//                   </div>
//                 )}
//                 {authUser.created_at && (
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="font-medium">Account created</p>
//                       <p className="text-sm text-muted-foreground">User account was created</p>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{formatDate(new Date(authUser.created_at || ""))}</p>
//                   </div>
//                 )}
//                 {!authUser.last_sign_in_at && !authUser.email_confirmed_at && !authUser.created_at && (
//                   <p className="text-sm text-muted-foreground">No activity logs available</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }
