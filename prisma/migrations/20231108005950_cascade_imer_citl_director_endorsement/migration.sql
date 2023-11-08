-- DropForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" DROP CONSTRAINT "IMERCCITLDirectorEndorsement_cITLDirectorId_fkey";

-- DropForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" DROP CONSTRAINT "IMERCCITLDirectorEndorsement_iMERCIDDCoordinatorEndorsemen_fkey";

-- AddForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" ADD CONSTRAINT "IMERCCITLDirectorEndorsement_cITLDirectorId_fkey" FOREIGN KEY ("cITLDirectorId") REFERENCES "CITLDirector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IMERCCITLDirectorEndorsement" ADD CONSTRAINT "IMERCCITLDirectorEndorsement_iMERCIDDCoordinatorEndorsemen_fkey" FOREIGN KEY ("iMERCIDDCoordinatorEndorsementId") REFERENCES "IMERCIDDCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
