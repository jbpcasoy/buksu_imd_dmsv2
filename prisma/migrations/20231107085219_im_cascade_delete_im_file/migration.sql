-- DropForeignKey
ALTER TABLE "IMFile" DROP CONSTRAINT "IMFile_iMId_fkey";

-- AddForeignKey
ALTER TABLE "IMFile" ADD CONSTRAINT "IMFile_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
