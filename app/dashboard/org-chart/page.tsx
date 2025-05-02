import { prisma } from "@/lib/prisma";

import TwoNodeTest from "./twoNodeTest";
import { Separator } from "@/components/ui/separator";
import OrgChart from "./org";


export default async function OrgChartPage() {
  const data = await prisma.user.findMany({
    include: {
      subordinates: true,
    },
  });
  
  // Transform data to match the expected type
  const transformedData = data.map(user => ({
    ...user,
    jobTitle: user.jobTitle || undefined,
    location: user.location || undefined,
    personalEmail: user.personalEmail || undefined,
    reportsToId: user.reportsToId || undefined,
    type: user.type || undefined,
    // Transform subordinates the same way
    subordinates: user.subordinates.map(sub => ({
      ...sub,
      jobTitle: sub.jobTitle || undefined,
      location: sub.location || undefined,
      personalEmail: sub.personalEmail || undefined,
      reportsToId: sub.reportsToId || undefined,
      type: sub.type || undefined,
    }))
  }));

  return (
    <div>
      <OrgChart users={transformedData} />
      <Separator />
      <TwoNodeTest />
      {/* <OrgChart /> */}
      {JSON.stringify(data ,null, 2)}
      {/* <OrgChart data={data} /> */}
    </div>
  )
}

