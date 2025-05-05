import { Module } from '@nestjs/common';
import { ReportController } from './reports.controller';
import { ReportService } from './reports.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportsModule {}
