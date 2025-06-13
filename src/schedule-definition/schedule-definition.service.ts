import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ScheduleDefinitionService {
    private readonly logger = new Logger(ScheduleDefinitionService.name);
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

    async update(id: string, dto: UpdateDefinitionDto, userId: string) {
        const existing = await this.findOne(id);
        try {
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
        } catch(error) {
            this.logger.error(`Error updating def ${id}: ${error.message}`, error.stack)

            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new HttpException(
                    `Unique constraint failed: ${error.meta?.target}`,
                    HttpStatus.BAD_REQUEST
                )
            }
            throw new HttpException(
                `Failed to update schedule: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
        
    }

    async remove(id: string, userId: string) {
        return this.prisma.scheduleDefinition.update({
            where: { id },
            data: { deleted_at: new Date(), updated_by: userId },
        });
    }
}
