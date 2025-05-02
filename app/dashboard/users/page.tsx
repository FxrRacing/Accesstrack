
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateUserForm from "./create-user-form";
import { UsersTable } from "./table";
import { User } from "@prisma/client";
import { UserPlus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUp } from "lucide-react";


export default async function UsersPage() {  
     const users: (User & { reportsTo: User | null })[] = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        },
        include: {
            reportsTo: true,
        },
     });
    return (
        <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Users</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="relative">
            <div className="absolute top-4 right-4 text-white/10">
              <UserPlus className="h-20 w-20" strokeWidth={1.5} />
            </div>
            <CardContent className="relative z-10 p-6 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">New Feature</Badge>
              </div>
              <CardTitle className="text-2xl font-bold mb-1 text-white">Add New Users</CardTitle>
              <CardDescription className="text-white/90 mb-4 text-sm">
                Quickly add new employees to your organization.
              </CardDescription>
              
              <CreateUserForm users={users} />
            </CardContent>
          </div>
        </Card>

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="relative">
            <div className="absolute top-4 right-4 text-white/10">
              <UsersRound className="h-20 w-20" strokeWidth={1.5} />
            </div>
            <CardContent className="relative z-10 p-6 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">Bulk Action</Badge>
              </div>
              <CardTitle className="text-2xl font-bold mb-1 text-white">Import Users</CardTitle>
              <CardDescription className="text-white/90 mb-4 text-sm">
                Import multiple users at once from CSV or Excel files.
              </CardDescription>
              <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
                <FileUp className="mr-2 h-4 w-4" />
                Import Users
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
            


            
            <UsersTable data={users} />
            

           
          
           </div>
        </main>
    );
}