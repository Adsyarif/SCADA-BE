import { ApiProperty } from '@nestjs/swagger';

export class PermissionBrief {
  @ApiProperty({ description: 'Permission ID', example: '48bdaa7e-9054-43ab-9c24-b1e9ba12595c' })
  id: string;

  @ApiProperty({ description: 'Permission name', example: 'manage_roles' })
  permissionName: string;
}

export class RoleEntity {
  @ApiProperty({ description: 'Role ID', example: '19c73237-d777-4e62-93f7-4824ea5464fe' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Master Admin' })
  roleName: string;

  @ApiProperty({
    description: 'Associated permissions',
    type: [PermissionBrief],
  })
  permissions: PermissionBrief[];
}

export class PaginatedRoleResponse {
  @ApiProperty({ description: 'Array of user roles', type: [RoleEntity] })
  data: RoleEntity[];

  @ApiProperty({ description: 'Total number of roles', example: 42 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages: number;
}
