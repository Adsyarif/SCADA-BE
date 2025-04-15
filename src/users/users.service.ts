import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User & { role: { id: string; roleName: string; permissions: { permission: { permissionName: string } }[] } } | null> {
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

  async findById(id: string): Promise<User & { role: { id: string, roleName: string, permissions: { permission: { permissionName: string } }[] } } | null> {
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
                  select: { permissionName: true}
                }
              }
            }
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { role : { select: { id: true, roleName: true}}}
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role : { select: { id: true, roleName: true}}}

    })
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
    })
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
}
