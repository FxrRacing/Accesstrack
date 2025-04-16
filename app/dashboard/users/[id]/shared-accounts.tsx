import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AddSharedAccountForm from "./add-shared-account-form"

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
    return <div>
        <h1>Shared Accounts</h1>
        =================
        {sharedAccounts.map((sharedAccount) => {
            return (
                <div key={sharedAccount.id}>
            <Link  href={`/dashboard/shared-accounts/${sharedAccount.sharedAccountId}`}>
                <p>{sharedAccount.sharedAccount.name}</p>
                <p>{sharedAccount.sharedAccount.email}</p>
                 <p>{sharedAccount.createdBy.email}</p>
               
            </Link>
            
                </div>

          
        )
    })}
    =================
    <AddSharedAccountForm id={id} availableSharedAccounts={availableSharedAccounts} authId={authId} />
    </div>
}