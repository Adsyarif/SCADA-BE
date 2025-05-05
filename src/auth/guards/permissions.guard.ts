import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
  
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredCode = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
      if (!requiredCode) {
        return Promise.resolve(true);
      }

      const required = context.switchToHttp().getRequest();
      const user = required.user;

      if (!user?.permissions?.includes(requiredCode)) {
        throw new ForbiddenException(`Missing required permission: ${requiredCode}`);
      }

      return Promise.resolve(true);
    }
  }
  