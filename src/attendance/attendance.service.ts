import { Attendance } from './../../node_modules/.prisma/client/index.d';
import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import {
  CreateAttendanceRequest,
  CreateAttendanceResponse,
  GetAllAttenndanceResponse,
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

    try {
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
    } catch (error) {
      this.logger.error(`Error creating attendance: ${error.message}`);
      throw new Error('Failed to create attendance');
    }
  }

  async getAllAttendance(): Promise<GetAllAttenndanceResponse[]> {
    this.logger.info(`Get all attendance`);

    try {
      const allAttendance = await this.prismaService.attendance.findMany({
        include: {
          staff: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return allAttendance.map((att) => ({
        staffId: att.staff_id,
        staffName: att.staff.username,
        createDate: att.created_at,
      }));
    } catch (error) {
      this.logger.error(`Failed to get attendance: ${error.message}`);
      throw new Error('Failed to fetch attendance data');
    }
  }

  async gettAttendanceByFilter() {}
}
