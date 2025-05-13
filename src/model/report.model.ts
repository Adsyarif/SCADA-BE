import { ReportCategory, User } from '@prisma/client';

export class CreateReportRequest {
  reportToId: string;
  reportFromId: string;
  reportCategoryId: string;
  updatedBy?: string;
  reportImage?: string;
  reportDescription: string;
}

export class CreateReportResponse {
  reportTo: string;
  reportToId: string;
  reportFrom: string;
  reportFromId: string;
  createAt: Date;
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
  reportToName?: string;
  create_at?: Date;
  reportCategory?: ReportCategory;
}

export class GetReportsByFilterResponse {
  reportTo: User;
  create_at: Date;
  reportCategory: ReportCategory;
  reportDescription: string;
}
