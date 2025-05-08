/*
  Warnings:

  - Added the required column `radius` to the `RtuConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RtuConfiguration" ADD COLUMN     "radius" DOUBLE PRECISION NOT NULL;
