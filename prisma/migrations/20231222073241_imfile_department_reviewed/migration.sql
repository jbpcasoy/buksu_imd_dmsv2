/*
  Warnings:

  - A unique constraint covering the columns `[departmentReviewedId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "departmentReviewedId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_departmentReviewedId_key" ON "IMFile"("departmentReviewedId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_departmentReviewedId_fkey" FOREIGN KEY ("departmentReviewedId") REFERENCES "DepartmentReviewed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
