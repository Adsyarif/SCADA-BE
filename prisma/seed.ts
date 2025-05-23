import { UserRolePermission } from './../node_modules/.prisma/client/index.d';
import { PrismaClient } from '@prisma/client';
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

  const reportCategory1 = await prisma.reportCategory.upsert({
    where: { category_name: 'Technical Issue' },
    update: {},
    create: {
      category_name: 'Technical Issue',
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

  const report = await prisma.report.create({
    data: {
      reportToId: reportedUser.id,
      reportFromId: reporterUser.id,
      reportCategoryId: reportCategory1.id,
      report_description: 'Sensor tidak bekerja dengan baik di RTU-1.',
    },
  });

  const reply1 = await prisma.reportReply.create({
    data: {
      reportId: report.id,
      userId: reportedUser.id,
      message: 'Terima kasih atas laporannya, kami akan cek secepatnya.',
    },
  });

  const reply2 = await prisma.reportReply.create({
    data: {
      reportId: report.id,
      userId: reporterUser.id,
      parentReplyId: reply1.id,
      message: 'Baik, kami tunggu kabar selanjutnya.',
    },
  });

  await prisma.reportReply.create({
    data: {
      reportId: report.id,
      userId: reportedUser.id,
      parentReplyId: reply2.id,
      message: 'Sudah dicek, ternyata ada kabel yang longgar.',
    },
  });

  const supervisorPassword = await bcrypt.hash('supervisor123', 10);
  const supervisorUser = await prisma.user.upsert({
    where: { email: 'supervisor@scada.com' },
    update: {},
    create: {
      username: 'supervisor_user',
      email: 'supervisor@scada.com',
      password: supervisorPassword,
      phone_number: '+6281122334455',
      employee_number: 'EMP004',
      userRoleId: userRole.id,
    },
  });

  const staffPassword = await bcrypt.hash('staff123', 10);
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@scada.com' },
    update: {},
    create: {
      username: 'staff_user',
      email: 'staff@scada.com',
      password: staffPassword,
      phone_number: '+6285566778899',
      employee_number: 'EMP005',
      userRoleId: userRole.id,
    },
  });

  await prisma.userSupervisor.upsert({
    where: {
      supervisor_staff_unique: {
        staffId: staffUser.id,
        supervisorId: supervisorUser.id,
      },
    },
    update: {},
    create: {
      staffId: staffUser.id,
      supervisorId: supervisorUser.id,
    },
  });

  await prisma.userSupervisor.upsert({
    where: {
      supervisor_staff_unique: {
        staffId: reportedUser.id,
        supervisorId: supervisorUser.id,
      },
    },
    update: {},
    create: {
      staffId: reportedUser.id,
      supervisorId: supervisorUser.id,
    },
  });

  await prisma.userSupervisor.upsert({
    where: {
      supervisor_staff_unique: {
        staffId: reporterUser.id,
        supervisorId: supervisorUser.id,
      },
    },
    update: {},
    create: {
      staffId: reporterUser.id,
      supervisorId: supervisorUser.id,
    },
  });

  await prisma.attendance.createMany({
    data: [
      {
        id: 'attend-001',
        staff_id: staffUser.id,
        created_at: new Date('2025-01-01T08:00:00Z'),
      },
      {
        id: 'attend-002',
        staff_id: staffUser.id,
        created_at: new Date('2025-01-02T08:05:00Z'),
      },
    ],
    skipDuplicates: true,
  });

  const customerRole = await prisma.userRole.upsert({
    where: { roleName: 'Customer User' },
    update: {},
    create: {
      roleName: 'Customer User',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
