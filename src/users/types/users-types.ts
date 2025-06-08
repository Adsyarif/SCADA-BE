import { UserWithRolePermissions } from "../type";

export type PaginatedUsers = {
  data: UserWithRolePermissions[]; // or your User type
  total: number;
  page: number;
  limit: number;
}