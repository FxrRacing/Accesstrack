

import { prisma } from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import Invite from "./invite";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function StaffPage() {

    const staff = await prisma.userProfiles.findMany(
       
    );  
const supabase = await createClient()
//staff.map(staff => staff.id)
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }
    return (
        <div className="flex flex-col gap-4 p-3">
            <h1 className="text-2xl font-bold">Staff</h1>

            <Invite authId={data.user.id} />

            <DataTable columns={columns} data={staff} />



           
        </div>
    )
}

