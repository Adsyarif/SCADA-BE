import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import {
  CreateAttendanceRequest,
  CreateAttendanceResponse,
} from 'src/model/attendance.model';
import { AttendanceValidation } from './attendance.validation';

@Injectable()
export class AttendanceService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createAttendance(
    request: CreateAttendanceRequest,
  ): Promise<CreateAttendanceResponse> {
    this.logger.info(`Create new attendance: ${JSON.stringify(request)}`);

    const createAttendanceRequest: CreateAttendanceRequest =
      this.validationService.validate(AttendanceValidation.CREATE, request);

    const createAttendance = await this.prismaService.attendance.create({
      data: {
        staff_id: createAttendanceRequest.staffId,
      },
      include: {
        staff: true,
      },
    });

    return {
      staffName: createAttendance?.staff.username,
      createAt: createAttendance?.created_at,
    };
  }
}
