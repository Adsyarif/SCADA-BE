import { User } from '@prisma/client';

export class CreateReportRequest {
  reportToId: string;
  reportFromId: string;
  reportCategoryId: string;
  updatedBy?: string;
  reportImage?: string;
  reportDescription: string;
}

export class CreateReportResponse {
  reportTo: User;
  reportFrom: User;
}
