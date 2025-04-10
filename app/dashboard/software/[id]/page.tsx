import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {Drawer} from "./drawer";

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
  async function editSoftware(formData: FormData) {
    "use server";
    // Mutate data
    const name = formData.get("name") as string;

    const description = formData.get("description") as string;
    // Perform the edit user action here
    console.log("Editing user:", formData);
    //we are not logged in so we will use a default user id
    const software = await prisma.software.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
      },
    });
    console.log("User updated:", software);
  }
  return (
    <>
      <div>
        <h1 className="text-xl">{software.name}</h1>
        <p>{software.description}</p>
        <p>{software.category}</p>
        <p>{software.status}</p>
        <p>{software.notes}</p>
        <p>{software.status}</p>
        <p>{software.userCount}</p>
        <p>{editedBy?.id}</p>

        <p>{editedBy?.name}</p>
      </div>
      <button className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-">
        Edit Software
      </button>
      <Drawer software={software} />
      <br />
      =============================================
      <h2>Edit Software</h2>
      <form action={editSoftware} className="flex flex-col gap-4">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" defaultValue={software.name} />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          defaultValue={software.description || ""}
        />

        <label htmlFor="notes">Notes:</label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          defaultValue={software.notes || ""}
        ></textarea>
        <label htmlFor="status">Status:</label>
        <select name="status" id="status" defaultValue={software.status || ""}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
        <label htmlFor="category">Category:</label>
        <select
          name="category"
          id="category"
          defaultValue={software.category || ""}
        >
          <option value="web">Web</option>
          <option value="software">Software</option>
          <option value="hardware">Hardware</option>
          <option value="network">Network</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">update</button>
      </form>
      =============================================
      <h3> Softwares Users</h3>
      {users.map((user) => (
        <div key={user.id}>
          <Link href={`/dashboard/users/${user.user.id}`}>
            <h2>
              {`--->`}
              {user.user.name}
            </h2>
          </Link>

          <p className="text-green-700">
            Description: {user.software.description}
          </p>
          <p className="text-green-700">Granted By : {user.grantedBy.email}</p>
          <p className="text-green-700">Status : {user.user.jobTitle}</p>
          <p className="text-green-700">Category : {user.software.category}</p>
        </div>
      ))}
      =========================================
      {/* Assign software */}
    </>
  );
}
