import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) {}

    async assign(dto: CreateScheduleDto, currentUserId: string) {
        return this.prisma.schedule.create({
            data: {
                userId: dto.userId,
                shiftId: dto.shiftId,
                updated_by: currentUserId,
            }
        })
    }

    async update(id: string, dto: UpdateScheduleDto, currentUserId: string) {
        const existing = await this.prisma.schedule.findUnique({
            where: { id },
        })
        if (!existing) throw new NotFoundException(`Schedule with ID ${id} not found`);

        const data: any = { updated_by: currentUserId };
        if (dto.userId) data.userId = dto.userId;
        if (dto.shiftId) data.shiftId = dto.shiftId;

        return this.prisma.schedule.update({
            where: { id },
            data,
        })
    }

    async remove(id: string, currentUserId: string) {
        return this.prisma.schedule.update({
            where: { id },
            data: {
                updated_by: currentUserId,
            }
        })
    }

    async findAll() {
        return this.prisma.schedule.findMany({
            where: { deleted_at: null },
            include: { user: true, shift: true },
            orderBy: { created_at: 'desc' },
        })
    }

    async findByUser(userId: string) {
        return this.prisma.schedule.findMany({
            where: { userId, deleted_at: null},
            include: { shift: true },
        })
    }

    async findByShift(shiftId: string) {
        return this.prisma.schedule.findMany({
            where: { shiftId, deleted_at: null },
            include: { user: true },
        });
  }
}
