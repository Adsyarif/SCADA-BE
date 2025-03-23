import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserRoleModule } from './user-role/user-role.module';

@Module({
  imports: [AuthModule, UsersModule, UserRoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
