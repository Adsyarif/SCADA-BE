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

  const supervisorRole = await prisma.userRole.upsert({
    where: { roleName: 'supervisor' },
    update: {},
    create: {
      roleName: 'supervisor',
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

  await prisma.$transaction(
    allPermissions.map((permission) =>
      prisma.userRolePermission.create({
        data: {
          userRoleId: supervisorRole.id,
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
      userRoleId: supervisorRole.id,
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

  const staff1Password = await bcrypt.hash('staff1123', 10);
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@scada.com' },
    update: {},
    create: {
      username: 'staff1_user',
      email: 'staff1@scada.com',
      password: staff1Password,
      phone_number: '+6281122334456',
      employee_number: 'EMP006',
      userRoleId: userRole.id,
    },
  });

  const staff2Password = await bcrypt.hash('staff2123', 10);
  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@scada.com' },
    update: {},
    create: {
      username: 'staff2_user',
      email: 'staff2@scada.com',
      password: staff2Password,
      phone_number: '+6281122334457',
      employee_number: 'EMP007',
      userRoleId: userRole.id,
    },
  });

  const supervisor1Password = await bcrypt.hash('supervisor1123', 10);
  const supervisor1 = await prisma.user.upsert({
    where: { email: 'supervisor1@scada.com' },
    update: {},
    create: {
      username: 'supervisor1_user',
      email: 'supervisor1@scada.com',
      password: supervisor1Password,
      phone_number: '+6281122334458',
      employee_number: 'EMP008',
      userRoleId: supervisorRole.id,
    },
  });

  await prisma.userSupervisor.createMany({
    data: [
      {
        staffId: staff1.id,
        supervisorId: supervisor1.id,
      },
      {
        staffId: staff2.id,
        supervisorId: supervisor1.id,
      },
      {
        staffId: staffUser.id,
        supervisorId: supervisor1.id,
      },
    ],
    skipDuplicates: true,
  });

  const performanceCategory = await prisma.reportCategory.upsert({
    where: { category_name: 'Performance Issue' },
    update: {},
    create: {
      category_name: 'Performance Issue',
    },
  });

  const safetyCategory = await prisma.reportCategory.upsert({
    where: { category_name: 'Safety Concern' },
    update: {},
    create: {
      category_name: 'Safety Concern',
    },
  });

  const technicalCategory = await prisma.reportCategory.upsert({
    where: { category_name: 'Techincal Concern' },
    update: {},
    create: {
      category_name: 'Techincal Concern',
    },
  });

  const report1 = await prisma.report.create({
    data: {
      reportToId: supervisor1.id,
      reportFromId: staff1.id,
      reportCategoryId: performanceCategory.id,
      report_description:
        'Saya menemukan performa mesin RTU-01 menurun drastis sejak kemarin.',
      status: ReportStatus.PENDING,
    },
  });

  const report2 = await prisma.report.create({
    data: {
      reportToId: supervisor1.id,
      reportFromId: staff2.id,
      reportCategoryId: safetyCategory.id,
      report_description:
        'Ada kebocoran gas di area RTU-03, perlu penanganan segera!',
      status: ReportStatus.PENDING,
    },
  });

  const report3 = await prisma.report.create({
    data: {
      reportToId: supervisor1.id,
      reportFromId: staffUser.id,
      reportCategoryId: technicalCategory.id,
      report_description:
        'Sensor tekanan di RTU-05 menunjukkan angka tidak stabil.',
      status: ReportStatus.APPROVED,
    },
  });

  const reply1_1 = await prisma.reportReply.create({
    data: {
      reportId: report1.id,
      userId: supervisor1.id,
      message: 'Terima kasih laporannya. Sudah dicek parameter apa saja?',
      created_at: new Date('2023-05-01T10:00:00Z'),
    },
  });

  const reply1_2 = await prisma.reportReply.create({
    data: {
      reportId: report1.id,
      userId: staff1.id,
      parentReplyId: reply1_1.id,
      message:
        'Sudah saya cek flow rate dan pressure, keduanya di bawah normal.',
      created_at: new Date('2023-05-01T11:30:00Z'),
    },
  });

  const reply1_3 = await prisma.reportReply.create({
    data: {
      reportId: report1.id,
      userId: supervisor1.id,
      parentReplyId: reply1_2.id,
      message: 'Baik, saya akan kirim tim maintenance untuk cek lebih lanjut.',
      created_at: new Date('2023-05-01T13:15:00Z'),
    },
  });

  const reply2_1 = await prisma.reportReply.create({
    data: {
      reportId: report2.id,
      userId: supervisor1.id,
      message:
        'Laporan diterima! Tim evakuasi sedang menuju lokasi. Mohon jauhi area tersebut!',
      created_at: new Date('2023-05-02T09:05:00Z'),
    },
  });

  const reply2_2 = await prisma.reportReply.create({
    data: {
      reportId: report2.id,
      userId: staff2.id,
      message: 'Sudah saya evakuasi area dan pasang tanda bahaya.',
      created_at: new Date('2023-05-02T09:20:00Z'),
    },
  });

  const reply3_1 = await prisma.reportReply.create({
    data: {
      reportId: report3.id,
      userId: supervisor1.id,
      message: 'Sensor sudah diganti dan berfungsi normal?',
      created_at: new Date('2023-05-03T14:00:00Z'),
    },
  });

  const reply3_2 = await prisma.reportReply.create({
    data: {
      reportId: report3.id,
      userId: staffUser.id,
      parentReplyId: reply3_1.id,
      message:
        'Sudah normal kembali. Kalibrasi terakhir menunjukkan akurasi 99%.',
      created_at: new Date('2023-05-03T15:30:00Z'),
    },
  });

  const report4 = await prisma.report.create({
    data: {
      reportToId: supervisor1.id,
      reportFromId: staff2.id,
      reportCategoryId: performanceCategory.id,
      report_description:
        'Ada anomaly pada data logger RTU-02 sejak update terakhir.',
      status: ReportStatus.REVISION,
    },
  });

  const reply4_1 = await prisma.reportReply.create({
    data: {
      reportId: report4.id,
      userId: supervisor1.id,
      message: 'Bisa dijelaskan lebih detail anomaly yang dimaksud?',
      created_at: new Date('2023-05-04T08:00:00Z'),
    },
  });

  const reply4_2 = await prisma.reportReply.create({
    data: {
      reportId: report4.id,
      userId: staff2.id,
      parentReplyId: reply4_1.id,
      message:
        'Data flow rate melompat-lompat padahal tidak ada perubahan pada flow actual.',
      created_at: new Date('2023-05-04T09:15:00Z'),
    },
  });

  const reply4_3 = await prisma.reportReply.create({
    data: {
      reportId: report4.id,
      userId: supervisor1.id,
      parentReplyId: reply4_2.id,
      message: 'Mohon screenshot grafiknya untuk 24 jam terakhir.',
      created_at: new Date('2023-05-04T10:30:00Z'),
    },
  });

  const reply4_4 = await prisma.reportReply.create({
    data: {
      reportId: report4.id,
      userId: staff2.id,
      parentReplyId: reply4_3.id,
      message:
        'Berikut grafiknya: [image-link]. Terlihat spike tidak wajar setiap 2 jam.',
      created_at: new Date('2023-05-04T11:45:00Z'),
    },
  });

  console.log('Seeding completed!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
