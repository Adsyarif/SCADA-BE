import { z, ZodType } from 'zod';

export class AttendanceValidation {
  static readonly CREATE: ZodType = z.object({
    staffId: z.string().min(1).max(100),
  });
}
