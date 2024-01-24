-- DropForeignKey
ALTER TABLE "PlagiarismFile" DROP CONSTRAINT "PlagiarismFile_iMERCCITLReviewedId_fkey";

-- AddForeignKey
ALTER TABLE "PlagiarismFile" ADD CONSTRAINT "PlagiarismFile_iMERCCITLReviewedId_fkey" FOREIGN KEY ("iMERCCITLReviewedId") REFERENCES "IMERCCITLReviewed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
