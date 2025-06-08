import { Module } from '@nestjs/common';
import { ReportCategoryController } from './report-category.controller';
import { ReportCategoryService } from './report-category.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ReportCategoryController],
  providers: [ReportCategoryService, PrismaService],
})
export class ReportCategoryModule {}
