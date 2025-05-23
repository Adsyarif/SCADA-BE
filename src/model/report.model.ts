import { ReportCategory, User } from '@prisma/client';

import { IsString, IsOptional, Length } from 'class-validator';

export class CreateReportRequest {
  @IsString()
  @Length(1, 100)
  reportToId: string;

  @IsString()
  @Length(1, 100)
  reportFromId: string;

  @IsString()
  @Length(1, 100)
  reportCategoryId: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsString()
  reportImage?: string;

  @IsString()
  @Length(1, 2000)
  reportDescription: string;
}

export class CreateReportResponse {
  reportTo: string;
  reportToId: string;
  reportFrom: string;
  reportFromId: string;
  createdAt: Date;
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
  reportId: string;
  reportToId: string;
  reportTo: string;
  create_at: Date;
  reportCategoryId: string;
  reportCategory: string;
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

export class GetReportByReportIdRequest {
  reportId: string;
}

export class GetReportByReportIdResponse {
  reportId: string;
  reportToId: string;
  reportToName: string;
  create_at: Date;
  reportCategoryId: string;
  reportCategoryName: string;
  reportDescription: string;
  reportImage?: string | undefined | null;
}
