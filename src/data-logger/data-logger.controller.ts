import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataLoggerService } from './data-logger.service';
import { RtuApiKeyGuard } from 'src/auth/guards/rtu-api-key.guard';
import { CreateDataLoggerDto } from './dto/create-data-logger.dto';

@ApiTags('Data Logger')
@Controller('data-logger')
export class DataLoggerController {
    constructor(private service: DataLoggerService) {}

    @Post()
    @UseGuards(RtuApiKeyGuard)
    @ApiOperation({ summary: 'RTU pushes a new data sample' })
    @ApiBody({ type: CreateDataLoggerDto })
    async create(@Body() dto: CreateDataLoggerDto) {
        return this.service.create(dto);
    }
}
