import { prisma } from "@/lib/prisma"

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
        {history.map((history) => (
            <div key={history.id} className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md w-fit border border-gray-200">
                <p>{history.action}</p>
                <p>{history.field}</p>
                <p>{history.oldValue}</p>
                <p>{history.newValue}</p>
                <p>{history.updatedBy.email}</p>
            </div>
        ))}
    </div>
}   