import { Module } from '@nestjs/common';
import { ReportCategoryController } from './report-category.controller';
import { ReportCategoryService } from './report-category.service';

@Module({
  controllers: [ReportCategoryController],
  providers: [ReportCategoryService]
})
export class ReportCategoryModule {}
