-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'DEAN_ENDORSEMENT';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "deanEndorsementId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deanEndorsementId_fkey" FOREIGN KEY ("deanEndorsementId") REFERENCES "DeanEndorsement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
