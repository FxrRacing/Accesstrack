import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { CardContent, CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Briefcase, Mail, MapPin, Users } from "lucide-react";
import EditDepartment from "./edit";
import DeleteDepartment from "./delete-department";
import PermissionsProvider from "@/utils/providers/permissions";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const supabase = await createClient()
  
    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
  
    const { id } = await params;
    const department = await prisma.department.findUnique({
        where: {
            id: id,
        },
        include: {
            departmentHead: true,
            users: true,
            _count: { select: { users: true } },
        },
    });
    if (!department) {
        redirect('/dashboard/departments')
    }
    const getStatusBadge = (status: string) => {
      const variant = status === "active" ? "default" : "secondary"
      return <Badge variant={variant}>{status}</Badge>
    }
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
    return (
      <>
      <div className="container mx-auto p-6 space-y-6">
      {/* Department Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
        <p className="text-lg text-muted-foreground capitalize">{department.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {department._count.users} {department._count.users === 1 ? "member" : "members"}
          </span>

        </div>  
        <EditDepartment department={department} />
      </div>

      {/* Department Head Card */}
        {department.departmentHead && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Head</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="space-y-1">
                <p className="font-medium">{department.departmentHead.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{department.departmentHead.email}</span>
                </div>
                {department.departmentHead.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{department.departmentHead.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Members</CardTitle>
          <CardDescription>All employees currently assigned to this department</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {department.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      <span>{user.jobTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{user.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {formatDate(user.onboardingDate ? user.onboardingDate.toString() : "")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

            {department.users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No members assigned to this department yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

<PermissionsProvider requiredPermission="delete">
      <DeleteDepartment departmentId={department.id} />
</PermissionsProvider>
    </div>
        
        </>
    );
}