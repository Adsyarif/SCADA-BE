import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, RtuAssignmentDto } from './dto/create-user.dto';
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
import { RoleWithPermissions, UserWithRolePermissions } from './type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PageOptionsDto } from './dto/page-options.dto';
import { PaginatedUsers } from './types/users-types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  async findByEmail(email: string): Promise<UserWithRolePermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            userRolePermissions: {
              include: {
                permission: {
                  select: {
                    permissionName: true,
                    permissionCode: true,
                  }
                }
              }
            }
          }
        }
      }
    })
    if (!user) {
      return null
    }

    const { role: rawRole, userRoleId, ...rest } = user

    const role: RoleWithPermissions= {
      id: rawRole.id,
      roleName: rawRole.roleName,
      permissions: rawRole.userRolePermissions.map((urp) => urp.permission)
    }

    return {
      ...rest,
      role,
    }
  }

  async findById(id: string): Promise<UserWithRolePermissions | null> {

    if (!id) {
      throw new Error('User ID is required');
    }
    
   
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            userRolePermissions: {
              include: {
                permission: {
                  select: {
                    permissionName: true,
                    permissionCode: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { role: rawRole, userRoleId, ...rest } = user;
    const role: RoleWithPermissions = {
      id: rawRole.id,
      roleName: rawRole.roleName,
      permissions: rawRole.userRolePermissions.map((urp) => urp.permission),
    };

    return {
      ...rest,
      role,
    };
  }

  async findAll(opts:PageOptionsDto): Promise<PaginatedUsers> {

    const page = opts.page ?? 1;
    const limit = opts.limit ?? 25;
    const skip = (page - 1) * limit;  

    const [rawData, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { deleted_at: null },
        include: {
          role: {
            include: {
              userRolePermissions: {
                include: {
                  permission: {
                    select: {
                      permissionName: true,
                      permissionCode: true,
                    }
                  }
                }
              }
            }
          },
          userSites: {
            include: { rtuConfiguration: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where: { deleted_at: null } }),
    ]);

    const data = rawData.map((user) => {
      const { role: rawRole, userRoleId, ...rest } = user;
      const role: RoleWithPermissions = {
        id: rawRole.id,
        roleName: rawRole.roleName,
        permissions: rawRole.userRolePermissions
          ? rawRole.userRolePermissions.map((urp) => urp.permission)
          : [],
      };
      return {
        ...rest,
        role,
      };
    });

    return { data, total, page, limit }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        userSites: {
          include: { rtuConfiguration: true }
        }
      }
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto, currentUserId: string) {
    const {
      username,
      email,
      password,
      phone_number,
      employee_number,
      nik,
      office_phone_number,
      userRoleId,
      address,
      rtuAssignments,
    } = dto

    const hashed = await bcrypt.hash(password, 12);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashed,
          phone_number,
          office_phone_number,
          employee_number,
          nik,
          userRoleId,
          address,
          updated_by: currentUserId

        }
      })

      const userSiteData = rtuAssignments?.map((assign: RtuAssignmentDto) => ({
        userId: newUser.id,
        rtuId: assign. rtuId,
        checkInStatus: assign.checkInStatus,
        updated_by: currentUserId
      }))

      await this.prisma.userSite.createMany({
        data: userSiteData,
        skipDuplicates: true,
      })

      return newUser;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta as any).target.join(', ')
        throw new HttpException(`Unique constraint failed: (${target})`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    await this.prisma.user.findUnique({
      where: { id }
    }).then((user) => {
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
    })

    const dataToUpdate: any = { updated_by: currentUserId }
    if (dto.username != undefined) dataToUpdate.username = dto.username;
    if (dto.email != undefined) dataToUpdate.email = dto.email;
    if (dto.phone_number != undefined) dataToUpdate.phone_number = dto.phone_number;
    if (dto.office_phone_number != undefined) dataToUpdate.office_phone_number = dto.office_phone_number;
    if (dto.employee_number != undefined) dataToUpdate.employee_number = dto.employee_number;
    if (dto.nik != undefined) dataToUpdate.nik = dto.nik;
    if (dto.address != undefined) dataToUpdate.address = dto.address;
    if (dto.userRoleId != undefined) dataToUpdate.userRoleId = dto.userRoleId;
    if (dto.password != undefined) {
      dataToUpdate.password = await bcrypt.hash(dto.password, 12);
    }

    try {
       const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate
       })
      
       if (Array.isArray(dto.rtuAssignments)) {
        await this.prisma.userSite.deleteMany({ where: { userId: id } });

        const userSiteData = dto.rtuAssignments.map((assign: RtuAssignmentDto) => ({
          userId: id,
          rtuId: assign.rtuId,
          checkInStatus: assign.checkInStatus,
          updated_by: currentUserId
        }))
        await this.prisma.userSite.createMany({
          data: userSiteData,
          skipDuplicates: true,
        })
       }

       return updatedUser

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta as any).target.join(', ')
        throw new HttpException(`Unique constraint failed: (${target})`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async remove(id: string, currentUserId: string) {
    const existing = await this.prisma.user.findUnique({ where : { id } });
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.userSite.deleteMany({ where: { userId: id } });
    return this.prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        updated_by: currentUserId,
      }
    })
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
