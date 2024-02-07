/*
  Warnings:

  - A unique constraint covering the columns `[iMERCCITLReviewedId]` on the table `IMFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IMFile" ADD COLUMN     "iMERCCITLReviewedId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IMFile_iMERCCITLReviewedId_key" ON "IMFile"("iMERCCITLReviewedId");

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
