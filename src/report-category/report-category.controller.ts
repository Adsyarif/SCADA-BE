import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import {
  CreateReportCategoryRequest,
  CreateReportCategoryResponse,
} from 'src/model/reportCategory.model';
import { WebResponse } from 'src/model/web.model';
import { ReportCategoryService } from './report-category.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/api/report-category')
export class ReportCategoryController {
  constructor(private reportCategoryService: ReportCategoryService) {}

  @Post()
  async create(
    @Body() request: CreateReportCategoryRequest,
  ): Promise<WebResponse<CreateReportCategoryResponse>> {
    console.log(request);
    const result =
      await this.reportCategoryService.createCategoryReport(request);
    return {
      data: result,
    };
  }
}
