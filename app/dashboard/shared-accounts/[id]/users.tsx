import { prisma } from "@/lib/prisma"
import AddUserForm from "./add-user-form"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { UnassignButton } from "./unassign-user-form"
import Link from "next/link"


export default async function Users({id, authId}: {id: string, authId: string}) {
    const currentUsers = await prisma.sharedAccountUser.findMany({
        where: {
            sharedAccountId: id
        },
        include: {
            user: true,
            createdBy: true
        },
        orderBy: {
            user: {
                name: 'asc'
            }
        }
    })
    const currentUsersIds = currentUsers.map((user) => user.user.id)
    const availableUsers = await prisma.user.findMany({
        where: {
            id: {
                notIn: currentUsersIds
            }
        }
    })

    return (
        <div className=" ">
            <div className="flex items-center justify-end">
              <AddUserForm id={id} availableUsers={availableUsers} authId={authId} />
            </div>
            
            <Table>
                <TableCaption>A list of users assigned to this shared account.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Granted By</TableHead>
                        <TableHead className="text-right">Assigned At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell className="font-medium">
                                <Link href={`/dashboard/users/${user.user.id}`} className="w-full hover:underline" prefetch={true}>
                                    {user.user.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/users/${user.user.id}`} className="w-full" prefetch={true}>
                                    {user.user.email}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/users/${user.user.id}`} className="w-full hover:underline" prefetch={true}>
                                    {user.createdBy.email}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/users/${user.user.id}`} className="w-full hover:underline" prefetch={true}>
                                    {user.assignedAt.toLocaleDateString()}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">
                                <UnassignButton user={user.user} sharedAccountId={id} authId={authId} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          
        </div>
    )
}