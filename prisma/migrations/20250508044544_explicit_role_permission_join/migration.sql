/*
  Warnings:

  - You are about to drop the `_UserPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserRolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRolePermission" DROP CONSTRAINT "UserRolePermission_id_fkey";

-- DropForeignKey
ALTER TABLE "_UserPermission" DROP CONSTRAINT "_UserPermission_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserPermission" DROP CONSTRAINT "_UserPermission_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserRolePermission" DROP CONSTRAINT "_UserRolePermission_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRolePermission" DROP CONSTRAINT "_UserRolePermission_B_fkey";

-- DropTable
DROP TABLE "_UserPermission";

-- DropTable
DROP TABLE "_UserRolePermission";
