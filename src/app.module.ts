import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule, UsersModule, UserRoleModule, ReportsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
