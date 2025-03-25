import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
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

    // Ensure user exists and password matches (assumes user.password exists and is hashed)
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // Extract permissions from the user's role
      const permissions =
        user.role?.permissions.map(
          (urp) => urp.permission.permissionName,
        ) || [];
      // Omit password from returned user object
      const { password, ...result } = user;
      return { ...result, permissions };
    }
    return null;
  }

  // Generate JWT token with user id, email, and permissions
  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: user.permissions
      }
    };
  }
}
