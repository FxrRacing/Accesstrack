import { prisma } from "@/lib/prisma"
import HistorySheet, { HistoryWithUser } from "./history-sheet"


export default async function History({id}: {id: string}) {
    const history = await prisma.userHistory.findMany({
        where: {
            userId: id
        },
        orderBy: {
            updatedOn: 'desc'
        },
        include: {
            updatedBy:true,
            user: true
        }
    })
    return <HistorySheet history={history as unknown as HistoryWithUser[]} />
}