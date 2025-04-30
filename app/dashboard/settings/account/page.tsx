import { Separator } from "@/components/ui/separator"
import { createClient } from "@/utils/supabase/server"

import { redirect } from "next/navigation"
import { AccountForm } from "./account-form"
import { prisma } from "@/lib/prisma"



export default async function SettingsAccountPage() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }const userProfile = await prisma.userProfiles.findUnique({
    where: { id: data.user.id },
  });

  if (!userProfile) {
    // Handle case where user profile doesn't exist
    return <div>User profile not found</div>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
   
      <Separator />
      <AccountForm user={{...userProfile, email: data.user.email || ""}} />
    </div>
  )
}