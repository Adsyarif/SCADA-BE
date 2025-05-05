
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UserRoleService } from './user-role.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto'
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedRoleResponse } from './entities/role.entities';

@ApiTags('User Roles')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('user-role')
export class UserRoleController {
    constructor(private readonly roles: UserRoleService) {}

    @Get()
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get paginated list of user roles' })
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (default: 1)',
      type: Number,
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      description: 'Items per page (default: 10)',
      type: Number,
    })
    @ApiResponse({
      status: 200,
      description: 'Paginated roles',
      type: PaginatedRoleResponse,
    })
    async findAll(@Query() query: PaginationQueryDto) {
        return this.roles.findAllPaginated(query);
    }

    @Get(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Get a single role by ID' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({
        status: 200,
        description: 'The requested role',
    })
    @ApiResponse({ status: 404, description: 'Role not found' })
    findOne(@Param('id') id: string) {
        return this.roles.findOne(id);
    }

    @Post()
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Create a new role' })
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({ status: 201, description: 'Role created successfully' })
    create(@Body() dto: CreateRoleDto) {
        return this.roles.create(dto);
    }

    @Put(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Update an existing role' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiBody({ type: UpdateRoleDto })
    @ApiResponse({ status: 200, description: 'Role updated successfully' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.roles.update(id, dto);
    }

    @Delete(':id')
    @Permissions('manage:roles')
    @ApiOperation({ summary: 'Delete a role' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiResponse({ status: 204, description: 'Role deleted successfully' })
    remove(@Param('id') id: string) {
        return this.roles.remove(id);
    }
}  
