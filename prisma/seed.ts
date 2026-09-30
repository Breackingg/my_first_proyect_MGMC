import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  console.log('Cleaning existing data...');

  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  console.log('Users deleted');
  console.log('Tenants deleted');
  console.log('Creating tenants and users...');

  const password = await bcrypt.hash('Password123!', 10);

  const tenants = [
    {
      name: 'Tech Solutions',
      user: {
        email: 'admin@techsolutions.com',
        name: 'Administrador Tech',
        telephone: '8888-0001',
        role: Role.ADMIN,
      },
    },
    {
      name: 'Marketing Pro',
      user: {
        email: 'user@marketingpro.com',
        name: 'Usuario Marketing',
        telephone: '8888-0002',
        role: Role.USER,
      },
    },
    {
      name: 'Consulting Experts',
      user: {
        email: 'user@consultingexperts.com',
        name: 'Usuario Consulting',
        telephone: '8888-0003',
        role: Role.USER,
      },
    },
  ];

  for (const tenantData of tenants) {
    await prisma.tenant.create({
      data: {
        name: tenantData.name,
        users: {
          create: {
            ...tenantData.user,
            password,
          },
        },
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
