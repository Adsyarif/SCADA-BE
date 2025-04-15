import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersService } from './users.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor (private readonly users: UsersService) {}

    @Get()
    @Permissions('manage_users')
    findAll() {
        return this.users.findAll();
    }

    @Get()
    @Permissions('manage_users')
    findOne(@Param('id') id: string) {
        return this.users.findOne(id);
    }

    @Post()
    @Permissions('manage_users')
    create(@Body() dto: CreateUserDto) {
        return this.users.create(dto);
    }

    @Put('id')
    @Permissions('manage_users')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.users.update(id, dto);
    }

    @Delete('id')
    @Permissions('manage_users')
    remove(@Param('id') id: string) {
        return this.users.remove(id);
    }

}
