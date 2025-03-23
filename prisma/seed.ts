import { PrismaClient } from '@prisma/client';

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
      })
    )
  );

  // Create master admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'masteradmin',
      email: 'admin@example.com',
      password: 'masteradmin@123',
      phone_number: '+1234567890',
      employee_number: 'ADMIN001',
      userRoleId: masterRole.id,
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