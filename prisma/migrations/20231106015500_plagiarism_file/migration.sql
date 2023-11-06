/*
  Warnings:

  - Added the required column `plagiarismFileId` to the `IMERCCITLRevision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IMERCCITLRevision" ADD COLUMN     "plagiarismFileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IMERCCITLRevision" ADD CONSTRAINT "IMERCCITLRevision_plagiarismFileId_fkey" FOREIGN KEY ("plagiarismFileId") REFERENCES "PlagiarismFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
