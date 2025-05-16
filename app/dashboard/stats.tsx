import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card"
import { Calendar, Mail, MessageSquare, MoreHorizontal, UserIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"

import { format } from "date-fns"
import Link from "next/link"

import { AvatarFallback } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/ui/status-badge"
import { StatusTypes } from "@/types/types"
export async function OffboardingSoon(){
  const users = await prisma.user.findMany({
    where: {
      offboardingDate: {
        lte: new Date(new Date().setDate(new Date().getDate() + 14)),
        gte: new Date()
      }
    }
  })
  return<>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Offboarding Soon</CardTitle>
      <CardDescription>People leaving your organization soon</CardDescription>
      <UserIcon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="grid gap-6">
        {users.map((user) => (
          <div key={user.id}>
            {user.name}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  </>
}

export async function OnboardingSoon(){
  const users = await prisma.user.findMany({
    where: {
      onboardingDate: {
        lte: new Date(new Date().setDate(new Date().getDate() + 14)),
        gte: new Date()
      }
    },
    include: {
      Department: true
    }
  })
  return<>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex flex-col">
      <CardTitle className="text-lg font-medium">Onboarding Soon</CardTitle>
      <CardDescription>People joining your organization soon</CardDescription>
      </div>
      <UserIcon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex flex-row justify-between pb-2">
     
     <div></div>
     <Link href="/dashboard/users" className="text-sm text-muted-foreground">View All</Link>
     </div>
    
     <div className="grid gap-6" >
{users.map((user) => (
  
  <div key={user.id} className="flex items-center justify-between p-3 hover:transform-border hover:border rounded-lg">
  <div className="flex items-center gap-3">
    <Avatar>
     
      <AvatarFallback>
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium">{user.name}</div>
      <div className="text-sm text-muted-foreground">
        {user.jobTitle} • {user.department}
      </div>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
      <Calendar className="h-4 w-4" />
      <span>Starts {format(user.onboardingDate || new Date(), "MMM d, yyyy")}</span>
    </div>

    <StatusBadge status={user.status as StatusTypes} />

    <div className="flex gap-2">
      <Button variant="ghost" size="icon" title="Send email">
        <Mail className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" title="Send message">
        <MessageSquare className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.status === "pending" ? (
            <DropdownMenuItem onClick={() => console.log("start onboarding "+user.id)}>
              Start onboarding
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => console.log("mark as pending "+user.id)}>
              Mark as pending
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => console.log("remove "+user.id)} className="text-destructive">
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>

))}
</div>
    
    </CardContent>
  </Card>
  </>
}



export async function UsersStats(){
    const users = await prisma.user.count()
    return<>
    <Link href="/dashboard/users">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users}</div>
          </CardContent>
        </Card>
      </Link>
    </>
}

export async function SoftwareStats(){
    const software = await prisma.software.count()
    return<>
    <Link href="/dashboard/software">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Software</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{software}</div>
          </CardContent>
        </Card>
      </Link>
    </>
}

export async function SharedAccountsStats(){
    const sharedAccounts = await prisma.sharedAccount.count()
    return<>
    <Link href="/dashboard/shared-accounts">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shared Accounts</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedAccounts}</div>
          </CardContent>
        </Card>
      </Link>
    </>
}