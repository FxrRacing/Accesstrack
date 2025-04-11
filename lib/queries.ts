import { notFound } from "next/navigation"
import { prisma } from "./prisma"

export async function findRealUser(id:string){
    const realUser = await prisma.users.findUnique({
        where: {
          id: id,
        },
      })
      if (!realUser) {
        //this should never happen
        return notFound()
      }
      return realUser
  }