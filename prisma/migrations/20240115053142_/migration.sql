/*
  Warnings:

  - You are about to drop the column `iMId` on the `PlagiarismFile` table. All the data in the column will be lost.
  - Added the required column `iMERCCITLReviewedId` to the `PlagiarismFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlagiarismFile" DROP CONSTRAINT "PlagiarismFile_iMId_fkey";

-- DropIndex
DROP INDEX "PlagiarismFile_iMId_key";

-- AlterTable
ALTER TABLE "PlagiarismFile" DROP COLUMN "iMId",
ADD COLUMN     "iMERCCITLReviewedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PlagiarismFile" ADD CONSTRAINT "PlagiarismFile_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
