"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SaveChangesButtonProps {
  userId: string
}

export function SaveChangesButton({ userId }: SaveChangesButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to update the user
      // await fetch(`/api/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ /* collect data from global state */ }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("User updated successfully", {
        description: `The user details have been updated. ${userId}`,
      })
    } catch (error) {
      toast.error(`Failed to update user details. ${error} ${userId}`, {
        description: "Please try again later. " + error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-1.5">
      <Save className="h-4 w-4" />
      {isLoading ? "Saving..." : "Save Changes"}
    </Button>
  )
}
