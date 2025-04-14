import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    const staff = await prisma.userProfiles.findUnique({
        where: {
            id: id,
        },
    });

    if (!staff) {
        return notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Staff Details</h1>
            <h1>staff details for {staff.fullName}</h1>
            <p>email: {staff.email}</p>
            <p>phone: {staff.phone}</p>
        </div>
    )
}