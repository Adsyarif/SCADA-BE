import { z, ZodType } from 'zod';

export class CategoryReportValidation {
  static readonly CREATE: ZodType = z.object({
    categoryName: z.string().min(1).max(100),
    createdDate: z.string().min(1).max(100),
    categoryDescription: z.string().min(1).max(100),
    categoryCode: z.string().min(3).max(5),
  });
}
