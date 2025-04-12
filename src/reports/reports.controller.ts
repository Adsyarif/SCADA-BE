import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './reports.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateReportRequest,
  CreateReportResponse,
} from 'src/model/report.model';

@Controller('/api/reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  async create(
    @Body() request: CreateReportRequest,
  ): Promise<WebResponse<CreateReportResponse>> {
    const result = await this.reportService.createReport(request);
    return {
      data: result,
    };
  }
}
