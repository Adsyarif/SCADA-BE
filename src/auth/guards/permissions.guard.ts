import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
  
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      // Retrieve required permissions from metadata
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredPermissions) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user || !user.permissions) {
        throw new ForbiddenException('No permissions found');
      }
      const hasPermission = requiredPermissions.every((permission) =>
        user.permissions.includes(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return hasPermission;
    }
  }
  