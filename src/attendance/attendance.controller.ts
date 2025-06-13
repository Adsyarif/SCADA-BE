import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { WebResponse } from 'src/model/web.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CreateAttendanceRequest } from './dto/create-attendance.dto';

@ApiTags('Attendance')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendance: AttendanceService) {}

  @Post('toggle')
  toggle(@Body() dto: CreateAttendanceRequest, @Req() req) {
    return this.attendance.toggleAttendance(dto, req.user.id)
  }

  @Get('all')
  log() {
    return this.attendance.getAllCheckIns()
  }
}
