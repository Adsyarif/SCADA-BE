import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsService {
    constructor(private prisma: PrismaService) {}

    private formatShiftName(start: Date, end:Date) {
        const format = (date: Date) => date.toISOString().substring(11, 16);
        return `${format(start)} - ${format(end)}`;
    }

    async findAll() {
        return this.prisma.shift.findMany({
            orderBy: {
                created_at: 'desc',
            }
        })
    }

    async findOne(id: string) {
        const shift = await this.prisma.shift.findUnique({
            where: { id },
        });
        if (!shift) {
            throw new NotFoundException(`Shift with ID ${id} not found`);
        }
        return shift;
    }

    async create(dto: CreateShiftDto, currentUserId: string) {
        const existingCount = await this.prisma.shift.count({
            where: { deleted_at: null },
        });
        const shiftName = `Shift ${existingCount + 1}`;

        const [sh, sm] = dto.startTime.split(':').map(Number);
        const [eh, em] = dto.endTime.split(':').map(Number);
        const today = new Date();
        const start = new Date(today); start.setHours(sh, sm, 0, 0);
        const end   = new Date(today); end.setHours(eh, em, 0, 0);

        return this.prisma.shift.create({
            data: {
                shiftName,
                startTime:  start,
                endTime:    end,
                isActive:   dto.isActive ?? true,
                updated_by: currentUserId,
            },
        });
    }

    async update(id: string, dto: UpdateShiftDto, currentUserId: string) {
        const existing = await this.prisma.shift.findUnique({
        where: { id },
        });
        if (!existing) throw new NotFoundException(`Shift ${id} not found`);

        const [sh, sm] = dto.startTime
        ? dto.startTime.split(':').map(Number)
        : [existing.startTime.getHours(), existing.startTime.getMinutes()];
        const [eh, em] = dto.endTime
        ? dto.endTime.split(':').map(Number)
        : [existing.endTime.getHours(),   existing.endTime.getMinutes()];

        const today = new Date();
        const start = new Date(today); start.setHours(sh, sm, 0, 0);
        const end   = new Date(today); end.setHours(eh, em, 0, 0);

        return this.prisma.shift.update({
            where: { id },
            data: {
                startTime:  start,
                endTime:    end,
                isActive:   dto.isActive ?? existing.isActive,
                updated_by: currentUserId,
            },
        });
    }

    async remove(id: string, currentUserId: string) {
        await this.prisma.shift.update({
            where: { id },
            data: {
                isActive: false,
                deleted_at: new Date(),
                updated_by: currentUserId
            }
        })
    }
}
