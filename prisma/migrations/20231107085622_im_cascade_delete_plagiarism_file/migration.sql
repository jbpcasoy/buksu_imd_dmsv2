-- DropForeignKey
ALTER TABLE "PlagiarismFile" DROP CONSTRAINT "PlagiarismFile_iMId_fkey";

-- AddForeignKey
ALTER TABLE "PlagiarismFile" ADD CONSTRAINT "PlagiarismFile_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
