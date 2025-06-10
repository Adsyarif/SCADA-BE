import { Module } from '@nestjs/common';
import { ScheduleDefinitionService } from './schedule-definition.service';
import { ScheduleDefinitionController } from './schedule-definition.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ScheduleDefinitionService, PrismaService],
  controllers: [ScheduleDefinitionController]
})
export class ScheduleDefinitionModule {}
