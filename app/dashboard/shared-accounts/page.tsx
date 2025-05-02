import { createSharedAccount } from "@/actions/sharedAccount_actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { FileUp,  UserPlus } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

export default async function SharedAccountsPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
    const sharedAccounts = await prisma.sharedAccount.findMany({
        orderBy: {
            name: 'asc',
        },
        
    });
    return (

        <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Shared Accounts</h2>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-cyan-600 to-teal-500">
          <div className="relative">
            <div className="absolute top-4 right-4 text-white/10">
              <UserPlus className="h-20 w-20" strokeWidth={1.5} />
            </div>
            <CardContent className="relative z-10 p-6 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">Collaboration</Badge>
              </div>
              <CardTitle className="text-2xl font-bold mb-1 text-white">Create Shared Account</CardTitle>
              <CardDescription className="text-white/90 mb-4 text-sm">
                Set up shared accounts for teams and departments.
              </CardDescription>
              <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Shared Account
              </Button>
            </CardContent>
          </div>
        </Card>

        <GradientCard
  title="Import Shared Accounts"
  description="Import shared accounts from a CSV file."
  badge="Import"
  icon={<FileUp className="h-20 w-20" strokeWidth={1.5} />}
  gradientFrom="from-teal-500"
  gradientTo="to-cyan-600"
>
  <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
    <FileUp className="mr-2 h-4 w-4" />
    Upload File
  </Button>
</GradientCard>
      </div>                    
            <DataTable columns={columns} data={sharedAccounts} />


           
===================
            <h2 className="font-bold text-lg">Create Shared Account</h2>
            <form action={createSharedAccount} className="flex flex-col gap-2">
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="email" placeholder="Email" />
                <input type="text" name="location" placeholder="Location" />
                <input type="text" name="type" placeholder="Type" />
                <input type="text" name="status" placeholder="Status" />
                <input type="text" name="updatedBy"  defaultValue={data.user.id} hidden />
                <button type="submit">Create Shared Account</button>
            </form>
        </div>
        </main>
    );
}
