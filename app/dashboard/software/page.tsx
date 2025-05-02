import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateForm from "./create-form";
import { PlusCircle, AppWindow, FileUp } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
export default async function SoftwarePage() {  
   const software= await prisma.software.findMany({});

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
               <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
    <PlusCircle className="mr-2 h-4 w-4" />
    Add Software
  </Button>     
                </GradientCard> 
                <GradientCard
                title="Import Software"
                description="Import software from a CSV file."
                badge="Import"
                icon={<FileUp className="h-20 w-20" strokeWidth={1.5} />}
                >
               <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
    <FileUp className="mr-2 h-4 w-4" />
    Upload File
  </Button>     
                </GradientCard>     
            </div>
            </div>
            <DataTable columns={columns} data={software} /> 
        </main>
        <div className="flex flex-col gap-4">
            <h1>Software</h1>
            <p>Software page content goes here.</p>
            {software.map((software) => (
               
                <div key={software.id}>
                     <Link  href={`/dashboard/software/${software.id}`} prefetch={true}><h2>{`--->`}{software.name}</h2></Link>
                    
                    <p className="text-green-700">{software.description}</p>
                </div>
               
            ))}
            <CreateForm />
        </div>
        </>
    );
}
