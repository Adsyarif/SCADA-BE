/*
  Warnings:

  - A unique constraint covering the columns `[permissionCode]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissionCode` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Permission_permissionName_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "permissionCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permissionCode_key" ON "Permission"("permissionCode");
