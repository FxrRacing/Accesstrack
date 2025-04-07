import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const software = await prisma.software.findUnique({
    where: {
      id: id,
    },
  });
  if (!software) {
    return notFound();
  }
  const editedBy = await prisma.user.findUnique({
    where: {
      id: software.notesLastUpdatedById,
    },
  });
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

  //return the page with the software details
  async function editSoftware( formData: FormData) {
    'use server'
    // Mutate data
    const name = formData.get('name') as string;

    const notes = formData.get('notes')    as string;
      // Perform the edit user action here
      console.log('Editing user:', formData);
      //we are not logged in so we will use a default user id
        const software = await prisma.software.update({
            where: {id: id,},
            data: {
            name: name,
            notes: notes,
            notesLastUpdatedById: '50313f26-7397-4d88-9e37-937c212d8eb2',
            },
        });
        console.log('User updated:', software);
  
  }
  return (
    <>
      <div>
        <h1>{software.name}</h1>
        <p>{software.description}</p>
        <p>{software.category}</p>
        <p>{software.status}</p>
        <p>{software.notes}</p>
        <p>{software.status}</p>
        <p>{software.userCount}</p>
        <p>{editedBy?.id}</p>
        <p>{editedBy?.name}</p>
      </div>
      =============================================
      <h2>Edit Software</h2>
       <form action={editSoftware} className='flex flex-col gap-4'>
      <input type="text" name="name"  defaultValue={software.name}/>
      <input type="text" name="notes" defaultValue={software.notes|| ""} />
        <input type="text" name="description" defaultValue={software.description|| ""}/>
        <input type="text" name="status" defaultValue={software.status||""}/>



        <input type="text" name="category" defaultValue='Category'/>
        
      <button type="submit">update</button>
    </form>

    =============================================
    <h3> Softwares Users</h3>
        {users.map((user) => (
            <div key={user.id}>
            <Link href={`/users/${user.user.id}`}><h2>{`--->`}{user.user.name}</h2></Link>
          
            <p className="text-green-700">Description: {user.software.description}</p>
            <p className="text-green-700">Granted By : {user.grantedBy.name}</p>
            <p className="text-green-700">Status : {user.user.jobTitle}</p>
            <p className="text-green-700">Category : {user.software.category}</p>
            </div>
        ))}
    </>
  );
}
