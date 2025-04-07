import { PrismaClient } from '@prisma/client';

import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // 👤 Seed Users
  const userSqlPath = path.join(__dirname, 'User_rows.sql');
    const softwareSqlPath = path.join(__dirname, 'Software_rows.sql');

    // Read the SQL file contents.
    const userSQL = fs.readFileSync(userSqlPath, 'utf8');
    const softwareSQL = fs.readFileSync(softwareSqlPath, 'utf8');

    console.log('Seeding Users...');
    await prisma.$executeRawUnsafe(userSQL);
    console.log('Users seeded successfully.');

    console.log('Seeding Software...');
    await prisma.$executeRawUnsafe(softwareSQL);
    console.log('Software seeded successfully.');
 

  
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
