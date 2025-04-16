import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {Drawer} from "./drawer";

import { removeAssignedUser } from "@/actions/software_actions";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/server'

import UserManagement from "@/components/access-list";
import AssignForm from "./assign-form";




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
  const software = await prisma.software.findUnique({
    where: {
      id: id,
    },
  });
  if (!software) {
    return notFound();
  }
  let editedBy;
  if (software.updatedById) {  
    editedBy = await prisma.user.findUnique({
      where: {
        id: software.updatedById,
      },
    });
  }
  const users = await prisma.userSoftware.findMany({
    where: {
      softwareId: id,
    },
    include: {
      user: true,
      grantedBy: true,
      software: true,
    },
  });
const assignedUsers = users.map((user) => ({
  id: user.user.id,
}));
const assignedUsersIds = assignedUsers.map((user) => user.id);
const availableUsers = await prisma.user.findMany({
  where: {
    id: {
      notIn: assignedUsersIds,
    },
  
  },
});
  //return the page with the software details
 
const sharedAccounts = await prisma.sharedAccountSoftware.findMany({
  where: {
    softwareId: id,
  },
  include: {
    sharedAccount: true,
  },
});
  
  return (
    <>
      <div>
        <h1 className="text-xl">{software.name}</h1>
        <p>Description:{software.description}</p>
        <p>Category:{software.category}</p>
      
        <p>Notes:{software.notes}</p>
        <p>Status:{software.status}</p>
        <p>User Count:{software.userCount}</p>
      

        <p>Edited By: {editedBy?.name}</p>
      </div>
      
      <Drawer software={software} />
      <br />
      =============================================
      <h3> Softwares Users</h3>
     

      <UserManagement 
  users={users} 

/>
    
      

      {users.map(async (user) => {
        const removeAssignedUserWithIds = removeAssignedUser.bind(null,  user.user.id,id);
       
        return (    
        <div key={user.id} className="w-xl border-2 border-gray-300 rounded-md p-4 mb-1.5 flex flex-col gap-2">
          <Link href={`/dashboard/users/${user.user.id}`}>
            <h2 className="text-xl font-bold">
              
              {user.user.name}
            </h2>
          </Link>

          <p className="text-green-700">Granted By : {user.grantedBy.email}</p>
          <p className="text-green-700">Job Title : {user.user.jobTitle}</p>
          <p className="text-green-700">Access Level : {user.accessLevel}</p>
          <p className="text-green-700">Role : {user.role}</p>
          <form action={removeAssignedUserWithIds} className="flex flex-col gap-4">
            <Button type="submit" size="sm" >Remove - </Button>
          </form>
        </div>
        )
      })}
      =========================================
      {/* Assign software */}
      <p>Assign Software</p>

      {availableUsers.length > 0 ? 
      <AssignForm id={id} availableUsers={availableUsers} authId={data.user.id} /> 
      : <p>There are no available users to assign to this software</p>
        
        
        }
      =========================================
<p className="text-xl">Shared Accounts</p>

{sharedAccounts.map((sharedAccount) => (
  <div key={sharedAccount.id} className="flex flex-col gap-2">
    <Link href={`/dashboard/shared-accounts/${sharedAccount.sharedAccountId}`} prefetch={true}>{sharedAccount.sharedAccount.name}</Link>
    <p>{sharedAccount.accessLevel}</p>
    <p>{sharedAccount.assignedAt.toLocaleDateString()}</p>
    <p>{sharedAccount.createdById}</p>
    <p>{sharedAccount.role}</p>
  </div>
))}

    </>
  );
}
