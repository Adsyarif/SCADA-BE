/*
  Warnings:

  - Made the column `reportFromId` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportFromId_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "reportFromId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportFromId_fkey" FOREIGN KEY ("reportFromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
