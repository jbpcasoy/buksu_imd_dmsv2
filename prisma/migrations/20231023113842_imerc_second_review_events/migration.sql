-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'IMERC_CITL_REVISION_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "iMERCCITLDirectorEndorsementId" TEXT,
ADD COLUMN     "iMERCCITLRevisionId" TEXT,
ADD COLUMN     "iMERCIDDCoordinatorEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLRevisionId_fkey" FOREIGN KEY ("iMERCCITLRevisionId") REFERENCES "IMERCCITLRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCIDDCoordinatorEndorsementId_fkey" FOREIGN KEY ("iMERCIDDCoordinatorEndorsementId") REFERENCES "IMERCIDDCoordinatorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iMERCCITLDirectorEndorsementId_fkey" FOREIGN KEY ("iMERCCITLDirectorEndorsementId") REFERENCES "IMERCCITLDirectorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
