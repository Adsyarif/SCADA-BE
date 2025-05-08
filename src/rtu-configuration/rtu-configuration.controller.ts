import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RtuConfigurationService } from './rtu-configuration.service';
import { CreateRtuConfigurationDto } from './dto/create-rtu-cofniguration.dto';
import { PaginationQueryDto } from 'src/user-role/dto/pagination-query.dto';
import { UpdateRtuConfigurationDto } from './dto/update-rtu-configuration.dto';

@Controller('rtu-configuration')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RtuConfigurationController {
    constructor( private readonly rtuService: RtuConfigurationService) {}

    @Post()
    create(@Body() dto: CreateRtuConfigurationDto, @Req() req) {
        return this.rtuService.create(dto, req.user.id);
    }

    @Get()
    findAll(@Query() q: PaginationQueryDto) {
        return this.rtuService.findAllPaginated(q);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rtuService.findByid(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRtuConfigurationDto, @Req() req) {
        return this.rtuService.update(id, dto, req.user.id)
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.rtuService.remove(id, req.user.id)
    }

}
