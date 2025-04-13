import { z, ZodType } from 'zod';

export class ReportValidation {
  static readonly CREATE: ZodType = z.object({
    reportToId: z.string().min(1).max(100),
    reportFromId: z.string().min(1).max(100),
    reportCategoryId: z.string().min(1).max(100),
    updatedBy: z.string().min(1).max(100).optional(),
    reportImage: z.string().min(1).max(255).optional(),
    reportDescription: z.string().min(1).max(2000),
  });
}
