/*
  Warnings:

  - A unique constraint covering the columns `[facultyId,iMId]` on the table `CoAuthor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoAuthor_facultyId_iMId_key" ON "CoAuthor"("facultyId", "iMId");
