import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AddSharedAccountForm from "../add-shared-account-form"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { removeUserFromSharedAccount } from "@/actions/user_actions"

export default async function SharedAccounts({id, authId}: {id: string, authId: string}) {
   const sharedAccounts = await prisma.sharedAccountUser.findMany({
    where: {
        userId: id
    },
    include: {
        sharedAccount: true,
        createdBy: true
    }
   })
   
   const assignedSharedAccounts = sharedAccounts.map((sharedAccount) => sharedAccount.sharedAccountId)
   const availableSharedAccounts = await prisma.sharedAccount.findMany({
    where: {
        id: {
            notIn: assignedSharedAccounts
        }
    }
   })
    return <div className="space-y-6">
<div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 border border-orange-200 hover-scale transition-transform duration-300">
                        <Mail className="h-4 w-4 text-orange-600" /> 
                      </div>
                      Shared Email Accounts
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Email accounts this employee has access to</p>
                  </div>
                  
                </div>

                
                  <Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-3">
                    <Table className="px-2">
                      <TableHeader>
                        <TableRow className="bg-orange-50 hover:bg-orange-50 border-b border-orange-200">
                          <TableHead className="font-semibold text-neutral-900 py-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-orange-100 border border-orange-200 hover-scale transition-transform duration-300">
                                <Mail className="h-3.5 w-3.5 text-orange-600" />
                              </div>
                              Account Name
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Email</TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Type</TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Granted By</TableHead>

                          <TableHead className="font-semibold text-neutral-900 py-3">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sharedAccounts.map((item, index) => {

                          const removeUserFromSharedAccountWithIds = removeUserFromSharedAccount.bind(null, id, item.sharedAccount.id, authId);
                            return (
                                <TableRow
                            key={index}
                            className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                          >
                            <TableCell className="font-medium py-3 text-sm">
                                <Link href={`/dashboard/shared-accounts/${item.sharedAccount.id}`}>
                                    {item.sharedAccount.name}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium py-3 text-sm">{item.sharedAccount.email}</TableCell>
                            <TableCell className="py-3 text-sm text-neutral-600">{item.sharedAccount.type}</TableCell>
                            <TableCell className="py-3 text-sm text-neutral-600">{item.createdBy.fullName}</TableCell>
                            
                           
                            <TableCell className="py-3 text-sm text-neutral-600">
                                <form action={removeUserFromSharedAccountWithIds}>
                                    <Button variant="outline" size="sm" className="cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </form>
                            </TableCell>
                          </TableRow>
                            )
                            
                        })
                        }
                      </TableBody>
                    </Table>
                  </Card>
               

        
   

      
       <Separator className="my-4" />
   
    <AddSharedAccountForm id={id} availableSharedAccounts={availableSharedAccounts} authId={authId} />
    </div>
}