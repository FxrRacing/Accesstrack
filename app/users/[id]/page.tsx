import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { assignSoftware } from '@/actions/user_actions'

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
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
        {software.map((software) => (
            <div key={software.id}>
                <Link  href={`/software/${software.software.id}`}><h2>{`--->`}{software.software.name}</h2></Link>
                
                <p className="text-green-700">{software.software.description}</p>
                <p className="text-green-700">Granted By: {software.grantedBy.name}</p>
               
                <p className="text-green-700">Notes: {software.software.notes}</p>
               
            </div>
        ))}
        ============================
        {/* Assign software */}
        <h2>Assign Software</h2>
        <form action={assignSoftware} className='flex flex-col gap-4'>
            <input type="text" name="softwareId" placeholder="Software Id*" />
            <input type="text" name="grantedById" placeholder="Granted By Id*" />
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