import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { permission } from 'process';

@Injectable()
export class UserRoleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.userRole.findMany({
      where: { deleted_at: null},
      include: {
        userRolePermissions: {
          include: {
            permission: {
              select: {
                permissionCode: true,
                permissionName: true
              }
            }
          }
        }
      }
    });
  }

    findOne(id: string) {
      return this.prisma.userRole.findUnique({
        where: { id, deleted_at: null },
        include: {
          userRolePermissions: {
            include: {
              permission: {
                select: {
                  permissionCode: true,
                  permissionName: true
                }
              }
            }
          }
        },
      });
    }

    async create(dto: CreateRoleDto) {
      const { roleName, permissions } = dto;

      try {
        const created = await this.prisma.userRole.create({
          data: {
            roleName,
            userRolePermissions: {
              create: permissions?.map((permissionId) => ({
                permission: { connect: {id: permissionId}}
              }))
            }
          },
          include: {
            userRolePermissions: {
              select: {
                permission: {
                  select: {
                    permissionCode: true,
                    permissionName: true
                  }
                }
              }
            }
          }
        })
        return {
          id: created.id,
          roleName: created.roleName,
          permissions: created.userRolePermissions.map((urp) => urp.permission),
          createdAt: created.created_at,
          updatedAt: created.updated_at,

        }
      } catch(error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            const target = (error.meta?.target as string[])?.join(', ') ?? 'field';
            throw new ConflictException(`${target} already exists`);
          }
          if ( error.code === 'P2003') {
            throw new BadRequestException(`One or more Permission not exist`);
          }
        }
        throw new InternalServerErrorException('An error occurred while creating the role');
      }
    }
  
    async update(id: string, dto: UpdateRoleDto) {
      const data: Prisma.UserRoleUpdateInput = {}

      if (dto.roleName !== undefined) {
        data.roleName = dto.roleName
      }

      if (dto.permissions !==undefined) {
        data.userRolePermissions = {
          deleteMany: {},
          create: dto.permissions.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        }
      }

      try {
        const updated = await this.prisma.userRole.update({
          where: { id},
          data,
          include: {
            userRolePermissions: {
              select: {
                permission: {
                  select: {
                    permissionCode: true,
                    permissionName: true
                  }
                }
              }
            }
          }
        })
        return {
          id: updated.id,
          roleName: updated.roleName,
          permissions: updated.userRolePermissions.map((urp) => urp.permission),
          createdAt: updated.created_at,
          updatedAt: updated.updated_at,
        }
      } catch  (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException(`Role with id ${id} not found`);
          }
          if (error.code === 'P2002') {
            const target = (error.meta?.target as string[])?.join(', ') ?? 'field';
            throw new ConflictException(`${target} already exists`);
          }
          if (error.code === 'P2003') {
            throw new BadRequestException('One or more permissions do not exist');
          }
        }
        throw new InternalServerErrorException('Could not update role');
      }
    }

    async remove(id: string, currentUserId: string) {
      try {
        const removed = await this.prisma.userRole.update({
          where: { id },
          data: {
            deleted_at: new Date(),
            updated_by: currentUserId,
          }
        });
        return {
          id: removed.id,
          roleName: removed.roleName,
          deletedAt: removed.deleted_at,
          updatedAt: removed.updated_at,
        }
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Role with id ${id} not found`);
        }
        // any other error
        throw new InternalServerErrorException(
          'Could not remove role; please try again later',
        );
      }
    }
  
    async findAllPaginated(query: PaginationQueryDto) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const skip = (page - 1) * limit;
  
      const total = await this.prisma.userRole.count({
        where: { deleted_at: null },
      });
  
      const raw = await this.prisma.userRole.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { roleName: 'asc' },
        include: {
          userRolePermissions: {
            select: {
              permission: {
                select: {
                  permissionCode: true,
                  permissionName: true
                }
              },
            },
          },
        },
      });

      const data = raw.map((role) => ({
        id: role.id,
        roleName: role.roleName,
        permissions: role.userRolePermissions.map((urp) => urp.permission),
        createdAt: role.created_at,
        updatedAt: role.updated_at,
        updatedBy: role.updated_by,
      }));
  
      const totalPages = Math.ceil(total / limit);
  
      return { data, total, page, limit, totalPages };
    }
}
  
