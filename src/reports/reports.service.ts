import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportsByFilterRequest,
  GetReportsByFilterResponse,
  GetReportsByIdRequest,
  GetReportsByIdResponse,
  GetSentReportByIdRequest,
  GetSentReportByIdResponse,
} from 'src/model/report.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReportValidation } from './reports.validation';
import { PrismaService } from 'src/common/prisma.service';
import { GetReportCategoryResponse } from 'src/model/reportCategory.model';

@Injectable()
export class ReportService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createReport(
    request: CreateReportRequest,
  ): Promise<CreateReportResponse> {
    this.logger.info(`Register new report: ${JSON.stringify(request)}`);

    const createReportRequest: CreateReportRequest =
      this.validationService.validate(ReportValidation.CREATE, request);

    const createReport = await this.prismaService.report.create({
      data: {
        reportToId: createReportRequest.reportToId,
        reportFromId: createReportRequest.reportFromId,
        reportCategoryId: createReportRequest.reportCategoryId,
        report_description: createReportRequest.reportDescription,
        updated_by: createReportRequest.updatedBy,
        report_image: createReportRequest.reportImage,
      },
      include: {
        reportTo: true,
        reportFrom: true,
      },
    });

    const response: CreateReportResponse = {
      reportTo: createReport.reportTo.username,
      reportToId: createReport.reportToId,
      reportFrom: createReport.reportFrom.username,
      reportFromId: createReport.reportFromId,
      createAt: createReport.created_at,
    };

    return response;
  }

  async getAllReportCategory(): Promise<GetReportCategoryResponse[]> {
    const response = await this.prismaService.reportCategory.findMany();

    const categories = response.map((category) => ({
      categoryId: category.id,
      categoryName: category.category_name,
    }));

    return categories;
  }

  async getReportBySenderId(
    request: GetSentReportByIdRequest,
  ): Promise<GetSentReportByIdResponse[]> {
    this.logger.info(
      `ReportService.getReportBySenderId (${JSON.stringify(request)})`,
    );

    const getReportBySenderIdRequest: GetSentReportByIdRequest =
      this.validationService.validate(
        ReportValidation.GET_REPORT_BY_SENDER_ID,
        request,
      );

    const reports = await this.prismaService.report.findMany({
      where: {
        reportToId: getReportBySenderIdRequest.reportToId,
        reportFromId: getReportBySenderIdRequest.reportFromId,
      },
      include: {
        reportTo: true,
        reportFrom: true,
        reportCategory: true,
      },
    });

    if (!reports || reports.length === 0) {
      throw new HttpException('Reports are not found', 404);
    }

    return reports.map((report) => ({
      reportFrom: report.reportFrom,
      create_at: report.created_at,
      reportCategory: report.reportCategory,
      reportDescription: report.report_description,
    }));
  }

  async getReportById(
    request: GetReportsByIdRequest,
  ): Promise<GetReportsByIdResponse[]> {
    this.logger.info(
      `ReportService.getReportsById (${JSON.stringify(request)})`,
    );

    const getReportsByIdRequest: GetReportsByIdRequest =
      this.validationService.validate(
        ReportValidation.GET_REPORT_BY_ID,
        request,
      );

    const reports = await this.prismaService.report.findMany({
      where: {
        reportFromId: getReportsByIdRequest.reportFromId,
      },
      include: {
        reportTo: true,
        reportFrom: true,
        reportCategory: true,
      },
    });

    if (!reports || reports.length === 0) {
      throw new HttpException('Report are not found', 400);
    }

    return reports.map((report) => ({
      reportTo: report.reportTo,
      create_at: report.created_at,
      reportCategory: report.reportCategory,
      reportDescription: report.report_description,
    }));
  }

  async getReportByFilter(
    request: GetReportsByFilterRequest,
  ): Promise<GetReportsByFilterResponse[]> {
    this.logger.info(
      `ReportService.getReportsByFilter (${JSON.stringify(request)})`,
    );

    const getReportsByFilterRequest = this.validationService.validate(
      ReportValidation.GET_REPORT_BY_FILTER,
      request,
    );

    const filters: any = {
      reportFromId: getReportsByFilterRequest.reportFromId,
    };

    if (getReportsByFilterRequest.reportCategory) {
      filters.reportCategory = getReportsByFilterRequest.reportCategory;
    }

    if (getReportsByFilterRequest.create_at) {
      filters.created_at = new Date(getReportsByFilterRequest.create_at);
    }

    if (getReportsByFilterRequest.reportToName) {
      filters.reportTo = {
        name: {
          contains: getReportsByFilterRequest.reportToName,
          mode: 'insensitive',
        },
      };
    }

    const reports = await this.prismaService.report.findMany({
      where: filters,
      include: {
        reportCategory: true,
        reportTo: true,
      },
    });

    if (!reports || reports.length === 0) {
      throw new HttpException('Reports not found', 404);
    }

    return reports.map((report) => ({
      reportTo: report.reportTo,
      create_at: report.created_at,
      reportCategory: report.reportCategory,
      reportDescription: report.report_description,
    }));
  }
}
