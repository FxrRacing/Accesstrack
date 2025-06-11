import { prisma } from "@/lib/prisma";

import CreateUserForm from "./create-user-form";
import { UsersTable } from "./table";

import { UserPlus} from "lucide-react";
import { Button } from "@/components/ui/button";

import { FileUp } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

export default async function UsersPage() {
  const users =
    await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        reportsTo: true,
        Location: true,
        
      },
    });

    const locations = await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
    });
    const departments = await prisma.department.findMany();
  return (
    <main className="flex-1 ">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Users</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <GradientCard
            title="Invite Users"
            description="Invite users to your organization"
            badge="Invite"
            icon={<UserPlus className="h-20 w-20" strokeWidth={1.5} />}
            gradientFrom="from-indigo-600"
            gradientTo="to-purple-700"
          >
            <CreateUserForm users={users} locations={locations} departments={departments} />
          </GradientCard>

          <GradientCard
            title="Import Users"
            description="Import multiple users at once from CSV or Excel"
            badge="Users"
            icon={<FileUp className="h-20 w-20" strokeWidth={1.5} />}
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-600"
          >
            <Button className="bg-black text-white hover:bg-black/90 rounded-full px-6">
              <FileUp className="mr-2 h-4 w-4" />
              Import Users
            </Button>
          </GradientCard>
        </div>

        <UsersTable data={users}  />
      </div>
    </main>
  );
}
