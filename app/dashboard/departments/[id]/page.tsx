import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const supabase = await createClient()
  
    const { data, error } = await supabase.auth.getUser()
    
    if (error || !data?.user) {
      redirect('/login')
    }
  
    const { id } = await params;
    const department = await prisma.department.findUnique({
        where: {
            id: id,
        },
        include: {
            departmentHead: true,
            users: true,
            _count: { select: { users: true } },
        },
    });
    if (!department) {
        redirect('/dashboard/departments')
    }
    return (
        <div className="flex flex-col gap-4 p-3">
            <h1>{department?.name}</h1>
            <p>{department?.description}</p>
            <p>{department?.departmentHead?.name}</p>
            <p>number of users: {department?._count.users}</p>
           {department.users.map((user) => (
            <div key={user.id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
           ))}
        </div>
    );
}