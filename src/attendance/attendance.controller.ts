import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CreateAttendanceRequest } from './dto/create-attendance.dto';
import { AttendanceInitDto } from './dto/attendance-init.dto';

@ApiTags('Attendance')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendance: AttendanceService) {}

  @Get('init')
  getInit(@Req() req): Promise<AttendanceInitDto> {
    const staffId = (req.user as any).userId;
    return this.attendance.getInit(staffId);
  }

  @Post('toggle')
  toggle(@Body() dto: CreateAttendanceRequest, @Req() req) {
    const staffId = (req.user as any).userId
    return this.attendance.toggleAttendance(dto, staffId)
  }

  @Get('all')
  log() {
    return this.attendance.getAllCheckIns()
  }
}
