
import { GradientCard } from "@/components/ui/gradient-card";
import { IconBuildingCommunity} from "@tabler/icons-react";
import AddDepartmentForm from "./addDepartmentForm";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import { ArrowUpRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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



      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[minmax(0,1fr)]">
          {departments.map((department) => (
            <Link href={`/dashboard/departments/${department.id}`} key={department.id} className="group">
            <Card  className={` h-full hover:shadow-lg duration-200 group relative overflow-hidden rounded-xl  border-1 border-zinc-100 transition-all hover:border-emerald-400/50 hover:border-1`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 ">{department.name}</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      {department.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {department.users.length + 1} members
                  </Badge>
                  <div className="absolute top-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                       <Button
                         variant="outline"
                         size="icon"
                         className="h-8 w-8 rounded-full bg-zinc-800/90 border-zinc-600 text-zinc-100 hover:bg-emerald-500 hover:text-zinc-900"
                         
                       >
                         <ArrowUpRight className="h-4 w-4" />
                         <span className="sr-only">View details</span>
                       </Button>
                     </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Department Head */}
                <div className="mb-4 p-3 bg-white rounded-lg border">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Department Head</p>
                  {department.departmentHead ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                      
                        <AvatarFallback>
                          {department.departmentHead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{department.departmentHead.name}</p>
                        <p className="text-sm text-gray-500">{department.departmentHead.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">No department head assigned</p>
                        <p className="text-sm text-gray-400">Position available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members */}
                {/* <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Team Members</p>
                  <div className="space-y-2">
                    {department.users.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                         
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500 truncate">{member.jobTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

    
    </div>
    
  );   
}
