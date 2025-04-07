import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
  // 👤 Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: 'dmonarch134@gmail.com',
      name: 'Derek Monarch',
      active: true,
      department: 'Engineering',
      jobTitle: 'Software Engineer',
      location: 'Remote',
      personalEmail: 'dmonarch.personal@gmail.com',
      type: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'mjohnson@example.com',
      name: 'Mike Johnson',
      active: true,
      department: 'Product',
      jobTitle: 'Product Manager',
      location: 'Austin',
      personalEmail: 'mike.johnson@gmail.com',
      type: 'standard',
      reportsTo: {
        connect: { id: user1.id },
      },
    },
  });

  //💾 Seed Software
  const software1 = await prisma.software.create({
    data: {
      name: 'Tableau',
      description: 'Task Management',
      category: 'Data Analytics',
      status: 'active',
      updatedBy: user1.email,
      userCount: 1,
      notes: "Hi there",
      notesLastUpdatedBy: {
        connect: { id: user1.id },
      },
    },
  });
  const software2 = await prisma.software.create({
    data: {
      name: 'Slack',
      description: 'Communication',
      category: 'Collaboration',
      status: 'active',
      updatedBy: user1.email,
      userCount: 1,
      notes: JSON.stringify({
        editedBy: 'Current User',
        lastEdited: new Date('2024-09-06T09:30:33.881Z'),
        note: 'sdfsd',
      }),
      notesLastUpdatedBy: {
        connect: { id: user1.id },
      },
    },
  });
  const software3 = await prisma.software.create({
    data: {
      name: 'Zoom',
      description: 'Video Conferencing',
      category: 'Collaboration',
      status: 'active',
      updatedBy: user1.email,
      userCount: 1,
      notes: JSON.stringify({
        editedBy: 'Current User',
        lastEdited: new Date('2024-09-06T09:30:33.881Z'),
        note: 'sdfsd',
      }),
      notesLastUpdatedBy: {
        connect: { id: user1.id },
      },
    },
  });

  console.log('✅ Seed completed!' ,{
    user1,
    user2,

    software1,
    software2,
    software3,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
