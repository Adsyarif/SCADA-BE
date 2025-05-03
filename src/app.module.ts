import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ReportsModule } from './reports/reports.module';
import { CommonModule } from './common/common.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AttendaceController } from './attendace/attendace.controller';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule, UsersModule, UserRoleModule, ReportsModule, CommonModule, PermissionsModule, AttendanceModule],
  controllers: [AppController, AttendaceController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
