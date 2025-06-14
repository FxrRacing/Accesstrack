import { prisma } from "@/lib/prisma";


//import { Separator } from "@/components/ui/separator";
import OrgChart from "./org";
//import WorkOrgChart from "./work-org-chart";


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
      {/* <Separator />
      <WorkOrgChart />  */}
      {/* <TwoNodeTest /> */}
      {/* <OrgChart /> */}
      {/* <pre>{JSON.stringify(transformedData, null, 2)}</pre> */}
   {/* {JSON.stringify(data ,null, 2)} */}
      {/* <OrgChart data={data} /> */}
    </div>
  )
}

