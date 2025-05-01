import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { UserIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"

import Link from "next/link"

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