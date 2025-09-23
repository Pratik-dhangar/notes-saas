import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');
  
  // Clear existing data
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  
  const password = await bcrypt.hash('password123', 10);

  // Create Acme Tenant
  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme Corporation',
      slug: 'acme',
      plan: 'FREE',
    },
  });

  // Create Globex Tenant
  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex Corporation',
      slug: 'globex',
      plan: 'PRO',
    },
  });

  // Create users
  const acmeAdmin = await prisma.user.create({
    data: {
      email: 'admin@acme.test',
      password,
      role: 'ADMIN',
      tenantId: acme.id,
    },
  });

  const acmeUser = await prisma.user.create({
    data: {
      email: 'user@acme.test',
      password,
      role: 'MEMBER',
      tenantId: acme.id,
    },
  });

  const globexAdmin = await prisma.user.create({
    data: {
      email: 'admin@globex.test',
      password,
      role: 'ADMIN',
      tenantId: globex.id,
    },
  });

  const globexUser = await prisma.user.create({
    data: {
      email: 'user@globex.test',
      password,
      role: 'MEMBER',
      tenantId: globex.id,
    },
  });

  // Create sample notes
  await prisma.note.createMany({
    data: [
      {
        title: 'Welcome to Acme Notes',
        content: 'This is your first note in the Acme workspace.',
        tenantId: acme.id,
        authorId: acmeAdmin.id,
      },
      {
        title: 'Meeting Notes',
        content: 'Notes from the team meeting...',
        tenantId: acme.id,
        authorId: acmeUser.id,
      },
      {
        title: 'Globex Project Ideas',
        content: 'Ideas for the new project initiative.',
        tenantId: globex.id,
        authorId: globexAdmin.id,
      },
    ],
  });

  console.log('✅ Seeding finished.');
  console.log('📊 Created:');
  console.log('  - 2 tenants (Acme, Globex)');
  console.log('  - 4 users (2 per tenant)');
  console.log('  - 3 sample notes');
  console.log('🔑 Test credentials:');
  console.log('  - admin@acme.test / password123');
  console.log('  - user@acme.test / password123');
  console.log('  - admin@globex.test / password123');
  console.log('  - user@globex.test / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });