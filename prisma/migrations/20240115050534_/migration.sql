/*
  Warnings:

  - A unique constraint covering the columns `[iMId]` on the table `PlagiarismFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlagiarismFile_iMId_key" ON "PlagiarismFile"("iMId");
