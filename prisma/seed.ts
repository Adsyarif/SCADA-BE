import { PrismaClient, ReportStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const permissions = await prisma.permission.createMany({
    data: [
      { permissionCode: 'manage:users', permissionName: 'Manage Users' },
      { permissionCode: 'manage:roles', permissionName: 'Manage Roles' },
      {
        permissionCode: 'manage:permissions',
        permissionName: 'Manage Permissions',
      },
      { permissionCode: 'manage:content', permissionName: 'Manage Content' },
      { permissionCode: 'create:reports', permissionName: 'Manage Reports' },
      { permissionCode: 'manage:settings', permissionName: 'Manage Settings' },
      { permissionCode: 'view:operators', permissionName: 'Daftar Operator' },
      { permissionCode: 'staff:attendance', permissionName: 'Attendance' },
      {
        permissionCode: 'manage:rtu-site',
        permissionName: 'RTU Site Configuration',
      },
      { permissionCode: 'message', permissionName: 'Message' },
      { permissionCode: 'user:profile', permissionName: 'User Profile' },
      { permissionCode: 'homepage', permissionName: 'Homepage' },
      { permissionCode: 'reporting', permissionName: 'Reporting' },
      {
        permissionCode: 'report:attendance',
        permissionName: 'Attendance Report',
      },
      { permissionCode: 'manage:schedule', permissionName: 'Schedule' },
      { permissionCode: 'manage:shifts', permissionName: 'Shifts' },
    ],
    skipDuplicates: true,
  });

  const masterRole = await prisma.userRole.upsert({
    where: { roleName: 'Master Admin' },
    update: {},
    create: {
      roleName: 'Master Admin',
    },
  });

  const allPermissions = await prisma.permission.findMany();
  console.log(allPermissions);

  if (allPermissions.length === 0) {
    console.error('Permissions are not properly created.');
    return;
  }

  await prisma.userRolePermission.deleteMany({
    where: { userRoleId: masterRole.id },
  });

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

  await prisma.$transaction(
    allPermissions.map((permission) =>
      prisma.userRolePermission.create({
        data: {
          userRoleId: userRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
