import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
  
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const handler = context.getHandler();
      const requiredPermissions = Reflect.getMetadata('permission', handler)

      if (!requiredPermissions) {
        return true
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if(!user || !user.permissions) {
        throw new ForbiddenException('User not Authenticated');
      }

      if( !user.permissions || !user.permissions.includes(requiredPermissions)) {
        throw new ForbiddenException(`Misssing required permission: ${requiredPermissions}`);
      }

      return true
    }
}  