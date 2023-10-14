/*
  Warnings:

  - A unique constraint covering the columns `[departmentReviewedId]` on the table `DepartmentRevision` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departmentReviewedId` to the `DepartmentRevision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DepartmentRevision" ADD COLUMN     "departmentReviewedId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRevision_departmentReviewedId_key" ON "DepartmentRevision"("departmentReviewedId");

-- AddForeignKey
ALTER TABLE "DepartmentRevision" ADD CONSTRAINT "DepartmentRevision_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
