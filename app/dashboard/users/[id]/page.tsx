import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { assignSoftware, removeAssignedSoftware } from '@/actions/user_actions'
import { createClient } from '@/utils/supabase/server'


export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log('User data:', data)
  if (error || !data?.user) {
    redirect('/login')
  }
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      return notFound()
    }
 

    const software = await prisma.userSoftware.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
        grantedBy: true,
        software: true,
      },
    })
    const assignedSoftware = software.map((s) => ({
        id: s.software.id,
      }));
      const assignedSoftwareIds = assignedSoftware.map((s) => s.id);
      
      const availableSoftware = await prisma.software.findMany({
         where: {
             id: {
                 notIn: assignedSoftwareIds,
             },
           },
         orderBy: {
             name: 'asc',
         },
 
      });

    
    return <>
        <div>
            <h1>{user.name}</h1>
            <p className="text-green-700">Department: {user.department}</p>
            <p className="text-green-700">Job Title: {user.jobTitle}</p>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">Location: {user.location}</p>
        </div>

        ===============================
        <h1>Software</h1>

        <div>
      {software.map((software) => {
        const removeAssignedSoftwareWithIds = removeAssignedSoftware.bind(null, id, software.software.id);

        return (
          <div key={software.id}>
            <Link href={`/software/${software.software.id}`}>
              <h2>{`---> ${software.software.name}`}</h2>
            </Link>
            <p className="text-green-700">{software.software.description}</p>
            <p className="text-green-700">Granted By: {software.grantedBy.name}</p>
            <p className="text-green-700">Access Level: {software.accessLevel}</p>
            <p className="text-green-700">Role: {software.role}</p>
           
            <form action={removeAssignedSoftwareWithIds} className="flex flex-col gap-4">
              <button type="submit">Remove</button>
            </form>
          </div>
        );
      })}
    </div>

        ============================
        {/* Assign software */}
       

        <h2>Assign Software</h2>
        <form action={assignSoftware} className='flex flex-col gap-4'>
            <select name="softwareId">
                {availableSoftware.map((software) => (
                    <option key={software.id} value={software.id}>{software.name}</option>
                ))}
            </select>
            <input type="text" name="grantedById"  defaultValue={data.user.id} hidden />
            {/* <select name="grantedById" className='flex flex-col gap-4'>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select> */}
            
            <input type="text" name="accessLevel" placeholder="Access Level*" />
            <input type="text" name="role" placeholder="Role*" />
            <input type="text" name="userId" defaultValue={id} hidden />
            <button type="submit">Assign Software +</button>
        </form>
        ============================

    </>
  }



  //tablou fe769674-65d0-4528-92af-2f2df451164e
  //derek 50313f26-7397-4d88-9e37-937c212d8eb2