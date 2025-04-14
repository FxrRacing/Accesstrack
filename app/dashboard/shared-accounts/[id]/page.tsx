import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
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
    return <div className="flex flex-col gap-4 p-3">
        <h1>Shared Account: {id}</h1>
        <p>Name: {sharedAccount.name}</p>
        <p>Email: {sharedAccount.email}</p>
        <p>Location: {sharedAccount.location}</p>
     
        <p>Type: {sharedAccount.type}</p>
        <p>Status: {sharedAccount.status}</p>
        <p>Created At: {sharedAccount.createdAt.toLocaleDateString()}</p>
        <p>Updated At: {sharedAccount.updatedAt.toLocaleDateString()}</p>
    </div>
} ;