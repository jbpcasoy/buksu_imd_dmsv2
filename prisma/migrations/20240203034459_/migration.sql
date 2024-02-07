-- DropForeignKey
ALTER TABLE "CoAuthor" DROP CONSTRAINT "CoAuthor_iMId_fkey";

-- DropForeignKey
ALTER TABLE "SerialNumber" DROP CONSTRAINT "SerialNumber_iMERCCITLDirectorEndorsementId_fkey";

-- AddForeignKey
ALTER TABLE "SerialNumber" ADD CONSTRAINT "SerialNumber_iMERCCITLDirectorEndorsementId_fkey" FOREIGN KEY ("iMERCCITLDirectorEndorsementId") REFERENCES "IMERCCITLDirectorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoAuthor" ADD CONSTRAINT "CoAuthor_iMId_fkey" FOREIGN KEY ("iMId") REFERENCES "IM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
