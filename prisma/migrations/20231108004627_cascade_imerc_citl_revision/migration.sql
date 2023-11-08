-- DropForeignKey
ALTER TABLE "IMERCIDDCoordinatorEndorsement" DROP CONSTRAINT "IMERCIDDCoordinatorEndorsement_iMERCCITLRevisionId_fkey";

-- AddForeignKey
ALTER TABLE "IMERCIDDCoordinatorEndorsement" ADD CONSTRAINT "IMERCIDDCoordinatorEndorsement_iMERCCITLRevisionId_fkey" FOREIGN KEY ("iMERCCITLRevisionId") REFERENCES "IMERCCITLRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
