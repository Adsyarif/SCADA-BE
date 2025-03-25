// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new user with hashed password and associate a role
  async create(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        phone_number: registerDto.phone_number,
        employee_number: registerDto.employee_number,
        role: {
          connect: { id: registerDto.userRoleId },
        },
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  // Find a user by username (include role & permissions)
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  // Find a user by ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }
}
