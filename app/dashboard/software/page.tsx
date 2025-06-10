import { prisma } from "@/lib/prisma";

import CreateForm from "./create-form";
import {AppWindow, FileUp } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import ImportSoftware from "./import";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function SoftwarePage( ) {  
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
   const software= await prisma.software.findMany({});
   const teamOwners = await prisma.userProfiles.findMany({})
   
    return (
        <>
        <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Software</h2>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <GradientCard
                title="Add Software"
                description="Add new software to your organization."
                badge="New"
                gradientFrom="from-indigo-500"
                gradientTo="to-blue-600"
                icon={<AppWindow className="h-20 w-20" strokeWidth={1.5} />}
                >
                <CreateForm teamOwners={teamOwners} /> 
                </GradientCard> 
                <GradientCard
                title="Import Software"
                description="Import software from a CSV file."
                badge="Import"
                icon={<FileUp className="h-20 w-20" strokeWidth={1.5} />}
                >
               <ImportSoftware authId={data.user.id} />     
                </GradientCard>     
            </div>
            <DataTable columns={columns} data={software} /> 
            </div>
            
        </main>
        <div className="flex flex-col gap-4">
            {/* <h1>Software</h1>
            <p>Software page content goes here.</p>
            {software.map((software) => (
               
                <div key={software.id}>
                     <Link  href={`/dashboard/software/${software.id}`} prefetch={true}><h2>{`--->`}{software.name}</h2></Link>
                    
                    <p className="text-green-700">{software.description}</p>
                </div>
               
            ))} */}
           

            <Link href="https://logo.dev" target="_blank" className="text-sm text-gray-500">Logos provided by Logo.dev</Link>
        </div>
        </>
    );
}
