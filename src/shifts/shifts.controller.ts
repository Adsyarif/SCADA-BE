import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ShiftsService } from './shifts.service';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@ApiTags('Shifts')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('shifts')
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) {}

    @Get()
    @Permission('manage:shifts')
    findAll() {
        return this.shiftsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shiftsService.findOne(id);
    }

    @Post()
    @Permission('manage:shifts')
    create(@Body() dto: CreateShiftDto, @Req() req) {
        const currentUserId = req.user.id;
        return this.shiftsService.create(dto, currentUserId);
    }

    @Put(':id')
    @Permission('manage:shifts')
    update(@Param('id') id: string, @Body() dto: UpdateShiftDto, @Req() req) {
        const currentUserId = req.user.id;
        return this.shiftsService.update(id, dto, currentUserId);
    }

    @Delete(':id')
    @Permission('manage:shifts')
    remove(@Param('id') id: string, @Req() req) {
        const currentUserId = req.user.id;
        return this.shiftsService.remove(id, currentUserId);
    }
}
