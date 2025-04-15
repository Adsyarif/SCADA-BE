import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { PERMS_KEY } from '../decorators/permission.decorator';
  
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const required = this.reflector.get<string[]>(PERMS_KEY, context.getHandler());
      if (!required) return true;
      const userPerms: string[] = context.switchToHttp().getRequest().user.perms;
      return required.every(p => userPerms.includes(p));
    }
  }
  