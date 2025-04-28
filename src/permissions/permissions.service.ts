import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PermissionDto } from './dto/permissions.dto';

@Injectable()
export class PermissionsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll(): Promise<PermissionDto[]> {
    return this.prisma.permission.findMany({
      select: {
        id: true,
        permissionName: true,
      },
    });
  }

}
