import { assignSoftware } from "@/actions/sharedAccount_actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

import { notFound, redirect } from "next/navigation";

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
    const sharedAccount = await prisma.sharedAccount.findUnique({
        where: {
            id: id,
        },
    });
    if (!sharedAccount) {
        return notFound()
    }
    const alreadyAssignedSoftware = await prisma.sharedAccountSoftware.findMany({
      where: {
        sharedAccountId: sharedAccount.id,
      },
      include: {
        software: true,
      },
    });
    const alreadyAssignedSoftwareIds = alreadyAssignedSoftware.map((s) => s.softwareId);
    
    const availableSoftware = await prisma.software.findMany(
      {
        where: {
          id: {
            notIn: alreadyAssignedSoftwareIds,
          },
        },
      }

     
    );

    return <>
    <div className="flex flex-col gap-4 p-3">
        <h1>Shared Account: {id}</h1>
        <p>Name: {sharedAccount.name}</p>
        <p>Email: {sharedAccount.email}</p>
        <p>Location: {sharedAccount.location}</p>
     
        <p>Type: {sharedAccount.type}</p>
        <p>Status: {sharedAccount.status}</p>
        <p>Created At: {sharedAccount.createdAt.toLocaleDateString()}</p>
        <p>Updated At: {sharedAccount.updatedAt.toLocaleDateString()}</p>
    </div>
    <div className="flex flex-col gap-4 p-3">
        <h1 className="text-xl font-bold">Software</h1>
        <div className="flex flex-col gap-4">
         
          {alreadyAssignedSoftware.map((software) => (
            <div key={software.id}>
             <Link href={`/dashboard/software/${software.softwareId}`} prefetch={true}>{software.software.name}</Link>
              <p>{software.accessLevel}</p>
              <p>{software.role}</p>
            </div>
          ))}
        
        </div>


<br />
        =================
       <p className="text-xl font-bold">Assign Software</p>
        =================
        <form action={assignSoftware} className="flex flex-col gap-4">
         

          <input type="text" name="sharedAccountId" readOnly value={sharedAccount.id} hidden />
          <label>Software</label>
          <select name="softwareId">
                {availableSoftware.map((software) => (
                    <option key={software.id} value={software.id}>{software.name}</option>
                ))}
            </select>
            <input type="text" name="grantedById" readOnly value={data.user.id} hidden />
          <label>Access Level</label>
          <input type="text" name="accessLevel" defaultValue="admin"  />
          <label>Role</label>
          <input type="text" name="role" defaultValue="admin"  />
          <button type="submit">Assign</button>
        </form>

    </div>
    <div className="flex flex-col gap-4 p-3">
        <h1>Users</h1>
    </div>

    
    </>
} ;