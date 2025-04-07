import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
    const software = await prisma.software.findUnique({
      where: {
        id: id,
      },
    });
    //return the page with the software details
    if (!software) {
        return notFound();
    }
    return <>
        <div>
            <h1>{software.name}</h1>
            <p>{software.description}</p>
            <p>{software.category}</p>
            <p>{software.status}</p>
            <p>{software.notes}</p>
            <p>{software.status}</p>
            <p>{software.userCount}</p>

        </div>
    
    </>
  }