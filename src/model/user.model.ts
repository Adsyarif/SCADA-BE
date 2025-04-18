import { User } from '@prisma/client';

export class GetSupervisorRequest {
  staffId: string;
}

export class GetSupervisorResponse {
  supervisor: User;
}
