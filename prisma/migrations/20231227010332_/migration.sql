/*
  Warnings:

  - A unique constraint covering the columns `[submittedReturnedDepartmentRevisionId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "submittedReturnedDepartmentRevisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_submittedReturnedDepartmentRevisionId_key" ON "IMFile"("submittedReturnedDepartmentRevisionId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_submittedReturnedDepartmentRevisionId_fkey" FOREIGN KEY ("submittedReturnedDepartmentRevisionId") REFERENCES "SubmittedReturnedDepartmentRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
