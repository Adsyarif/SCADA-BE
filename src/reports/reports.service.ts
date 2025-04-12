import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import {
  CreateReportRequest,
  CreateReportResponse,
} from 'src/model/report.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReportValidation } from './reports.validation';
import { PrismaService } from 'src/common/prisma.service';

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
    });

    const checkReport = await this.prismaService.report.findUnique({
      where: { id: createReport.id },
      include: {
        reportTo: true,
        reportFrom: true,
      },
    });

    if (!checkReport) {
      throw new HttpException('Failed to retrieve newly created report', 500);
    }

    const response: CreateReportResponse = {
      reportTo: checkReport.reportTo,
      reportFrom: checkReport.reportFrom,
    };

    return response;
  }
}
