import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersService } from './users.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetSupervisorRequest,
  GetSupervisorResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Permissions('manage_users')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAll() {
    return this.users.findAll();
  }

  @Get()
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Put('id')
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'OK' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Delete('id')
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'No Content' })
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }

  @Get('/get-supervisor')
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Get supervisor of a staff via query' })
  async getSupervisor(
    @Query('staffId') staffId: GetSupervisorRequest,
  ): Promise<WebResponse<GetSupervisorResponse>> {
    const result = await this.users.getSupervisor(staffId);
    return {
      data: result,
    };
  }
}
