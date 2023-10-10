/*
  Warnings:

  - You are about to drop the column `iMId` on the `DepartmentReview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DepartmentReview" DROP CONSTRAINT "DepartmentReview_iMId_fkey";

-- DropIndex
DROP INDEX "DepartmentReview_iMId_key";

-- AlterTable
ALTER TABLE "DepartmentReview" DROP COLUMN "iMId";
