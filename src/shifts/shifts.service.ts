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
        const start= new Date(dto.startTime);
        const end = new Date(dto.endTime);
        const shiftName = this.formatShiftName(start, end);

        return this.prisma.shift.create({
            data: {
                shiftName,
                startTime: start,
                endTime: end,
                isActive: dto.isActive ?? true,
                updated_by: currentUserId,
            }
        })
    }

    async update(id: string, dto: UpdateShiftDto, currentUserId: string) {
        const existing = await this.prisma.shift.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new NotFoundException(`Shift with ID ${id} not found`);
        }

        const start = dto.startTime ? new Date(dto.startTime) : existing.startTime;
        const end = dto.endTime ? new Date(dto.endTime) : existing.endTime;

        const shiftName = this.formatShiftName(start, end);

        return this.prisma.shift.update({
            where: { id },
            data: {
                startTime: start,
                endTime: end,
                shiftName,
                isActive: dto.isActive ?? existing.isActive,
                updated_by: currentUserId,
            }
        })
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
