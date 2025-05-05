import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './reports.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportsByFilterRequest,
  GetReportsByFilterResponse,
  GetReportsByIdRequest,
  GetReportsByIdResponse,
  GetSentReportByIdResponse,
} from 'src/model/report.model';
import { GetReportCategoryResponse } from 'src/model/reportCategory.model';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @Get('/categories')
  async getCategory(): Promise<WebResponse<GetReportCategoryResponse[]>> {
    const result = await this.reportService.getAllReportCategory();
    return {
      data: result,
    };
  }

  @Get('/get-report-to/:id/:sender')
  @HttpCode(200)
  async getSentReportById(
    @Param('id') id: string,
    @Param('sender') senderId: string,
  ): Promise<WebResponse<GetSentReportByIdResponse[]>> {
    const userId = {
      reportToId: id,
      reportFromId: senderId,
    };
    const result = await this.reportService.getReportBySenderId(userId);
    return {
      data: result,
    };
  }

  @Get('/get-report/:id')
  @HttpCode(200)
  async getReportsById(
    @Param('id') id: string,
  ): Promise<WebResponse<GetReportsByIdResponse[]>> {
    const userId: GetReportsByIdRequest = {
      reportFromId: id,
    };
    const result = await this.reportService.getReportById(userId);

    return {
      data: result,
    };
  }

  @Get('filter-report')
  @HttpCode(200)
  async getReportByFilter(
    @Body() request: GetReportsByFilterRequest,
  ): Promise<WebResponse<GetReportsByFilterResponse[]>> {
    const reports = await this.reportService.getReportByFilter(request);

    return {
      data: reports,
    };
  }
}
