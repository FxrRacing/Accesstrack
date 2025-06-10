import { prisma } from "@/lib/prisma"
import HistorySheet, { HistoryWithUser } from "./components/history-sheet"


export default async function History({id}: {id: string}) {
    const history = await prisma.softwareHistory.findMany({
        where: {
            softwareId: id
        },
        orderBy: {
            updatedOn: 'desc'
        },
        include: {
            updatedBy:true,
            software: true
        }
    })
    return <HistorySheet history={history as HistoryWithUser[]} />
}