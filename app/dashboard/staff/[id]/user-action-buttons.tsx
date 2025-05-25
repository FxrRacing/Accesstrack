"use client"

import { useState } from "react"
import { Lock, KeyboardOffIcon as KeyOff, LogOut, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserActionButtonsProps {
  userId: string
  email: string
}

export function UserActionButtons({ userId, email }: UserActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleResetPassword = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to send a password reset email
      // await fetch(`/api/users/${userId}/reset-password`, { method: 'POST' })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Password reset email sent", {
        description: `The user ${email} will receive instructions to reset their password.`,
      })
    } catch (error) {
      toast.error(`Failed to send password reset email. ${error} ${userId}`, {
        description: "Please try again later. " + error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeAccess = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to revoke access
      // await fetch(`/api/users/${userId}/revoke-access`, { method: 'POST' })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Access revoked", {
        description: "The user's access has been revoked.",
      })
    } catch (error) {
      toast.error("Failed to revoke access.", {
        description: "Please try again later. " + error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOutAllSessions = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to sign out all sessions
      // await fetch(`/api/users/${userId}/sign-out-all`, { method: 'POST' })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("User signed out", {
        description: "The user has been signed out from all devices.",
      })
    } catch (error) {
      toast.error("Failed to sign out user from all devices.", {
        description: "Please try again later. " + error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to delete the user
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("User deleted", {
        description: "The user account has been permanently deleted.",
      })

      // Redirect to users list after successful deletion
      window.location.href = "/dashboard/staff"
    } catch (error) {
      toast.error("Failed to delete user account.", {
        description: "Please try again later. " + error,
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6 sm:gap-10">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          <Lock className="h-6 w-6 text-muted-foreground" />
        </Button>
        <span className="mt-2 text-center text-sm">Reset Password</span>
      </div>
      <div className="flex flex-col items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
              <KeyOff className="h-6 w-6 text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke user access?</AlertDialogTitle>
              <AlertDialogDescription>
                This will prevent the user from accessing the system until access is restored.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRevokeAccess}>Revoke Access</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span className="mt-2 text-center text-sm">Revoke Access</span>
      </div>
      <div className="flex flex-col items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
              <LogOut className="h-6 w-6 text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out from all devices?</AlertDialogTitle>
              <AlertDialogDescription>
                This will terminate all active sessions for this user. They will need to log in again on all devices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOutAllSessions}>Sign Out All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span className="mt-2 text-center text-sm">Sign Out All</span>
      </div>
      <div className="flex flex-col items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
              <Trash className="h-6 w-6 text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and remove all associated
                data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span className="mt-2 text-center text-sm">Delete</span>
      </div>
    </div>
  )
}
