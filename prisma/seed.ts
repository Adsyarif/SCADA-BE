import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const permissions = await prisma.permission.createMany({
    data: [
      { permissionName: 'manage_users' },
      { permissionName: 'manage_roles' },
      { permissionName: 'manage_permissions' },
      { permissionName: 'manage_content' },
      { permissionName: 'view_dashboard' },
    ],
    skipDuplicates: true,
  });

  // Create Master Admin role
  const masterRole = await prisma.userRole.upsert({
    where: { roleName: 'Master Admin' },
    update: {},
    create: {
      roleName: 'Master Admin',
    },
  });

  // Get all permissions
  const allPermissions = await prisma.permission.findMany();

  // Delete existing role permissions (in case of updates)
  await prisma.userRolePermission.deleteMany({
    where: { userRoleId: masterRole.id },
  });

  // Connect all permissions to Master Admin role
  await prisma.$transaction(
    allPermissions.map((permission) =>
      prisma.userRolePermission.create({
        data: {
          userRoleId: masterRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  const hashedPassword = await bcrypt.hash('masteradmin@123', 10);
  // Create master admin user
  await prisma.user.upsert({
    where: { email: 'masteradmin@scada.com' },
    update: {},
    create: {
      username: 'masteradmin',
      email: 'masteradmin@scada.com',
      password: hashedPassword,
      phone_number: '+1234567890',
      employee_number: 'ADMIN001',
      userRoleId: masterRole.id,
    },
  });

  const userRole = await prisma.userRole.upsert({
    where: { roleName: 'Regular User' },
    update: {},
    create: {
      roleName: 'Regular User',
    },
  });

  const reporterPassword = await bcrypt.hash('reporter123', 10);
  const reporterUser = await prisma.user.upsert({
    where: { email: 'reporter@scada.com' },
    update: {},
    create: {
      username: 'reporter_user',
      email: 'reporter@scada.com',
      password: reporterPassword,
      phone_number: '+628123456789',
      employee_number: 'EMP002',
      userRoleId: userRole.id,
    },
  });

  const reportedPassword = await bcrypt.hash('reported123', 10);
  const reportedUser = await prisma.user.upsert({
    where: { email: 'reported@scada.com' },
    update: {},
    create: {
      username: 'reported_user',
      email: 'reported@scada.com',
      password: reportedPassword,
      phone_number: '+628987654321',
      employee_number: 'EMP003',
      userRoleId: userRole.id,
    },
  });

  const reportCategory = await prisma.reportCategory.upsert({
    where: { category_name: 'Pelanggaran Etika' },
    update: {},
    create: {
      category_name: 'Pelanggaran Etika',
    },
  });

  await prisma.report.create({
    data: {
      reportToId: reportedUser.id,
      reportFromId: reporterUser.id,
      reportCategoryId: reportCategory.id,
      report_description:
        'User melakukan pelanggaran etika saat meeting online.',
      report_image: 'https://example.com/report-image.jpg',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
