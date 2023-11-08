-- DropForeignKey
ALTER TABLE "CITLDirectorEndorsement" DROP CONSTRAINT "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_fkey";

-- AddForeignKey
ALTER TABLE "CITLDirectorEndorsement" ADD CONSTRAINT "CITLDirectorEndorsement_iDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iDDCoordinatorEndorsementId") REFERENCES "IDDCoordinatorEndorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
