import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ScheduleDefinitionService } from './schedule-definition.service';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';

@ApiTags('Schedule-Definitions')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('schedule-definition')
export class ScheduleDefinitionController {
    constructor(private schedule: ScheduleDefinitionService) {}

    @Get()
    @Permission('manage:schedules')
    findAll() {
        return this.schedule.findAll();
    }

    @Get(':id')
    @Permission('manage:schedules')
    findOne(@Param('id') id: string) {
        return this.schedule.findOne(id);
    }

    @Post()
    @Permission('manage:schedules')
    create(@Body() dto: CreateDefinitionDto, @Req() req) {
        return this.schedule.create(dto, req.user.id);
    }

    @Patch(':id')
    @Permission('manage:schedules')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateDefinitionDto,
        @Req() req
    ) {
        return this.schedule.update(id, dto, req.user.id);
    }

    @Delete(':id')
    @Permission('manage:schedules')
    remove(@Param('id') id: string, @Req() req) {
        return this.schedule.remove(id, req.user.id);
    }
}
