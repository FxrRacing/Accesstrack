//delete data from 

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const sharedAccount = await prisma.sharedAccount.findMany();

console.log(sharedAccount);

async function main() {
    await prisma.sharedAccount.deleteMany();
}

main();