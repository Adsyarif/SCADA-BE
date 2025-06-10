import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';

@Injectable()
export class ScheduleDefinitionService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.scheduleDefinition.findMany({
            where: { deleted_at: null},
            include: {
                rtu: true,
                shift: true,
                userSites: {
                    include: {
                        userSite: { include: { user: true}}
                    }
                }
            },
            orderBy: { created_at: 'desc'} 
        })
    }

    async findOne(id: string) {
        const def = await this.prisma.scheduleDefinition.findUnique({
            where: { id },
            include: {
                rtu: true,
                shift: true,
                userSites: {
                    include: {
                        userSite: {
                            include: { user: true }
                        }
                    }
                }
            },
        })
        if (!def) throw new NotFoundException(`Definition ${id} not found`)
        return def
    }

    async create(dto: CreateDefinitionDto, userId: string) {
        const def = await this.prisma.scheduleDefinition.create({
            data: {
                rtuId:      dto.rtuId,
                shiftId:    dto.shiftId,
                daysOfWeek: dto.daysOfWeek.join(','),
                updated_by: userId,
                userSites: {
                    create: dto.userSiteIds.map(usId => ({
                        userSiteId: usId,
                        updated_by: userId,
                    }))
                }
            },
            include: { userSites: true },
        });

        await this.prisma.userSite.updateMany({
            where: { id: { in: dto.userSiteIds } },
            data: { checkInStatus: true, updated_by: userId },
        });

        return def;
    }

    async update(
        id: string,
        dto: UpdateDefinitionDto,
        userId: string
    ) {
        const existing = await this.findOne(id);

        const updated = await this.prisma.scheduleDefinition.update({
        where: { id },
        data: {
            ...(dto.rtuId      && { rtuId: dto.rtuId }),
            ...(dto.shiftId    && { shiftId: dto.shiftId }),
            ...(dto.daysOfWeek && { daysOfWeek: dto.daysOfWeek.join(',') }),
            updated_by: userId,
            ...(Array.isArray(dto.userSiteIds) && {
            userSites: {
                deleteMany: { scheduleDefinitionId: id },
                create: dto.userSiteIds.map(usId => ({
                userSiteId: usId,
                updated_by: userId,
                }))
            }
            })
        },
        include: { userSites: true },
        });

        if (Array.isArray(dto.userSiteIds)) {
            await this.prisma.userSite.updateMany({
                where: { rtuId: existing.rtuId },
                data: { checkInStatus: false, updated_by: userId },
            });
            await this.prisma.userSite.updateMany({
                where: { id: { in: dto.userSiteIds } },
                data: { checkInStatus: true, updated_by: userId },
            });
        }

        return updated;
    }

    async remove(id: string, userId: string) {
        return this.prisma.scheduleDefinition.update({
            where: { id },
            data: { deleted_at: new Date(), updated_by: userId },
        });
    }
}
