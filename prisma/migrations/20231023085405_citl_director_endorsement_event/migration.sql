-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'CITL_DIRECTOR_ENDORSEMENT_CREATED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cITLDirectorEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cITLDirectorEndorsementId_fkey" FOREIGN KEY ("cITLDirectorEndorsementId") REFERENCES "CITLDirectorEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
