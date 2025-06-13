import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDataLoggerDto } from './dto/create-data-logger.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class DataLoggerService {
    private readonly logger = new Logger(DataLoggerService.name)
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateDataLoggerDto) {
        try {
            const rtu = await this.prisma.rtuConfiguration.findUnique({
                where: { rtuEngineId: dto.rtuEngineId }
            })
            if(!rtu) {
                throw new NotFoundException(
                    `RTU with engineId ${dto.rtuEngineId} not found`
                )
            }
            return await this.prisma.dataLogger.create({
                data: {
                    rtuEngineId: dto.rtuEngineId,
                    flow_line_dia: dto.flow_line_dia,
                    setting_press: dto.setting_press,
                    tank_cap: dto.tank_cap,
                    flow_rate: dto.flow_rate,
                    flow_factor: dto.flow_factor,
                    tbg_temp: dto.tbg_temp,
                    tbg_press: dto.tbg_press,
                    leu_status:    dto.leu_status,
                    pump_press:    dto.pump_press,
                    tank_level:    dto.tank_level,
                    flow_capacity: dto.flow_capacity,
                }
            })
        } catch (error) {
            this.logger.error(
                `Error creating DataLogger for RTU ${dto.rtuEngineId}: ${error.message}`,
                error.stack
            )

            if (
                error instanceof PrismaClientKnownRequestError && error.code === 'P2002'
            ) {
                throw new InternalServerErrorException(
                    `Duplicate entry when saving data logger`
                )
            }
        }
    }
}
