/*
  Warnings:

  - You are about to drop the column `departmentReviewId` on the `DepartmentRevision` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DepartmentRevision" DROP CONSTRAINT "DepartmentRevision_departmentReviewId_fkey";

-- AlterTable
ALTER TABLE "DepartmentRevision" DROP COLUMN "departmentReviewId";
