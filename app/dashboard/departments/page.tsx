
import { GradientCard } from "@/components/ui/gradient-card";
import { IconBuildingCommunity} from "@tabler/icons-react";
import AddDepartmentForm from "./addDepartmentForm";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany(
    {
      include: {
        departmentHead: true,
        users: true,
        _count: { select: { users: true } },
      },
    }
  )
  const users = await prisma.user.findMany({
   

  })
  //dept count is count of users in the department plus the department head
  
    return (<div className="flex flex-col gap-4 p-3">
      <h1 className="text-2xl font-bold">Departments</h1>
      <GradientCard
        title="Create Department"
        description="Create a new department"
        badge="Create"
        icon={<IconBuildingCommunity className="h-20 w-20" strokeWidth={1.5} />}
        gradientFrom="from-amber-500"
        gradientTo="to-orange-600"
      >
       <AddDepartmentForm users={users} />
      </GradientCard>

      {departments.map((department) => (
        <Link href={`/dashboard/departments/${department.id}`} key={department.id}>
          <Card >
          <CardHeader>
          <CardTitle>{department.name}</CardTitle>
          <CardDescription>{department.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{department.departmentHead?.name}</p>
         
          {department.users.map((user) => (
            <div key={user.id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
             
            </div>
           
          ))}
          <p>number of users: {department._count.users}</p>
        </CardContent>
        </Card>
        </Link>
      ))}
    </div>
    
  );   
}
