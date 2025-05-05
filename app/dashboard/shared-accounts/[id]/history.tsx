import { prisma } from "@/lib/prisma"
import HistorySheet, { HistoryWithUser }     from "./history-sheet"


export default async function History({id}: {id: string}) {
    const history = await prisma.sharedAccountHistory.findMany({
        where: {
            sharedAccountId: id
        },
        include: {
            updatedBy: true
        }
    })
    return <div>
        <h1>History</h1>
        <HistorySheet history={history as unknown as HistoryWithUser[]} />
       
    </div>
}   