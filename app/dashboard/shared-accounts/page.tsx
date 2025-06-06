
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import { Button } from "@/components/ui/button";

import { FileUp,  UserPlus } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import CreateForm from "./create-form";

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
        
        <GradientCard
        title="Create Shared Account"
        description="Set up shared accounts for teams and departments."
        badge="Create"
        icon={<UserPlus className="h-20 w-20" strokeWidth={1.5} />}
        gradientFrom="from-teal-500"
        gradientTo="to-cyan-600">
            <CreateForm user={data.user} />
        </GradientCard>

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


           

          
        </div>
        </main>
    );
}
