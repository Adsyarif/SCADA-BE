import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UserRoleService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.userRole.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        })
    }
    
    findOne(id: string) {
        return this.prisma.userRole.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        })
    }

    create(dto: CreateRoleDto) {
        return this.prisma.userRole.create({
            data: {
                roleName: dto.roleName,
                permissions: {
                    create: dto.permissions.map((pid) => ({
                        permission: { connect: { id: pid } },
                    }))
                }
            },
            include: {
                permissions: {
                    include: { permission: true }
                }
            }
        })
    }

    update(id: string, dto: UpdateRoleDto) {
        return this.prisma.userRole.update({
          where: { id },
          data: {
            roleName: dto.roleName,
            permissions: {
              deleteMany: {},
              create: dto.permissions?.map((pid) => ({
                permission: { connect: { id: pid } },
              })),
            },
          },
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        });
      }

    remove(id: string) {
    return this.prisma.userRole.delete({
        where: { id },
    })
    }
}
