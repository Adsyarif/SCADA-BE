import { ReportCategory, User } from '@prisma/client';

export class CreateReportRequest {
  reportToId: string;
  reportFromId: string;
  reportCategoryId: string;
  updatedBy?: string;
  report_image?: string;
  report_description: string;
}

export class CreateReportResponse {
  reportTo: User;
  reportFrom: User;
}

export class GetSentReportByIdRequest {
  reportToId: string;
  reportFromId: string;
}

export class GetSentReportByIdResponse {
  reportFrom: User;
  create_at: Date;
  reportCategory: ReportCategory;
  reportDescription: string;
}

export class GetReportsByIdRequest {
  reportFromId: string;
}

export class GetReportsByIdResponse {
  reportTo: User;
  create_at: Date;
  reportCategory: ReportCategory;
  reportDescription: string;
}

export class GetReportsByFilterRequest {
  reportFromId: string;
  reportToName: string;
}

export class GetReportsByFilterResponse {
  reportTo: User;
  create_at: Date;
  reportCategory: ReportCategory;
  reportDescription: string;
}
