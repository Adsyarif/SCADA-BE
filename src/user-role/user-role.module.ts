import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [UserRoleService, PrismaService],
  controllers: [UserRoleController]
})
export class UserRoleModule {}
