import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    return {
      id: user.id,
      username: user.username,
      perms: user.role.permissions.map(p => p.permission.permissionName),
    }
  };

  async login(user: {  id: string, username: string, perms: string[]}) {
    const payload = {
      sub: user.id,
      username: user.username,
      perms: user.perms,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
