import { z, ZodType } from 'zod';

export class ReportValidation {
  static readonly CREATE: ZodType = z.object({
    reportToId: z.string().min(1).max(100),
    reportFromId: z.string().min(1).max(100),
    reportCategoryId: z.string().min(1).max(100),
    updatedBy: z.string().min(1).max(100).optional().nullable(),
    reportImage: z.string().min(1).max(255).optional().nullable(),
    reportDescription: z.string().min(1).max(2000),
  });

  static readonly GET_REPORT_BY_SENDER_ID: ZodType = z.object({
    reportToId: z.string().min(1).max(100),
  });

  static readonly GET_REPORT_BY_ID: ZodType = z.object({
    reportFromId: z.string().min(1).max(100),
  });

  static readonly GET_REPORT_BY_FILTER: ZodType = z.object({
    reportFromId: z.string().min(1).max(100),
    reportToName: z.string().min(1).max(100).optional(),
    create_at: z.date().optional(),
    reportCategory: z.string().min(1).max(100).optional(),
  });

  static readonly GET_REPORT_BY_REPORT_ID: ZodType = z.object({
    reportId: z.string().min(1).max(100),
  });
}
