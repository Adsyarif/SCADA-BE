import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersService } from './users.service';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetOperatorRequest,
  GetOperatorResponse,
  GetSupervisorRequest,
  GetSupervisorResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { PageOptionsDto } from './dto/page-options.dto';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Permission('manage:users')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'OK' })
    async findAll(@Query() opts: PageOptionsDto) {
    return this.users.findAll(opts);
  }

  @Get('/get-supervisor')
  async getSupervisor(
    @Query('staffId') staffId: string,
  ): Promise<WebResponse<GetSupervisorResponse>> {
    const staffIdRequest: GetSupervisorRequest = {
      staffId: staffId,
    };
    const result = await this.users.getSupervisor(staffIdRequest);
    return {
      data: result,
    };
  }

  @Get('/get-operators')
  @ApiOperation({ summary: 'Get operator of a staff via query' })
  async getOperators(
    @Query('supervisorId') supervisorId: string,
  ): Promise<WebResponse<GetOperatorResponse[]>> {
    const supervisorIdRequest: GetOperatorRequest = {
      supervisorId: supervisorId,
    };
    const result = await this.users.getOperator(supervisorIdRequest);
    return {
      data: result,
    };
  }

  @Get(':id')
  @Permission('manage:users')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  @Permission('manage:users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateUserDto, @Req() req) {
    const currentUserId = (req.user as any).id;
    return this.users.create(dto, currentUserId)
  }

  @Patch(':id')
  @Permission('manage:users')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'OK' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
    const currentUserId = (req.user as any).id
    return this.users.update(id, dto, currentUserId);
  }

  @Delete(':id')
  @Permission('manage:users')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'No Content' })
  remove(@Param('id') id: string, @Req() req) {
    const currentUserId = (req.user as any).id;
    return this.users.remove(id, currentUserId);
  }
}
