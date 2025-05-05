import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { grantAccess } from "../actions";
import { revokeAccess } from "../actions";
import { deleteStaff } from "../actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { TEAM_OPTIONS } from "@/utils/constants";
import PermissionsProvider from "@/utils/providers/permissions";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;

   
   const authUser = await prisma.users.findUnique({
    where: {
        id: id,
    },
   })
    const staff = await prisma.userProfiles.findUnique({
        where: {
            id: id,
        },
    });
if (!authUser) {
    return notFound();
}
    if (!staff) {
        return notFound();
    }

    const raw_user_meta_data = authUser.raw_user_meta_data as { first_name: string, last_name: string, is_active: boolean, role: string};

    const revokeAccessWithId = revokeAccess.bind(null, id);
    const grantAccessWithId = grantAccess.bind(null, id);
    const deleteStaffWithId = deleteStaff.bind(null, id);   
    return (
            <div>

            <h1 className="text-2xl font-bold">Staff Details</h1>
            <h1>staff details for {staff.fullName}</h1>
            <p>email: {staff.email}</p>
            <p>phone: {staff.phone}</p>
==========
<p>auth user details </p>
<p>first name: {raw_user_meta_data?.first_name}</p>
<p>last name: {raw_user_meta_data?.last_name}</p>
<p>email: {authUser?.email}</p>
<p>email confirmed at: {authUser?.email_confirmed_at?.toISOString()}</p>
<p>created at: {authUser?.created_at?.toISOString()}</p>
<p>updated at: {authUser?.updated_at?.toISOString()}</p>
-------
<p>last sign in at: {authUser?.last_sign_in_at?.toISOString()}</p>
<p>has access should be bool: {raw_user_meta_data?.is_active?.toString()}</p>
<p>is active: {raw_user_meta_data?.is_active ? 'true' : 'false'}</p>
<p>Role: {raw_user_meta_data?.role}</p>

<p>json: <pre>{JSON.stringify(authUser, null, 2)}</pre></p>

<div className="flex flex-row gap-4">
<form action={revokeAccessWithId}>
<Button type="submit">Revoke Access</Button>
</form>
<form action={grantAccessWithId}>
<Button type="submit">Grant Access</Button>
</form>

<form action={deleteStaffWithId}>
<Button type="submit">Delete Staff</Button>
</form>

<PermissionsProvider requiredPermission="grant">
<GrantRole />
</PermissionsProvider>
</div>
        </div>
    )
}



async function GrantRole() {
    return<>
    <form>
        <label htmlFor="role">Role</label>
       <Select>
        <SelectTrigger>
            <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
            {TEAM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
           
          
        </SelectContent>
       </Select>
        <button type="submit">Grant Role</button>
    </form>
    </>
}


// const removeAssignedSoftwareWithIds = removeAssignedSoftware.bind(null, id, software.software.id);
//         const grantedBy= await findRealUser(software.grantedById);
        
//         return (
//           <div key={software.id}>
//             <Link href={`/dashboard/software/${software.software.id}`} prefetch={true}>
//               <h2>{`---> ${software.software.name}`}</h2>
//             </Link>
//             <p className="text-green-700">{software.software.description}</p>
//             <p className="text-green-700">Granted By: {grantedBy.email}</p>
//             <p className="text-green-700">Access Level: {software.accessLevel}</p>
//             <p className="text-green-700">Role: {software.role}</p>
           
//             <form action={removeAssignedSoftwareWithIds} className="flex flex-col gap-4">
//               <button type="submit">Remove</button>
//             </form>
//           </div>