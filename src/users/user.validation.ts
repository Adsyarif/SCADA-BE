import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly GET_SUPERVISOR: ZodType = z.object({
    staffId: z.string().min(1).max(100),
  });

  static readonly GET_OPERATOR: ZodType = z.object({
    supervisorId: z.string().min(1).max(100),
  });
}
