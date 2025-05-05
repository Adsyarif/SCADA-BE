import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  GetOperatorResponse,
  GetSupervisorRequest,
  GetSupervisorResponse,
} from 'src/model/user.model';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';
import { GetOperatorRequest } from '../model/user.model';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  async findByEmail(email: string): Promise<
    | (User & {
        role: {
          id: string;
          roleName: string;
          permissions: { permission: { permissionName: string, permissionCode: string } }[];
        };
      })
    | null
  > {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<
    | (User & {
        role: {
          id: string;
          roleName: string;
          permissions: { permission: { permissionName: string, permissionCode: string } }[];
        };
      })
    | null
  > {
    if (!id) {
      throw new Error('User ID is required');
    }
    
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            id: true,
            roleName: true,
            permissions: {
              select: {
                permission: {
                  select: { permissionName: true, permissionCode: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: { select: { id: true, roleName: true } } },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: { select: { id: true, roleName: true } } },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashed,
        phone_number: dto.phone_number,
        employee_number: dto.employee_number,
        role: { connect: { id: dto.userRoleId } },
      },
      include: { role: { select: { id: true, roleName: true } } },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }
    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: { select: { id: true, roleName: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async getSupervisor(
    request: GetSupervisorRequest,
  ): Promise<GetSupervisorResponse> {
    const getSupervisorRequest: GetSupervisorRequest =
      this.validationService.validate(UserValidation.GET_SUPERVISOR, request);

    const supervisor = await this.prisma.userSupervisor.findFirst({
      where: { staffId: getSupervisorRequest.staffId, deleted_at: null },
      include: {
        staff: true,
        supervisor: true,
      },
    });

    if (!supervisor) {
      throw new HttpException('User have no supervisor yet', 404);
    }

    return {
      supervisorId: supervisor.supervisor.id,
      superVisorName: supervisor.supervisor.username,
    };
  }

  async getOperator(
    request: GetOperatorRequest,
  ): Promise<GetOperatorResponse[]> {
    const getOperatorRequest: GetOperatorRequest =
      this.validationService.validate(UserValidation.GET_OPERATOR, request);

    const operators = await this.prisma.userSupervisor.findMany({
      where: {
        supervisorId: getOperatorRequest.supervisorId,
      },
      include: {
        staff: true,
        supervisor: true,
      },
    });
    if ((!operators || operators.length) === 0) {
      throw new HttpException('There is no operator found', 300);
    }

    return operators.map((operator) => ({
      operatorId: operator.id,
      operatorName: operator.staff.username,
    }));
  }
}
