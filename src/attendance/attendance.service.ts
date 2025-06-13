import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAttendanceRequest } from "./dto/create-attendance.dto";
import { AttendanceResponse } from "./dto/attendance-response.dto";
import { getDistanceInMeters } from "src/utils/haversine-formula";


@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async toggleAttendance(req: CreateAttendanceRequest, staffId: string): Promise<AttendanceResponse> {
    const us = await this.prisma.userSite.findFirst({
      where: { userId: staffId, deleted_at: null },
      include: { rtuConfiguration : true, user: true }
    })

    if (!us) throw new NotFoundException('User not assigned to any RTU')
    
    const { latitude, longitude, radius } = us.rtuConfiguration;
    const dist = getDistanceInMeters(
      req.latitude, req.longitude,
      latitude, longitude
    )
    if (dist > radius) {
      throw new ForbiddenException({
        message: 'Too far from RTU',
        distance: Math.round(dist),
        radius: Math.round(radius)
      })
    }
    const existing = await this.prisma.attendance.findFirst({
      where: { staff_id: staffId, checked_out: null}
    })

    if (!existing) {
      const rec = await this.prisma.attendance.create({
        data: { staff_id: staffId },
        include: { staff: true }
      })
      return {
        staffId: rec.staff_id,
        staffName: rec.staff.username,
        createDate: rec.checked_in,
      }
    } else {
      const rec = await this.prisma.attendance.update({
        where: { id: existing.id },
        data: { checked_out: new Date() },
        include: { staff: true }
      })
      return {
        staffId: rec.staff_id,
        staffName: rec.staff.username,
        createDate: rec.checked_out!,
      }
    }
  }

  async getAllCheckIns(): Promise<AttendanceResponse[]> {
    const all = await this.prisma.attendance.findMany({
      include: { staff: true },
      orderBy: { checked_in: 'desc' },
    });
    return all.map(rec => ({
      staffId: rec.staff_id,
      staffName: rec.staff.username,
      createDate: rec.checked_out ?? rec.checked_in,
    }));
  }

}
