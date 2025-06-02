import { columns } from "./columns";
import { DataTable } from "./data-table";

import Invite from "./intive";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { serviceRoleClient } from "@/utils/supabase/admin";
import { GradientCard } from "@/components/ui/gradient-card";
import { FileUp } from "lucide-react";

export default async function StaffPage() {
  // const staff = await prisma.userProfiles.findMany(

  // );
  const liveStaff = await serviceRoleClient.auth.admin.listUsers();
  const supabase = await createClient();
  //staff.map(staff => staff.id)
  const { data, error } = await supabase.auth.getUser();

  
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col gap-4 p-3">
      <h1 className="text-2xl font-bold">Staff</h1>
      <GradientCard
        title="Invite Staff"
        description="Invite staff to your organization"
        badge="Invite"
        icon={<FileUp className="h-20 w-20" strokeWidth={1.5} />}
        gradientFrom="from-amber-500"
        gradientTo="to-orange-600"
      >
        <Invite authId={data.user.id} />
      </GradientCard>

     

      <DataTable columns={columns} data={liveStaff.data.users} />
    </div>
  );
}
