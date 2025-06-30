import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import {
  CreateReportRequest,
  CreateReportResponse,
  GetReportByReportIdRequest,
  GetReportByReportIdResponse,
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
import {
  CreateReportReplyRequest,
  CreateReportReplyResponse,
  GetRepliesByReportIdRequest,
  GetRepliesByReportIdResponse,
  ReplyDetail,
} from 'src/model/report.reply.model';
import { ReportStatus } from '@prisma/client';

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
    try {
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

      return {
        reportTo: createReport.reportTo.username,
        reportToId: createReport.reportToId,
        reportFrom: createReport.reportFrom.username,
        reportFromId: createReport.reportFromId,
        createdAt: createReport.created_at,
      };
    } catch (error) {
      this.logger.error('Error creating report', error);
      throw new Error('Failed to create report');
    }
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
        replies: true,
      },
    });

    if (!reports || reports.length === 0) {
      return [];
    }

    return reports.map((report) => ({
      reportId: report.id,
      reportToId: report.reportToId,
      reportTo: report.reportTo.username,
      create_at: report.created_at,
      reportCategoryId: report.reportCategory.id,
      reportCategory: report.reportCategory.category_name,
      reportDescription: report.report_description,
      status: report.status,
      replies: report.replies,
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

  async getReportByReportId(
    request: GetReportByReportIdRequest,
  ): Promise<GetReportByReportIdResponse | null> {
    try {
      const getReportByReportIdRequest: GetReportByReportIdRequest =
        this.validationService.validate(
          ReportValidation.GET_REPORT_BY_REPORT_ID,
          request,
        );
      const report = await this.prismaService.report.findUnique({
        where: {
          id: getReportByReportIdRequest.reportId,
        },
        include: {
          reportCategory: true,
          reportFrom: true,
          reportTo: true,
          replies: true,
        },
      });

      if (!report) {
        return null;
      }

      return {
        reportId: report.id,
        reportToId: report.reportTo.id,
        reportToName: report.reportTo.username,
        reportFromId: report.reportFromId,
        create_at: report.created_at,
        reportCategoryId: report.reportCategoryId,
        reportCategoryName: report.reportCategory.category_name,
        reportDescription: report.report_description,
        reportImage: report.report_image,
        replies: report.replies,
        status: report.status,
      };
    } catch (error) {
      this.logger.error('Error creating report', error);
      throw new HttpException('Report not found', 404);
    }
  }

  async createReply(
    request: CreateReportReplyRequest,
  ): Promise<CreateReportReplyResponse> {
    try {
      this.logger.info(`Creating new reply: ${JSON.stringify(request)}`);

      const createReplyRequest: CreateReportReplyRequest =
        this.validationService.validate(ReportValidation.CREATE_REPLY, request);

      const reportExists = await this.prismaService.report.findUnique({
        where: { id: createReplyRequest.reportId },
      });

      if (!reportExists) {
        throw new HttpException('Report not found', 404);
      }

      if (createReplyRequest.parentReplyId) {
        const parentReplyExists =
          await this.prismaService.reportReply.findUnique({
            where: { id: createReplyRequest.parentReplyId },
          });

        if (!parentReplyExists) {
          throw new HttpException('Parent reply not found', 404);
        }
      }

      const reply = await this.prismaService.reportReply.create({
        data: {
          reportId: createReplyRequest.reportId,
          userId: createReplyRequest.userId,
          message: createReplyRequest.message,
          parentReplyId: createReplyRequest.parentReplyId || null,
        },
      });

      return {
        replyId: reply.id,
        createdAt: reply.created_at,
      };
    } catch (error) {
      this.logger.error('Error creating reply', error);
      throw new HttpException('Failed to create reply', 500);
    }
  }

  async getRepliesByReportId(
    request: GetRepliesByReportIdRequest,
  ): Promise<GetRepliesByReportIdResponse> {
    try {
      this.logger.info(
        `Getting replies for report: ${JSON.stringify(request)}`,
      );

      const getRepliesRequest: GetRepliesByReportIdRequest =
        this.validationService.validate(ReportValidation.GET_REPLIES, request);

      const reportExists = await this.prismaService.report.findUnique({
        where: { id: getRepliesRequest.reportId },
      });

      if (!reportExists) {
        throw new HttpException('Report not found', 404);
      }

      const replies = await this.prismaService.reportReply.findMany({
        where: {
          reportId: getRepliesRequest.reportId,
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      const replyMap = new Map<string, ReplyDetail>();
      const rootReplies: ReplyDetail[] = [];

      for (const reply of replies) {
        const replyDetail: ReplyDetail = {
          replyId: reply.id,
          userId: reply.userId,
          username: reply.user.username,
          message: reply.message,
          parentReplyId: reply.parentReplyId || undefined,
          createdAt: reply.created_at,
          replies: [],
        };

        replyMap.set(reply.id, replyDetail);

        if (!reply.parentReplyId) {
          rootReplies.push(replyDetail);
        }
      }

      for (const reply of replies) {
        if (reply.parentReplyId) {
          const parent = replyMap.get(reply.parentReplyId);
          if (parent) {
            const childReply = replyMap.get(reply.id);
            if (childReply) {
              parent.replies.push(childReply);
            }
          }
        }
      }

      return {
        replies: rootReplies,
      };
    } catch (error) {
      this.logger.error('Error getting replies', error);
      throw new HttpException('Failed to get replies', 500);
    }
  }

  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    userId: string,
  ): Promise<void> {
    try {
      this.logger.info(`Updating report ${reportId} status to ${status}`);

      const report = await this.prismaService.report.findUnique({
        where: { id: reportId },
        include: {
          reportFrom: {
            include: {
              asStaffIn: {
                where: {
                  supervisorId: userId,
                },
              },
            },
          },
        },
      });

      if (!report) {
        throw new HttpException('Report not found', 404);
      }

      if (report.reportFrom.asStaffIn.length === 0) {
        throw new HttpException('Unauthorized to update this report', 403);
      }

      await this.prismaService.report.update({
        where: { id: reportId },
        data: {
          status,
          updated_by: userId,
        },
      });
    } catch (error) {
      this.logger.error('Error updating report status', error);
      throw new HttpException('Failed to update report status', 500);
    }
  }
}
