/*
  Warnings:

  - A unique constraint covering the columns `[returnedDepartmentRevisionId]` on the table `SubmittedReturnedDepartmentRevision` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubmittedReturnedDepartmentRevision_returnedDepartmentRevis_key" ON "SubmittedReturnedDepartmentRevision"("returnedDepartmentRevisionId");
