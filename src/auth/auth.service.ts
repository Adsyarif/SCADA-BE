import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

export type AuthenticatedUser = {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthenticatedUser> {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    return {
      id: user.id,
      username: user.username,
      role: user.role.roleName,
      permissions: user.role.permissions.map(p => p.permissionCode),
    }
  };

  async login(user: AuthenticatedUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async me(userId: string) {
    console.log('User ID:', userId);
    const user = await this.users.findById(userId)

    if (!user) throw new NotFoundException('User not found');

    const permissionCodes = user.role.permissions.map(urp => urp.permissionCode)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.roleName,
      permissions: permissionCodes,
    }
  }
}
