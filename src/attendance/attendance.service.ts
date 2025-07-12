import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAttendanceRequest } from "./dto/create-attendance.dto";
import { AttendanceResponse } from "./dto/attendance-response.dto";
import { getDistanceInMeters } from "src/utils/haversine-formula";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TodayAttendanceDto } from "./dto/today-attendance.dto";
import { AttendanceInitDto } from "./dto/attendance-init.dto";


@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
  constructor(private prisma: PrismaService) {}

  async getInit(staffId: string): Promise<AttendanceInitDto> {
    try {
      const us = await this.prisma.userSite.findFirst({
        where: { userId: staffId, deleted_at: null },
        include: { rtuConfiguration: true },
      });
      if (!us) {
        throw new NotFoundException(`You are not assigned to any site`);
      }
      const { latitude, longitude, radius, id: rtuId } = us.rtuConfiguration;

      const todayShort = new Date().toLocaleDateString("en-US", { weekday: 'short' });
      const defs = await this.prisma.scheduleDefinition.findMany({
        where: {
          rtuId,
          daysOfWeek: { contains: todayShort},
          deleted_at: null,
        }
      })

      if (defs.length === 0) {
        throw new NotFoundException("No Shift defined for today");
      }
      const def = defs[0];
      const shift = await this.prisma.shift.findUnique({
        where: { id: def.shiftId, deleted_at: null },
      })

      if (!shift) {
        throw new NotFoundException("Shift not found for today");
      }

      const now = new Date();
      const stTemplate = new Date(shift.startTime);
      const shiftStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        stTemplate.getHours(),
        stTemplate.getMinutes(),
        stTemplate.getSeconds()
      );

      const etTemplate = new Date(shift.endTime);
      const shiftEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        etTemplate.getHours(),
        etTemplate.getMinutes(),
        etTemplate.getSeconds()
      )

      const startOfDay = new Date(now).setHours(0, 0, 0, 0);
      const endOfDay = new Date(now).setHours(23, 59, 59, 999);
      const rec = await this.prisma.attendance.findFirst({
        where: {
          staff_id: staffId,
          checked_in: { gte: new Date(startOfDay), lt: new Date(endOfDay) },
        },
      })
      return {
        latitude,
        longitude,
        radius,
        shiftStart,
        shiftEnd,
        checkedIn: rec?.checked_in ?? undefined,
        checkedOut: rec?.checked_out ?? undefined,
      };
    } catch (error) {
      this.logger.error(`Error fetching attendance init for staff ID ${staffId}: ${error.message}`, error.stack);
      if (error.getStatus) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch attendance init: ${error.message}`,
      );
    }
  }

  async toggleAttendance(dto: CreateAttendanceRequest, staffId: string): Promise<AttendanceResponse> {
    try {
      const us = await this.prisma.userSite.findFirst({
        where: { userId: staffId, deleted_at: null},
        include: { rtuConfiguration: true, user: true}
      });
      if (!us) {
        throw new NotFoundException(`User with ID ${staffId} not found or not assigned to any site.`);
      }

      const { latitude, longitude, radius } = us.rtuConfiguration;
      const distance = getDistanceInMeters(
        dto.latitude,
        dto.longitude,
        latitude,
        longitude
      )
      if (distance > radius) {
        throw new ForbiddenException({
          message: "You are too far from the site to check in/out.",
          distance: Math.round(distance),
          radius: Math.round(radius),
        })
      }

      const existing = await this.prisma.attendance.findFirst({
        where: { staff_id: staffId, checked_out: null },
      })

      let rec;
      if (!existing) {
        rec = await this.prisma.attendance.create({
          data: { staff: { connect: { id: staffId } } },
          include: { staff: true },
        })
      } else {
        rec = await this.prisma.attendance.update({
          where: { id: existing.id },
          data: { checked_out: new Date() },
          include: { staff: true },
        })
      }

      return {
        staffId: rec.staff_id,
        staffName: rec.staff.username,
        checkedIn: rec.checked_in,
        checkedOut: rec.checked_out ?? undefined,
      };

    } catch (error) {
      this.logger.error(`Error toggling attendance for staff ID ${staffId}: ${error.message}`, error.stack);

      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new InternalServerErrorException("Attendance record referenced invalid data")
      }
      if (error.getStatus && error.getResponse) {
        throw error
      }
      throw new InternalServerErrorException(
        `Failed to toggle attendance: &{error.message}`,
      )
    }
  }

  async getAllCheckIns(): Promise<AttendanceResponse[]> {
    try {
      const all = await this.prisma.attendance.findMany({
        include: { staff: true },
        orderBy: { checked_in: 'desc' },
      });
      return all.map(rec => ({
        staffId: rec.staff_id,
        staffName: rec.staff.username,
        checkedIn: rec.checked_in,
        checkedOut: rec.checked_out ?? undefined,
      }));
    } catch (error) {
      this.logger.error(`Error fetching all check-ins: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch all check-ins: ${error.message}`,
      );
    }
  }

  async getTodayAttendance(staffId: string): Promise<TodayAttendanceDto> {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const rec = await this.prisma.attendance.findFirst({
        where: {
          staff_id: staffId,
          checked_in: { gte: start, lte: end },
        }
      })

      if (!rec) {
        return {};
      }
      return {
        checkedIn: rec.checked_in,
        checkedOut: rec.checked_out ?? undefined,
      }
    } catch (error) {
      this.logger.error(`Error fetching today's attendance for staff ID ${staffId}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch today's attendance: ${error.message}`,
      );
    }
  }
}
