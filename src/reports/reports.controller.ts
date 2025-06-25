import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './reports.service';
import { WebResponse } from 'src/model/web.model';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportByReportIdRequest,
  GetReportByReportIdResponse,
  GetReportsByFilterRequest,
  GetReportsByFilterResponse,
  GetReportsByIdRequest,
  GetReportsByIdResponse,
  GetSentReportByIdResponse,
} from 'src/model/report.model';
import { GetReportCategoryResponse } from 'src/model/reportCategory.model';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import {
  CreateReportReplyRequest,
  CreateReportReplyResponse,
  GetRepliesByReportIdRequest,
  GetRepliesByReportIdResponse,
} from 'src/model/report.reply.model';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('/api/reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  async create(
    @Body() request: CreateReportRequest,
  ): Promise<WebResponse<CreateReportResponse>> {
    console.log(request);
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

  @Get('/get-report-by-id/:id')
  @HttpCode(200)
  async getReportByReportId(
    @Param('id') id: string,
  ): Promise<WebResponse<GetReportByReportIdResponse | null>> {
    const reportId: GetReportByReportIdRequest = {
      reportId: id,
    };
    const result = await this.reportService.getReportByReportId(reportId);

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

  @Post('/:reportId/replies')
  async createReply(
    @Param('reportId') reportId: string,
    @Body() request: Omit<CreateReportReplyRequest, 'reportId'>,
    user: User,
  ): Promise<WebResponse<CreateReportReplyResponse>> {
    const createRequest: CreateReportReplyRequest = {
      reportId,
      userId: user.id,
      message: request.message,
      parentReplyId: request.parentReplyId,
    };

    const result = await this.reportService.createReply(createRequest);
    return {
      data: result,
    };
  }

  @Get('/:reportId/replies')
  async getReplies(
    @Param('reportId') reportId: string,
  ): Promise<WebResponse<GetRepliesByReportIdResponse>> {
    const request: GetRepliesByReportIdRequest = {
      reportId,
    };

    const result = await this.reportService.getRepliesByReportId(request);
    return {
      data: result,
    };
  }

  @Put('/:reportId/approve')
  async approveReport(
    @Param('reportId') reportId: string,
    @Body() body: { userId: string },
  ): Promise<WebResponse<string>> {
    await this.reportService.updateReportStatus(
      reportId,
      'APPROVED',
      body.userId,
    );
    return {
      data: 'Report approved',
    };
  }

  @Put('/:reportId/reject')
  async rejectReport(
    @Param('reportId') reportId: string,
    user: User,
  ): Promise<WebResponse<string>> {
    await this.reportService.updateReportStatus(reportId, 'REJECTED', user.id);
    return {
      data: 'Report rejected',
    };
  }

  @Put('/:reportId/request-revision')
  async requestRevision(
    @Param('reportId') reportId: string,
    user: User,
  ): Promise<WebResponse<string>> {
    await this.reportService.updateReportStatus(reportId, 'REVISION', user.id);
    return {
      data: 'Report need revision',
    };
  }

  @Put('/:reportId/close')
  async closeReport(
    @Param('reportId') reportId: string,
    user: User,
  ): Promise<WebResponse<string>> {
    await this.reportService.updateReportStatus(reportId, 'CLOSED', user.id);
    return {
      data: 'Report closed',
    };
  }
}
