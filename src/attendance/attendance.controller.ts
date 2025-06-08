import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceRequest,
  CreateAttendanceResponse,
  GetAllAttenndanceResponse,
} from 'src/model/attendance.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  async create(
    @Body() request: CreateAttendanceRequest,
  ): Promise<WebResponse<CreateAttendanceResponse>> {
    const result = await this.attendanceService.createAttendance(request);
    return {
      data: result,
    };
  }

  @Get('/all')
  async getAllAttendance(): Promise<WebResponse<GetAllAttenndanceResponse[]>> {
    const result = await this.attendanceService.getAllAttendance();
    return {
      data: result,
    };
  }
}
