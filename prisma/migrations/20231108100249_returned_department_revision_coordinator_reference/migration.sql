/*
  Warnings:

  - Added the required column `coordinatorId` to the `ReturnedDepartmentRevision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReturnedDepartmentRevision" ADD COLUMN     "coordinatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ReturnedDepartmentRevision" ADD CONSTRAINT "ReturnedDepartmentRevision_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
