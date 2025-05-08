import { User } from '@prisma/client';

export type RoleWithPermissions = {
  id: string;
  roleName: string;
  permissions: {
    permissionCode: string;
    permissionName: string;
  }[];
};

export type UserWithRolePermissions = Omit<User, 'userRoleId'> & {
  role: RoleWithPermissions;
};
