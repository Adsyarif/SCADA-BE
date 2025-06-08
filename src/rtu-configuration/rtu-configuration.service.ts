import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRtuConfigurationDto } from './dto/create-rtu-cofniguration.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginationQueryDto } from 'src/user-role/dto/pagination-query.dto';
import { UpdateRtuConfigurationDto } from './dto/update-rtu-configuration.dto';

@Injectable()
export class RtuConfigurationService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateRtuConfigurationDto, currentUserId: string) {
        try {
            return await this.prisma.rtuConfiguration.create({
                data: {
                    rtuEngineId: dto.rtuEngineId,
                    rtuName: dto.rtuName,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    radius: dto.radius,
                    updated_by: currentUserId,
                }
            }) 
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException ('RTU name must be unique')
            }
            throw new InternalServerErrorException('Failed to create RTU configuration')
        }
    }

    async findAllPaginated(query: PaginationQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const [total, raw] = await this.prisma.$transaction([
            this.prisma.rtuConfiguration.count({ where: { deleted_at: null } }),
            this.prisma.rtuConfiguration.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            })
        ])

        const totalpages = Math.ceil(total / limit);
        return { data: raw, total, page, limit, totalpages }
    }

    async findByid(id: string) {

        if (!id)throw new BadRequestException('ID is required')
        
        const rtu = await this.prisma.rtuConfiguration.findUnique({ where: { id } })
        if (!rtu) {
            throw new NotFoundException(`RTU configuration with ${id} not found`)
        } return rtu
    }

    async update(id: string, dto: UpdateRtuConfigurationDto, currentUserId: string) {
        const data: any = { updated_by: currentUserId }
        if (dto.rtuName != null ) data.rtuName = dto.rtuName
        if (dto.latitude != null ) data.latitude = dto.latitude
        if (dto.longitude != null ) data.longitude = dto.longitude
        if (dto.radius != null ) data.radius = dto.radius

        try {
            return await this.prisma.rtuConfiguration.update({
                where: { id },
                data,
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`RTU configuration with ${id} not found`)
            } throw new InternalServerErrorException('Failed to update RTU configuration')
        }
    }

    async remove(id: string, currentUserId: string) {
        try {
            return await this.prisma.rtuConfiguration.update({
                where: { id },
                data: {
                    deleted_at: new Date(),
                    updated_by: currentUserId,
                }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`RTU configuration with ${id} not found`)
            } throw new InternalServerErrorException('Failed to delete RTU configuration')
        }
    }
}
