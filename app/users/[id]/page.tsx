import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
    </>
  }