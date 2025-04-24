import { prisma } from "@/lib/prisma";


export default async function OrgChartPage() {
  const data = await prisma.user.findMany({
    include: {
      subordinates: true,
    },
  });

  return (
    <div>
{JSON.stringify(data ,null, 2)}
      {/* <OrgChart data={data} /> */}
    </div>
  )
}

