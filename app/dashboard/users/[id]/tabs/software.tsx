import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma";
import { Monitor, Trash } from "lucide-react"
import AssignSoftware from "../components/assign-software";
import { removeAssignedSoftware } from "@/actions/user_actions";
import { Button } from "@/components/ui/button";
import PermissionsProvider from "@/utils/providers/permissions";

export default async function Software({id, authId}: {id: string, authId: string}) {

    const software = await prisma.userSoftware.findMany({
        where: {
          userId: id,
        },
        include: {
          user: true,
          grantedBy: true,
          software: true,
        },
      })
    const assignedSoftware = software.map((s) => ({
        id: s.software.id,
      }));
      const assignedSoftwareIds = assignedSoftware.map((s) => s.id);
      
      const availableSoftware = await prisma.software.findMany({
         where: {
             id: {
                 notIn: assignedSoftwareIds,
             },
           },
         orderBy: {
             name: 'asc',
         },
        
 
      });
    return (
        <>
        
                <div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-200 hover-scale transition-transform duration-300">
                        <Monitor className="h-4 w-4 text-emerald-600" />
                      </div>
                      Software Access
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Software licenses and access details</p>
                  </div>
                  <PermissionsProvider requiredPermission="edit" replaceWith={ <></>}>
                  <AssignSoftware id={id} authId={authId} availableSoftware={availableSoftware} />
                  </PermissionsProvider>
                  
                </div>

                {software.length===0? (<Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Monitor className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Software Assigned</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              This user doesn&apos;t have any software applications assigned to them yet.
            </p>
          </CardContent>
        </Card>):(<Card className="border border-neutral-200 shadow-vercel rounded-lg overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up stagger-3">
                    <Table className="px-2">
                      <TableHeader>
                        <TableRow className="bg-emerald-50 hover:bg-emerald-50 border-b border-emerald-200">
                          <TableHead className="font-semibold text-neutral-900 py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-emerald-100 border border-emerald-200 hover-scale transition-transform duration-300">
                                <Monitor className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              Software
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3 ">Access Level</TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Role</TableHead>
                          <TableHead className="font-semibold text-neutral-900 py-3">Granted By</TableHead>
                          <PermissionsProvider requiredPermission="edit" replaceWith={ <></>}>
                          <TableHead className="font-semibold text-neutral-900 py-3">Actions</TableHead>
                          </PermissionsProvider>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {software.map((item,index) => {
                          const removeAssignedSoftwareWithIds = removeAssignedSoftware.bind(null, id, item.software.id, authId);
                        
                          return (
                            <TableRow
                              key={index}
                              className="hover:bg-neutral-50 transition-all duration-300 border-b border-neutral-100 hover-lift"
                            >
                              <TableCell className="font-medium py-3 text-sm">{item.software.name}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.accessLevel}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.role}</TableCell>
                              <TableCell className="py-3 text-sm text-neutral-600">{item.grantedBy.fullName}</TableCell>
                              <PermissionsProvider requiredPermission="edit" replaceWith={ <></>}>
                              <TableCell className="py-3 text-sm text-neutral-600">
                                <form action={removeAssignedSoftwareWithIds}>
                                  <Button variant="outline" className=" cursor-pointer border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </form>
                              </TableCell>
                              </PermissionsProvider>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>)}
                  
              
                  </>
    )
}