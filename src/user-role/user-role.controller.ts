import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UserRoleService } from './user-role.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('user-role')
export class UserRoleController {
    constructor(private readonly roles: UserRoleService) {}

    @Get()
    @Permissions('manage_roles')
    findAll() {
        return this.roles.findAll();
    }

    @Get(':id')
    @Permissions('manage_roles')
    findOne(@Param('id') id: string) {
        return this.roles.findOne(id);
    }

    @Permissions('manage_roles')
    create(@Body() dto: CreateRoleDto) {
        return this.roles.create(dto);
    }

    @Put(':id')
    @Permissions('manage:roles')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.roles.update(id, dto);
    }

    @Delete(':id')
    @Permissions('manage:roles')
    remove(@Param('id') id: string) {
        return this.roles.remove(id);
    }
    
}
