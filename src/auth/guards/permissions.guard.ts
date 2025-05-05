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
       
      const handler = context.getHandler()
      const requiredPermission = Reflect.getMetadata('permission', handler)

      if (!requiredPermission) {
        return true
      }

      const request = context.switchToHttp().getRequest()
      const user = request.user

      if (!user || !user.userId) {
        throw new ForbiddenException('User not authenticated')
      }

      const permission = await this.prisma.permission.findUnique({
        where: { permissionCode: requiredPermission },
      })
      .catch(()=> null)

      if (!permission) {
        throw new ForbiddenException(`Permission ${requiredPermission} not found`)
      }


      const userHasPermission = await this.prisma.userRolePermission
      .findFirst({
        where: {
          id: user.userId,  // Find the user by userId
          permissionId: permission.id,  // Check if the user has the specific permissionId
        },
      })
      .catch(() => null);

      if(!userHasPermission) {
        throw new ForbiddenException(`Missing required permission: ${requiredPermission}`)
      }
      return true
  }
}  