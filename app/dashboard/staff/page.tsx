

import { prisma } from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import Invite from "./intive";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { serviceRoleClient } from "@/utils/supabase/admin";

export default async function StaffPage() {

    const staff = await prisma.userProfiles.findMany(
       
    ); 
    const liveStaff = await serviceRoleClient.auth.admin.listUsers()
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

            <DataTable columns={columns} data={liveStaff.data.users} />

            <pre>{JSON.stringify(staff, null, 2)}</pre>
            <pre>{JSON.stringify(liveStaff, null, 2)}</pre>



           
        </div>
    )
}

