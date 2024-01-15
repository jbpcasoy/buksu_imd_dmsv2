/*
  Warnings:

  - A unique constraint covering the columns `[iMERCCITLReviewedId]` on the table `PlagiarismFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlagiarismFile_iMERCCITLReviewedId_key" ON "PlagiarismFile"("iMERCCITLReviewedId");
