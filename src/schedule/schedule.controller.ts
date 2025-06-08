import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ScheduleService } from './schedule.service';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Schedules')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('schedule')
export class ScheduleController {
    constructor(private schedule: ScheduleService) {}

    @Get()
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'list all schedules'})
    findAll() {
        return this.schedule.findAll()
    }

    @Get('by-user/:userId')
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'Get schedules for user'})
    findByuser(@Param('userId') userId: string ) {
        return this.schedule.findByUser(userId)
    }

    @Get('by-shift/:shiftId')
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'Get schedules for a shift' })
    findByShift(@Param('shiftId') shiftId: string) {
        return this.schedule.findByShift(shiftId);
    }

    @Post()
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'Assign user to shift' })
    assign(@Body() dto: CreateScheduleDto, @Req() req) {
        const userId = req.user.id;
        return this.schedule.assign(dto, userId);
    }

    @Put(':id')
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'Update schedule entry' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateScheduleDto,
        @Req() req
    ) {
        const currentUserId = req.user.id;
        return this.schedule.update(id, dto, currentUserId);
    }

    @Delete(':id')
    @Permission('manage:schedules')
    @ApiOperation({ summary: 'Soft-delete schedule entry' })
    remove(@Param('id') id: string, @Req() req) {
        const currentUserId = req.user.id;
        return this.schedule.remove(id, currentUserId);
    }
}
